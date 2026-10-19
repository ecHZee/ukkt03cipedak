# Hari 19 — CMS album massal dan Backblaze B2

19 Oktober 2026, baseline `00b5abf`, branch `revisi`. Scope mengikuti handoff Claude
`da8a081` dan `HARI-19-RENCANA.md`. Hari 20 dan merge `main` belum dikerjakan.

## Hasil implementasi

- `/admin/galeri` menjadi CMS nyata: daftar sesuai hak akses, album draf/review/terbit,
  tautan folder Drive, sampul, keterangan, urutan, hapus, video berkas dan tautan platform.
- Antrean maksimal 40 berkas sekali pilih, 200 media/album; foto input maksimal 20 MiB
  menjadi WebP sisi terpanjang 1920 px dan thumbnail 480 px. Video maksimal 200 MiB.
  File asli tetap terpisah di Drive/lokal privat. Tidak mengimpor Drive otomatis.
- PUT bertanda tangan 300 detik ke staging private, MIME/ukuran ikut ditandatangani;
  server memeriksa HEAD/magic bytes lalu CopyObject bersyarat ETag ke path final immutable.
  Finalisasi memakai klaim atomik dan hash sumber per album untuk retry tanpa duplikat.
- Jeda, progres per file, retry otomatis dan kelanjutan saat online. Sesudah tab ditutup,
  pilih ulang sumber yang sama; bukan antrean persisten yang menyimpan seluruh file di perangkat.
- JWT, profil aktif, RLS dan RPC database menjaga bidang/pemilik/penerbit; versi suntingan,
  cover se-album dan batas kuota juga diperiksa di database. Tidak ada akses tulis langsung
  authenticated ke tabel reservasi. Dua migrasi diterapkan, total 14 migrasi.
- `/media/*` mengecek media+album terbit pada setiap request sebelum Cache API; GET/HEAD/Range,
  cache objek immutable setahun, respons browser no-store. Menarik album tetap memblokir cache.
  Preview privat memakai signed GET 5 menit, berlaku sampai expiry setelah diberikan.
- Cleanup menyimpan jejak reservasi batal sampai presigned PUT terakhir kedaluwarsa.
  Menghapus staging tidak mencabut URL PUT; cleanup ulang setelah lima menit bila ada PUT terlambat.
- Bucket `katar-rw03-media` tetap private/enkripsi/lifecycle terakhir; caps tetap $0.
  CORS dibaca ulang: tepat Pages, Worker, localhost:5173 dan 127.0.0.1:5173; GET/HEAD/PUT,
  tanpa wildcard. Hanif memasukkan key sendiri di lokal dan dua Runtime Secret Worker.
  Panduan dan pembanding harga umum vs batas akun: `B2-SETUP.md`.

## Bukti lokal dan database

| Lapisan | Hasil |
| --- | --- |
| Unit/regresi publik dan admin | 87/87, termasuk 15 galeri baru |
| DB CRUD/RLS | 127/127, termasuk 39 galeri baru; fixture suite dibersihkan |
| Integrasi service kegiatan | 20/20 |
| Integrasi berita/foto profil | 26/26 |
| Total suite otomatis | 260/260 |
| TypeScript / build | exit 0 |
| ESLint | 0 error, 7 warning bawaan |
| RPC langsung runtime Worker lokal | 20/20, baseline positif + envelope error/no-store |
| Layout form album | 360/768/1024/1440/1920, tidak melampaui lebar konten |
| axe form album | 0 pelanggaran otomatis, 27 pemeriksaan lulus |

Batch UI di localhost, browser desktop lebar 360 px: **30/30 foto sintetis tersimpan di B2**,
ditambah video WebM sintetis 27.807 byte. Koneksi sengaja diputus saat antrean berjalan:
berhenti di 4/30, setelah online lanjut sendiri hingga 30/30 tanpa klik ulang. Pilih ulang
foto pertama selesai 1/1 dengan jumlah tetap 31 media, lalu tautan video ditambahkan jadi 32.
Sampul dipindah, caption dan urutan diubah lewat UI, metadata Drive disimpan dan album diterbitkan.
Lightbox foto berpindah, video readyState 4, 640×360, durasi 1,02 detik, tanpa error decoder.

Runtime build sebenarnya diuji dengan Wrangler 4.151.1. Wrangler cache lama 4.148.0 tidak bisa
menjalankan compatibility date 19 Okt; diperbarui lewat npx tanpa mengubah dependensi repo.
Media foto: MISS → HIT, HEAD 200 tanpa body, Range 206/32 byte; video GET 200/27.807 byte,
Range HIT 206/32 byte dan SHA256 cocok sumber. Thumbnail 200. Tarik album ke draf → 404,
termasuk URL yang sudah masuk cache; halaman album juga 404.

Kesalahan selama QA: dev Vite belum memuat B2 non-VITE ke process.env, kini script dev memakai
Node `--env-file=.env.local`. RPC hash produksi tidak berlaku di Vite; uji dipindah ke runtime
build Worker, kegagalan ID/transport tidak dihitung sebagai bukti penolakan akses. Nitro hanya
memberi Request dengan waitUntil, sehingga gateway mengambil konteks dari Request bila ctx kosong.
Hasil cache HIT di atas berasal setelah koreksi ini. Regresi gdrive null diperbaiki dan suite diulang.

## Produksi dan penutupan

Kode `ba72b7d` berhasil dibangun otomatis dengan Bun1.4.3 frozen dan Node24.21.0,
Worker versi `6605eb9b-c68f-438c-869f-adb0f3e08beb`. Produksi Pages/Worker masing-masing
20 RPC lolos, total 40, serta 40 HTTP/aset/header/redirect lolos. Dua secret tetap terenkripsi,
bucket/endpoint runtime berasal konfigurasi versi ini. Header gateway Pages dan no-store benar.

Album sintetis diterbitkan sementara untuk QA. Foto 200 MISS→HIT, HEAD200 tanpa body,
Range206/32byte; video200/27.807byte dan SHA256 cocok, Range206. Pages video Range HIT;
Worker pernah MISS saat cache belum selesai/lokasi lain. Uji ulang20 GET berurutan semuanya
HIT (Pages CGK10/Worker SIN10). Permintaan dingin lain tetap dapat MISS; ini cache per data center.
Dashboard ClassB171→203 di sela QA tidak mengisolasi fase HIT dari GET gambar sebelumnya;
**belum menjadi bukti grafik ClassB tetap**. Cache HIT terbukti, klaim grafik provider dipisahkan.

Browser produksi: lima lebar album tanpa overflow, seluruh foto yang diperiksa decode1200×800;
video benar-benar diputar (readyState4, waktu maju, tanpa error). Lightbox berpindah foto,
tautan Drive tampil dan href tepat fixture. Axe album23passes/lightbox21passes, 0pelanggaran;
konsol produksi 0error/warning. Penarikan via RPC produksi Kabid se-bidang berhasil;
media di kedua origin menjadi404 meskipun pernah HIT, sebelum pembacaan cache.

Temuan cleanup: S3 DELETE tanpa versionId hanya membuat delete marker. Helper diperbaiki
untuk listing versi dengan prefix lalu menghapus versi/marker yang Key-nya **persis** path;
pagination dan kegagalan listing diuji, tidak menghapus prefix tetangga. Dua tes baru lolos
(15 galeri; total260), tsc/lint/build diperiksa ulang. Uji B2 nyata:2versi staging→0.
GET video diberi waktu streaming5menit (HEAD30detik). Build sempat EBUSY karena runtime
Wrangler memegang output Windows; setelah proses sendiri dihentikan, build exit0.
Deploy koreksi cleanup dan pembersihan seluruh fixture menyusul di penutupan akhir.

## Batas penerimaan dan pekerjaan berikut

- **HP fisik 30 foto** belum dilakukan; emulasi 360 px tidak menggantikan syarat ini.
- Cache per data center, bisa eviction; HIT membuktikan request itu tidak fetch B2 lagi,
  bukan jaminan satu GET seumur hidup. Grafik Class B akun dibuktikan terpisah bila sudah terbarui.
- Video 200 MiB adalah batas validasi; bukan klaim sudah mengunggah file sebesar itu atau semua codec.
- Signed preview privat tetap berlaku maksimal lima menit setelah dibuat; salinan yang sudah
  diunduh tidak bisa ditarik kembali. Metadata verifikasi bukan pemindaian malware/decoder penuh.
- Foto/media asli belum dipublikasi. Kurasi dan izin organisasi tetap perlu sebelum Hari 24.
- Q06–Q08 audit (tinggi beranda, LCP konsisten <2,5 detik, metadata tiga halaman), HP fisik,
  preview WhatsApp, restore drill, dan persetujuan Checkpoint 3 tetap terbuka.
- Hari 20 sesuai jadwal: CMS arsip/dokumen dan pengurus Level 1, termasuk crop foto yang telah
  diminta Hanif. Belum dimulai.

Bukti rinci privat: lampiran lokal `katar-hari19-20261019` di luar repo; tidak memasukkan
fixture, JWT, key, signed URL atau foto orang ke Git publik.
