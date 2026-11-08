# Hari 31 — Diagnosis dan perbaikan kecepatan beranda

Dimulai 8 November 2026 atas arahan Hanif. Scope: Q07 pada fitur dan desain E
yang sudah ada. Ekspansi storage, reset akun asli, migrasi dan perubahan billing
tidak termasuk pekerjaan hari ini.

## Urutan dan bukti

1. Catat baseline commit dan kondisi alat. Ukur tiga navigasi Lighthouse mobile
   beranda publik; simpan JSON, trace dan rincian jaringan di luar repo publik.
   Bandingkan waktu tunggu dokumen, penemuan/unduh hero dan render. Hasil lama
   median5,596detik adalah konteks historis, bukan baseline sesi baru.
2. Periksa jalur SSR, loader root/beranda, gambar dan aset yang ditunjuk trace.
   Perubahan dipilih setelah diagnosis; tidak menambah preload/cache spekulatif.
3. Implementasikan perubahan kecil yang mempertahankan desain, konten, izin dan
   pembaruan publikasi. Jika ada cache, respons berakun/dokumen privat tetap
   terisolasi dan aturan pencabutan izin tidak dikorbankan.
4. Jalankan tsc, lint, build, tes regresi relevan dan tes baru untuk perilaku
   yang berubah. Suite DB diperlukan bila menyentuh aturan data/akun/RLS.
5. Uji browser360/375/768/1024/1440px, menu/tautan/filter, konsol dan overflow.
   Uji runtime Worker hasil build, lalu deploy hanya branchrevisi.
6. Verifikasi commit produksi, dua origin, header no-store/gateway dan aset;
   ulang tiga pengukuran mobile setara serta uji desktop. Catat median/rentang,
   batas bukti, cleanup dan risiko yang belum ditutup.

Target Q07 tetap LCP≤2,5detik. CLS≤0,1 serta fungsi/aksesibilitas/SEO dipertahankan.
Hasil Lighthouse adalah laboratorium, bukan bukti p75 pengguna nyata. Jika target
belum tercapai, laporkan penyebab, perubahan dan hasil sebenarnya tanpa meluluskan
Q07. Tidak mengubah checkpoint/main atau keputusan launching.

## Kesepakatan lanjutan

Paket32 memuat QA fungsional/keamanan terarah dan penguatan alur password sementara
acak→wajib ganti; paket33 SOP permintaan/pembagian akun privat; paket35 regresi
otomatis menyeluruh. Pengujian peserta44kasus tetap menunggu tim. Lima paket31–35
bukan janji lima hari kalender. Storage tetap memakai penyedia/cap saat ini;
calon berbayar harus dapat dibayar tanpa kartu kredit dan dievaluasi terpisah.


## Lanjutan atas arahan Hanif — 8 November 2026

Tetap Hari31 sampai Q07 mencapai target; jangan pindah Hari32 hanya karena satu
paket eksperimen selesai. Telusuri dependensi JS awal, middleware token global,
loader route dan jalur CSS. Pertahankan sesi/RLS, konten, foto dan desain.
Kandidat diuji dengan JS normal: tiga run mobile produksi yang setara, tidak
memakai hasil script diblokir atau localhost sebagai kelulusan. Jika hasil gagal,
lanjutkan diagnosis/perbaikan terukur dalam Hari31. Tanpa perubahan DB/akun asli,
storage/billing/main atau fitur baru. Artefak sesi lanjutan tetap di luar repo publik.
