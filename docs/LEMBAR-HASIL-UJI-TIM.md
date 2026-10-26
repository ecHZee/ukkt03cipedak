# Lembar hasil dan evaluasi tim website

**Template kosong.** Salin ke catatan tim privat sebelum diisi. Jangan mengisi hasil atas
nama orang yang belum mencoba, serta jangan menempelkan password, token, nomor pribadi,
tautan unduh sementara atau dokumen terbatas di repositori publik.

## Identitas putaran uji

| Isian                           | Nilai            |
| ------------------------------- | ---------------- |
| Tanggal/pertemuan               | Belum ditetapkan |
| Versi/commit yang diuji         | …                |
| Alamat website/lingkungan       | …                |
| Peserta dan peran               | …                |
| Pemeriksa/pendamping            | …                |
| Perangkat, browser dan jaringan | …                |
| Data latihan dan izin pemakaian | …                |

## Hasil per kasus

Ambil ID dari [skenario uji](SKENARIO-UJI-TIM.md). Satu kasus dapat mempunyai beberapa
baris bila dicoba pada perangkat/peran berbeda. Status yang boleh dipakai: Belum diuji,
Lulus, Gagal, Terhalang, atau Tidak berlaku (sertakan alasan).

| ID kasus / fitur | Peserta/peran | Perangkat | Langkah terakhir | Hasil yang diharapkan | Hasil yang terjadi | Status      | Bukti privat / nomor masalah | Bantuan yang diterima |
| ---------------- | ------------- | --------- | ---------------- | --------------------- | ------------------ | ----------- | ---------------------------- | --------------------- |
| …                | …             | …         | …                | …                     | …                  | Belum diuji | …                            | …                     |

## Catatan masalah

| Nomor | Jenis: bug / membingungkan / ide fitur | Cara mengulangi | Dampak | Bukti privat | Penanggung jawab | Status | Versi perbaikan | Hasil dicoba ulang |
| ----- | -------------------------------------- | --------------- | ------ | ------------ | ---------------- | ------ | --------------- | ------------------ |
| …     | …                                      | …               | …      | …            | …                | Baru   | …               | Belum dicoba       |

- **Kritis:** data terbatas terbuka, data asli rusak/hilang, atau dampak keamanan lain.
  Hentikan langkah berisiko dan laporkan segera.
- **Berat:** tugas pokok tidak bisa selesai tanpa jalan keluar yang layak.
- **Sedang:** tugas dapat selesai dengan langkah tambahan yang perlu diperbaiki.
- **Ringan:** tulisan/kerapian yang tidak menghalangi tugas.

Pengembang menilai penyebab dan urutan perbaikan bersama pengelola. Setelah diperbaiki,
ulangi langkah pemicu dan alur terkait; menutup laporan membutuhkan bukti coba ulang.
Tidak menghapus laporan lama hanya karena ada versi baru.

## Penilaian penerimaan oleh tim

| Pertanyaan                                                          | Jawaban dan alasan |
| ------------------------------------------------------------------- | ------------------ |
| Apakah pekerjaan pokok tiap peran dapat dilakukan?                  | Belum dinilai      |
| Apakah ada fitur yang membingungkan atau sebaiknya dikurangi?       | Belum dibahas      |
| Apakah semua kendala kritis/berat telah ditangani dan dicoba ulang? | Belum dinilai      |
| Risiko apa yang masih terbuka dan siapa yang menerima?              | Belum diputuskan   |
| Apakah bahan, foto, akun dan panduan siap diserahkan?               | Belum dinilai      |
| Keputusan: lanjut uji / revisi / siap launching                     | Belum diputuskan   |
| Pengambil keputusan dan tanggal                                     | Belum ditetapkan   |

Jumlah Lulus dihitung dari baris hasil nyata. Gagal/Terhalang/Belum diuji tetap ditampilkan;
jangan mengganti hasil peserta dengan jumlah tes otomatis. Pengumuman ke warga dan perubahan
branch utama mengikuti persetujuan Hanif/tim yang terpisah.
