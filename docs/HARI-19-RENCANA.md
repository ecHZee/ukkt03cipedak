# Hari 19 — Album massal dan B2

Disetujui Hanif 19 Oktober 2026, baseline `00b5abf`, branch `revisi`.
Mengikuti SCHEDULE Hari 19 dan handoff awal `da8a081`: album, upload massal, retry, cover/urutan,
video, tautan asli Drive, B2 private dan penyajian Worker-cache. Bukan impor otomatis Google Drive.

1. Verifikasi bucket/akun, siapkan CORS origin spesifik dan panduan key. Hanif membuat key read/write
   khusus `katar-rw03-media` dan memasukkan nilainya sendiri di `.env.local` serta runtime Worker.
   Tidak menampilkan secret, membuat master key, mengubah billing, atau mengubah bucket menjadi publik.
2. Layanan B2 server-only dengan SigV4; URL PUT sementara ke lokasi staging, bukan path final.
   Finalisasi memeriksa objek dan menyalin ke path final yang tidak pernah diberi URL PUT browser.
   Metadata yang belum terverifikasi tidak boleh tampil publik; unggahan gagal dapat dilanjutkan/dibersihkan.
3. Migrasi kolom tautan asli Drive, metadata unggahan dan fungsi album/media atomik. Cek peran juga
   melalui JWT/RLS, konflik versi, cover dari album yang sama, batas dan idempotensi unggahan.
4. Ganti maket admin.galeri: daftar privat, form album draf/review/terbit, cover/caption/urutan/hapus,
   antrean foto/video, progres, jeda/retry saat koneksi pulih dan tautan YouTube/IG/TikTok.
   Semua upload frontend tetap melalui `src/services/storage.ts`. PDF/profil lama tetap kompatibel.
5. Route `/media/*` memeriksa media dan album publik sebelum cache, menandatangani GET ke B2 private,
   memakai Cache API untuk objek final immutable; draf/album yang ditarik tidak boleh dilayani dari cache.
   Pratinjau privat melalui URL sementara hanya setelah pemeriksaan akses.
6. Uji sumber/unit, DB/RLS dan B2 sungguhan; browser localhost akun sementara, bulk minimal 30 foto,
   putus/pulih koneksi, duplikat, validasi, cover/urutan, tamu/nonaktif/anggota/Kabid lintas bidang.
   Ukuran 360/768/1024/1440/1920; axe, console, bundle tanpa secret. Produksi Pages dan Worker,
   GET/HEAD/Range media, cache hit, draf/withdraw 404, API privat no-store. Uji fisik HP oleh Hanif
   dicatat terpisah jika belum dilakukan, bukan diklaim oleh emulasi.
7. Cleanup seluruh fixture B2/DB/Auth/audit; satu section DEVLOG, update konteks/review, commit/push
   revisi dan bukti produksi. Tidak merge main atau melanjutkan Hari 20.

File utama: `src/lib/galeri-admin.ts`, `src/services/galeri-admin.{server,functions}.ts`,
`src/services/b2.server.ts`, layanan gateway media server, `src/routes/admin.galeri.tsx`,
komponen album/antrean upload, `storage.ts`, `konten.ts`, domain/renderer album publik,
dashboard admin, migrasi/tipes, tes, `.env.example`, dokumentasi setup/review.

Bukti penerimaan: minimal 30 foto selesai satu antrean; retry tidak menggandakan media; cover dan
urutan tersimpan; album terbit terlihat di publik, draf/ditarik tidak; request kedua objek cache-hit
tanpa GET B2 tambahan pada cache yang sama. Grafik transaksi B2 dan HP fisik membutuhkan bukti
tersendiri. Kuota/harga provider diverifikasi dari dokumentasi/dashboard terkini, bukan menyalin
angka lama handoff tanpa cek. Media uji memakai logo/sintetis; foto asli tidak dipublikasi otomatis.
