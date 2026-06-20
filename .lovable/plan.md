
# Blueprint v1.0 — Platform Digital Karang Taruna RW 03 Cipedak
**Status:** APPROVED BASELINE · **Mode:** Plan · **Hasil rapat final**

---

## 0. Changelog dari Draft Awal

| # | Perubahan | Status |
|---|---|---|
| R1 | Stack: Supabase + PostgreSQL + Vercel + YouTube (bukan Lovable Cloud) | Applied |
| R2 | Auth: Username + Password + Email (recovery). Detail teknis ditunda ke fase implementasi | Applied |
| R3 | LPJ tetap menu utama publik (simbol transparansi) | Applied |
| R4 | Hapus Contact Form — anti-spam. Ganti dengan kanal langsung | Applied |
| R5 | Tambah entitas **Periode Kepengurusan** sejak MVP | Applied |
| R6 | Tambah prinsip baru: **Digital Legacy** | Applied |
| R7 | Tambah modul baru: **Announcement** (≠ Kegiatan) | Applied |

---

## 1. Filosofi Produk

Platform diposisikan sebagai **"Markas Digital Karang Taruna RW 03 Cipedak"** dengan **3 pilar utama**:

1. **Community Portal** — wajah resmi organisasi ke publik.
2. **Media Publikasi** — kanal berita, kegiatan, galeri, pengumuman.
3. **Digital Archive** — arsip dokumen, LPJ, dan jejak organisasi lintas periode.

### Prinsip Inti
- **Sustainable** — hidup 3+ tahun tanpa developer.
- **Low Maintenance** — pengurus klik, bukan ngoding.
- **Trust by Default** — transparan, terdokumentasi, terverifikasi.
- **Modern Civic** — elegan, premium, bukan "website RT/RW jadul".
- **Digital Legacy** *(baru)* — semua berita, galeri, kegiatan, dan dokumen tetap dapat diakses lintas periode kepengurusan tanpa kehilangan histori organisasi. Setiap entitas konten **wajib terhubung ke entitas Periode Kepengurusan**.

---

## 2. Product Architecture (Updated)

```text
                ┌──────────────────────────────┐
                │  PLATFORM DIGITAL KT RW 03    │
                └──────────────┬───────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   PUBLIC PORTAL          INTERNAL CMS           DATA LAYER
   (anon, SSR, SEO)       (auth, /admin)        (Supabase)
        │                      │                      │
   - Beranda              - Dashboard            - PostgreSQL
   - Tentang              - Announcement (NEW)   - Supabase Auth
   - Program Kerja        - Anggota              - Supabase Storage
   - Kegiatan             - Berita                 (public/private)
   - Berita               - Kegiatan             - RLS per-role
   - Galeri               - Galeri               - Audit log table
   - LPJ                  - Dokumen / LPJ        - Periode entity
   - Kontak               - Periode Kepengurusan   (legacy backbone)
                          - Website Settings
                          - Audit Log
                          - Users & Roles

                  HOSTING: Vercel
                  VIDEO  : YouTube (embed, external CDN)
```

### Stack Resmi
| Layer | Teknologi |
|---|---|
| Frontend | React + TypeScript |
| Backend | Supabase |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Video | YouTube (External CDN, embed) |

---

## 3. Role & Hak Akses

Role mengikuti **jabatan organisasi**, bukan individu. Saat pergantian pengurus → jabatan dipindahkan, akun lama dinonaktifkan, history tetap utuh (Digital Legacy).

| Role | Pemegang | Akses |
|---|---|---|
| **Super Admin** | Jabranzz (Programmer) | Full: user mgmt, role mgmt, settings, audit log, hard delete, periode mgmt |
| **Admin** | Ketua | Semua konten publik + approve publish + lihat audit log + kelola announcement |
| **Editor** | Sekretaris & Kabid Media | CRUD Berita, Kegiatan, Galeri, Dokumen, Announcement (draft → minta approve) |
| **Member** | Anggota aktif | Lihat info internal yang diizinkan, lihat announcement internal, profil sendiri, ganti password |

> Role disimpan di tabel `user_roles` terpisah (bukan di `profiles`) untuk mencegah privilege escalation. Cek role via security-definer function di PostgreSQL.

---

## 4. Autentikasi

Keputusan **prinsip** (detail teknis ditunda ke fase Supabase):
- Login menggunakan **Username + Password**.
- **Email wajib disimpan** sebagai identitas & recovery account.
- **Tidak ada self-registration** publik.
- **Force change password** pada login pertama.
- Tombol *"Ayo Daftar Jadi Anggota"* di public portal → **WhatsApp deeplink** ke PIC, bukan form akun.

> Implementasi teknis (cara username dimapping ke Supabase Auth, recovery flow, session policy) akan diputuskan pada fase build, bukan di blueprint.

---

## 5. Public Portal Architecture (Final)

**Navbar publik (final, 8 item):**
```
Beranda · Tentang · Program · Kegiatan · Berita · Galeri · LPJ · Kontak
```

| Route | Tujuan | Konten utama |
|---|---|---|
| `/` Beranda | Hook & ringkasan | Hero, statistik (7 RT · 59 anggota · 60 keg/thn), kegiatan terdekat, berita terbaru, **announcement publik aktif**, CTA WA "Daftar Anggota" |
| `/tentang` | Identitas organisasi | Sejarah (berdiri 09 Jun 2025), visi-misi, struktur kepengurusan periode aktif, masa bakti, foto pengurus, **arsip periode sebelumnya** |
| `/program-kerja` | Komitmen | 6 bidang fokus (sosial, pendidikan, olahraga, lingkungan, masyarakat, publikasi), proker per bidang per periode |
| `/kegiatan` | Katalog | List + filter (bidang, tahun, **periode**, status). Detail di `/kegiatan/$slug` |
| `/berita` | Publikasi | List + filter kategori + **periode**. Detail di `/berita/$slug` dengan OG image |
| `/galeri` | Dokumentasi visual | Album per kegiatan, lightbox, lazy load, embed video YouTube |
| `/lpj` | **Transparansi (menu utama)** | LPJ per kegiatan & per tahun, downloadable PDF, filter periode. Pembeda utama platform |
| `/kontak` | Kanal komunikasi langsung | **Tanpa form**. Hanya: WhatsApp, Email, Google Maps, Instagram, YouTube |

> Setiap berita, kegiatan, dokumen, dan galeri **dilabeli periode** otomatis → mendukung Digital Legacy.

### Catatan Halaman Kontak (R4)
Karena tidak ada form, halaman `/kontak` adalah **kanal aksi langsung**:
- Tombol WhatsApp (`wa.me/...`) — primer
- Email (mailto, klik untuk salin)
- Embed Google Maps lokasi sekretariat
- Link Instagram organisasi
- Link YouTube organisasi

---

## 6. Internal CMS Architecture (Updated)

URL prefix: `/admin` (semua di bawah route protected).

| Module | Fitur inti |
|---|---|
| **Dashboard** | KPI cards (anggota aktif, kegiatan bulan ini, berita draft, announcement aktif, dokumen baru), aktivitas terakhir, shortcut |
| **Announcement** *(NEW)* | CRUD pengumuman: jadwal rapat, perubahan jadwal, info penting. Field: judul, isi, kategori (rapat/jadwal/info/urgent), audience (internal/publik), tanggal mulai-berakhir, status (aktif/arsip). **Berbeda dari Kegiatan**: announcement = pesan singkat & temporer; Kegiatan = event terjadwal dengan LPJ |
| **Anggota** | CRUD anggota, foto, RT, jabatan, **periode jabatan**, status (aktif/nonaktif/alumni), assign role, reset password |
| **Berita** | CRUD + rich editor + cover image + status (draft/review/published) + scheduling + auto-tag periode |
| **Kegiatan** | CRUD + tanggal + lokasi + PIC + bidang + status + galeri & LPJ terkait + auto-tag periode |
| **Galeri** | Album per kegiatan, batch upload ke Supabase Storage, drag-reorder, set cover, embed YouTube |
| **Dokumen** | Upload PDF ke Supabase Storage, kategori (LPJ, Notulensi, SK, Proposal, Surat), visibilitas (publik/internal), auto-tag periode. LPJ publik = filter `category=LPJ AND is_public=true` |
| **Periode Kepengurusan** *(NEW)* | CRUD periode: nama (2025–2028), tanggal mulai, tanggal akhir, status (aktif/selesai/akan datang), ketua, SK pengangkatan. Hanya **satu periode aktif** pada satu waktu. Super Admin only |
| **Website Settings** | Logo, nama, tagline, kontak (WA, email, IG, YouTube, Maps), hero image, maintenance toggle |
| **Audit Log** | Siapa, kapan, aksi apa, entitas mana. Read-only. Super Admin only |
| **Users & Roles** | Buat akun, assign role berdasarkan jabatan, reset password, deaktivasi. Super Admin only |

### Sidebar Admin (Final)
```
Dashboard
─────────────
Komunikasi
  · Announcement
─────────────
Konten
  · Berita
  · Kegiatan
  · Galeri
  · Dokumen / LPJ
─────────────
Organisasi
  · Anggota
  · Periode Kepengurusan
─────────────
Sistem
  · Website Settings
  · Audit Log         (Super Admin)
  · Users & Roles     (Super Admin)
```

---

## 7. Entitas Data Utama (Konseptual)

```text
periode (id, nama "2025-2028", start, end, status, ketua_id)
  └── 1..N berita, kegiatan, galeri, dokumen, anggota_jabatan, announcement

anggota (id, nama, foto, rt, email, telepon, status)
  └── anggota_jabatan (id, anggota_id, periode_id, jabatan, bidang)

users (auth) ── user_roles (user_id, role)  -- terpisah, anti-escalation

announcement (id, judul, isi, kategori, audience, start, end, status, periode_id)

berita / kegiatan / galeri / dokumen
  └── periode_id (wajib, auto-fill periode aktif saat create)

audit_logs (id, actor_id, action, entity, entity_id, meta, created_at)
```

> **Digital Legacy rule:** `periode_id` adalah foreign key **wajib** di semua entitas konten. Periode lama tidak boleh dihapus — hanya diset status `selesai`.

---

## 8. UX Principles (Unchanged)

- **3-Click Rule** untuk task pengurus utama (publish berita, upload LPJ, posting announcement).
- **Empty States bermakna** — panduan langkah berikut, bukan halaman kosong.
- **Toast Notification** di setiap aksi mutasi.
- **Soft Delete** + confirm dialog untuk semua delete.
- **Audit Log** mencatat semua mutasi penting.
- **Optimistic UI** untuk toggle status & reorder.
- **No destructive without confirm.**

---

## 9. Responsive Strategy

- **Mobile-first.** Mayoritas warga & anggota akses via HP.
- Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280`.
- Public: single-column di mobile, multi-column ≥ md.
- Admin sidebar: drawer di mobile, fixed di ≥ lg.
- DataTable: card-list di mobile, table di ≥ md.
- Image: lazy loading + WebP via Supabase Storage transformations.
- Video: embed YouTube responsive (16:9 aspect-ratio).

---

## 10. Identitas Visual

| Token | Value | Pemakaian |
|---|---|---|
| Primary | `#0047AB` Benhur Blue | Autoritas, kepercayaan, header, CTA primer |
| Accent | `#D4A017` Gold | Premium, badge transparansi, CTA "Daftar" |
| Background | `#F8FAFC` | Bersih, lapang |
| Ink | `#334155` Slate | Body text |
| Surface | `#FFFFFF` | Cards, modals |
| Batik Ornament | SVG, 3–5% opacity | Hero, divider, footer — **public only**, tidak di admin |

- Typography: heading display modern + body humanis (pilihan final di fase visual design).
- Radius 10–14px, shadow lembut, motion 150–250ms ease-out.

---

## 11. Future Scalability (Updated)

Struktur data disiapkan sejak MVP, fitur diaktifkan bertahap:

- **Multi-periode kepengurusan** — *sudah masuk MVP* sebagai fondasi Digital Legacy.
- **Arsip lintas-periode** — halaman `/arsip` browsing per periode.
- **E-Voting internal** untuk pemilihan ketua periode berikutnya.
- **Iuran / Kas digital** dengan rekap bulanan & laporan.
- **Notifikasi WhatsApp** outbound untuk announcement urgent (via webhook gateway).
- **PWA / install to home screen** — markas digital di saku anggota.
- **Public read-only API** untuk RW lain yang ingin mengadopsi pola.
- **YouTube auto-sync** — fetch metadata video terbaru dari channel YouTube organisasi.
- **Backup & export** otomatis bulanan ke Google Drive organisasi.

---

## 12. MVP Scope (Updated, sesuai hasil rapat)

### Rilis 1 — MVP
1. **Public Portal lengkap (8 route final):** Beranda, Tentang, Program, Kegiatan, Berita, Galeri, **LPJ**, Kontak (tanpa form).
2. **Auth:** Username + Password + Email (Supabase Auth), force change password pertama.
3. **Internal:**
   - Dashboard
   - **Announcement** *(NEW)*
   - Anggota + **Periode Kepengurusan** *(NEW)*
   - Berita, Kegiatan, Galeri
   - Dokumen / LPJ (sekaligus, satu sumber data)
   - Website Settings
   - Users & Roles
4. **Audit Log** dasar (CRUD utama).
5. **Digital Legacy enforcement:** semua konten wajib terhubung ke periode aktif.
6. **SEO & Open Graph** per route + per detail berita/kegiatan.
7. **Aksesibilitas WCAG AA** minimal.

### Rilis 2
- Editor workflow review/approve formal (draft → review → publish).
- Audit log lengkap + filter & export.
- Halaman `/arsip` per periode.

### Rilis 3
- E-voting, notifikasi WA, PWA, iuran digital, YouTube auto-sync.

---

## 13. Definition of Done — MVP

- 8 halaman publik live, responsive, OG tags lengkap, Lighthouse ≥ 90 (Perf · A11y · SEO).
- Login username/password berfungsi termasuk force change password & recovery via email.
- 4 role berjalan dengan RLS terverifikasi (test: editor tidak bisa hapus user, member tidak bisa lihat dokumen internal).
- **Periode Kepengurusan aktif berfungsi** — semua konten baru auto-tag ke periode aktif.
- **Announcement** dapat dipublish dengan audience internal/publik.
- Halaman `/kontak` tanpa form, hanya kanal langsung (WA, Email, Maps, IG, YouTube).
- Halaman `/lpj` publik menampilkan LPJ downloadable per periode.
- Pengurus bisa: tambah anggota, publish berita, buat kegiatan, upload galeri, posting announcement, upload LPJ, ganti hero, **tanpa bantuan developer**.
- Audit log mencatat minimal: create/update/delete user, publish/unpublish berita, upload dokumen, ganti periode aktif.
- Dokumen serah-terima (cara pakai, backup, reset password, ganti periode) tersedia.

---

## 14. Catatan Implementasi Kritis (Untuk Fase Build)

1. **Periode aktif = singleton.** Hanya satu periode boleh berstatus `aktif` pada satu waktu. Constraint di DB level + UI guard.
2. **Foreign key `periode_id`** wajib di semua tabel konten. Saat create record, default ke periode aktif saat ini.
3. **Dokumen & LPJ = satu tabel** dengan flag `category` + `is_public`. LPJ publik = view filter, bukan tabel terpisah.
4. **Storage strategy:** bucket `public/` untuk hero/cover/galeri publik, bucket `private/` untuk dokumen internal. Policy berbasis role.
5. **YouTube:** simpan hanya `video_id` di DB. Embed via iframe responsive.
6. **Tidak ada Contact Form** → tidak ada captcha, tidak ada rate-limit form, tidak ada moderasi inbox. Sederhana & anti-spam.
7. **Handover periode:** saat status periode berubah ke `selesai`, akun pengurus periode itu tidak otomatis dihapus — diset `nonaktif`. History tetap utuh (Digital Legacy).
8. **Backup:** Supabase scheduled backup + ekspor manual bulanan ke Google Drive organisasi.

---

## 15. Langkah Berikutnya

Setelah Blueprint v1.0 ini di-lock:
1. **Fase Visual Design** — saya tawarkan 3 arah desain bertema "Modern Civic Portal" sebagai prototype.
2. **Setup Supabase + project skeleton** (Vercel deployment, env vars).
3. **Implementasi modul mengikuti urutan MVP** — Periode Kepengurusan & Auth dulu (fondasi), baru modul konten.

---

**Blueprint v1.0 — siap dijadikan baseline produk.**
Mohon konfirmasi lock blueprint ini, atau berikan revisi tambahan sebelum lanjut ke fase Visual Design.
