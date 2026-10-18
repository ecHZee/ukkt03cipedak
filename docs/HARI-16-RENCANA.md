# Rencana Hari 16 — QA tampilan dan Checkpoint 3

Hari 15 selesai pada 18 Oktober 2026. **Hari 16 mulai atas persetujuan Hanif 18 Oktober 2026**.
Pelaksanaan dan bukti: [HARI-16-REVIEW.md](HARI-16-REVIEW.md). Perbaikan/QA teknis sudah online;
median LCP final 2,741 detik, target <2,5 belum konsisten. Hari 16 belum ditutup penuh dan
Checkpoint 3 menunggu review Hanif/Ketua; Hari 17 belum dimulai.
Target utama https://ukkt03cipedak.pages.dev; Worker asal menjadi pembanding bila ada masalah proxy.

## Urutan

| Langkah | Pekerjaan                                                                                                                                   | Bukti selesai                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | Audit seluruh halaman publik dan interaksi lintas route pada 360, 390, 768, 1024, 1440 px.                                                  | Matriks halaman/lebar dan screenshot; tidak ada overflow, menu/header/footer, kartu, filter serta dialog tetap terbaca dan dapat dipakai.        |
| 2       | Periksa aksesibilitas: kontras AA, target sentuh 44 px, Tab/Shift+Tab/Enter/Escape, fokus kembali, label formulir dan mode kurangi animasi. | Temuan dengan langkah reproduksi, ukuran/rasio terukur dan bukti setelah diperbaiki.                                                             |
| 3       | Ukur performa produksi dengan Lighthouse/DevTools, perangkat mobile dan throttling 4G.                                                      | Catat profil throttling, LCP/CLS serta beberapa run; target LCP <2,5 detik. Angka waktu header Node Hari 15 tidak dipakai sebagai pengganti LCP. |
| 4       | Perbaiki temuan, lalu uji ulang bagian yang berubah dan alur utama.                                                                         | TypeScript/build lolos, lint 0 error, regresi relevan lulus; bukti produksi dan console bersih.                                                  |
| 5       | Hanif/teman-teman/Ketua meninjau hasil; selesaikan temuan kritis.                                                                           | Daftar temuan beserta status dan persetujuan Checkpoint 3 sebelum fast-forward main.                                                             |

Cakupan: beranda, Tentang/direktori, Program/tujuh bidang, kegiatan/detail, berita/detail, galeri/album,
arsip, kontak, login dan bagian admin yang sudah fungsional. Galeri atau arsip kosong tidak diisi data
rekaan untuk membuat screenshot terlihat lengkap. Fixture sintetis sementara boleh dipakai untuk
menguji cabang UI di lingkungan uji lalu dibersihkan; form CMS maket tidak dianggap sudah berfungsi.

## File yang mungkin disentuh

- Temuan tampilan di `src/components/public/`, `src/routes/` dan `src/styles.css`, dipilih berdasarkan
  reproduksi; pertahankan desain E, warna/logo, hierarki BPH/Kabid dan modal potret dengan gradasi.
- Performa ditangani di titik terbukti, misalnya font, aset/gambar, pemuatan route atau cache aset;
  jangan melemahkan no-store pada respons privat atau mengorbankan izin foto.
- Proxy `cloudflare/pages/` hanya bila ada temuan yang berasal dari lapisan Pages.
- Hasil di `docs/HARI-16-REVIEW.md`, status di `backupcontext.md`, satu section baru DEVLOG.

## Definisi selesai

Semua ukuran memiliki bukti pemeriksaan; temuan kritis ditutup, tidak ada scroll horizontal, interaksi
keyboard/touch utama lolos dan target kontras/sentuh terpenuhi. Hasil LCP 4G dilaporkan apa adanya;
jika target belum tercapai, cari penyebab dan perbaiki, jangan menyebut waktu header sebagai LCP.
Masukan Hanif/Ketua menjadi dasar Checkpoint 3. `main` hanya di-fast-forward setelah persetujuan,
sedangkan deployment tetap dari `revisi`. Pembelian domain serta CMS Hari 17–22 belum termasuk Hari 16.
