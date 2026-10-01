import type { BidangSlug } from "@/domains/program/data";

/** Data pengurus diambil dari database (src/services/organisasi.ts). File ini hanya berisi tipe. */

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
