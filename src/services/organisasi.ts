/**
 * Akses data organisasi (periode, bidang, pengurus) dari Supabase.
 * Dipakai di loader route sehingga data diambil saat render di server (SSR).
 * Hanya membaca data publik; aturan akses ditegakkan RLS di database.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Anggota, StrukturGroup } from "@/domains/anggota/data";
import type { Bidang } from "@/domains/program/data";
import { urlPublik } from "@/services/storage";

/** Data bidang tanpa gaya tampilan (ikon/warna) — harus data polos agar bisa dikirim dari server. */
export type BidangData = Omit<Bidang, "icon" | "tone" | "iconBg">;

export type Periode = {
  id: string;
  label: string;
  nomorSK: string | null;
  /** Sudah diformat, mis. "05 Juni 2025". */
  tanggalSK: string | null;
  tanggalPelantikan: string | null;
  aktif: boolean;
};

const formatTanggal = (iso: string | null) =>
  iso
    ? new Date(`${iso}T00:00:00+07:00`).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })
    : null;

const GRUP: Record<string, StrukturGroup> = {
  penasihat: "PENASIHAT",
  bph: "BPH",
  bidang: "BIDANG",
};

function gagal(label: string, error: { message: string } | null): never {
  throw new Error(`Gagal memuat ${label}: ${error?.message ?? "data kosong"}`);
}

export async function ambilBidang(): Promise<BidangData[]> {
  const { data, error } = await supabase
    .from("bidang")
    .select("slug, nama_resmi, nama_singkat, tagline, deskripsi, fokus")
    .order("urutan");
  if (error || !data) gagal("bidang", error);
  return data.map((b) => ({
    slug: b.slug as Bidang["slug"],
    name: b.nama_resmi,
    singkat: b.nama_singkat,
    tagline: b.tagline ?? "",
    description: b.deskripsi ?? "",
    fokus: b.fokus,
  }));
}

export async function ambilPeriode(): Promise<Periode[]> {
  const { data, error } = await supabase
    .from("periode")
    .select("id, label, nomor_sk, tanggal_sk, tanggal_pelantikan, aktif")
    .order("tanggal_sk", { ascending: false });
  if (error || !data) gagal("periode", error);
  return data.map((p) => ({
    id: p.id,
    label: p.label,
    nomorSK: p.nomor_sk,
    tanggalSK: formatTanggal(p.tanggal_sk),
    tanggalPelantikan: formatTanggal(p.tanggal_pelantikan),
    aktif: p.aktif,
  }));
}

export async function ambilPengurus(periode: Periode): Promise<Anggota[]> {
  const { data, error } = await supabase
    .from("pengurus")
    .select(
      "id, nama, gelar, jabatan, grup, rt, instagram, foto_path, urutan, bidang(slug, nama_resmi, nama_singkat, urutan)",
    )
    .eq("periode_id", periode.id);
  if (error || !data) gagal("pengurus", error);

  const urutGrup = { penasihat: 0, bph: 1, bidang: 2 } as const;
  return [...data]
    .sort(
      (a, b) =>
        urutGrup[a.grup] - urutGrup[b.grup] ||
        (a.bidang?.urutan ?? 0) - (b.bidang?.urutan ?? 0) ||
        a.urutan - b.urutan,
    )
    .map((p) => ({
      id: p.id,
      nama: p.nama,
      gelar: p.gelar ?? undefined,
      jabatan: p.jabatan,
      group: GRUP[p.grup],
      bidang: (p.bidang?.slug as Anggota["bidang"]) ?? undefined,
      bidangNama: p.bidang?.nama_resmi,
      bidangSingkat: p.bidang?.nama_singkat,
      rt: p.rt ?? undefined,
      periode: periode.label,
      instagram: p.instagram ?? undefined,
      // foto_path otomatis null bila pemiliknya tidak mengizinkan (trigger privasi)
      fotoUrl: urlPublik("media", p.foto_path) ?? undefined,
    }));
}

/** Semua data untuk halaman Tentang: periode aktif, riwayat periode, bidang, pengurus. */
export async function ambilOrganisasi() {
  const [periode, bidang] = await Promise.all([ambilPeriode(), ambilBidang()]);
  const aktif = periode.find((p) => p.aktif) ?? periode[0];
  if (!aktif) gagal("periode aktif", null);
  const pengurus = await ambilPengurus(aktif);
  return { periodeAktif: aktif, riwayatPeriode: periode, bidang, pengurus };
}

/** Jumlah pengurus aktif (tanpa penasihat) pada periode aktif. */
export async function hitungPengurusAktif(): Promise<number> {
  const { data: periode, error: e1 } = await supabase
    .from("periode")
    .select("id")
    .eq("aktif", true)
    .maybeSingle();
  if (e1) gagal("periode aktif", e1);
  if (!periode) return 0;
  const { count, error } = await supabase
    .from("pengurus")
    .select("*", { count: "exact", head: true })
    .eq("periode_id", periode.id)
    .neq("grup", "penasihat");
  if (error) gagal("jumlah pengurus", error);
  return count ?? 0;
}
