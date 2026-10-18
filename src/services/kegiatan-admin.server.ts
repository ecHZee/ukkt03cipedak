import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  bolehKelolaKegiatan,
  bolehTerbitKegiatan,
  dataSimpanKegiatan,
  type FormulirKegiatan,
  type AksesKegiatan,
  type KegiatanAdmin,
} from "@/lib/kegiatan-admin";

type Client = SupabaseClient<Database>;
async function aksesKegiatan(db: Client, userId: string): Promise<AksesKegiatan> {
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

export async function ruangKegiatan(db: Client, userId: string) {
  const akses = await aksesKegiatan(db, userId);
  const [b, p] = await Promise.all([
    db.from("bidang").select("id, nama_singkat").order("urutan"),
    db
      .from("periode")
      .select("id, label, aktif")
      .order("aktif", { ascending: false })
      .order("label", { ascending: false }),
  ]);
  if (b.error || p.error) throw new Error("Gagal memuat pilihan bidang/periode. Coba muat ulang.");
  const kegiatan: KegiatanAdmin[] = [];
  if (akses.bolehKontribusi) {
    // Batasi jangkauan di query, bukan sekadar menyembunyikan kartu di browser.
    for (let offset = 0; ; offset += 1000) {
      let q = db
        .from("kegiatan")
        .select("*")
        .order("updated_at", { ascending: false })
        .order("id")
        .range(offset, offset + 999);
      if (akses.role === "anggota") q = q.eq("created_by", userId);
      else if (akses.bidangId)
        q = q.or(`bidang_id.eq.${akses.bidangId},and(bidang_id.is.null,created_by.eq.${userId})`);
      const { data, error } = await q;
      if (error || !data) throw new Error("Gagal memuat kegiatan. Coba muat ulang.");
      kegiatan.push(...data.filter((k) => bolehKelolaKegiatan(akses, k)));
      if (data.length < 1000) break;
    }
  }
  return { akses, kegiatan, bidang: b.data ?? [], periode: p.data ?? [] };
}

export async function simpanKegiatan(db: Client, userId: string, d: FormulirKegiatan) {
  const a = await aksesKegiatan(db, userId);
  const baru = { bidang_id: d.bidang_id, created_by: userId, status: d.status };
  let pembuat = userId;
  if (d.id) {
    const { data: lama, error } = await db
      .from("kegiatan")
      .select("bidang_id, created_by, status")
      .eq("id", d.id)
      .maybeSingle();
    if (error || !lama || !bolehKelolaKegiatan(a, lama))
      throw new Error("Kegiatan tidak tersedia atau di luar hak aksesmu.");
    pembuat = lama.created_by ?? "";
  }
  const target = { ...baru, created_by: pembuat };
  if (
    !a.bolehKontribusi ||
    !bolehKelolaKegiatan(a, target) ||
    (d.status === "terbit" && !bolehTerbitKegiatan(a, target))
  ) {
    throw new Error("Kamu tidak berhak menyimpan kegiatan dengan bidang/status ini.");
  }
  // Klien ber-JWT dari middleware: seluruh penulisan tetap lewat RLS, tanpa service role.
  const nilai = dataSimpanKegiatan(d);
  const q = d.id
    ? db.from("kegiatan").update(nilai).eq("id", d.id).eq("updated_at", d.versi!)
    : db.from("kegiatan").insert(nilai);
  const { data, error } = await q.select("id, slug, status").single();
  if (error || !data) {
    if (error?.code === "23505")
      throw new Error("Alamat kegiatan sudah digunakan. Ubah slug lalu simpan lagi.");
    if (error?.code === "PGRST116")
      throw new Error(
        "Kegiatan sudah berubah atau aksesmu berubah. Muat ulang sebelum menyimpan lagi.",
      );
    throw new Error(
      "Kegiatan gagal disimpan. Periksa koneksi, bidang, dan hak akses lalu coba lagi.",
    );
  }
  return data;
}

/** BPH saja; baca metadata Storage asli, tanpa mengirim nama/path berkas privat. */
export async function pemakaianPenyimpanan(db: Client, userId: string) {
  const a = await aksesKegiatan(db, userId);
  if (!bolehTerbitKegiatan(a, { bidang_id: null, created_by: null }))
    throw new Error("Pemakaian penyimpanan hanya untuk BPH dan Super Admin.");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let bytes = 0,
    berkas = 0,
    permintaan = 0;
  try {
    for (const bucket of ["media", "dokumen-publik", "dokumen-internal"]) {
      const antrean = [""];
      while (antrean.length) {
        const path = antrean.shift()!;
        for (let offset = 0; ; offset += 100) {
          // Jangan menyajikan angka parsial sebagai total bila daftar terlalu besar/gagal.
          if (++permintaan > 200) throw new Error("batas pemindaian");
          const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .list(path, { limit: 100, offset, sortBy: { column: "name", order: "asc" } });
          if (error || !data) throw new Error("storage tidak tersedia");
          for (const f of data) {
            if (!f.id) antrean.push([path, f.name].filter(Boolean).join("/"));
            else {
              const size = Number(f.metadata?.size);
              if (!Number.isFinite(size) || size < 0) throw new Error("ukuran tidak tersedia");
              bytes += size;
              berkas++;
            }
          }
          if (data.length < 100) break;
        }
      }
    }
    return { tersedia: true, bytes, berkas, diperiksa: new Date().toISOString() };
  } catch {
    return { tersedia: false, bytes: null, berkas: null, diperiksa: new Date().toISOString() };
  }
}
