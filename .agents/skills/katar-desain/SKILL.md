---
name: "katar-desain"
description: "Arah desain & aturan anti-AI-slop proyek Katar RW 03 (desain E dipertahankan, HP dulu). Gunakan saat membuat atau mengubah tampilan publik/admin, komponen UI, tata letak, atau teks antarmuka."
---

# Desain

## Keputusan

Hanif melihat 5 arah — A Buletin Warga, B Poster Kampung, C Album Kenangan, D Kekinian, E = desain sekarang +
foto asli (contoh di `katar_profile/_contoh-desain/`, sajikan via preview `contoh-desain` port 8090, bukan
`file://`) — dan **memilih E**. Maka: **poles, jangan ganti gaya.**
Token: biru Benhur `#0047AB` (primary), emas `#D4A017` (accent), batik kawung halus, Plus Jakarta Sans (judul) +
Inter (isi), kartu `rounded-xl` + `shadow-tile`, logo resmi bundar (`src/components/shared/Logo.tsx`).

## Aturan

- HP dulu: navigasi bawah (Beranda · Agenda · Gabung · Galeri · Lainnya), beranda ≤6 layar (375×740),
  daftar panjang geser-samping `snap-x`, target sentuh ≥44 px, halaman tidak pernah bisa digeser ke samping.
- Konten spesifik RW 03 (nama RT, kegiatan nyata, angka dari DB) & foto asli lebih penting daripada hiasan.
  Bagian kosong disembunyikan.
- Jangan menambah ciri "AI slop": gradasi ungu/biru tanpa makna, label kapital kecil berspasi baru, badge
  "Live/New" berkedip, tiga kartu ikon generik, teks yang cocok untuk organisasi mana saja, emoji sebagai ikon.
  Merapikan yang sudah ada (53 label kapital, bayangan berlebih) hanya bila Hanif setuju — tawarkan di Hari 16.
- UI Bahasa Indonesia penuh, tanpa label Inggris.
- Aksesibilitas: kontras AA, `aria-label` pada tombol ikon, fokus terlihat, `prefers-reduced-motion`.
- Mengusulkan arah desain baru: buat contoh HTML statis di LUAR repo, sajikan via server lokal, beri pilihan.
