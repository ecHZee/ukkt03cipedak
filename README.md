# 🏠 Markas Digital Karang Taruna RW 03 Cipedak

Website resmi **Unit Kerja Karang Taruna RW 03**, Kelurahan Cipedak, Kecamatan Jagakarsa, Jakarta Selatan
(masa bakti 2025–2028).

Isinya kabar kegiatan, galeri, struktur pengurus, arsip dokumen, dan info yang berguna buat warga RW 03.
Targetnya: **deploy sekali, lalu dikelola sendiri oleh pengurus tanpa perlu developer.**

> 🚧 **Status: sedang direvisi.** Pengerjaan aktif ada di branch [`revisi`](https://github.com/ecHZee/ukkt03cipedak/tree/revisi).
> Progres harian bisa dicek di [`DEVLOG.md`](./DEVLOG.md), rencana lengkapnya di [`docs/`](./docs).

---

## ⚡ Coba jalankan (5 menit)

Butuh **Node.js 22.12+** dan **Git**.

```bash
git clone -b revisi https://github.com/ecHZee/ukkt03cipedak.git
cd ukkt03cipedak
npm install
npm run dev
```

Buka **http://localhost:5173** 🎉

> Untuk sekadar lihat tampilan, belum perlu `.env.local`. File ini baru dibutuhkan saat web sudah
> mengambil data dari database (lihat [Environment](#-environment)).

Sudah pernah clone? Ambil versi terbaru:

```bash
git switch revisi && git pull
```

---

## 🗺️ Progres

| Fase | Isi                                                                     | Status                           |
| ---- | ----------------------------------------------------------------------- | -------------------------------- |
| 0    | Beres-beres repo, data sesuai SK, perbaikan tampilan cepat              | 🔄 Hari 1 ✅ · Hari 2 berikutnya |
| 1    | Database Supabase, login admin, upload ke Cloudflare R2, staging online | ⏳                               |
| 2    | Desain ulang semua halaman publik                                       | ⏳                               |
| 3    | Admin yang bisa dipakai pengurus                                        | ⏳                               |
| 4    | Launching di domain resmi                                               | ⏳                               |
| 5    | Fitur untuk warga (kas, UMKM, aspirasi, dll.)                           | ⏳                               |

Jadwal per hari ada di [`docs/SCHEDULE.md`](./docs/SCHEDULE.md).

---

## 🧰 Tech stack

| Bagian           | Pakai                                                        | Catatan                                                      |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Framework        | [TanStack Start](https://tanstack.com/start) (React 19, SSR) | Halaman dirender di server, bagus buat SEO & preview link WA |
| Styling          | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)         | Komponen dasar ada di `src/components/ui`                    |
| Database & login | [Supabase](https://supabase.com) (Postgres + RLS)            | Region Singapore, paket Free                                 |
| Media            | Cloudflare R2                                                | Foto, dokumen, video pendek _(mulai Fase 1)_                 |
| Hosting          | Cloudflare                                                   | _(mulai Fase 1)_                                             |

Biaya bulanan target: **Rp0**. Detail & alasannya di [`docs/PLANNING.md`](./docs/PLANNING.md#12-biaya).

---

## 📜 Perintah

| Perintah                   | Fungsinya                                              |
| -------------------------- | ------------------------------------------------------ |
| `npm run dev`              | Jalankan web di lokal (auto-reload saat file disimpan) |
| `npm run build`            | Build versi produksi                                   |
| `npm run preview`          | Coba hasil build di lokal                              |
| `npm run lint`             | Cek kualitas kode                                      |
| `npm run format`           | Rapikan format kode (Prettier)                         |
| `npm run db -- <perintah>` | Supabase CLI dengan akun Katar (lihat di bawah)        |

### 🗄️ `npm run db`, bukan `npx supabase`

Di proyek ini Supabase CLI **selalu** dijalankan lewat:

```bash
npm run db -- migration list
npm run db -- db push
```

Skrip ini memakai token akun **Karang Taruna** dari `.env.local`, bukan token pribadi yang mungkin
ada di komputer kamu. Skrip juga menolak jalan kalau folder ternyata tersambung ke proyek Supabase lain.

---

## 🔐 Environment

Salin template lalu isi:

```bash
cp .env.example .env.local
```

| Variabel                                                    | Isi                                      | Rahasia?                |
| ----------------------------------------------------------- | ---------------------------------------- | ----------------------- |
| `VITE_SUPABASE_URL`, `SUPABASE_URL`                         | URL proyek Supabase                      | Tidak                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PUBLISHABLE_KEY` | Key `sb_publishable_…`                   | Tidak (aman di browser) |
| `SUPABASE_SERVICE_ROLE_KEY`                                 | Key `sb_secret_…`                        | **Ya**                  |
| `SUPABASE_ACCESS_TOKEN`                                     | Token akun `sbp_…` untuk CLI             | **Ya**                  |
| `VITE_SITE_URL`                                             | Alamat web, mis. `http://localhost:5173` | Tidak                   |

**Aturan emas 🛑**

- `.env.local` tidak pernah di-commit (sudah di `.gitignore`)
- Kunci rahasia jangan dikirim lewat chat atau di-screenshot
- Variabel berawalan `VITE_` ikut terkirim ke browser, jadi **jangan pernah** isi dengan kunci rahasia
- Butuh akses database? Minta diundang ke organisasi Supabase Katar, jangan pinjam token orang lain

---

## 📁 Struktur folder

```
ukkt03cipedak/
├── docs/                  📚 Planning, jadwal, blueprint awal
├── scripts/               🛠️ Skrip bantu (mis. wrapper Supabase CLI)
├── supabase/              🗄️ Konfigurasi & migrasi database
├── src/
│   ├── routes/            🧭 Satu file = satu halaman (file-based routing)
│   │   ├── index.tsx          → /
│   │   ├── tentang.tsx        → /tentang
│   │   └── admin.*.tsx        → /admin/...
│   ├── components/
│   │   ├── public/        🌐 Komponen halaman publik
│   │   ├── admin/         🔧 Komponen admin
│   │   ├── shared/        ♻️ Dipakai publik & admin (empty state, skeleton)
│   │   └── ui/            🧱 Komponen dasar shadcn/ui
│   ├── domains/           📦 Data per topik (berita, kegiatan, anggota, …)
│   ├── integrations/      🔌 Koneksi Supabase
│   ├── constants/         📌 Nama situs, daftar rute, token desain
│   ├── config/            ⚙️ Konfigurasi & pembacaan env
│   ├── seo/               🔎 Meta tag, OG image, sitemap
│   └── styles.css         🎨 Design token (warna, font, radius)
├── AGENTS.md              🤖 Aturan untuk AI coding agent
└── DEVLOG.md              📝 Catatan kerja (append-only)
```

> `src/routeTree.gen.ts` dibuat otomatis oleh router. Jangan diedit manual.

---

## 🤝 Cara berkontribusi

1. **Baca bagian paling bawah [`DEVLOG.md`](./DEVLOG.md)** biar tahu posisi terakhir
2. Kerja di branch `revisi` (atau branch turunannya), **jangan langsung ke `main`**
3. Sebelum commit:
   ```bash
   npm run lint && npm run build
   ```
4. **Tambahkan satu section baru di bawah `DEVLOG.md`** (pakai template di file itu). Section lama jangan diubah
5. Push, lalu kabari di grup 🙌

`main` hanya diperbarui di setiap checkpoint setelah direview bersama.

### 🤖 Vibe coding bareng AI?

Boleh banget, pakai Claude Code, Codex, Cursor, Antigravity, atau apa pun. Pastikan agent-nya:

- Membaca [`AGENTS.md`](./AGENTS.md) dan [`DEVLOG.md`](./DEVLOG.md) dulu (kebanyakan agent otomatis membaca `AGENTS.md`)
- Mengikuti rencana di [`docs/PLANNING.md`](./docs/PLANNING.md), bukan mengarang fitur sendiri
- Menulis section DEVLOG di akhir sesi

Tips: suruh agent kerja **per hari sesuai [`docs/SCHEDULE.md`](./docs/SCHEDULE.md)**, supaya perubahannya kecil,
mudah dicek, dan mudah dibatalkan kalau salah.

> ⚠️ Repo ini dulunya tersambung ke **Lovable**. Editor Lovable **sudah tidak dipakai** sejak revisi dimulai
> supaya tidak menimpa perubahan. Jangan force-push dan jangan menulis ulang riwayat commit yang sudah di-push.

---

## 📚 Dokumen penting

| File                                                 | Isi                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [`docs/PLANNING.md`](./docs/PLANNING.md)             | Rencana lengkap: scope, arsitektur, model data, role, desain, fase |
| [`docs/SCHEDULE.md`](./docs/SCHEDULE.md)             | Jadwal harian 30 hari kerja                                        |
| [`docs/BLUEPRINT-AWAL.md`](./docs/BLUEPRINT-AWAL.md) | Arsip prompt awal ke Lovable                                       |
| [`DEVLOG.md`](./DEVLOG.md)                           | Catatan setiap sesi kerja                                          |
| [`AGENTS.md`](./AGENTS.md)                           | Aturan untuk AI coding agent                                       |

---

## 👥 Tim

Dikelola oleh **Bidang Media Publikasi, Dokumentasi & Desain Grafis** Karang Taruna RW 03 Cipedak.

Pengurus berdasarkan SK Karang Taruna Kelurahan Cipedak No. 003/SK/KT-Cipedak/VI/2025.

<sub>Dibangun bareng Lovable, Hermes Agent, dan Claude Code 🤖 · dengan semangat pemuda RW 03 🇮🇩</sub>
