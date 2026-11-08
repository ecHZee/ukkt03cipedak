# Q07 — Bukti performa Hari 31

8 November 2026. **Kriteria median lab Q07 terpenuhi pada dcaaed9**, dengan
outlier yang tetap dilaporkan. Dua batch beranda mempunyai median2,081 dan2,313detik;
Galeri1,646,Pengurus1,445,Arsip1,339. Ini penutupan target median lab, bukan jaminan
setiap run/pengunjung <2,5detik atau persetujuan launch. Hari32 belum dimulai.

## Kriteria dan cara ukur

- Tiga navigasi produksi Pages anonim dengan JavaScript normal per halaman/versi.
  Laporkan semua run, median LCP <2,5 detik dan kestabilan halaman representatif.
  CLS ≤0,1; fungsi, aksesibilitas, SEO dan aturan no-store dipertahankan.
- Lighthouse resmi 13.6.0, chrome-launcher 1.2.3, Chrome157 Windows; runner Node24
  (syarat Lighthouse ≥22.19). Mode mobile412×823 DPR1,75, CPU4×; simulasi RTT150ms/
  throughput1638,4Kbps. Browser/profil/cache browser baru setiap run; cache edge dapat
  hangat. Cache edge dingin diuji terpisah secara fungsional, bukan dijanjikan punya
  LCP yang sama dengan cache hangat.
- Opsi: `--headless --no-first-run`, kategori performance,accessibility,best-practices,
  seo dan `--save-assets`. Tanpa blokir skrip/gambar, trik timer atau deteksi audit.
- Hentikan server/build/tab QA sendiri saat mengukur. Catat beban host; permainan
  sempat aktif, kemudian ditutup pemilik. Kontrol tanpa permainan tetap gagal,
  sehingga RAM/GPU tidak dijadikan satu-satunya penyebab atau alasan membuang hasil.

## Koreksi alat; hasil lama tetap berlaku sebagai riwayat

Wrapper global sebelumnya memakai Lighthouse13.5.0 dan launcher yang menonaktifkan
RenderDocument. Pada Chrome baru ada laporan jeda frame headless terkait flag itu;
launcher resmi memperbaikinya. Rilis13.6 juga mengubah pemodelan HTTP3/connectionless.
Alat resmi diperbarui **terisolasi di luar repo**, tanpa menambal library/hasil,
menyetel flag khusus atau mengganti dependency aplikasi/tool global. Perbandingan
JSON membuktikan screen/throttling/method sama; versi alat/model tetap berbeda.
Penurunan angka13.5→13.6 tidak boleh seluruhnya diatribusikan ke perubahan kode.

Sumber primer: [isu Lighthouse17148](https://github.com/GoogleChrome/lighthouse/issues/17148),
[perbaikan launcher372](https://github.com/GoogleChrome/chrome-launcher/pull/372),
[rilis13.6](https://github.com/GoogleChrome/lighthouse/releases/tag/v13.6.0).
Dua audit prompt geolokasi/notifikasi tidak dijadikan bukti keamanan karena batas
instrumentasi ConsoleMessages yang dicatat [upstream17486](https://github.com/GoogleChrome/lighthouse/pull/17486).
Nilai kategori100 bukan bukti QA keamanan menyeluruh.

## Semua batch Lighthouse13.6 sampai 22:35 WIB

Angka dalam detik; label adalah nama berkas privat, bukan status kelulusan.
`final` pada label lama bukan penetapan versi final. Tidak ada run gagal dibuang.

| Batch | LCP run1 / run2 / run3 | Median | Rentang |
| --- | --- | --- | --- |
| lh136-73a | 1.940 / 2.299 / 2.084 | 2.084 | 0.359 |
| lh136-final | 2.468 / 2.986 / 2.747 | 2.747 | 0.518 |
| lh136-foto-url | 2.287 / 3.002 / 2.755 | 2.755 | 0.715 |
| lh136-idle | 2.797 / 3.300 / 2.917 | 2.917 | 0.504 |
| lh136-prioritas | 2.360 / 2.226 / 2.552 | 2.360 | 0.326 |
| lh136-galeri | 2.356 / 2.862 / 5.183 | 2.862 | 2.827 |
| lh136-pengurus | 1.173 / 1.924 / 4.967 | 1.924 | 3.794 |
| lh136-arsip | 1.866 / 1.341 / 4.114 | 1.866 | 2.773 |
| lh136-cover-galeri | 1.950 / 1.623 / 1.855 | 1.855 | 0.327 |
| lh136-cover-pengurus | 1.384 / 1.441 / 1.263 | 1.384 | 0.178 |
| lh136-cover-arsip | 1.137 / 1.192 / 1.125 | 1.137 | 0.067 |
| lh136-cover-home | 3.274 / 3.400 / 3.355 | 3.355 | 0.127 |
| lh136-cover-home-lega | 2.911 / 3.076 / 3.928 | 3.076 | 1.017 |
| lh136-inline-priority-home | 2.630 / 2.221 / 2.874 | 2.630 | 0.654 |

Pemetaan versi: `73a`=73a8e24; `final`=ca931e8; `foto-url`=967efe0;
`idle`=b91fd9d; `prioritas`,galeri,pengurus,arsip=bcb60d2;
`cover-*`=1cdcbd4; `inline-priority-home`=ccf0dac. Mayoritas label adalah beranda;
halaman lain ditulis eksplisit. `cover-home-lega` adalah kontrol kode sama setelah
permainan ditutup, bukan perubahan kode.

Beranda bcb pernah memenuhi median2,360 tetapi run3=2,552 dan Galeri belum lulus.
Setelah sampul Galeri didahulukan, tiga halaman pembanding membaik dan lebih rapat;
beranda pada1cdc belum stabil memenuhi target. Hasil cepat satu batch tidak menutup
Q07. Desktop beranda bcb satu run0,560 detik bukan pasangan tiga run mobile.
Semua batch13.5, eksperimen yang dicabut, trace dan keterbatasan selengkapnya pada
[review kronologis](HARI-31-REVIEW.md).

## Perubahan yang dipertahankan pada versi terukur

Pemisahan helper publik dari SDK unggah/Auth, server loader publik, loader route
terpisah, menu Radix saat diperlukan, CSS SSR inline; QueryClient hanya di Arsip
per mount/request. Hook Worker memberi prioritas rendah script/modulepreload hanya
GET beranda200HTML, tanpa timer/pemblokiran. Glow/badge/header awal diringankan;
foto, gradasi, batik, ukuran dan isi tetap. Sampul Galeri pertama hasil filter eager/
high, sisanya lazy/low; React menyediakan preload sampul pertama.

Versi terukur menggabungkan foto cache byte identik ≤128KiB ke HTML beranda
setelah pengaturan publik dibaca segar. Cache dingin/rusak/besar/gagal tetap gateway;
HTML lebih besar dan tidak dianggap otomatis cepat. Prioritas font isi Inter Low terbukti di network;
font judul tetap High. Analitik dikembalikan ke perilaku aslinya setelah eksperimen
idle tidak membantu. Pengelompokan runtime manual dan varian percobaan lain yang
tidak membantu telah dicabut.

## Regresi dan batas bukti

171 unit lulus (termasuk pembatasan cache foto, isolasi SSR Arsip dan batas hook
prioritas), tsc/build0; full lint0error/7warning bawaan. 133 berkas bundle diperiksa
terhadap4nilai privat nyata secara lokal tanpa mencetak nilainya:0temuan.32HTTP per
origin pada ccf0dac lulus; header no-store/gateway, GET/HEAD,penolakan405/404,
redirect301denganfilter dan bytefotoSHA256 identik. Lima lebar Worker/produksi,
menu buka/tutup/fokus/konsol0; 375×740beranda5,635layar. Detail tahap/batas pada review.
Tidak ada migrasi/reset akun asli/perubahan billing/cap/main dalam iterasi lanjutan;
suiteDB tidak diulang karena DB/RLS/akun tidak diubah. Insiden fixture sesi pertama
serta bukti pemulihannya tetap tercatat pada review.

Artefak privat berada di `katar_profile/_qa-hari31/2026-11-08-lanjutan/`:
runner `ukur136.ps1`, `lighthouse136.ps1`, laporan per run,trace,devtoolslog,
`protocol-lh136.json`, `rekap-lh136-semua.json`, logtes/HTTP/layout. Tidak dimasukkan
ke repo publik karena berukuran besar dan dapat memuat URL/isi runtime.
Reproduksi: pasang versi alat yang dipin di direktori privat, gunakan Node yang
memenuhi syarat lalu jalankan runner tiga kali berurutan; jangan menaikkan versi
secara diam-diam dan membandingkan angka sebagai efek kode semata.

Laporan ini bukti lab, bukan p75 pengguna nyata/CrUX, uji HP fisik, penerimaan44UAT,
QA keamanan Hari32, persetujuan checkpoint atau izin launching. Seluruh risiko lain
pada [pra-launch/Forbit](PRA-LAUNCH-DAN-FORBIT.md) tetap berlaku.

## Hasil akhir satu versi — dcaaed9, produksi 22:35:22 WIB

| Batch | LCP run1 / run2 / run3 | Median | Rentang |
| --- | --- | --- | --- |
| lh136-font-home | 2.413 / 1.933 / 2.081 | 2.081 | 0.479 |
| lh136-font-home-konfirmasi | 2.979 / 2.262 / 2.313 | 2.313 | 0.717 |
| lh136-font-galeri | 1.646 / 1.586 / 2.735 | 1.646 | 1.149 |
| lh136-font-pengurus | 1.735 / 1.445 / 1.343 | 1.445 | 0.392 |
| lh136-font-arsip | 1.139 / 1.339 / 2.034 | 1.339 | 0.895 |

Versi alat/settings sama pada semua15run mobile;0warning,a11y/SEO100,CLS maksimum
0,017859. Median beranda berulang dengan selisih0,232detik; rentang tiap batch0,479/
0,717detik. Lima dari enam run beranda di bawah2,5; satu2,979 tetap dicatat. Galeri
run3=2,735 juga di atas2,5. Tidak mengklaim semua run lulus. Pembanding juga sebelumnya
sudah diukur pada1cdcbd4 dengan medianGaleri1,855/Pengurus1,384/Arsip1,137; hasil baru
bukan pemilihan satu run tercepat. Kriteria median dan pengulangan lab terpenuhi;
variabilitas jaringan/host masih ada, sehingga pemantauan ulang masuk regresi32/35.

**Outlier blocking yang harus tetap terlihat:** konfirmasi beranda run1 TBT1157ms,
performance69; lima run beranda lain TBT42–174ms. Laporan menandai tugas terpanjang
simulasi1191ms sebagai Unattributable, sedangkan Script Evaluation total309,688ms dan
Rendering33,920ms pada breakdown observasi. Angka observasi dan simulasi berbeda;
tidak dijumlahkan atau mengarang penyebab. Belum terbukti itu kesalahan JavaScript
aplikasi maupun murni beban laptop. Pertahankan trace dan ulang observasi interaksi
pada regresi terarah; median LCP yang lulus tidak menghapus risiko jeda satu run ini.
Desktop satu run LCP1,032detik/CLS0,003153/TBT0,performance90,a11y/SEO100,warning0.

Hint Inter efektif terbukti **Low** di network semua3run batch pertama, JakartaHigh.
Perubahan tidak mengubah berkas/font. Perbedaan batch bukan bukti seluruh penurunan
kausal hanya dari satu hint; tidak ada eksperimen acak terkontrol.

**Regresi akhir produksi:**32HTTP masing-masing Pages dan Worker; fotoSHA256 identik,
no-store dan gateway tetap.20kombinasi empat halaman×360/375/768/1024/1440 semuanya
1h1/scrollWidth=clientWidth (desktop scrollbar15px bukan overflow). Arsip pencarian+
bidang→URL benar→reset; Galeri4→1→4,first covereager/high dan lainnyalazy/low; album
foto1/3→2/3→tutup; modalpengurus buka/tutup; hamburger buka/tutup/fokus pulih;konsol0.
HP375×740 normal5,635/reduced-motion5,857layar, foto1200/inline dan beaconpublik1.
Screenshot `beranda-dcaaed9-produksi.png` serta dashboard build disimpan privat;
semua tabQA milik agen ditutup, emulasi dihapus, tabCloudflare dikembalikan ke daftar.
Tidak mengubah main,akun/data asli,billing/cap atau memulai Hari32.
