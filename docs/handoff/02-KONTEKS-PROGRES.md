# 02 · Konteks, Progres, dan Masalah yang Pernah Ditemukan

> Rangkuman percakapan Hanif × Claude Code (29 Sep – 18 Okt 2026). Detail per sesi ada di `DEVLOG.md`
> (33 section, append-only). Ringkasan keputusan juga di `backupcontext.md`. Dokumen ini menekankan
> **mengapa** sesuatu dibuat begitu dan **masalah apa yang pernah terjadi** supaya tidak terulang.

---

## Pembaruan status 19 Oktober 2026

Bagian riwayat Claude di bawah merupakan snapshot awal serah terima (sampai Hari11).
Status terkini mengacu pada `backupcontext.md`, DEVLOG dan review per hari:

- Hari17 kegiatan, Hari18 berita + remediasi Q01–Q05/Q09, Hari19 album massal+B2 sudah online.
- Hari19 kode `a09cfd8`:260tes,40RPC dan40HTTP produksi;30foto sintetis di browser360px,
  retry/offline, cover/caption/urutan, video/Drive dan cache terbukti.14migrasi lokal/remote cocok.
- Seluruh akun/media/audit uji dan versi objek B2 dibersihkan, sisa0. Master/foto asli tetap privat.
- Maket tersisa: CMS dokumen/pengurus Level1, pengaturan/audit. Hari20 belum dimulai.
- Penerimaan HP fisik30foto dan grafik ClassB terisolasi belum selesai. Q06–Q08, previewWA,
  restore drill dan Checkpoint3 tetap terbuka. Main belum diperbarui.
- Rincian: `docs/HARI-19-REVIEW.md`; jangan menyamakan hasil lokal dengan produksi atau emulasi
  dengan HP fisik. Bun1.4.3 frozen sudah disamakan pada Hari18, tetap gunakan `.inputValidator`.

## 1. Orang & tujuan

- **Hanif** (Hanif Muhammad Zhafran Sutisna, S.Kom.) — anggota Bid. Media Karang Taruna RW 03 Cipedak, programmer
  sekaligus **Super Admin** web (username `ukkt03cipedak`). Bahasa Indonesia santai, memanggil agen "beb",
  suka diberi **pilihan + rekomendasi**, mengaku kurang paham UI/UX, suka dijelaskan dengan tabel & analogi.
  Memakai Antigravity IDE (`agy .` / `anti .`). Limit Claude terbatas (dipakai juga untuk kerjaan kantor) →
  proyek dialihkan ke Codex mulai 18 Okt 2026.
- Proyek: website profil + CMS **Karang Taruna RW 03, Kel. Cipedak, Kec. Jagakarsa, Jakarta Selatan**.
  Janji Hanif ke Ketua Umum: web menjadi **portal aktivitas dan arsip** (pengganti GDrive yang berantakan).
- Target utama: **"deploy lalu ditinggal"** — pengurus mengelola sendiri tanpa developer, biaya Rp0.

## 2. Asal-usul kode

Web awalnya dibuat dengan **Lovable + Hermes Agent** → hasilnya maket UI tanpa backend (data hard-coded, label
Inggris, hero 7 varian, navbar luber, `.env` ter-commit). Claude mengaudit (temuan di `docs/PLANNING.md §16`;
prompt Lovable asli diarsipkan di `docs/BLUEPRINT-AWAL.md`) lalu merombak bertahap di branch `revisi`.
File bertanda "automatically generated" dari Lovable (mis. `src/integrations/supabase/*.ts`) tetap boleh dibaca,
tapi ubah seminimal mungkin.

## 3. Progres per hari

| Hari         | Hasil                                                                                                                                                                                                               | Commit / bukti       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Riset        | ±20 web (Karang Taruna, desa, PA Singapore, Kitabisa, charity: water, GOV.UK) → PLANNING & SCHEDULE                                                                                                                 | `docs/`              |
| 1            | Branch `revisi`, `.gitattributes` LF, `.env` keluar dari git, `.env.example`, perbaikan TS, halaman error Indonesia, Supabase CLI via `npm run db`                                                                  | DEVLOG 09-30         |
| 2            | Data resmi SK (61 pengurus: 2 penasihat, 8 BPH, 51 anggota bidang; 7 bidang), hapus data palsu, perbaikan hero Tentang & navbar 1024                                                                                | Checkpoint 1 → main  |
| 3–4          | Tabel inti + konten, RLS, trigger audit & meta, `scripts/test-db.mjs`                                                                                                                                               | migrasi 0930…        |
| 5–6          | Halaman publik membaca Supabase lewat loader; seed dummy (8 kegiatan, 6 berita); review Hanif (Hari 6.5): satu desain hero, kolase 2×2, nama bidang revisi                                                          |                      |
| 7            | Login admin, penjaga `/admin` (ssr:false), menu per peran, pendaftaran publik dimatikan                                                                                                                             |                      |
| 8            | Supabase Storage: bucket `media`, `dokumen-publik`, `dokumen-internal`; kompres foto WebP 1920 di browser                                                                                                           |                      |
| 8.5          | **Model akun final**: login username, role turun dari jabatan, izin kontribusi anggota + persetujuan, 61 akun digenerate (`npm run akun -- generate`), ganti password wajib, Profil Saya, foto profil               | migrasi 1001…        |
| 8.6          | Halaman **Akun** Super Admin (`/admin/users`): daftar, ganti username, reset password (tampil sekali), nonaktif/aktif (+ ban di Auth), fungsi server service role + cek Super Admin di server, audit `tabel='akun'` | `13241f1`            |
| 9            | **Online** di Cloudflare Workers `katar-rw03`; Supabase Auth Site URL; repo private backup + ping; uji E2E online 8/8                                                                                               | `b3fd2c6`…`2544a9b`  |
| Diskusi      | Storage → **Backblaze B2**; logo resmi transparan; WA sekretariat = WA Ketum (sudah setuju tampil publik); kurasi foto (2.160 → 37); 5 contoh desain → **E dipilih**                                                | `67582d5`, `7ffb242` |
| 10           | Logo resmi di semua tempat, favicon/og:image, navbar berkelompok, navigasi bawah HP, bug geser-samping                                                                                                              | `82487f5`            |
| Checkpoint 2 | Hanif uji Chrome+Opera desktop, Chrome iPhone & Android → main fast-forward ke `82487f5`                                                                                                                            |                      |
| 11           | Beranda HP 13,4 → 6,05 layar, bagian Ajakan (WA siap ketik), banner pengumuman (`pengaturan.pengumuman`)                                                                                                            | `1364876` (HEAD)     |

## 4. Kondisi teknis saat ini (yang sudah nyata vs maket)

**Nyata & teruji:** database + RLS + trigger (83 tes), login/logout/kunci 5× gagal, ganti password wajib,
Profil Saya + foto profil, tab Pengurus (izin kontribusi, preview kartu profil), menu Akun (Super Admin),
semua halaman publik membaca data asli, beranda baru, navigasi baru, banner pengumuman, deploy otomatis,
backup mingguan + ping 2 hari.

**Masih maket (diganti di Fase 3):** form tulis Berita, Kegiatan, Galeri, Dokumen, Pengaturan, Audit Log di admin.
Foto asli belum ada di web (menunggu admin + B2 Hari 19) — beranda masih menampilkan placeholder bermotif.

## 5. Database (ringkas)

Tabel: `periode`, `bidang`, `pengurus`, `profiles`, `pengaturan`, `audit_log`, `kegiatan`, `berita`, `album`,
`media`, `dokumen`. Enum: `app_role` (super_admin · admin · anggota), `status_konten` (draft · review · terbit),
`akses_dokumen` (publik · anggota · bph), `jenis_media` (foto · video · embed), `tahap_kegiatan`.
Helper RLS: `peran_saya`, `is_bph`, `is_pengurus`, `bidang_saya`, `bidang_akun_saya`, `kontributor_saya`,
`boleh_terbit`, `boleh_kelola`, `boleh_tulis_folder`. RPC: `atur_izin_kontribusi`, `ubah_profil_saya`,
`ubah_foto_saya`, `selesai_ganti_password`. Role diturunkan **otomatis dari jabatan** (trigger `ikut_jabatan`/
`sinkron_akun`); `profiles.bidang_id` null = lintas bidang (BPH/Penasihat/Super Admin).
Admin Level 1 = semua BPH; Admin Level 2 = 7 Kepala Bidang (nama urutan 1 di SK); Anggota = anggota bidang + penasihat.
`pengaturan` key–value (`value jsonb NOT NULL`): `organisasi.*`, `kontak.*` (WA terisi), `sosmed.*` (kosong),
`pengumuman` (JSON null).

## 6. Masalah yang pernah ditemukan & pelajarannya (PENTING)

| #   | Masalah                                                                                   | Penyebab                                                                                                                                       | Solusi / aturan sekarang                                                                                                                                |
| --- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Semua halaman 500 setelah deploy pertama**                                              | Cloudflare memasang dependensi dari `bun.lock` (TanStack Start 1.167) yang belum punya `.validator`; laptop memakai npm tanpa lockfile (1.170) | Pakai `.inputValidator`. **Versi lokal ≠ produksi** sampai lockfile diselaraskan; cek API TanStack terhadap versi di `bun.lock`                         |
| 2   | SSR 500 "Seroval"                                                                         | Loader mengirim ikon lucide (komponen)                                                                                                         | Data loader harus plain object; gaya/ikon ditempel di komponen                                                                                          |
| 3   | Relasi album↔media ambigu                                                                 | Dua FK antar tabel                                                                                                                             | Pakai hint FK eksplisit `media!media_album_id_fkey(count)`                                                                                              |
| 4   | `pengaturan.value` NOT NULL                                                               | "Kosong" ditulis null                                                                                                                          | Simpan `""` atau JSON `'null'::jsonb`; **`null` dari supabase-js = NULL SQL → ditolak** (sempat membuat pengumuman uji tampil ±1–2 menit di web online) |
| 5   | `supabase migration new` macet & membuat file kosong                                      | CLI                                                                                                                                            | Tulis file `supabase/migrations/<timestamp>_nama.sql` manual, lalu `npm run db -- db push --yes`                                                        |
| 6   | Prettier merusak DEVLOG                                                                   | format otomatis                                                                                                                                | DEVLOG ada di `.prettierignore`                                                                                                                         |
| 7   | `routeTree.gen.ts` hampir ter-revert padahal ada route baru                               | kebiasaan membuang noise CRLF                                                                                                                  | Bila ada route baru, file itu **wajib** ikut commit                                                                                                     |
| 8   | Input password tersembunyi di skrip bocor ("s*u*p*e*r…")                                  | override readline salah                                                                                                                        | Sudah diperbaiki di `scripts/akun.mjs`; password Super Admin sempat terlihat → sudah diganti kuat oleh Hanif                                            |
| 9   | Login Super Admin dengan username gagal                                                   | email auth masih Gmail                                                                                                                         | Email auth dipindah ke `ukkt03cipedak@akun.katar-rw03.internal`; Gmail di `email_kontak`                                                                |
| 10  | Pengguna ter-logout saat query profil gagal sementara                                     | `ambilAkunSaya` sign-out untuk semua error                                                                                                     | Sekarang throw; sign-out hanya bila profil tak ada/nonaktif                                                                                             |
| 11  | Modal admin tidak menutupi header                                                         | animasi `<main>` mengurung `position:fixed`                                                                                                    | Render modal lewat **portal ke `document.body`**                                                                                                        |
| 12  | Halaman bisa digeser ke samping di HP                                                     | wadah marquee `flex-1 overflow-hidden` tanpa `min-w-0` (melebar ±6.000 px)                                                                     | `min-w-0` + pengaman global `html,body{overflow-x:clip}`                                                                                                |
| 13  | "Invalid hook call" pada DropdownMenu di dev                                              | Vite memaket ulang dependensi baru saat server jalan → dua salinan React                                                                       | Hanya dev; restart dev server. Bukan bug produksi                                                                                                       |
| 14  | Screenshot emulasi 1440 px di browser panel tampil mengecil                               | artefak alat                                                                                                                                   | Verifikasi lebar via JS (`scrollWidth`), struktur via read_page                                                                                         |
| 15  | Foto contoh desain tidak tampil                                                           | dibuka sebagai `file://`                                                                                                                       | Sajikan lewat server lokal (`contoh-desain` port 8090)                                                                                                  |
| 16  | Wrangler lokal: "Found both a user configuration file…"                                   | dijalankan dari `.output/server`                                                                                                               | Jalankan dari root repo; `.dev.vars` sementara, hapus setelahnya; matikan proses `workerd` sisa                                                         |
| 17  | DNS laptop sesekali `ENOTFOUND` ke workers.dev                                            | jaringan                                                                                                                                       | Skrip uji online diberi retry                                                                                                                           |
| 18  | GitHub Actions bisa dimatikan setelah 60 hari repo sepi                                   | aturan GitHub                                                                                                                                  | Backup mingguan **meng-commit** ke repo backup → repo selalu aktif                                                                                      |
| 19  | Supabase Free di-pause bila 7 hari sepi                                                   | aturan Supabase                                                                                                                                | Ping tiap 2 hari dari repo backup                                                                                                                       |
| 20  | Kuota Supabase (1 GB, egress ±5 GB/bln) tak cukup untuk portal foto/video; R2 butuh kartu | biaya                                                                                                                                          | Backblaze B2 + cache Cloudflare (lihat rencana Hari 19)                                                                                                 |

## 7. Data & aset penting

- **SK** No. 003/SK/KT-Cipedak/VI/2025, 05 Juni 2025, masa bakti 2025–2028. Tanggal pelantikan belum dikonfirmasi.
- 7 bidang (slug): `okk`, `kerohanian`, `lingkungan`, `ekonomi`, `pendidikan`, `media`, `inventaris`.
- Logo resmi: `public/logo/` (1024, 512, 192, 180 apple-touch, 48 favicon) dari PNG resolusi tinggi Hanif.
- WA sekretariat (WA Ketum) sudah di `pengaturan.kontak.whatsapp`. IG/TikTok/YouTube/alamat/maps belum ada.
- 37 foto terpilih + catatan kurasi: Reses (321, 337) memuat backdrop anggota DPRD → **jangan di beranda**;
  folder Futsal Anak² dilewati (anak-anak); 189 (foto bersama pengurus) & 285 (serah bendera) calon foto utama.

## 8. Keamanan & privasi yang sudah disepakati

- Rahasia tidak pernah lewat chat, screenshot, atau commit. Repo web **PUBLIC**.
- `SUPABASE_SERVICE_ROLE_KEY` hanya di runtime (server); tidak pernah ber-awalan `VITE_`; kode server di
  `*.server.ts` dan dipanggil lewat `*.functions.ts` (`createServerFn`). Sudah dicek tidak bocor ke bundle browser.
- Password tidak bisa dilihat siapa pun (hash) — solusi: reset di menu Akun (password sementara tampil sekali).
- Tes memakai **akun uji sementara** (dibuat skrip service role, dihapus beserta audit-nya). Jangan logout sesi Hanif.
- Agen tidak memasukkan password/kunci/data kartu ke situs mana pun; login dashboard & isi secret oleh Hanif.
- Foto orang tidak di-commit; foto anak & konten politik dihindari di halaman utama.
