import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import type { AksesKegiatan } from "@/lib/kegiatan-admin";
import {
  bolehKelolaAlbum,
  type FormulirAlbum,
  type ReservasiAlbum,
  type AksiMediaAlbum,
  thumbB2,
} from "@/lib/galeri-admin";
import { supabaseAdmin as admin } from "@/integrations/supabase/client.server";
import {
  tandaGetB2,
  tandaPutB2,
  finalkanObjekB2,
  bersihkanObjekB2,
  pastikanB2Siap,
} from "./b2.server";
import { bacaLinkVideo } from "./storage";
type Client = SupabaseClient<Database>;
export async function aksesGaleri(db: Client, userId: string): Promise<AksesKegiatan> {
  const { data: p, error } = await db
    .from("profiles")
    .select("id,role,bidang_id,izin_kontribusi,aktif")
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
async function albumMilik(db: Client, userId: string, id: string, draf = false) {
  const akses = await aksesGaleri(db, userId);
  const { data: a, error } = await db.from("album").select("*").eq("id", id).maybeSingle();
  if (error || !a || !bolehKelolaAlbum(akses, a))
    throw new Error("Album tidak tersedia atau di luar hak aksesmu.");
  if (draf && a.status === "terbit")
    throw new Error("Tarik album ke draf sebelum mengubah medianya.");
  return a;
}
function gagal(error: { code?: string; message?: string } | null): never {
  if (error?.code === "40001")
    throw new Error("Album sudah berubah. Muat ulang sebelum mencoba lagi.");
  if (error?.code === "23505") throw new Error("Alamat album atau berkas sudah digunakan.");
  // Pesan RPC merupakan aturan produk; jangan teruskan detail PostgREST/SQL/server.
  const aman = [
    "Selesaikan unggahan",
    "Bidang album",
    "Maksimal 200",
    "Selesaikan/bersihkan",
    "File sudah",
    "Bersihkan unggahan",
    "Hapus media",
    "Sampul harus",
  ];
  throw new Error(
    aman.some((p) => error?.message?.startsWith(p))
      ? error!.message
      : "Perubahan gagal. Periksa koneksi, muat ulang dan cek hak aksesmu.",
  );
}
export async function ruangGaleri(db: Client, userId: string, albumId?: string) {
  const akses = await aksesGaleri(db, userId);
  const b = await db.from("bidang").select("id,nama_singkat").order("urutan");
  if (b.error) throw new Error("Pilihan bidang belum dapat dimuat.");
  const album: Database["public"]["Tables"]["album"]["Row"][] = [];
  if (akses.bolehKontribusi)
    for (let offset = 0; ; offset += 1000) {
      let q = db
        .from("album")
        .select("*")
        .order("updated_at", { ascending: false })
        .order("id")
        .range(offset, offset + 999);
      if (akses.role === "anggota") q = q.eq("created_by", userId);
      else if (akses.bidangId)
        q = q.or(`bidang_id.eq.${akses.bidangId},and(bidang_id.is.null,created_by.eq.${userId})`);
      const r = await q;
      if (r.error) throw new Error("Daftar album belum dapat dimuat.");
      album.push(...r.data.filter((a) => bolehKelolaAlbum(akses, a)));
      if (r.data.length < 1000) break;
    }
  const media: Database["public"]["Tables"]["media"]["Row"][] = [];
  let tertunda = 0;
  if (albumId && album.some((a) => a.id === albumId)) {
    const r = await db
      .from("media")
      .select("*")
      .eq("album_id", albumId)
      .order("urutan")
      .order("id");
    const u = await db
      .from("galeri_unggahan")
      .select("id", { count: "exact", head: true })
      .eq("album_id", albumId)
      .in("status", ["pending", "siap", "memproses", "batal"]);
    if (r.error || u.error) throw new Error("Isi album belum dapat dimuat.");
    media.push(...r.data);
    tertunda = u.count ?? 0;
  }
  return { akses, album, bidang: b.data, media, tertunda };
}
export async function simpanAlbum(db: Client, userId: string, data: FormulirAlbum) {
  await aksesGaleri(db, userId);
  const r = await db.rpc("simpan_album_admin", { p_data: data as Json });
  if (r.error || !r.data) gagal(r.error);
  return r.data as unknown as Database["public"]["Tables"]["album"]["Row"];
}
export async function reservasiGaleri(db: Client, userId: string, data: ReservasiAlbum) {
  await albumMilik(db, userId, data.album_id, true);
  pastikanB2Siap();
  const r = await db.rpc("reservasi_galeri", { p_data: data as Json });
  if (r.error || !r.data) gagal(r.error);
  const u = r.data as unknown as Database["public"]["Tables"]["galeri_unggahan"]["Row"];
  if (u.status === "selesai") return { id: u.id, selesai: true, url: null, thumbUrl: null };
  if (u.status === "memproses")
    throw new Error("Berkas sedang diverifikasi. Tunggu sebentar lalu coba lagi.");
  const hasil = {
    id: u.id,
    selesai: false,
    url: u.status === "siap" ? null : await tandaPutB2(u.staging_path, u.mime, u.ukuran_bytes),
    thumbUrl:
      u.status !== "siap" && u.thumb_bytes !== null
        ? await tandaPutB2(thumbB2(u.staging_path), "image/webp", u.thumb_bytes)
        : null,
  };
  if (hasil.url) {
    // Simpan expiry SETELAH signing agar pembersihan tidak kehilangan jejak PUT terlambat.
    const jejak = await admin
      .from("galeri_unggahan")
      .update({ put_berlaku_sampai: new Date(Date.now() + 301_000).toISOString() })
      .eq("id", u.id)
      .eq("status", "pending")
      .select("id")
      .single();
    if (jejak.error) throw new Error("Unggahan sedang berubah. Coba lagi sebentar.");
  }
  return hasil;
}
export async function selesaikanGaleri(db: Client, userId: string, id: string) {
  const r = await admin
    .from("galeri_unggahan")
    .select("*")
    .eq("id", id)
    .eq("created_by", userId)
    .maybeSingle();
  if (r.error || !r.data) throw new Error("Unggahan tidak tersedia.");
  let u = r.data;
  await albumMilik(db, userId, u.album_id, true);
  if (u.status === "selesai") return { id: u.id };
  // CAS lintas isolate: dua permintaan tidak boleh menyalin ulang path final yang sudah terbit.
  if (u.status === "memproses" && Date.now() - Date.parse(u.updated_at) > 600_000) {
    await admin
      .from("galeri_unggahan")
      .update({ status: "pending" })
      .eq("id", id)
      .eq("updated_at", u.updated_at)
      .eq("status", "memproses");
    u = { ...u, status: "pending" };
  }
  if (u.status === "pending") {
    const claim = await admin
      .from("galeri_unggahan")
      .update({ status: "memproses" })
      .eq("id", id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();
    if (claim.error || !claim.data)
      throw new Error("Verifikasi sedang berjalan. Coba lagi sebentar.");
    try {
      await finalkanObjekB2(u);
      const siap = await admin
        .from("galeri_unggahan")
        .update({ status: "siap" })
        .eq("id", id)
        .eq("status", "memproses")
        .eq("updated_at", claim.data.updated_at)
        .select("id")
        .single();
      if (siap.error) throw new Error("Verifikasi belum tersimpan. Coba lagi.");
    } catch (e) {
      await admin
        .from("galeri_unggahan")
        .update({ status: "pending" })
        .eq("id", id)
        .eq("status", "memproses")
        .eq("updated_at", claim.data.updated_at);
      throw e;
    }
  } else if (u.status !== "siap") throw new Error("Berkas sedang diproses atau sudah dibatalkan.");
  const selesai = await db.rpc("selesaikan_galeri", { p_id: id });
  if (selesai.error) gagal(selesai.error);
  // Cleanup staging boleh diulang; media final tetap valid jika koneksi ke B2 sedang putus.
  try {
    await bersihkanObjekB2(u);
  } catch {
    /* Ditangani tombol bersihkan dan lifecycle staging. */
  }
  return { id };
}
export async function aturMediaAlbum(db: Client, userId: string, data: AksiMediaAlbum) {
  await albumMilik(db, userId, data.album_id, true);
  if (data.aksi === "embed" && (!data.url || !bacaLinkVideo(data.url)))
    throw new Error("Tautan YouTube/Instagram/TikTok belum dikenali.");
  const r = await db.rpc("atur_media_album", { p_data: data as Json });
  if (r.error) gagal(r.error);
  let menungguExpiry = 0;
  if (data.aksi === "hapus" || data.aksi === "bersihkan") {
    let q = admin.from("galeri_unggahan").select("*").eq("album_id", data.album_id);
    q = data.aksi === "hapus" ? q.eq("id", data.media_id!) : q.eq("created_by", userId);
    const daftar = await q;
    if (daftar.error)
      throw new Error("Perubahan tersimpan, tetapi pembersihan belum dapat dimulai.");
    for (const u of daftar.data) {
      if (u.status !== "batal" && u.status !== "selesai") continue;
      await bersihkanObjekB2(u, u.status === "batal");
      if (u.status === "batal" && Date.parse(u.put_berlaku_sampai) > Date.now()) {
        menungguExpiry++;
        continue;
      }
      if (u.status === "batal") {
        const hapus = await admin
          .from("galeri_unggahan")
          .delete()
          .eq("id", u.id)
          .eq("status", "batal");
        if (hapus.error) throw new Error("Pembersihan belum tersimpan. Coba lagi.");
      }
    }
  }
  return {
    peringatan: menungguExpiry
      ? "Media/reservasi sudah dihapus atau dibatalkan. Jejak pembersihan dijaga sampai URL unggah kedaluwarsa; klik Bersihkan lagi setelah lima menit."
      : null,
  };
}
export async function pratinjauMedia(db: Client, userId: string, id: string) {
  const { data: m, error } = await db.from("media").select("*").eq("id", id).maybeSingle();
  if (error || !m?.album_id) throw new Error("Media tidak tersedia.");
  await albumMilik(db, userId, m.album_id);
  if (!m.storage_path?.startsWith("b2:")) return { url: null };
  return {
    url: await tandaGetB2(
      m.jenis === "foto" ? thumbB2(m.storage_path.slice(3)) : m.storage_path.slice(3),
    ),
  };
}
