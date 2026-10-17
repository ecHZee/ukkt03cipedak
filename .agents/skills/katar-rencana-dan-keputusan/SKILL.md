---
name: "katar-rencana-dan-keputusan"
description: "Cara merencanakan pekerjaan dan kapan/bagaimana bertanya ke Hanif di proyek Katar RW 03. Gunakan saat tugas multi-langkah, saat ada pilihan desain/biaya/akun/privasi, atau sebelum aksi publik/tak bisa dibatalkan."
---

# Rencana & keputusan

## Kapan langsung kerja

- Permintaan jelas, perubahan bisa dibatalkan, tidak menyentuh biaya/akun/data publik/privasi.
- Bug yang terbukti (ada bukti reproduksi) di dalam lingkup tugas.

## Kapan WAJIB tanya dulu

- Desain yang mengubah "rasa" web (Hanif memilih desain **E**; Fase 2 = memoles).
- Biaya, akun pihak ketiga, kartu/pembayaran, domain.
- Deploy fitur yang terlihat publik untuk pertama kali, merge ke `main`, menghapus data asli, mengubah data publik.
- Privasi: foto orang/anak, nomor HP, konten politik.

## Format bertanya (terbukti cocok untuk Hanif)

1. Jelaskan situasi 1–3 kalimat (pakai analogi bila teknis: Cloudflare = rumah/toko, Supabase = gudang).
2. Tabel 2–4 opsi: | Opsi | Hasil | Catatan/biaya |.
3. **Rekomendasi** + alasan konkret.
4. Pertanyaan penutup yang bisa dijawab singkat ("Setuju A?", "Gas sekarang atau besok?").

Jangan bertanya hal yang bisa dicek sendiri (versi library, struktur tabel, isi file, enum).

## Rencana tertulis

Untuk tugas besar tampilkan tabel "# | Tugas | Kenapa" + definisi selesai yang bisa diuji (angka/perilaku),
lalu kerjakan tanpa menunggu bila tidak ada keputusan yang dibutuhkan.

## Lingkup

Temuan di luar tugas → catat & tawarkan ("Mau sekalian aku beresin?"), jangan langsung dikerjakan.
