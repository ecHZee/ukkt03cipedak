import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import { supabaseAdmin as admin } from "@/integrations/supabase/client.server";
import { aksesAdmin } from "./akses-admin.server";
import {
  KUNCI_SITUS,
  isianDariBaris,
  pathTampilan,
  pathAsetSitus,
  ringkasAudit,
  filterAudit,
  headerWebpSah,
  type IsianSitus,
} from "@/lib/pengaturan-admin";
import type { z } from "zod";
type Client = SupabaseClient<Database>;
async function bph(db: Client, uid: string) {
  const a = await aksesAdmin(db, uid);
  if (!(a.role === "super_admin" || (a.role === "admin" && !a.bidangId)))
    throw new Error("Halaman ini khusus BPH dan Super Admin.");
  return a;
}
export async function ruangPengaturan(db: Client, uid: string) {
  await bph(db, uid);
  const r = await db
    .from("pengaturan")
    .select("key,value,updated_at")
    .in("key", [...KUNCI_SITUS]);
  if (r.error || r.data.length !== KUNCI_SITUS.length)
    throw new Error("Pengaturan belum tersedia. Coba muat ulang.");
  const s = await db.from("aset_situs_sampah").select("path", { count: "exact", head: true });
  if (s.error) throw new Error("Status berkas belum tersedia.");
  return {
    nilai: isianDariBaris(r.data),
    versi: Object.fromEntries(r.data.map((x) => [x.key, x.updated_at])),
    tertunda: s.count ?? 0,
  };
}
async function cekWebp(path: string) {
  const r = await admin.storage.from("media").download(path);
  if (r.error || !r.data || r.data.size > 2097152)
    throw new Error("Gambar belum terunggah lengkap.");
  const h = new Uint8Array(await r.data.slice(0, 12).arrayBuffer());
  if (!headerWebpSah(h)) throw new Error("Isi gambar bukan WebP yang benar.");
}
export async function simpanPengaturan(
  db: Client,
  uid: string,
  nilai: IsianSitus,
  versi: Record<string, string>,
) {
  const lama = await ruangPengaturan(db, uid);
  for (const path of pathTampilan(nilai["situs.tampilan"])) {
    if (!pathTampilan(lama.nilai["situs.tampilan"]).includes(path)) {
      if (!path.startsWith(`pengaturan/${uid}/`))
        throw new Error("Pilih gambar dari unggahan sendiri.");
      await cekWebp(path);
    }
  }
  const r = await db.rpc("simpan_pengaturan_situs", {
    p_data: nilai as unknown as Json,
    p_versi: versi,
  });
  if (r.error)
    throw new Error(
      r.error.code === "P0021"
        ? "Pengaturan sudah berubah. Salin isianmu, lalu muat ulang sebelum menyimpan lagi."
        : "Pengaturan belum tersimpan. Periksa isian, koneksi, dan izin akses.",
    );
  // Simpan sudah berhasil; kegagalan menghapus berkas lama tidak boleh dilaporkan sebagai gagal simpan.
  let peringatan = "";
  try {
    await bersihkanAsetSitus(db, uid);
  } catch {
    peringatan = "Pengaturan tersimpan. Berkas lama belum terhapus; gunakan Bersihkan berkas lama.";
  }
  return { nilai, versi: r.data as Record<string, string>, tertunda: lama.tertunda, peringatan };
}
export async function bersihkanAsetSitus(db: Client, uid: string) {
  await bph(db, uid);
  const r = await db
    .from("aset_situs_sampah")
    .select("path")
    .lt("created_at", new Date(Date.now() - 3600_000).toISOString())
    .limit(100);
  if (r.error) throw new Error("Antrean pembersihan belum tersedia.");
  let jumlah = 0;
  for (const { path } of r.data) {
    if (!pathAsetSitus.test(path)) throw new Error("Lokasi berkas perlu diperiksa.");
    const del = await db.storage.from("media").remove([path]);
    if (del.error) throw new Error("Berkas lama belum terhapus. Coba lagi.");
    // Storage dapat mengembalikan sukses dengan nol objek bila policy menolak penghapusan.
    const ada = await admin.storage
      .from("media")
      .list(path.split("/").slice(0, 2).join("/"), { search: path.split("/").at(-1) });
    if (ada.error || ada.data.length) throw new Error("Berkas masih dipakai atau belum terhapus.");
    const q = await admin.from("aset_situs_sampah").delete().eq("path", path);
    if (q.error) throw new Error("Status pembersihan belum tersimpan.");
    jumlah++;
  }
  return { jumlah };
}
export async function buangUnggahanSitus(db: Client, uid: string, path: string) {
  await bph(db, uid);
  if (!pathAsetSitus.test(path) || !path.startsWith(`pengaturan/${uid}/`))
    throw new Error("Unggahan tidak sesuai.");
  const r = await db.storage.from("media").remove([path]);
  if (r.error) throw new Error("Unggahan sementara belum dibersihkan.");
  const boleh = await db.rpc("aset_situs_boleh_hapus", { p: path });
  if (boleh.error || !boleh.data) throw new Error("Gambar sedang dipakai website.");
  const q = await admin.from("aset_situs_sampah").delete().eq("path", path);
  if (q.error) throw new Error("Status unggahan sementara belum dibersihkan.");
}
export async function siapkanAsetSitus(db: Client, uid: string) {
  await bph(db, uid);
  const path = `pengaturan/${uid}/${crypto.randomUUID()}.webp`;
  const r = await admin.from("aset_situs_sampah").insert({ path });
  if (r.error) throw new Error("Penyimpanan gambar belum siap.");
  return { path };
}
export async function daftarAudit(db: Client, uid: string, input: z.infer<typeof filterAudit>) {
  await bph(db, uid);
  const f = filterAudit.parse(input);
  let q = db
    .from("audit_log")
    .select("id,waktu,tabel,aksi,user_id,record_id,sebelum,sesudah", { count: "exact" })
    .in("tabel", [
      "pengaturan",
      "akun",
      "profiles",
      "pengurus",
      "kegiatan",
      "berita",
      "album",
      "media",
      "dokumen",
      "periode",
      "bidang",
    ]);
  if (f.modul) q = q.eq("tabel", f.modul);
  if (f.aksi) q = q.eq("aksi", f.aksi);
  if (f.pelaku) q = q.eq("user_id", f.pelaku);
  if (f.dari) q = q.gte("waktu", f.dari + "T00:00:00+07:00");
  if (f.sampai) q = q.lte("waktu", f.sampai + "T23:59:59.999999+07:00");
  const r = await q
    .order("waktu", { ascending: false })
    .order("id", { ascending: false })
    .range(f.halaman * 25, f.halaman * 25 + 24);
  const p = await db.from("profiles").select("id,username,nama_tampilan").order("nama_tampilan");
  if (r.error || p.error) throw new Error("Log aktivitas belum tersedia. Coba lagi.");
  const nama = new Map(p.data.map((a) => [a.id, a.username ? `@${a.username}` : a.nama_tampilan]));
  return {
    jumlah: r.count ?? 0,
    pelaku: p.data.map((a) => ({ id: a.id, nama: nama.get(a.id) ?? "Pengurus" })),
    baris: r.data.map((x) => ({
      id: x.id,
      waktu: x.waktu,
      modul: x.tabel,
      aksi: x.aksi,
      pelaku: x.user_id ? (nama.get(x.user_id) ?? "Akun sudah dihapus") : "Sistem / migrasi",
      ringkasan: ringkasAudit(x),
      sasaran:
        x.tabel === "pengaturan" &&
        KUNCI_SITUS.includes(x.record_id as (typeof KUNCI_SITUS)[number])
          ? x.record_id
          : null,
    })),
  };
}
