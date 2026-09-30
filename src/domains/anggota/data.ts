import type { BidangSlug } from "@/domains/program/data";

export type StrukturGroup = "PENASIHAT" | "BPH" | "BIDANG";

export type Anggota = {
  id: string;
  nama: string;
  /** Gelar akademik, ditulis terpisah dari nama (mis. "S.Kom."). */
  gelar?: string;
  /** Penasihat / Ketua / Wakil Ketua / ... / Kepala Bidang / Anggota Bidang */
  jabatan: string;
  group: StrukturGroup;
  bidang?: BidangSlug; // hanya untuk group BIDANG
  bidangNama?: string; // dari database (nama resmi bidang)
  bidangSingkat?: string; // dari database (nama singkat bidang)
  rt?: string; // mis. "RT 01" — opsional
  periode: string;
  instagram?: string; // opsional, hanya dengan izin yang bersangkutan
  fotoUrl?: string; // opsional, hanya dengan izin yang bersangkutan
};

/** Nama + gelar untuk ditampilkan, mis. "Lulu Khaulia, A.Md.I.Kom." */
export function namaLengkap(a: Pick<Anggota, "nama" | "gelar">) {
  return a.gelar ? `${a.nama}, ${a.gelar}` : a.nama;
}

const PERIODE = "2025–2028";

export const PERIODE_AKTIF = {
  label: PERIODE,
  nomorSK: "003/SK/KT-Cipedak/VI/2025",
  /** Tanggal SK ditetapkan (sumber resmi). */
  tanggalSK: "05 Juni 2025",
  /** Belum dikonfirmasi Ketua — jangan ditampilkan selama masih null. */
  tanggalPelantikan: null as string | null,
  status: "Aktif" as const,
};

export const PERIODE_HISTORY = [
  {
    label: PERIODE,
    nomorSK: PERIODE_AKTIF.nomorSK,
    tanggalSK: PERIODE_AKTIF.tanggalSK,
    status: "Aktif" as const,
  },
];

const penasihat = (id: string, nama: string, gelar?: string): Anggota => ({
  id,
  nama,
  gelar,
  jabatan: "Penasihat",
  group: "PENASIHAT",
  periode: PERIODE,
});

const bph = (id: string, jabatan: string, nama: string, gelar?: string): Anggota => ({
  id,
  nama,
  gelar,
  jabatan,
  group: "BPH",
  periode: PERIODE,
});

/** Nama pertama di setiap bidang adalah Kepala Bidang (sesuai urutan SK). */
const bidang = (slug: BidangSlug, anggota: Array<[nama: string, gelar?: string]>): Anggota[] =>
  anggota.map(([nama, gelar], i) => ({
    id: `${slug}-${i + 1}`,
    nama,
    gelar,
    jabatan: i === 0 ? "Kepala Bidang" : "Anggota Bidang",
    group: "BIDANG",
    bidang: slug,
    periode: PERIODE,
  }));

/**
 * Struktur Unit Kerja Karang Taruna RW 03 Cipedak — Masa Bakti 2025–2028.
 * SUMBER: Lampiran SK Karang Taruna Kelurahan Cipedak No. 003/SK/KT-Cipedak/VI/2025.
 * Urutan mengikuti SK. DILARANG menambah nama di luar SK.
 */
export const STRUKTUR_2025_2028: Anggota[] = [
  // ===== Penasihat =====
  penasihat("penasihat-1", "Barmansyah"),
  penasihat("penasihat-2", "Fadhilah Sakti Nugroho"),

  // ===== Badan Pengurus Harian =====
  bph("bph-ketua", "Ketua", "Dimas Pratama Fitriandi"),
  bph("bph-wakil-1", "Wakil Ketua", "Hafizh Muhammad Dzikra Sutisna", "S.Pd."),
  bph("bph-wakil-2", "Wakil Ketua", "Abdullah Azzam Umair", "S.Sos."),
  bph("bph-wakil-3", "Wakil Ketua", "Rizki Hasyim Sakban Nasution"),
  bph("bph-sekretaris", "Sekretaris", "Lulu Khaulia", "A.Md.I.Kom."),
  bph("bph-wakil-sekretaris", "Wakil Sekretaris", "Ainurisma Sobrina"),
  bph("bph-bendahara", "Bendahara", "Indah Rachmadania"),
  bph("bph-wakil-bendahara", "Wakil Bendahara", "Tri Dewi Setyawati"),

  // ===== Bidang =====
  ...bidang("okk", [
    ["Muhammad Akram Kautsar Umron"],
    ["Nur Latifah Zahra"],
    ["Muhammad Maulida Afrizal"],
    ["Ridho Ramadhani"],
    ["Mikail Hanif Pradana"],
    ["Muhamad Fadly Adzikri"],
    ["Muhammad Raihan"],
  ]),
  ...bidang("kerohanian", [
    ["Razzan Adriansyah"],
    ["Fahrizal Zachry", "A.Md.I.Kom."],
    ["Fajar Andhika Putra Santoso"],
    ["Muhammad Habibi Muqtahidin"],
  ]),
  ...bidang("lingkungan", [
    ["Firman Valerian"],
    ["Dafaldi Aditya"],
    ["Ferdi Adrian"],
    ["Agus Rinaldi"],
    ["Muhammad Azki Hibatulloh"],
    ["Muhammad Ikhsan"],
    ["Muhammad Aliksan"],
    ["Deandyka Mahendra"],
  ]),
  ...bidang("ekonomi", [
    ["Syazkiya Alifah Annur"],
    ["Rizkia Salma Ramadhani"],
    ["Adinda Aulia Zahra"],
    ["Nurvani Ishaqtijani"],
    ["Siti Fathonnah"],
    ["Nada Nurina Fajriani"],
    ["Sabila Putri Zanah"],
    ["Raya Adia Heza Muslimah"],
  ]),
  ...bidang("pendidikan", [
    ["Omar Sultan"],
    ["Kobar Jayamadya"],
    ["Muhammad Rizky Ramdhani"],
    ["Muhammad Faiz Fachrezy"],
    ["Muhammad Rafid Ramadhan"],
    ["Azka Zuhdi"],
    ["Cakra Aditia"],
    ["Muhammad Arif Setiawan"],
    ["Gibran Latif"],
    ["Hadil Alwan"],
    ["Harza Fairuz"],
    ["Alvis Fauzi Juniar"],
    ["Muhammad Arfan Arrasyiq"],
  ]),
  ...bidang("media", [
    ["Deva Ramadhani"],
    ["Rizky Fauzi Ramadhan", "S.Kom."],
    ["Aditya Firmansya"],
    ["Hanif Muhammad Zhafran Sutisna", "S.Kom."],
    ["Kaisar Muhammad Dekariansyah"],
    ["Keysha Noormeydhiana"],
    ["Fazli Nugraha"],
  ]),
  ...bidang("inventaris", [
    ["Azalea Agza Putri Susanto"],
    ["Rahma Amelia"],
    ["Alifia Putri Ramadhani"],
    ["Thalita Salwa Athaya Rayyan"],
  ]),
];

/** Pengurus aktif = semua kecuali penasihat (59 orang). */
export const PENGURUS_AKTIF = STRUKTUR_2025_2028.filter((a) => a.group !== "PENASIHAT");
