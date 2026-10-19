import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import { supabaseAdmin as admin } from "@/integrations/supabase/client.server";
import { aksesAdmin } from "./akses-admin.server";
import { bolehKelolaKegiatan, bolehTerbitKegiatan } from "@/lib/kegiatan-admin";
import { pathArsip, type DokumenForm, type PengurusForm } from "@/lib/hari20-admin";
type Client = SupabaseClient<Database>;
const bph = (a: Awaited<ReturnType<typeof aksesAdmin>>) =>
  a.role === "super_admin" || (a.role === "admin" && !a.bidangId);
function gagal(e: { code?: string } | null): never {
  throw new Error(
    e?.code === "40001"
      ? "Data sudah berubah. Muat ulang sebelum menyimpan lagi."
      : "Perubahan belum tersimpan. Periksa isian, koneksi dan hak aksesmu.",
  );
}
async function pilihan(db: Client) {
  const [b, p] = await Promise.all([
    db.from("bidang").select("id,nama_singkat,slug").order("urutan"),
    db.from("periode").select("id,label,aktif").order("label", { ascending: false }),
  ]);
  if (b.error || p.error) throw new Error("Pilihan bidang/periode belum tersedia.");
  return { bidang: b.data, periode: p.data };
}
export async function ruangDokumen(db: Client, uid: string) {
  const akses = await aksesAdmin(db, uid),
    pilih = await pilihan(db);
  const dokumen: Database["public"]["Tables"]["dokumen"]["Row"][] = [];
  if (akses.bolehKontribusi)
    for (let n = 0; ; n += 1000) {
      let q = db
        .from("dokumen")
        .select("*")
        .order("updated_at", { ascending: false })
        .range(n, n + 999);
      if (akses.role === "anggota") q = q.eq("created_by", uid);
      else if (akses.bidangId)
        q = q.or(`bidang_id.eq.${akses.bidangId},and(bidang_id.is.null,created_by.eq.${uid})`);
      const r = await q;
      if (r.error) throw new Error("Daftar dokumen belum tersedia.");
      dokumen.push(
        ...r.data.filter((d) => bolehKelolaKegiatan(akses, d) && (d.akses !== "bph" || bph(akses))),
      );
      if (r.data.length < 1000) break;
    }
  const sampah = await db.from("arsip_sampah").select("id", { head: true, count: "exact" });
  if (sampah.error) throw new Error("Status berkas belum tersedia.");
  return { akses, ...pilih, dokumen, tertunda: sampah.count ?? 0 };
}
async function kelolaDokumen(db: Client, uid: string, id: string) {
  const a = await aksesAdmin(db, uid);
  const r = await db.from("dokumen").select("*").eq("id", id).maybeSingle();
  if (r.error || !r.data || !bolehKelolaKegiatan(a, r.data) || (r.data.akses === "bph" && !bph(a)))
    throw new Error("Dokumen tidak tersedia atau di luar hak aksesmu.");
  return { a, d: r.data };
}
async function cekPdf(path: string, ukuran: number) {
  const r = await admin.storage.from("dokumen-internal").download(path);
  if (r.error || !r.data) throw new Error("PDF belum terunggah lengkap.");
  if (r.data.size !== ukuran || !((await r.data.slice(0, 5).text()) === "%PDF-"))
    throw new Error("Isi/ukuran file tidak sesuai PDF. Pilih file PDF yang benar.");
}
export async function bersihkanArsip(db: Client, uid: string) {
  await aksesAdmin(db, uid);
  const q = await db.from("arsip_sampah").select("*");
  if (q.error) throw new Error("Daftar pembersihan belum tersedia.");
  let jumlah = 0;
  for (const s of q.data) {
    if (!/^[a-z0-9/-]+\.pdf$/i.test(s.path) || s.path.includes(".."))
      throw new Error("Lokasi berkas lama perlu diperiksa Super Admin.");
    const used = await admin
      .from("dokumen")
      .select("id")
      .in("storage_path", [s.path, "privat:" + s.path])
      .limit(1);
    if (used.error || used.data.length)
      throw new Error("Berkas masih digunakan; pembersihan dihentikan.");
    const r = await admin.storage.from(s.bucket).remove([s.path]);
    if (r.error)
      throw new Error(
        "Perubahan tersimpan, tetapi berkas lama belum dibersihkan. Coba tombol Bersihkan lagi.",
      );
    const del = await admin.from("arsip_sampah").delete().eq("id", s.id);
    if (del.error) throw new Error("Status pembersihan belum tersimpan.");
    jumlah++;
  }
  return { jumlah };
}
export async function simpanDokumen(db: Client, uid: string, data: DokumenForm) {
  let berkasLamaDihapus = false;
  const a = await aksesAdmin(db, uid);
  const lama = data.id ? (await kelolaDokumen(db, uid, data.id)).d : null;
  if (lama && lama.updated_at !== data.versi)
    throw new Error("Dokumen sudah berubah. Muat ulang sebelum menyimpan.");
  if (
    !a.bolehKontribusi ||
    !bolehKelolaKegiatan(a, {
      bidang_id: data.bidang_id,
      created_by: lama?.created_by ?? uid,
      status: data.status,
    }) ||
    (data.akses === "bph" && !bph(a)) ||
    (data.status === "terbit" &&
      !bolehTerbitKegiatan(a, { bidang_id: data.bidang_id, created_by: lama?.created_by ?? uid }))
  )
    throw new Error("Akses penyimpanan dokumen ditolak.");
  if (data.storage_path && data.storage_path !== lama?.storage_path) {
    if (
      !pathArsip(data.storage_path) ||
      !data.storage_path.startsWith(`privat:arsip/${uid}/`) ||
      !data.ukuran_bytes
    )
      throw new Error("Pilih PDF dari unggahan sendiri.");
    await cekPdf(data.storage_path.slice(7), data.ukuran_bytes);
  }
  if (
    lama?.storage_path &&
    !lama.storage_path.startsWith("privat:") &&
    lama.akses === "publik" &&
    data.akses !== "publik"
  ) {
    if (!data.storage_path?.startsWith("privat:"))
      throw new Error("Unggah ulang PDF agar bisa dipindahkan ke penyimpanan privat.");
    if (!/^[a-z0-9/-]+\.pdf$/i.test(lama.storage_path) || lama.storage_path.includes(".."))
      throw new Error("Lokasi PDF lama perlu diperiksa Super Admin.");
    const r = await admin.storage.from("dokumen-publik").remove([lama.storage_path]);
    if (r.error) throw new Error("Salinan publik lama belum dapat dihapus; akses belum diubah.");
    berkasLamaDihapus = true;
  }
  const r = await db.rpc("simpan_dokumen_admin", { p_data: data as Json });
  if (r.error || !r.data) {
    if (berkasLamaDihapus)
      throw new Error(
        "Data belum tersimpan, tetapi PDF publik lama sudah dihapus. Muat ulang dan unggah ulang PDF sebelum mencoba lagi.",
      );
    gagal(r.error);
  }
  let peringatan: string | null = null;
  try {
    await bersihkanArsip(db, uid);
  } catch (e) {
    peringatan = e instanceof Error ? e.message : "Berkas lama perlu dibersihkan.";
  }
  return {
    dokumen: r.data as unknown as Database["public"]["Tables"]["dokumen"]["Row"],
    peringatan,
  };
}
export async function hapusDokumen(db: Client, uid: string, data: { id: string; versi: string }) {
  const { d } = await kelolaDokumen(db, uid, data.id);
  if (d.status === "terbit") throw new Error("Tarik dokumen ke draf sebelum menghapus.");
  const r = await db
    .from("dokumen")
    .delete()
    .eq("id", data.id)
    .eq("updated_at", data.versi)
    .select("id")
    .single();
  if (r.error || !r.data) gagal(r.error);
  try {
    await bersihkanArsip(db, uid);
    return { peringatan: null };
  } catch (e) {
    return { peringatan: e instanceof Error ? e.message : "Berkas lama perlu dibersihkan." };
  }
}
export async function bukaDokumen(db: Client, uid: string, id: string) {
  await aksesAdmin(db, uid);
  const r = await db.from("dokumen").select("storage_path,akses,status").eq("id", id).maybeSingle();
  if (r.error || !r.data?.storage_path) throw new Error("Dokumen tidak tersedia untuk akunmu.");
  const d = r.data;
  if (d.akses === "publik" && d.status === "terbit" && d.storage_path!.startsWith("privat:"))
    return { url: `/berkas/dokumen/${id}` };
  const r2 = await db.storage
    .from(
      d.storage_path!.startsWith("privat:") || d.akses !== "publik"
        ? "dokumen-internal"
        : "dokumen-publik",
    )
    .createSignedUrl(d.storage_path!.replace(/^privat:/, ""), 600);
  if (r2.error) throw new Error("PDF belum dapat dibuka.");
  return { url: r2.data.signedUrl };
}
export async function ruangPengurus(db: Client, uid: string) {
  const a = await aksesAdmin(db, uid);
  if (!bph(a)) throw new Error("Kelola pengurus hanya untuk BPH dan Super Admin.");
  const pilih = await pilihan(db);
  const pengurus: Database["public"]["Tables"]["pengurus"]["Row"][] = [];
  for (let n = 0; ; n += 1000) {
    const r = await db
      .from("pengurus")
      .select("*")
      .order("nama")
      .range(n, n + 999);
    if (r.error) throw new Error("Daftar pengurus belum tersedia.");
    pengurus.push(...r.data);
    if (r.data.length < 1000) break;
  }
  return { akses: a, ...pilih, pengurus };
}
export async function simpanPengurus(db: Client, uid: string, data: PengurusForm) {
  let fotoLamaDihapus = false;
  const a = await aksesAdmin(db, uid);
  if (!bph(a)) throw new Error("Kelola pengurus hanya untuk BPH dan Super Admin.");
  let lama: Database["public"]["Tables"]["pengurus"]["Row"] | null = null;
  if (data.id) {
    const r = await db.from("pengurus").select("*").eq("id", data.id).single();
    if (r.error || r.data.updated_at !== data.versi)
      throw new Error("Data pengurus sudah berubah. Muat ulang terlebih dahulu.");
    lama = r.data;
    const p = await db.from("profiles").select("role").eq("pengurus_id", data.id);
    if (p.error) throw new Error("Hak akun pengurus belum dapat diperiksa.");
    if (p.data.some((p) => p.role === "super_admin") && a.role !== "super_admin")
      throw new Error("Data Super Admin hanya dapat diubah Super Admin.");
  }
  if (data.foto_path && data.foto_path !== lama?.foto_path) {
    if (!data.id || !new RegExp(`^pengurus/${data.id}/[a-zA-Z0-9-]+\\.webp$`).test(data.foto_path))
      throw new Error("Foto harus dari unggahan pengurus ini.");
    const r = await db.storage
      .from("media")
      .list(`pengurus/${data.id}`, { search: data.foto_path.split("/")[2] });
    if (r.error || !r.data?.some((x) => x.name === data.foto_path!.split("/")[2]))
      throw new Error("Foto baru belum tersedia.");
  }
  if (lama?.foto_path && (!data.izin_foto || lama.foto_path !== data.foto_path)) {
    const p = await admin.from("profiles").select("id").eq("pengurus_id", lama.id);
    if (p.error) throw new Error("Pemilik foto belum dapat diperiksa.");
    const sah =
      lama.foto_path.startsWith(`pengurus/${lama.id}/`) ||
      p.data.some((p) => lama!.foto_path!.startsWith(`profil/${p.id}/`));
    if (!sah) throw new Error("Foto lama perlu diperiksa Super Admin.");
    const r = await admin.storage.from("media").remove([lama.foto_path]);
    if (r.error) throw new Error("Foto lama belum dihapus; perubahan belum disimpan.");
    fotoLamaDihapus = true;
  }
  const r = await db.rpc("simpan_pengurus_admin", {
    p_data: { ...data, foto_path: data.izin_foto ? data.foto_path : null } as Json,
  });
  if (r.error || !r.data) {
    if (fotoLamaDihapus)
      throw new Error(
        "Data belum tersimpan, tetapi foto lama sudah dihapus. Muat ulang lalu pilih foto kembali bila masih diizinkan tampil.",
      );
    gagal(r.error);
  }
  return r.data as unknown as Database["public"]["Tables"]["pengurus"]["Row"];
}
