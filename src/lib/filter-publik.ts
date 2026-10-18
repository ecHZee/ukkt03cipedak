/** Nilai URL dibatasi supaya tautan yang dibagikan selalu punya hasil yang dapat dipulihkan. */
const BIDANG = [
  "okk",
  "kerohanian",
  "lingkungan",
  "ekonomi",
  "pendidikan",
  "media",
  "inventaris",
  "umum",
];
const STATUS = ["rencana", "berjalan", "selesai", "batal"];
const KATEGORI = [
  "lpj-kegiatan",
  "proposal",
  "surat-masuk",
  "surat-keluar",
  "sk-organisasi",
  "template-surat",
  "lainnya",
];
const pilih = (nilai: unknown, pilihan: string[]) =>
  typeof nilai === "string" && pilihan.includes(nilai) ? nilai : undefined;

type FilterBerita = { bidang?: string };
type FilterKegiatan = FilterBerita & { status?: string };
type FilterArsip = FilterBerita & { tahun?: number; kategori?: string; q?: string };

export function bacaFilterBerita(s: Record<string, unknown>): FilterBerita {
  return { bidang: pilih(s.bidang, BIDANG) };
}

export function bacaFilterKegiatan(s: Record<string, unknown>): FilterKegiatan {
  return { ...bacaFilterBerita(s), status: pilih(s.status, STATUS) };
}

export function bacaFilterArsip(s: Record<string, unknown>): FilterArsip {
  const tahun = typeof s.tahun === "number" || typeof s.tahun === "string" ? Number(s.tahun) : NaN;
  return {
    ...bacaFilterBerita(s),
    tahun: Number.isInteger(tahun) && tahun >= 1900 && tahun <= 2100 ? tahun : undefined,
    kategori: pilih(s.kategori, KATEGORI),
    q: typeof s.q === "string" && s.q.trim() ? s.q.trim().slice(0, 120) : undefined,
  };
}

export function cocokBidang(nilai: string | null, pilihan?: string) {
  return !pilihan || (pilihan === "umum" ? nilai === null : nilai === pilihan);
}
