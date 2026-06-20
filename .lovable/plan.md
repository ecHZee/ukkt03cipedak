
# Visual Design Final — Platform Digital Karang Taruna RW 03 Cipedak

**Status:** LOCKED · **Mode:** Plan · **Berbasis:** Blueprint v1.0 + Hybrid Direction (60% Markas Digital · 25% Balai Modern · 15% Pemuda Cipedak)

> Dokumen ini adalah **referensi visual final**. Belum ada kode, komponen, atau prototype. Akan dipakai sebagai sumber kebenaran saat fase build dimulai.

---

## 1. Identitas Visual

**Karakter:** *"Markas Digital Modern Karang Taruna RW 03 yang profesional, hidup, dan dapat diwariskan lintas periode kepengurusan."*

| Pilar | Sumber | Porsi |
|---|---|---|
| Produk digital, bento, tile, scalable | Markas Digital | 60% |
| Whitespace, kredibilitas, formal di LPJ | Balai Modern | 25% |
| Kolase foto, energi muda, editorial di berita/galeri | Pemuda Cipedak | 15% |

**Prinsip turunan:**
1. **Tile-first** — bento grid adalah motif utama, bukan ornamen.
2. **Photo-honest** — semua foto = dokumentasi asli organisasi. Tidak ada gambar AI sebagai visual utama.
3. **Quiet motion** — animasi membantu pemahaman, bukan menarik perhatian.
4. **Legacy-ready** — setiap section harus terbaca baik untuk periode 2025-2028 maupun 2031-2034.

---

## 2. Color Tokens (Final)

Sesuai Blueprint, dikunci tanpa perubahan.

| Token | Value | Pemakaian |
|---|---|---|
| `--primary` | `#0047AB` Benhur Blue | CTA primer, link, fokus, header status aktif |
| `--primary-foreground` | `#FFFFFF` | Teks di atas primary |
| `--accent` | `#D4A017` Gold | Badge "Terverifikasi", periode aktif, CTA "Daftar Anggota" (satu-satunya tombol gold) |
| `--ink` | `#334155` Slate | Body text |
| `--ink-muted` | `#64748B` | Meta, label, caption |
| `--background` | `#F8FAFC` | Page background |
| `--surface` | `#FFFFFF` | Card, modal, tile |
| `--border` | `#E2E8F0` Slate-200 | Border tile & input |
| `--border-strong` | `#CBD5E1` Slate-300 | Divider section |
| `--success` | `#16A34A` | Status dot "aktif" |
| `--warning` | `#D97706` | Status "akan datang" |
| `--muted-surface` | `#F1F5F9` | Tile sekunder, skeleton |
| **Batik overlay** | SVG kawung/parang, opacity **4%** | Hero kanan, footer, divider — **public only** |

**Aturan emas:** Gold dipakai hemat — maksimal **3 elemen visible** per viewport. Jangan jadikan warna dekoratif.

---

## 3. Typography (Final)

- **Heading:** Plus Jakarta Sans (500 / 600 / 700)
- **Body:** Inter (400 / 500)
- **Numeric/metadata:** Inter `font-variant-numeric: tabular-nums` (no mono — menjaga kesatuan dengan Balai Modern's keterbacaan)

### Skala (Desktop / Mobile)

| Token | Desktop | Mobile | Weight | Pemakaian |
|---|---|---|---|---|
| Display | 64 / 72 | 40 / 48 | 700 | Hero H1 |
| H1 | 48 / 56 | 32 / 40 | 600 | Page title |
| H2 | 36 / 44 | 28 / 36 | 600 | Section title |
| H3 | 24 / 32 | 20 / 28 | 600 | Card title, sub-section |
| H4 | 18 / 26 | 16 / 24 | 600 | Tile title |
| Body L | 18 / 28 | 16 / 26 | 400 | Lead paragraph |
| Body | 16 / 26 | 15 / 24 | 400 | Default |
| Body S | 14 / 22 | 13 / 20 | 400 | Caption, meta |
| Label | 12 / 16 | 12 / 16 | 600 uppercase tracked 0.06em | Section label, chip |

**Aturan:** Maksimal **2 berat font** per section (mis. 600 + 400). Tidak ada italic kecuali untuk pull-quote di halaman Berita.

---

## 4. Spacing, Radius, Elevation, Motion

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Container:** max-w 1280px, padding `px-6 md:px-10 lg:px-16`.
- **Section padding vertical:** 64 mobile / 96 desktop.
- **Radius:** sm 8 · md 12 · lg 16 · pill 9999. Tile default = 12.
- **Shadow:**
  - `shadow-tile` = `0 1px 2px rgb(15 23 42 / 0.04), 0 1px 0 rgb(15 23 42 / 0.02)` (default tile)
  - `shadow-tile-hover` = `0 4px 12px rgb(0 71 171 / 0.08)` (hover, tinted ke primary)
  - `shadow-elevated` = `0 8px 24px rgb(15 23 42 / 0.08)` (modal, popover)
- **Motion:** semua 120–200ms `ease-out`. Tidak ada bouncy, tidak ada parallax. Page transition fade 120ms saja.
- **Focus ring:** `0 0 0 3px rgba(0,71,171,0.25)` pada semua interaktif. Wajib visible.

---

## 5. Layout System

### Bento Grid (motif utama)
- Grid dasar 12 kolom, gap 16 mobile / 24 desktop.
- Tile size pattern: `4×4`, `8×4`, `6×6`, `12×3` — dikombinasi per section.
- Setiap tile = card dengan radius 12, border 1px, status dot opsional pojok kiri-atas, arrow pojok kanan-atas yang muncul pada hover.

### Section Header Pattern (dari Markas Digital)
```
// 02 — Berita Terbaru          [Lihat semua →]
─────────────────────────────────────────────
```
Label kecil uppercase tracked + judul section H2 + link action kanan.

### Editorial Strip (dari Pemuda Cipedak, dipakai HANYA di Berita, Galeri, Beranda block "Kegiatan Terbaru")
- 1 featured 8 kolom + 4 secondary 4 kolom (magazine layout).
- Kolase foto di Beranda: maksimal 3 foto offset tumpang-tindih, di area sekunder hero (bukan menggantikan tile).

### Formal Block (dari Balai Modern, dipakai HANYA di LPJ, Tentang, Dokumen publik)
- Single column max-w 880px.
- Divider gold 1px sebelum heading.
- Tabel LPJ dengan zebra row halus, header sticky.

---

## 6. Komponen Visual Utama

| Komponen | Spesifikasi |
|---|---|
| **Navbar (public)** | Tinggi 72, sticky, background `--background` dengan blur saat scroll, logo + 8 nav item + CTA gold "Daftar via WA" |
| **Hero Beranda** | Tinggi ±70vh. Kiri (7 col): badge "Periode 2025–2028 · Aktif", display H1, sub-headline, 2 CTA. Kanan (5 col): bento mini 2×2 berisi (a) kegiatan terdekat, (b) announcement aktif, (c) counter LPJ, (d) kolase 3 foto. Batik overlay 4% di tile kosong. |
| **Stat Strip** | Di bawah hero. 4 angka besar (7 RT · 59 Anggota · 60 Kegiatan/thn · 12 LPJ) dengan label di bawah, divider vertikal slate-200. |
| **News Card** | Cover 16:9 radius-top 12, chip kategori, judul H3 2 baris clamp, meta tanggal + periode badge, footer "Baca →". Hover: shadow-tile-hover + arrow translate-x. |
| **Event Card** | Layout horizontal di desktop (date block kiri 96×96, konten kanan), vertical di mobile. Status dot. |
| **Document/LPJ Row** | Table row: ikon PDF · judul · periode badge · tanggal · ukuran · tombol "Unduh" ghost. Hover row background `--muted-surface`. |
| **Announcement Banner** | Strip tipis di atas hero (opsional, dismissible) untuk announcement urgent. Background primary 6% tint, ikon bell, link "Selengkapnya". |
| **Periode Badge** | Pill kecil `border-1 --accent`, teks accent, contoh: `2025–2028`. Status aktif → background gold 10%. |
| **Footer** | 4 kolom (Tentang, Kontak, Sosmed, Periode). Batik overlay 4%. Bottom strip © + masa bakti aktif. |

### Admin (internal — TANPA batik, TANPA gold dekoratif)
| Komponen | Spesifikasi |
|---|---|
| **AdminShell** | Sidebar fix 248px kiri (drawer di mobile), topbar 56px dengan breadcrumb + user menu, content area background `--background` |
| **DataTable** | Header sticky, row 56px, hover muted-surface, action menu kanan. Mobile: card list. |
| **StatusBadge** | aktif (success), draft (slate), review (warning), arsip (muted) |
| **RichEditor** | Toolbar bersih, font Inter, tidak ada gold/batik |

---

## 7. Photography & Imagery

- **Sumber:** 100% dokumentasi asli kegiatan KT RW 03.
- **Larangan:** generatif AI sebagai visual utama. AI hanya boleh untuk placeholder development atau ornamen abstrak non-manusia.
- **Treatment:** foto ditampilkan **apa adanya** (no duotone berat). Boleh adjust kontras + warm white balance ringan untuk konsistensi.
- **Crop ratio:** 16:9 (berita, hero), 4:5 (kartu galeri portrait), 1:1 (foto pengurus).
- **Empty state foto:** placeholder tile dengan ornamen batik 4% + ikon lucide `Image`, label "Belum ada dokumentasi".
- **Alt text:** wajib di semua foto (a11y + SEO).

---

## 8. Iconography

- **Library:** Lucide, stroke 1.5px, 20/24px default.
- **Duotone untuk 6 bidang program** (sosial, pendidikan, olahraga, lingkungan, masyarakat, publikasi) — base ink, accent gold 30% opacity di layer kedua.
- **Status dot:** lingkaran 8px (success / warning / muted).

---

## 9. Motion Specification

| Interaksi | Durasi | Easing |
|---|---|---|
| Hover card | 150ms | ease-out |
| Button hover | 120ms | ease-out |
| Modal/drawer open | 200ms | ease-out |
| Skeleton shimmer | 1200ms loop | linear |
| Page content fade-in | 120ms | ease-out |
| Number counter (hero stats) | 600ms | ease-out, sekali saat in-view |
| Scroll reveal | 180ms fade + 8px up, stagger 40ms | ease-out |

Tidak ada: parallax, spring bounce, marquee, kursor kustom, scroll-jacking.

---

## 10. Responsive Strategy

- **Breakpoints:** sm 640 · md 768 · lg 1024 · xl 1280.
- **Bento behavior:**
  - ≥ lg: full 12-col bento.
  - md: 6-col, tile besar jadi full width.
  - < md: single column stack, rasio tile dipertahankan saat mungkin.
- **Hero kanan (bento mini)** di mobile → horizontal scroll-snap carousel.
- **Editorial featured** di mobile → vertical stack, featured tetap di atas.
- **Navbar:** drawer kiri dengan section terkelompok (Konten · Organisasi · Transparansi · Kontak).
- **Sticky bottom CTA "Daftar via WA"** muncul di mobile setelah scroll > 600px.

---

## 11. Aksesibilitas (WCAG AA — wajib MVP)

- Kontras teks ≥ 4.5:1; teks besar ≥ 3:1. Cek pasangan `ink/background` (lulus), `primary/background` (lulus), `accent/background` (4.6:1 — lulus, tapi accent **tidak untuk body text**).
- Focus ring visible di semua interaktif.
- Semua ikon interaktif punya `aria-label`.
- Navigasi keyboard penuh termasuk drawer & modal.
- Gambar punya alt text bermakna.
- Prefers-reduced-motion → matikan reveal & counter.

---

## 12. Penerapan Hybrid per Halaman

| Halaman | Markas Digital | Balai Modern | Pemuda Cipedak |
|---|---|---|---|
| Beranda | Hero bento + stat strip | Whitespace antar section | Kolase 3 foto di tile hero |
| Tentang | Periode tile + struktur grid | Narasi panjang max-w 880 | Foto pengurus 1:1 grid |
| Program | 6 bidang sebagai bento tile | — | Ikon duotone gold |
| Kegiatan | Filter chip + grid tile | — | Featured event magazine |
| Berita | List grid tile | — | **Editorial featured + 4 secondary (dominan)** |
| Galeri | Album sebagai tile | — | **Kolase masonry + lightbox (dominan)** |
| LPJ | Tile per tahun + filter periode | **Tabel formal max-w 880 (dominan)** | — |
| Kontak | Tile per kanal (WA, Email, Maps, IG, YT) | Sangat tenang, banyak whitespace | — |
| /admin | Bento dashboard | Tabel formal | — *(tidak digunakan di admin)* |

---

## 13. Design Tokens — Daftar Akhir (untuk fase build)

Akan diimplementasikan di `src/styles.css` saat build mode. Contoh nama token:
`--color-primary`, `--color-accent`, `--color-ink`, `--color-ink-muted`, `--color-surface`, `--color-border`, `--shadow-tile`, `--shadow-tile-hover`, `--radius-tile`, `--font-heading`, `--font-body`, `--motion-fast`, `--motion-base`, `--ease-out`.

Catatan: token akan dikonversi ke format **oklch** sesuai konvensi template saat build, value visual final mengikuti tabel Color di atas.

---

## 14. Definition of Done — Visual

- Semua 8 halaman publik mengikuti pola bento + section-header + photography rule.
- Gold muncul hanya pada: CTA "Daftar via WA", badge periode aktif, badge "Terverifikasi", divider formal LPJ. **Maks 3 instance per viewport.**
- Batik overlay hanya di public, opacity 4%, tidak pernah di admin.
- Plus Jakarta Sans & Inter ter-load via `<link>` di `__root.tsx` (bukan @import di CSS).
- Semua motion ≤ 200ms ease-out, reduced-motion dihormati.
- Lighthouse target: Performance ≥ 90, A11y ≥ 95, SEO ≥ 95.
- Zero gambar AI sebagai konten publik utama.

---

## 15. Langkah Berikutnya

Visual Design Final ini siap dijadikan dasar build. Mohon konfirmasi salah satu:

1. **Lock Visual Design Final** → lanjut ke setup project skeleton (TanStack Start + Supabase wiring + tokens di `styles.css` + font loading) — **belum membangun halaman**.
2. **Revisi** spesifik (mis. ubah ratio hero, ganti behavior gold, tambah komponen).
3. **Buat prototype HTML** 1 halaman (Beranda) sebagai bukti visual sebelum build penuh.

Saya tetap di plan mode sampai Anda memilih.
