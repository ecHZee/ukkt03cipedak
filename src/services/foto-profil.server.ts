import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Hapus melalui Storage API agar metadata DAN objek hilang. Seluruh akses tetap memakai JWT/RLS. */
export async function simpanFotoProfil(
  db: SupabaseClient<Database>,
  userId: string,
  path: string | null,
  izin: boolean,
) {
  const { data: p, error } = await db
    .from("profiles")
    .select("pengurus_id, aktif")
    .eq("id", userId)
    .single();
  if (error || !p?.aktif || !p.pengurus_id)
    throw new Error("Akun tidak aktif atau belum terhubung ke pengurus.");
  if (
    path &&
    (!path.startsWith(`profil/${userId}/`) ||
      path.split("/").length !== 3 ||
      !/^[\w-]+\.webp$/.test(path.split("/")[2]))
  )
    throw new Error("Foto harus berada di folder profil milik sendiri.");
  if (izin && !path) throw new Error("Pilih foto sebelum mengaktifkan izin.");
  const { data: lama, error: e } = await db
    .from("pengurus")
    .select("foto_path")
    .eq("id", p.pengurus_id)
    .single();
  if (e || !lama) throw new Error("Gagal memeriksa foto sebelumnya. Coba lagi.");
  if (izin && path !== lama.foto_path) {
    const nama = path!.split("/")[2];
    const r = await db.storage.from("media").list(`profil/${userId}`, { search: nama, limit: 10 });
    if (r.error || !r.data?.some((f) => f.id && f.name === nama))
      throw new Error("Unggahan foto baru belum tersedia. Foto lama belum diubah; coba lagi.");
  }
  if (lama.foto_path && (!izin || lama.foto_path !== path)) {
    if (!lama.foto_path.startsWith(`profil/${userId}/`))
      throw new Error("Foto lama perlu dibersihkan BPH sebelum diganti.");
    const r = await db.storage.from("media").remove([lama.foto_path]);
    if (r.error || !r.data?.some((f) => f.name === lama.foto_path))
      throw new Error("Berkas lama belum berhasil dihapus. Izin belum diubah; coba lagi.");
  }
  const r = await db.rpc("ubah_foto_saya", {
    p_foto_path: (izin ? path : null) as string,
    p_izin: izin,
  });
  if (r.error)
    throw new Error(
      "Gagal memperbarui profil. Berkas lama mungkin sudah dibersihkan; muat ulang lalu coba lagi.",
    );
  return { foto: izin ? path : null, izin };
}
