import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import {
  bolehKelolaBerita,
  bolehTerbitBerita,
  type FormulirBerita,
  type BeritaAdmin,
} from "@/lib/berita-admin";
import type { AksesKegiatan } from "@/lib/kegiatan-admin";

type Client = SupabaseClient<Database>;
async function aksesBerita(db: Client, userId: string): Promise<AksesKegiatan> {
  const { data: p, error } = await db
    .from("profiles")
    .select("id, role, bidang_id, izin_kontribusi, aktif")
    .eq("id", userId)
    .single();
  if (error || !p?.aktif)
    throw new Error("Akses akun tidak tersedia. Muat ulang atau hubungi BPH.");
  return {
    id: p.id,
    role: p.role,
    bidangId: p.bidang_id,
    bolehKontribusi: p.role !== "anggota" || p.izin_kontribusi,
  };
}
export async function ruangBerita(db: Client, userId: string) {
  const akses = await aksesBerita(db, userId);
  const b = await db.from("bidang").select("id, nama_singkat").order("urutan");
  if (b.error) throw new Error("Gagal memuat pilihan bidang. Coba lagi.");
  const berita: BeritaAdmin[] = [];
  if (akses.bolehKontribusi)
    for (let offset = 0; ; offset += 1000) {
      let q = db
        .from("berita")
        .select("*")
        .order("updated_at", { ascending: false })
        .order("id")
        .range(offset, offset + 999);
      if (akses.role === "anggota") q = q.eq("created_by", userId);
      else if (akses.bidangId)
        q = q.or(`bidang_id.eq.${akses.bidangId},and(bidang_id.is.null,created_by.eq.${userId})`);
      const { data, error } = await q;
      if (error || !data) throw new Error("Gagal memuat berita. Coba lagi.");
      berita.push(...data.filter((n) => bolehKelolaBerita(akses, n)));
      if (data.length < 1000) break;
    }
  const sampul: Array<{ id: string; storage_path: string | null; caption: string | null }> = [];
  for (let offset = 0; offset < berita.length; offset += 100) {
    const ids = berita.slice(offset, offset + 100).flatMap((n) => (n.cover_id ? [n.cover_id] : []));
    if (!ids.length) continue;
    const r = await db.from("media").select("id,storage_path,caption").in("id", ids);
    if (r.error) throw new Error("Gagal memuat sampul. Coba lagi.");
    sampul.push(...r.data);
  }
  return { akses, berita, bidang: b.data, sampul };
}
export async function simpanBerita(db: Client, userId: string, d: FormulirBerita) {
  const a = await aksesBerita(db, userId);
  let pembuat = userId;
  if (d.id) {
    const r = await db.from("berita").select("*").eq("id", d.id).maybeSingle();
    if (r.error || !r.data || !bolehKelolaBerita(a, r.data))
      throw new Error("Berita tidak tersedia atau di luar hak aksesmu.");
    if (r.data.updated_at !== d.versi)
      throw new Error("Berita sudah berubah. Muat ulang sebelum menyimpan lagi.");
    pembuat = r.data.created_by ?? "";
  }
  const target = { bidang_id: d.bidang_id, created_by: pembuat, status: d.status };
  if (
    !a.bolehKontribusi ||
    !bolehKelolaBerita(a, target) ||
    (d.status === "terbit" && !bolehTerbitBerita(a, target))
  )
    throw new Error("Kamu tidak berhak menyimpan berita dengan bidang/status ini.");
  if (d.sampul) {
    const { path, thumbPath } = d.sampul;
    const prefix = `berita/${userId}/`;
    if (
      !path.startsWith(prefix) ||
      !/^[a-zA-Z0-9-]+\.webp$/.test(path.slice(prefix.length)) ||
      thumbPath !== path.replace(/\.webp$/, "_thumb.webp")
    )
      throw new Error("Sampul harus berasal dari unggahan milik sendiri.");
  }
  const { sampul, ...nilai } = d;
  const { data, error } = await db.rpc("simpan_berita_admin", {
    p_data: nilai as Json,
    p_sampul: (sampul ?? null) as Json,
  });
  if (error || !data) {
    if (error?.code === "23505")
      throw new Error("Alamat berita sudah digunakan. Ubah slug lalu simpan lagi.");
    if (["40001", "P0021"].includes(error?.code ?? ""))
      throw new Error(
        "Berita sudah berubah atau aksesmu berubah. Muat ulang sebelum menyimpan lagi.",
      );
    throw new Error("Berita gagal disimpan. Periksa koneksi dan hak akses lalu coba lagi.");
  }
  return data as { id: string; slug: string; status: "draft" | "review" | "terbit" };
}

/** Hapus draf/review saja; media tetap di pustaka agar berkas yang dipakai konten lain tidak rusak. */
export async function hapusBerita(db: Client, userId: string, id: string, versi: string) {
  const a = await aksesBerita(db, userId);
  const r = await db.from("berita").select("*").eq("id", id).maybeSingle();
  if (r.error || !r.data || !bolehKelolaBerita(a, r.data))
    throw new Error("Berita tidak tersedia atau di luar hak aksesmu.");
  if (r.data.status === "terbit") throw new Error("Tarik berita ke draf sebelum menghapus.");
  const hasil = await db
    .from("berita")
    .delete()
    .eq("id", id)
    .eq("updated_at", versi)
    .select("id")
    .single();
  if (hasil.error || !hasil.data)
    throw new Error("Berita berubah atau gagal dihapus. Muat ulang lalu coba lagi.");
}
