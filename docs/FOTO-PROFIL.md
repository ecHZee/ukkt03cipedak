# Panduan foto profil pengurus

## Foto yang disarankan saat ini

- **Potret 3:4, 900 × 1200 piksel**. Ini rekomendasi untuk hasil yang rapi, belum menjadi syarat validasi unggahan.
- Gunakan foto satu orang dengan wajah dan bahu di tengah. Sisakan ruang di atas kepala dan di samping wajah
  agar tetap aman saat ditampilkan sebagai avatar persegi di kartu.
- Rapikan crop lewat editor foto sebelum memilih file. Form Foto Profil saat ini langsung menyimpan file
  setelah dipilih; belum ada langkah crop/konfirmasi tambahan.
- Foto dikompres menjadi WebP, sisi terpanjang maksimal 1920 px, tanpa memperbesar sumber yang lebih kecil.
  Jadi file tidak harus tepat 900 × 1200 px agar bisa diunggah.
- Foto yang sama dipakai di kartu dan popup profil. Popup menampilkan gambar utuh di bingkai potret 3:4;
  foto dengan rasio lain diberi ruang kosong di bingkai, sehingga wajah tidak dipotong otomatis.
- Tanpa foto berizin (atau bila file gagal dimuat), bingkai menampilkan inisial. Izin tampil publik tetap
  mengikuti alur dan pemeriksaan privasi yang sudah ada; email/telepon pribadi tidak ditambahkan ke popup.

## Rencana tahap CMS — belum diimplementasikan

**Pembaruan Hari 18:** pilihan Hanif adalah tetap memakai Storage sekarang dan menghapus objek foto
lama saat diganti/izin dicabut. Proses memakai server function ber-JWT, bukan hanya mengosongkan
referensi; database menolak melepas foto selama objek lama masih ada. Akun nonaktif ditolak Storage.
Jika penghapusan gagal, UI memberi pesan gagal dan tidak mengaku sudah mencabut izin. Foto profil
baru memakai cache 0, menggantikan cache immutable setahun. Salinan/cache yang sudah diunduh orang
tidak dapat ditarik kembali; ini bukan penyajian foto privat per request. Crop tetap Hari 20.

Hanif memilih menunda crop interaktif ke tahap CMS pengurus. Rancangan yang disiapkan:

1. Pilih foto → tampilkan dimensi asli dan pratinjau, belum mengunggah.
2. Bingkai crop 3:4, kontrol posisi/zoom, beserta petunjuk area aman wajah/bahu.
3. Pratinjau **potret pada popup** dan **avatar persegi pada kartu** berdampingan.
4. Beri saran bila sumber terlalu kecil (misalnya di bawah 600 × 800 px); hindari memperbesar foto diam-diam.
5. Hasil yang disarankan WebP 900 × 1200 px, dengan ukuran lebih kecil bila sumber tidak mencukupi.
6. Pengguna meninjau izin foto publik dan menekan Simpan; baru unggah lewat `src/services/storage.ts`.
   Batal tidak mengunggah atau mengganti foto lama.

Batas dimensi/file yang benar-benar wajib, kebijakan sumber kecil, serta kontrol crop sentuh/keyboard
diselesaikan dan diuji pada tahap CMS. Tidak ada editor crop atau perubahan penyimpanan dari review modal ini.
