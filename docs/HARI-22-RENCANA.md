# Rencana Hari 22 — Panduan pengurus dan uji mandiri

Implementasi dan QA teknis dijalankan 20 Oktober 2026; hasil dan status produksi/cleanup ada di [review Hari 22](HARI-22-REVIEW.md). Uji mandiri manusia dan penerimaan Checkpoint 4 masih menunggu. Rencana awal berikut dipertahankan untuk membandingkan hasil.

1. Buat `docs/PANDUAN-PENGURUS.md` dengan bahasa umum: masuk/ganti password, draf–tinjau–terbit berita/kegiatan/album, upload/retry, PDF sesuai akses, foto/izin pengurus, pengaturan, akun dan log sesuai peran.
2. Sertakan gambar langkah dari akun/data latihan; tanpa password, kontak pribadi atau dokumen internal asli di repo publik. Tunjukkan juga cara membatalkan dan memperbaiki kegagalan.
3. Tambahkan bantuan singkat di admin (`/admin/bantuan`) dan tautan menu. Bantuan tidak memberikan izin baru; semua tindakan tetap memakai server/RLS yang ada.
4. Jalankan skenario panduan di localhost dengan akun anggota Media berizin, lalu tinjau hasil dengan Kabid/BPH. Anggota membuat draf dan mengajukan peninjauan; Kabid/BPH yang menerbitkan. Jangan menyuruh anggota menekan tombol yang hanya dimiliki admin.
5. Uji 360/768/1024/1440/1920, keyboard/axe, tautan bantuan, penolakan akses, build dan smoke kedua origin. Hapus seluruh fixture.
6. Hanif meminta satu anggota Media yang belum pernah memakai admin mencoba hanya dari panduan. Catat langkah, hambatan, dan hasilnya; perbaiki panduan berdasarkan bukti itu.

Definisi selesai teknis: panduan dan bantuan tersedia, semua langkah bisa diulang pada akun/peran yang tepat, tautan dan uji teknis lulus. Definisi selesai uji pengguna: anggota tadi berhasil mengajukan berita tanpa dibimbing langsung dan penguji yang berhak menyetujui. Agen tidak dapat menggantikan bukti uji manusia ini atau otomatis menyetujui checkpoint.

Checkpoint 4 fase admin dipresentasikan sesudah hasil Hari 22; persetujuan Checkpoint 3 dan isu lama tetap terpisah. Hari 23 berfokus SEO/alamat publik/analytics sesuai keputusan layanan saat itu. Tidak membeli domain atau mengubah billing tanpa kebutuhan dan persetujuan khusus.
