# Hari 29 — Stabilisasi dan paket uji tim website

26 Oktober 2026, Codex (GPT 6.1 Sol). Berangkat dari `17fe472` pada `revisi`.
Hanif menyetujui pemeriksaan fitur yang sudah ada agar siap dibahas tim website.
Tanggal pertemuan, peserta dan keputusan launching belum ditetapkan.

## Hasil pekerjaan

| Bagian            | Hasil                                                                                                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bahan rapat       | [Inventaris 13 bagian website](INVENTARIS-FITUR-WEBSITE.md), [44 skenario black-box/UAT](SKENARIO-UJI-TIM.md), [lembar hasil kosong](LEMBAR-HASIL-UJI-TIM.md)                                                     |
| Akun              | 62 Auth dan profil aktif, 61 pengurus; 1 Super Admin, 15 admin, 46 anggota. Tidak ada ketidakcocokan pemetaan yang terdeteksi. 61 akun masih wajib mengganti password awal                                        |
| Dashboard         | Keterangan keliru “B2 belum terhubung” diganti penjelasan bahwa angka hanya menghitung Supabase; pemakaian B2 diperiksa terpisah                                                                                  |
| Ketahanan alat QA | Cleanup menemukan ulang fixture melalui penanda run, memeriksa error dan membaca ulang hasil; respons INSERT/upload yang hilang tidak boleh membuat laporan bersih palsu                                          |
| Runtime           | `compatibility_date` dipin ke `2026-10-19`; tanggal otomatis Nitro sebelumnya melampaui dukungan workerd pada Wrangler 4.151.1 yang dipakai QA                                                                    |
| B2                | Uji operasi berkas dan pembersihan versi berhasil dengan key aktif. **Rotasi belum dilakukan**: Hanif belum memiliki/tidak yakin mengenai pasangan administrasi berizin `writeKeys` dan meminta lanjut QA lainnya |

Tidak menambah fitur produk, mengubah desain besar, dependensi, migrasi, akun asli, biaya,
atau branch `main`. Panduan dan lembar uji tidak memuat akun/password atau hasil peserta.

## Bukti pengujian sebelum deploy

| Lapisan                       | Bukti                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit/regresi                  | **141/141**; mencakup 13 SEO dan 5 regresi cleanup baru. 13 SEO juga diulang terpisah, tidak dijumlahkan sebagai tes unik tambahan                                             |
| Database/RLS/Storage          | **164/164** dengan helper cleanup yang telah diperbaiki                                                                                                                        |
| Layanan dengan akun sementara | Kegiatan **20/20**, berita/foto **26/26**, arsip/pengurus **17/17**                                                                                                            |
| Pemulihan cleanup nyata       | Respons ID sengaja tidak diberikan ke helper; 2 bidang dan 1 akun milik run ditemukan kembali, dihapus, dan dibaca ulang: 0 tersisa                                            |
| B2 nyata                      | **13 pemeriksaan**: signed PUT/HEAD/Range/CopyObject/readback privat/versi; 4 path uji dibersihkan, tidak ada objek uji tertinggal                                             |
| Build                         | TypeScript 0 error, lint 0 error/7 warning bawaan, build exit 0; Worker lokal berjalan dengan tanggal kompatibilitas yang dipin                                                |
| Layout dev                    | **135 kasus**: 6 beranda, 54 halaman publik/login, 75 tampilan admin; tanpa overflow horizontal                                                                                |
| Ukuran                        | Publik: 360/375/768/1024/1235/1440 px; admin: 360/375/768/1024/1440 px                                                                                                         |
| Interaksi                     | Draf wajib isi → pratinjau → simpan → sunting → ajukan review → BPH kembalikan Draf; menu sesuai peran, akun nonaktif ditolak, pencarian akun uji, pembatasan halaman langsung |
| Build Worker nyata            | **34 pemeriksaan HTTP**; menu/Escape/fokus, jeda banner, filter/reset album, foto berikutnya/Escape/fokus dan pengalihan anonim ke login berhasil; konsol build 0 error        |
| Privasi                       | Draf latihan tak terlihat anonim dan 404 pada kedua origin produksi; objek B2 tanpa media/album terbit 404 pada kedua origin                                                   |

Terdapat 17 catatan interaksi dev dan 7 interaksi build terpisah.

Tombol hitung Supabase pada sesi BPH localhost menampilkan 8 berkas, sekitar 0,76 MB.
Ini tidak menghitung B2, database, Drive atau seluruh pemakaian akun provider.
Ganti password yang sah oleh pemilik tetap menjadi kasus UAT; agen hanya memeriksa penolakan
password terlalu pendek dan kewajiban modal awal, tanpa mengubah password akun asli.

## Keutuhan data dan kesalahan yang ditemukan

Sebelum/sesudah seluruh tes tulis, isi dan jumlah **10 tabel asli** dibandingkan melalui
digest privat dan cocok. Metadata Auth asli cocok; audit pemetaan akhir 0 masalah.
Tujuh akun browser sementara, draf dan jejaknya telah dibersihkan. Delapan objek Supabase
dan 22 versi objek B2 asli identik dengan pembanding, 0 unggahan B2 belum selesai.
Total sumber tetap **30 objek/3.505.676 byte**. Metadata rinci berada di luar Git publik.

Pada percobaan DB awal, jaringan putus sesudah server menyimpan dua bidang UJI, tetapi
client belum menerima ID. Cleanup lama salah melaporkan bersih. Kedua fixture milik run
ditemukan, diperiksa tidak terkait data asli, lalu dibersihkan. Helper diperbaiki, lima
regresi dan uji pemulihan nyata ditambahkan, serta suite DB diulang sampai 164/164.

Satu halaman dev sempat kosong dengan error React setelah pergantian/HMR. Navigasi ulang
berhasil; kasus tidak terulang pada build Worker baru. Tidak ada perubahan redirect yang
diklaim memperbaikinya. Pemeriksaan login pertama juga sempat membaca halaman yang masih
memuat; sesudah menunggu formulir terlihat, enam lebar lulus. Ekspektasi QA simpan draf
dikoreksi: hasil memang kembali ke daftar. Preview pertama gagal karena tanggal runtime
otomatis; build ulang dengan tanggal dipin kemudian berjalan. Semua ini dicatat terpisah
dari hasil akhir, bukan disembunyikan sebagai lulus sejak percobaan awal.

## Performa: Q07 tetap terbuka

Tiga baseline baru memakai Lighthouse 13.5/Chrome 155, simulasi 4G, 412×823, DPR 1,75 dan
CPU 4×: LCP **6,422 / 4,062 / 4,723 detik**, median **4,723 detik**.
CLS sekitar 0,000128; TBT 11/24/17 ms. Accessibility/best practices/SEO 100 ketiganya.

Pada rincian navigasi yang direkam, TTFB dan unduh hero lebih dominan; render delay
22/163/21 ms. Diagnosis render delay dari pengukuran Hari 28 tidak direproduksi sebagai
penyebab utama pada ketiga run ini. Hero sudah ada pada HTML awal dengan prioritas tinggi;
tidak menambah preload yang menggandakan permintaan atau mengganti foto/desain tanpa bukti.
Angka sebelum/sesudah dipakai untuk memantau variasi, bukan klaim kausal perbaikan LCP
dari perubahan teks dashboard atau tanggal kompatibilitas.

## Yang belum diluluskan

- Target LCP ≤2,5 detik, rotasi key B2 web, dan pemulihan layanan Supabase penuh.
- Login oleh setiap pemilik akun, pembagian password privat dan penggantian awal yang sah.
- Seluruh **44 kasus peserta masih Belum diuji**; QA agen tidak menggantikan penerimaan tim.
- HP fisik, alur unggah banyak foto pada perangkat peserta, dan preview WhatsApp nyata.
- Cron mingguan pertama setelah aktivasi backup; nominal berikutnya 1 November 01.00 WIB,
  dapat terlambat oleh GitHub. Run manual/rantai workflow yang sudah lulus bukan kejadian cron.
- Tiga hari terakhir tanpa kendala kritis, checkpoint `main`, dan keputusan launching.

Panduan B2 mencatat hak key aktual yang terlalu luas. Penggantian dibuat bertahap oleh
pemilik, diuji dengan key baru, baru key lama dicabut; tidak mengganti atau mencabutnya
ketika pasangan administrasi belum siap. SMTP/email reset tetap belum diaktifkan sesuai
keputusan sebelumnya; lupa password melalui Super Admin.

## Lokasi bukti

Log, screenshot akun uji, pembanding data, manifest dan hasil terinci disimpan privat di
`katar_profile/_qa-hari29/2026-10-26/`. Jangan menyalinnya ke repo publik. Bukti produksi,
pengukuran sesudah deploy dan cleanup akhir tercatat di bawah.

## Produksi dan penutupan terverifikasi

Kode **`cbc1fea`** mendapat check Workers Builds `success` pada 26 Oktober 2026
**23.11.44 WIB**. Penanda baru pada chunk dashboard dibaca dari referensi entry produksi,
bukan memakai hash build lokal yang berbeda lingkungan. Kedua origin mengirim chunk baru,
keterangan baru tersedia dan teks lama tidak ada. Pengelolaan akun asli tidak dipakai
untuk membuktikan deployment.

- **68/68 pemeriksaan HTTP** di Pages dan Worker: halaman, no-store dinamis, gateway Pages,
  sitemap/robots, redirect query, 404 privat, metode ditolak, thumbnail HEAD/Range/416.
- **12 layout produksi** (beranda dan galeri × enam lebar) tanpa overflow, satu h1;
  filter olahraga menghasilkan satu album, reset kembali empat. Konsol tab produksi 0 error.
- Tinggi beranda pada emulasi 375×740 adalah 4.171 px (sekitar 5,64 layar), di bawah batas
  enam layar untuk kondisi normal saat pengukuran ini. Ini tidak menggantikan HP fisik.
- LCP sesudah deploy **4,317 / 5,596 / 6,569 detik**, median **5,596 detik**;
  baseline 4,723 detik. Kedua seri tetap gagal target 2,5 detik. Perbedaan ini belum
  diisolasi sebagai dampak kode; variasi jaringan/TTFB tetap perlu pengujian tersendiri.
  Skor performance 79/69/63; accessibility/best practices/SEO 100 ketiganya, 0 warning.
  CLS 0,000128/0/0; TBT 23/15,5/16 ms. Tidak mengklaim perbaikan kecepatan.
- Pemindaian 102 bundle dan file perubahan terhadap delapan nilai privat: 0 kecocokan.
  DEVLOG terverifikasi append-only. Foto, manifest dan kredensial tidak masuk Git publik.

Preview/dev/workerd yang dibuat sesi ini dihentikan; port 5173/8090/8788 kosong.
Tujuh akun browser dan seluruh fixture sendiri bersih, berkas kredensial QA dihapus.
Penghapusan `.output/server/.dev.vars` oleh alat ditolak pemeriksaan persetujuan otomatis
(`blocked by policy`); Hanif menghapusnya melalui Explorer, kemudian keberadaan file
**diverifikasi tidak ada**. `.env.local` asli tetap tersedia. Tab localhost ditutup,
emulasi viewport dipulihkan, sesi/tab pemilik tidak dikeluarkan. Docker/WSL proyek lain
serta repo backup privat tidak diubah.

**Status:** paket stabilisasi dan QA teknis Hari 29 selesai, online dengan risiko tersisa
tercatat. Rotasi key B2 ditunda sesuai pilihan pemilik; Q07, UAT peserta, cron pertama,
restore penuh, HP fisik/WhatsApp dan checkpoint tetap terbuka. Tidak menyatakan website
sudah lulus seluruh syarat launching. Bukti utama: `http-production.json`,
`production-marker.json`, `production-layout.json`, `performance-summary.json`,
`original-data-compare.json`, `source-storage-compare.json`, `fixture-cleanup.json`.
