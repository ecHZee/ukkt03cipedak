# Backup Konteks Proyek — Platform Digital Karang Taruna RW 03 Cipedak

> **WAJIB DIBACA PERTAMA** oleh siapa pun (manusia atau AI agent) sebelum mengerjakan apa pun di repo ini.
> Urutan baca: **file ini → bagian paling bawah `DEVLOG.md` → `docs/SCHEDULE.md`**.
> File ini merangkum percakapan Hanif × Claude Code (29 Sep – 1 Okt 2026) supaya konteks tidak hilang
> walau riwayat chat dipadatkan (auto-compact) atau pindah ke sesi baru.
> Terakhir diperbarui: 7 Okt 2026, akhir Hari 8.6. **Tidak berisi password/kunci rahasia — jangan pernah menambahkannya.**

---

## 1. Siapa & apa

- **Hanif** (Hanif Muhammad Zhafran Sutisna, S.Kom.) — anggota Bid. Media KT RW 03, sekaligus programmer &
  Super Admin web. Lebih nyaman berbahasa santai ("beb"), Bahasa Indonesia. Pakai **Antigravity IDE**
  (perintah `agy .` / `anti .` membuka Antigravity **IDE**, bukan versi agentic).
- Proyek: website profil + CMS **Karang Taruna RW 03, Kel. Cipedak, Kec. Jagakarsa, Jakarta Selatan**.
- Awalnya dibuat dengan Lovable + Hermes Agent (hasil: maket UI tanpa backend). Diaudit & dirombak oleh Claude Code.
- Repo: `github.com/ecHZee/ukkt03cipedak`, folder lokal `katar_profile/ukkt03cipedak`.
- Target utama: **"deploy lalu ditinggal"** — pengurus mengelola sendiri tanpa developer.

## 2. Aturan kerja (wajib)

1. Baca file ini + bawah `DEVLOG.md` sebelum mulai. Setiap sesi kerja **tambahkan 1 section di bawah `DEVLOG.md`**
   (append-only, jangan ubah section lama; waktu WIB).
2. Kerja di branch **`revisi`**; commit + push tiap akhir sesi. `main` hanya di-merge saat checkpoint
   (Checkpoint 1 sudah). `main` terhubung ke Lovable — **editor Lovable tidak dipakai lagi**, jangan force-push.
3. Supabase CLI **selalu** `npm run db -- <perintah>` (token akun Katar dari `.env.local`), **bukan** `npx supabase`
   — komputer Hanif punya `SUPABASE_ACCESS_TOKEN` global milik akun pribadi (proyek yolimen) yang harus tetap ada.
4. Rahasia (`.env.local`, token, password) tidak pernah dikirim lewat chat, di-screenshot, atau di-commit.
   Folder `rahasia/` (password awal akun) diabaikan git.
5. Jangan `git checkout -- src/routeTree.gen.ts` bila ada route baru — file itu harus ikut di-commit.
6. Migrasi database: tulis file SQL langsung di `supabase/migrations/<timestamp>_nama.sql`
   (`supabase migration new` pernah macet), lalu `npm run db -- db push --yes`.
7. Sebelum commit: `npx tsc --noEmit`, `npx eslint .` (0 error; 7 warning bawaan shadcn wajar),
   `npm run build`, dan `npm run test:db` bila menyentuh database.
8. Tes di browser panel: jangan logout sesi milik Hanif; pakai akun uji sementara lalu hapus.
9. Perubahan besar → tanya dulu; Hanif suka diberi pilihan + rekomendasi.

## 3. Stack & infrastruktur

| Bagian          | Pakai                                                                             | Catatan                                                      |
| --------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Framework       | TanStack Start (React 19, SSR, Vite)                                              | route file-based di `src/routes`                             |
| UI              | Tailwind v4 + shadcn/ui                                                           | warna Benhur Blue #0047AB + Gold #D4A017, batik halus        |
| Database & Auth | Supabase **"Profile Web Database"** (ref `twmbcxjojknjtjwtntxr`, Singapore, Free) |                                                              |
| Media           | **Supabase Storage** (1 GB, 50 MB/file)                                           | Cloudflare R2 ditunda: wajib kartu/PayPal, Hanif tidak punya |
| Hosting         | **Cloudflare** (akun email Katar sudah ada)                                       | belum deploy (Hari 9)                                        |
| Anti-pause      | cron ping Supabase tiap 2 hari                                                    | Free tier di-pause bila 7 hari sepi (Hari 9)                 |
| Email Katar     | ukktrw03cipedak@gmail.com                                                         |                                                              |

Env (`.env.local`, lihat `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (sb_secret_), `SUPABASE_ACCESS_TOKEN` (sbp_, akun Katar),
`VITE_SITE_URL`. Pendaftaran publik di Supabase Auth **dimatikan**.

## 4. Data organisasi (sumber resmi)

- SK Karang Taruna Kelurahan Cipedak **No. 003/SK/KT-Cipedak/VI/2025**, ditetapkan **05 Juni 2025**
  (tanggal pelantikan belum dikonfirmasi Ketua → `tanggal_pelantikan` null). Masa bakti 2025–2028.
- **61 pengurus**: 2 Penasihat, 8 BPH (Ketua, 3 Wakil Ketua, Sekretaris+Wakil, Bendahara+Wakil), 51 anggota bidang.
  "59 pengurus aktif" = tanpa penasihat. **Kabid = nama urutan pertama** tiap bidang di SK.
- 7 bidang (nama revisi 1 Okt 2026; slug tetap):
  `okk` Organisasi, Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM · `kerohanian` Kerohanian & Pembinaan Mental ·
  `lingkungan` Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi · `ekonomi` Ekonomi Mandiri &
  Kesejahteraan Sosial · `pendidikan` Pendidikan, Keolahragaan & Kebudayaan · `media` Media Publikasi,
  Dokumentasi & Digitalisasi · `inventaris` Inventarisasi & Kearsipan.
- Nama & gelar ditulis terpisah (gelar diseragamkan, mis. "S.Pd."). Hanif = anggota Bid. Media.
- Kontak (WA, IG, alamat, maps) **belum ada** → tabel `pengaturan` berisi null/"" dan web menyembunyikannya.

## 5. Scope (disepakati)

- Web **Karang Taruna**, tapi warga RW 03 dapat manfaat tanpa login (agenda, kas ringkas, UMKM, aspirasi,
  template surat unduhan) — Fase 5.
- **Tidak**: akun warga, pengajuan surat online (SKTM), janji temu RT/RW (wewenang RT/RW).

## 6. Akun, role & hak akses (keputusan final Hanif, 1 Okt 2026)

| Peran             | Siapa                                 | Hak                                                                                                           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | programmer (username `ukkt03cipedak`) | segalanya + kelola akun                                                                                       |
| **Admin Level 1** | semua BPH (8)                         | kelola pengurus (tambah/hapus/pindah), setujui konten semua bidang, dokumen BPH, audit log, pengaturan        |
| **Admin Level 2** | 7 Kepala Bidang                       | konten bidangnya, beri/cabut izin anggota bidangnya                                                           |
| **Anggota**       | Anggota Bidang & Penasihat            | baca + ubah profil sendiri; buat/ubah **draft** di bidangnya bila diberi **izin kontribusi**; harus disetujui |

- DB: enum `app_role` = super_admin · admin · anggota. Role **diturunkan otomatis dari jabatan** di `pengurus`
  (trigger), kecuali super_admin. `profiles.bidang_id` null = lintas bidang.
- **Login dengan username** = kata pertama + terakhir nama (mis. `hanif.sutisna`), dipetakan ke email internal
  `<username>@akun.katar-rw03.internal`. Super Admin juga login dengan username (email Gmail disimpan di `email_kontak`).
- Password awal acak per orang (mis. "Mangga-4821-Elang"), **wajib ganti** saat login pertama (popup).
- **61 akun sudah dibuat** 1 Okt 2026; password awal di `rahasia/akun-awal-2026-10-01.csv` (lokal, jangan di-commit;
  bagikan lewat chat pribadi setelah web online, lalu hapus file).
- Password **tidak bisa dilihat siapa pun** (di-hash) — solusinya reset oleh Super Admin di menu **Akun**
  (`/admin/users`, Hari 8.6): ganti username, reset password (tampil sekali), nonaktif/aktifkan (ikut di-ban di Auth).
- Email & no. HP pribadi hanya terlihat oleh diri sendiri, Kabid bidangnya, dan BPH.
- Foto profil = foto di halaman Tentang; tampil publik hanya bila `izin_foto` (trigger mengosongkan bila tidak diizinkan).
- Login di **`/login`** (bukan /admin/masuk); CMS di `/admin/*`. Ikon kecil "Masuk pengurus" di navbar.
  Kunci 60 detik setelah 5× gagal. Belum ada "lupa password via email" (butuh SMTP; reset via Super Admin).
- ⚠️ Password Super Admin sempat terlihat di screenshot; Hanif sudah reset — pastikan **kuat sebelum online**.

## 7. Database (migrasi di `supabase/migrations`)

Tabel: `periode`, `bidang`, `pengurus`, `profiles`, `pengaturan`, `audit_log`, `kegiatan`, `berita`, `album`,
`media`, `dokumen`. Semua konten punya `status` (draft/review/terbit), `created_by` (dikunci trigger),
`terbit_at` & `disetujui_oleh` (otomatis), `is_dummy`. Audit log otomatis untuk semua tabel.
Helper RLS: `peran_saya`, `is_bph`, `is_pengurus`, `bidang_saya`, `bidang_akun_saya`, `kontributor_saya`,
`boleh_terbit`, `boleh_kelola`, `boleh_tulis_folder`. RPC: `atur_izin_kontribusi`, `ubah_profil_saya`,
`ubah_foto_saya`, `selesai_ganti_password`.
Storage: bucket `media` (publik), `dokumen-publik` (publik, PDF), `dokumen-internal` (privat, signed URL 10 menit);
path `<slug-bidang|umum|bph>/…`; foto profil `media/profil/<id-akun>/…`.
Dummy: 8 kegiatan + 6 berita (`npm run seed:dummy`, hapus: `-- --hapus`). Foto dummy belum (butuh izin unduh / foto asli).

## 8. Perintah penting

| Perintah                                                                                                                              | Fungsi                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                                                                                                                         | jalankan lokal (http://localhost:5173)                       |
| `npm run test:db`                                                                                                                     | 83 tes CRUD/RLS/storage/akun (akun uji otomatis dibersihkan) |
| `npm run seed:dummy`                                                                                                                  | isi ulang konten contoh                                      |
| `npm run db -- <cmd>`                                                                                                                 | Supabase CLI akun Katar                                      |
| `npm run akun -- generate [--coba] \| buat \| daftar \| username <lama> <baru> \| reset <user> \| nonaktif <user> \| aktifkan <user>` | kelola akun                                                  |

## 9. Riwayat keputusan & masukan penting

- Riset ±20 website (Karang Taruna, desa, PA Singapore, Kitabisa, charity: water, GOV.UK) → arah desain
  "foto asli sebagai elemen utama", navigasi bawah ala aplikasi di HP, share WA, Google Calendar.
- Hanif mengaku kurang paham UI/UX → Claude mengusulkan desain; keputusan visual tetap biru-emas.
- Masukan teman full-stack Hanif (dokumen _Masukan-Pengembangan-Website-KT-RW03.docx_) sudah dirangkum di PLANNING.
- Hari 6.5 (review Hanif): satu desain hero untuk semua halaman, kolase beranda 2×2 simetris, revisi nama bidang.
- Sesi login pendek (5–10 menit) **tidak** dipakai: sesi tidak membebani server. Usulan: auto-logout setelah
  **30 menit tanpa aktivitas** + peringatan 1 menit — **belum diputuskan Hanif**.
- Badge BPH (emas) & Penasihat (gelap) di tab Pengurus.

## 10. Status terakhir (7 Okt 2026)

Selesai: Hari 1–8.6 (lihat `DEVLOG.md`). Tes database 83/83. Semua di-push ke `revisi`.
**Berikutnya: Hari 9 (online pertama).** Saran effort: sedang–tinggi.
PR Hanif: password Super Admin kuat; simpan & nanti hapus CSV password awal; kumpulkan logo, nomor WA sekretariat,
akun IG resmi, ±20 foto kegiatan.

## 11. Rencana ke depan (ringkas)

- ~~**8.6** Halaman Akun (Super Admin)~~ — selesai 7 Okt 2026.
- **9** Deploy Cloudflare (link sementara), cron anti-pause & backup mingguan, uji CRUD ujung-ke-ujung
  (login → berita + foto + PDF → publik → edit → hapus). **Checkpoint 2** → merge ke main.
- **Fase 2 (10–16)** desain ulang publik: navigasi baru + navigasi bawah HP, beranda ≤6 layar, halaman detail +
  share WA + Google Calendar + OG image, galeri polaroid/lightbox/video, Tentang & pengurus, arsip/kontak/filter, QA.
- **Fase 3 (17–22)** admin: dashboard & form kegiatan, editor berita + setujui/tolak, upload album massal,
  form dokumen + CRUD pengurus (Level 1), pengaturan/audit log/(opsional) lupa password email, panduan pengurus.
- **Fase 4 (23–30)** domain + SEO + analytics, hapus dummy & isi data asli, uji coba pengurus 1 minggu, launching.
- **Fase 5** fitur warga: RSVP, kas, pendaftaran anggota, aspirasi, UMKM, template surat, inventaris, absensi QR,
  liga 17an, generator LPJ.

---

### Cara memperbarui file ini

Di akhir setiap sesi besar, perbarui bagian **6, 9, 10, 11** bila ada keputusan baru. Ringkas, tanpa rahasia.
