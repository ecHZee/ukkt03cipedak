# Jadwal Harian Revisi — Platform Digital KT RW 03 Cipedak

> Turunan dari [`PLANNING.md`](./PLANNING.md) v1.0 · Disusun 30 September 2026
> **"Hari" = hari kerja**, bukan tanggal kalender. Kalau suatu hari terlewat, jadwal cukup digeser.
> Total: **30 hari kerja** (±6 minggu bila 5 hari/minggu).

## Cara membaca

Setiap hari berisi:

- 🎯 **Tujuan:** satu kalimat
- 🤖 **Claude:** pekerjaan coding
- 🙋 **Hanif:** tugas non-coding atau keputusan (sering kali hanya 5–15 menit)
- ✅ **Selesai bila:** cara mengecek hasil hari itu

Ada **4 checkpoint** (🚩) untuk review bersama sebelum lanjut ke fase berikutnya.

## Aturan kerja

1. Semua pekerjaan di branch **`revisi`**, bukan `main`. `main` baru diperbarui di setiap checkpoint.
2. Setiap hari ditutup dengan **commit + 1 section di `DEVLOG.md`**.
3. **Kunci rahasia (key/password) tidak pernah dikirim lewat chat.** Hanif menempelkannya sendiri ke `.env.local`.
4. Setelah Hari 1, **editor Lovable tidak dipakai lagi** supaya tidak menimpa perubahan (menunggu konfirmasi, PLANNING §15 Q5).

## Ringkasan

| Minggu | Hari  | Fase                        | Hasil akhir                                                            |
| ------ | ----- | --------------------------- | ---------------------------------------------------------------------- |
| 1      | 1–2   | **Fase 0:** Beres-beres     | Repo aman, data SK benar, kerusakan tampilan beres                     |
| 1–2    | 3–9   | **Fase 1:** Backend         | Isi web dari database, login admin, upload ke R2, versi staging online |
| 2–4    | 10–16 | **Fase 2:** Tampilan publik | Desain baru di semua halaman                                           |
| 4–5    | 17–22 | **Fase 3:** Admin           | Pengurus bisa mengelola web sendiri                                    |
| 5–6    | 23–30 | **Fase 4:** Launching       | Tayang di domain resmi                                                 |

Fase 5 (fitur untuk warga) dijadwalkan terpisah setelah launching.

## Status prasyarat

| Prasyarat                                          | Dibutuhkan mulai | Status                            |
| -------------------------------------------------- | ---------------- | --------------------------------- |
| Email organisasi                                   | Hari 1           | ✅ Sudah (30 Sep)                 |
| Proyek Supabase (Singapore, Free)                  | Hari 3           | ✅ Sudah ("Profile Web Database") |
| Supabase CLI terhubung (`supabase login` + `link`) | Hari 3           | ⏳ Hari 1                         |
| Akun Cloudflare + R2 aktif                         | Hari 8           | ⏳ lihat catatan Hari 7           |
| Konfirmasi tanggal pelantikan                      | Hari 2           | ⏳ menunggu Ketua                 |
| Logo resmi                                         | Hari 10          | ☐                                 |
| ±20–30 foto kegiatan asli                          | Hari 24          | ☐                                 |
| Nama domain                                        | Hari 23          | ☐                                 |

---

# Fase 0: Beres-beres

## Hari 1: Setup & keamanan repo

🎯 Repo siap dikerjakan dengan aman.

🤖 **Claude**

1. Buat branch `revisi`
2. Tambahkan `.gitattributes` (line ending LF) supaya lint tidak error di Windows
3. Hapus `.env` dari git, tambahkan ke `.gitignore`, buat `.env.example` tanpa isi rahasia
4. Perbaiki error TypeScript di `src/routes/__root.tsx`
5. Ganti `SITE.url` sementara, tambahkan `engines.node >= 22.12` di `package.json`
6. Terjemahkan halaman 404 & error ke Bahasa Indonesia
7. Siapkan konfigurasi Supabase CLI di folder `supabase/`

🙋 **Hanif**

- Isi `.env.local` dengan URL proyek & _publishable/anon key_ dari Supabase (tombol **Connect**) — Claude akan kasih templatenya
- Jalankan `npx supabase login` lalu `npx supabase link` di terminal (Claude pandu langkahnya)
- Putuskan: stop pakai editor Lovable? (disarankan ya)
- Karena `.env` lama sempat ter-commit: cek apakah isinya milik proyek Supabase **lama** buatan Lovable. Kalau ya, aman diabaikan karena proyek baru dipakai

✅ **Selesai bila:** `tsc` & `lint` bersih, `.env` tidak ada di git, CLI Supabase terhubung.

## Hari 2: Data SK & perbaikan tampilan cepat

🎯 Data organisasi sesuai SK, kerusakan tampilan paling jelas hilang.

🤖 **Claude**

1. Satukan model role (Super Admin · BPH · Editor Bidang · Anggota · Publik)
2. Ganti 7 bidang dengan nama resmi SK + nama singkat + warna bidang
3. Ganti struktur pengurus: 2 penasihat, 8 BPH, 51 anggota bidang (Kabid = urutan 1)
4. Tanggal SK 05 Juni 2025; tanggal pelantikan ditandai menunggu konfirmasi
5. Hapus data palsu: agenda "hari ini", "12 Dokumen LPJ", tanggal libur yang salah
6. Perbaiki hero halaman Tentang (teks hilang di HP) & navbar luber di 1024 px

🙋 **Hanif**

- Cek penulisan nama & gelar pengurus di halaman Tentang (typo nama itu sensitif)

✅ **Selesai bila:** Tentang terbaca di HP, tidak ada scroll horizontal di 1024 px, nama sesuai SK.

🚩 **Checkpoint 1:** Hanif review singkat → merge ke `main`.

---

# Fase 1: Backend

## Hari 3: Tabel inti

🎯 Tabel organisasi & keamanan dasar ada di database.

🤖 **Claude**

1. Migrasi SQL: `periode`, `bidang`, `pengurus`, `profiles`, `pengaturan`, `audit_log`
2. Kebijakan RLS untuk tabel tersebut
3. Trigger audit log otomatis
4. Terapkan migrasi ke proyek Supabase

🙋 **Hanif**

- Buka Table Editor di Supabase, pastikan tabelnya muncul (cukup lihat)

✅ **Selesai bila:** migrasi tercatat di Supabase ("Last migration" tidak lagi kosong).

## Hari 4: Tabel konten

🎯 Tempat menyimpan kegiatan, berita, galeri, dan dokumen siap.

🤖 **Claude**

1. Migrasi: `kegiatan`, `berita`, `album`, `media`, `dokumen`
2. RLS per tabel: publik hanya bisa membaca yang sudah terbit, editor hanya bidangnya, BPH yang menerbitkan
3. Tes otomatis kebijakan akses (misal: pengunjung tidak bisa melihat draft/dokumen BPH)
4. Generate ulang `types.ts` dari database

✅ **Selesai bila:** semua tes akses lolos.

## Hari 5: Isi awal & sambungan pertama

🎯 Halaman profil mengambil data dari database.

🤖 **Claude**

1. Seed: periode 2025–2028, 7 bidang, 61 pengurus, pengaturan awal
2. Seed dummy (`is_dummy = true`): ±8 kegiatan, ±6 berita, ±4 album foto Unsplash
3. Lapisan akses data (query + cache) sebagai pengganti `src/domains/*/data.ts`
4. Sambungkan halaman Tentang & Program ke database

✅ **Selesai bila:** mengubah nama bidang di Supabase langsung tampil di web.

## Hari 6: Semua halaman dari database

🎯 Tidak ada lagi isi yang di-hardcode.

🤖 **Claude**

1. Sambungkan Beranda, Kegiatan, Berita, Galeri, Arsip, Kontak ke database
2. Helper **"sembunyikan bagian kosong"**
3. Statistik beranda dihitung otomatis
4. Hapus file `src/domains/*/data.ts` yang sudah tidak dipakai

✅ **Selesai bila:** `grep` tidak menemukan data konten di kode; web tetap tampil normal.

## Hari 7: Login admin

🎯 `/admin` hanya bisa dibuka pengurus.

🤖 **Claude**

1. Halaman `/admin/masuk` (email + password)
2. Proteksi rute admin di server + `noindex`
3. Role dibaca dari tabel `profiles`
4. Pembatasan percobaan login

🙋 **Hanif**

- Buat akun Super Admin pertama (untuk Hanif sendiri) lewat undangan yang Claude siapkan
- **Buat akun Cloudflare** dengan email organisasi, lalu aktifkan R2. Catatan: Cloudflare biasanya meminta metode pembayaran (kartu/PayPal) untuk mengaktifkan R2 meski pemakaiannya masih gratis. Kalau ini jadi kendala, kabari, ada alternatif (Supabase Storage 1 GB dulu)

✅ **Selesai bila:** membuka `/admin` tanpa login dialihkan ke halaman masuk.

## Hari 8: Penyimpanan media (R2)

🎯 Foto & dokumen bisa diupload dan tampil.

🤖 **Claude**

1. Bucket R2 publik (foto) & privat (dokumen internal)
2. Endpoint upload dengan presigned URL
3. Kompresi foto di browser (WebP, 1920 px) + thumbnail
4. Batas ukuran video (200 MB) + dukungan tempel link YouTube/IG/TikTok
5. Link sementara untuk dokumen non-publik

🙋 **Hanif**

- Buat API token R2 dan tempelkan ke `.env.local` (Claude pandu)

✅ **Selesai bila:** foto 5 MB dari HP tersimpan ±300 KB dan tampil di galeri.

## Hari 9: Online pertama (staging)

🎯 Web bisa dibuka dari HP siapa saja lewat link sementara.

🤖 **Claude**

1. Ubah target deploy ke Cloudflare
2. Deploy staging (alamat `*.workers.dev`)
3. Cron ping anti-pause (tiap 2 hari) + backup mingguan ke R2
4. Uji: buka link langsung ke halaman dalam, refresh (tidak boleh 404 seperti web RT)

🙋 **Hanif**

- Buka link staging dari HP, coba semua menu

✅ **Selesai bila:** staging jalan, cron tercatat berhasil minimal 1 kali.

🚩 **Checkpoint 2:** tunjukkan staging ke 1–2 teman Katar (termasuk teman full-stack) → merge ke `main`.

---

# Fase 2: Desain ulang tampilan publik

## Hari 10: Fondasi desain & navigasi

🎯 Kerangka visual baru.

🤖 **Claude**

1. Rapikan design token (warna bidang, jarak, radius, bayangan)
2. **Satu komponen hero** untuk semua halaman (7 varian lama dihapus)
3. Navbar desktop berkelompok: Tentang ▾ · Kabar ▾ · Arsip · Untuk Warga · Kontak + **Gabung**
4. **Navigasi bawah di HP**: Beranda · Agenda · Gabung · Galeri · Lainnya
5. Pasang logo resmi

🙋 **Hanif**

- Kirim file logo resmi (PNG/SVG)

✅ **Selesai bila:** navigasi berfungsi di 360 px & 1440 px.

## Hari 11: Beranda baru

🎯 Beranda ±5 layar di HP.

🤖 **Claude**

1. Hero dengan foto kegiatan
2. **Kegiatan terdekat** (fallback ke kegiatan terakhir bila kosong)
3. Angka dampak otomatis
4. Cerita terbaru
5. Ajakan: Gabung / Usul kegiatan / Hubungi
6. Banner pengumuman (bisa ditutup, ada tanggal kedaluwarsa)

✅ **Selesai bila:** tinggi beranda di HP ≤ 6 layar.

## Hari 12: Detail kegiatan & berita

🎯 Setiap kegiatan & berita punya halaman sendiri yang enak dibagikan.

🤖 **Claude**

1. `/kegiatan/[slug]` dan `/berita/[slug]`
2. Tombol **Tambah ke Google Calendar** & **Share ke WhatsApp**
3. Gambar preview WA (OG image) otomatis per konten
4. Kartu agenda baru (tanggal besar, lokasi, warna bidang)

🙋 **Hanif**

- Kirim link salah satu kegiatan ke grup WA percobaan, cek preview-nya

✅ **Selesai bila:** preview di WA menampilkan judul + gambar yang benar.

## Hari 13: Galeri

🎯 Foto & video tampil menarik.

🤖 **Claude**

1. `/galeri` (daftar album) & `/galeri/[album]`
2. Layout masonry + bingkai ala polaroid untuk dokumentasi
3. Lightbox (geser foto, bisa di-zoom di HP)
4. Pemutar video pendek & embed link

✅ **Selesai bila:** album 50 foto tetap lancar di HP (lazy load).

## Hari 14: Tentang, pengurus, bidang

🎯 Profil organisasi yang rapi dan sesuai SK.

🤖 **Claude**

1. Halaman Tentang (sejarah, visi-misi, dasar hukum dalam bentuk buka-tutup)
2. `/tentang/pengurus`: kartu dengan **avatar inisial** berwarna bidang, filter per bidang
3. `/program/[bidang]`: pengurus + kegiatan bidang tersebut

🙋 **Hanif**

- Minta BPH memverifikasi teks visi, misi, dan sejarah

✅ **Selesai bila:** 61 pengurus tampil benar per bidang.

## Hari 15: Arsip, kontak, filter

🎯 Halaman tersisa selesai.

🤖 **Claude**

1. `/arsip` dengan akses berjenjang (dokumen yang tidak boleh dilihat tidak dikirim sama sekali)
2. Kontak + peta
3. **Satu komponen filter** untuk kegiatan, berita, arsip (chip nama bidang singkat, bisa digeser di HP)
4. Redirect `/lpj` → `/arsip`; badge emoji diganti ikon

✅ **Selesai bila:** tidak ada lagi label bahasa Inggris & emoji di web publik.

## Hari 16: QA tampilan

🎯 Tampilan rapi di semua ukuran.

🤖 **Claude**

1. Screenshot semua halaman di 360, 390, 768, 1024, 1440 px
2. Cek kontras, target sentuh 44 px, mode kurangi animasi
3. Cek kecepatan (LCP < 2,5 detik di 4G)
4. Perbaiki semua temuan

🙋 **Hanif**

- Review staging bersama teman-teman, catat masukan

✅ **Selesai bila:** tidak ada scroll horizontal di semua ukuran, masukan kritis sudah diperbaiki.

🚩 **Checkpoint 3:** review desain bersama Ketua → merge ke `main`.

---

# Fase 3: Admin

## Hari 17: Dashboard & kegiatan

🤖 **Claude**

1. Tampilan admin baru (Bahasa Indonesia penuh)
2. Dashboard: ringkasan, draft menunggu review, pemakaian penyimpanan
3. Form kegiatan, termasuk kegiatan rutin (misal futsal tiap Jumat)

✅ **Selesai bila:** kegiatan baru dari admin langsung muncul di beranda.

## Hari 18: Editor berita

🤖 **Claude**

1. Editor berita dengan gambar
2. Alur **draft → review BPH → terbit**
3. Pratinjau sebelum terbit

✅ **Selesai bila:** akun Editor tidak bisa menerbitkan, akun BPH bisa.

## Hari 19: Upload galeri massal

🤖 **Claude**

1. Buat album + upload banyak foto sekaligus
2. Progress bar, lanjut otomatis bila koneksi putus
3. Atur cover & urutan foto, tambah link video

✅ **Selesai bila:** upload 30 foto dari HP berhasil dalam sekali proses.

## Hari 20: Arsip & pengurus

🤖 **Claude**

1. Upload dokumen + pilih level akses
2. Kelola pengurus per periode (tambah, ubah jabatan, izin foto)

✅ **Selesai bila:** dokumen berakses BPH tidak terlihat saat logout.

## Hari 21: Pengaturan, akun, log

🤖 **Claude**

1. Pengaturan web: WA, email, sosmed, alamat, peta, logo, foto hero, pengumuman
2. Kelola akun & role (khusus Super Admin), undang pengurus via email
3. Tampilan audit log

✅ **Selesai bila:** mengganti nomor WA dari admin langsung berubah di seluruh web.

## Hari 22: Panduan pengurus & uji mandiri

🤖 **Claude**

1. `docs/PANDUAN-PENGURUS.md` + versi bergambar (screenshot langkah demi langkah)
2. Halaman bantuan singkat di dalam admin

🙋 **Hanif**

- Minta 1 anggota Bid. Media **yang belum pernah lihat admin** mencoba posting berita hanya dengan membaca panduan

✅ **Selesai bila:** orang tersebut berhasil tanpa dibantu.

🚩 **Checkpoint 4:** merge ke `main`.

---

# Fase 4: Launching

## Hari 23: Domain & SEO

🤖 **Claude**

1. Hubungkan domain + HTTPS
2. Meta per halaman, canonical absolut, `sitemap.xml`, `robots.txt`, JSON-LD
3. Cloudflare Web Analytics

🙋 **Hanif**

- Beli domain dengan akun organisasi (Claude bantu pilih & konfigurasi DNS)

✅ **Selesai bila:** web terbuka di domain resmi.

## Hari 24: Data asli

🤖 **Claude**

1. Hapus semua data `is_dummy`
2. Bantu input data awal (berita pelantikan, kegiatan rutin, album pertama)

🙋 **Hanif**

- Kumpulkan & upload foto asli, isi kontak resmi, pastikan izin foto pengurus

✅ **Selesai bila:** tidak ada data dummy tersisa dan tidak ada bagian kosong yang tampil.

## Hari 25–29: Uji coba pengurus (1 minggu)

🙋 **Pengurus**

- Bid. Media posting minimal 2 berita + 1 album
- Tiap Kabid menambahkan 1 kegiatan bidangnya
- Semua mencatat kendala di satu tempat (grup WA / catatan bersama)

🤖 **Claude** (ringan, ±1 jam/hari)

- Perbaiki kendala yang dilaporkan

✅ **Selesai bila:** tidak ada kendala kritis selama 3 hari terakhir.

## Hari 30: Launching & serah terima

🤖 **Claude**

1. Final check: keamanan, backup, cron, analytics
2. Update `PLANNING.md` & `DEVLOG.md`

🙋 **Hanif & BPH**

- Tetapkan 2 Super Admin
- Umumkan web di grup WA warga RW 03 🎉

✅ **Selesai bila:** web tayang, akun & panduan sudah diserahkan.

---

# Setelah launching

- **2 minggu pertama:** pantau, pengurus mengelola sendiri tanpa developer
- **Fase 5** (dijadwalkan terpisah): RSVP agenda → transparansi kas → pendaftaran anggota → aspirasi → UMKM → template surat → inventaris → absensi QR → liga 17an → generator LPJ
