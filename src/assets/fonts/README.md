# Font lokal

Font asli Google Fonts, diunduh 18 Oktober 2026 melalui CSS API resmi. Berkas WOFF2 tidak dimodifikasi.
Subset Latin dimuat lebih dulu; Latin Extended hanya diminta jika karakternya diperlukan.
Font variabel Inter mendukung bobot 100–900 dan Plus Jakarta Sans 200–800, sesuai metadata `fvar`.

- [Inter](https://fonts.google.com/specimen/Inter), lisensi di `Inter-OFL.txt`.
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), lisensi di `Plus-Jakarta-Sans-OFL.txt`.
- [CSS sumber](https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap).

Tujuannya menghapus stylesheet lintas origin yang menahan render pada audit Hari 16, tetap dengan
keluarga font desain E. Vite memberi nama hash di `/assets/`, sehingga cache aset lama tidak menahan
perubahan font. Gunakan `font-display: swap`; jangan menambah stylesheet Google Fonts lagi di root.
