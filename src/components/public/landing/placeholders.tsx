/**
 * Daftar URL placeholder yang HARUS diganti dengan dokumentasi asli
 * Karang Taruna RW 03 Cipedak. Pakai picsum.photos dengan seed untuk
 * deterministik selama development.
 *
 * Saat foto asli tersedia:
 * 1. Upload via CLI `lovable-assets create --file <path>`.
 * 2. Ganti URL di sini.
 */
const p = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/ktrw03-${seed}/${w}/${h}`;

export const PLACEHOLDERS = {
  hero: p("hero", 1600, 900),
  about: p("about", 900, 700),
  kegiatan: [
    { src: p("keg-futsal", 800, 600), alt: "Futsal Rutin (placeholder)" },
    { src: p("keg-kerjabakti", 800, 600), alt: "Kerja Bakti Mingguan (placeholder)" },
    { src: p("keg-pawai", 800, 600), alt: "Pawai Obor Ramadhan (placeholder)" },
  ],
  beritaFeatured: { src: p("ber-1", 1200, 800), alt: "Berita utama (placeholder)" },
  berita: [
    { src: p("ber-2", 600, 400), alt: "Berita pendukung 1 (placeholder)" },
    { src: p("ber-3", 600, 400), alt: "Berita pendukung 2 (placeholder)" },
    { src: p("ber-4", 600, 400), alt: "Berita pendukung 3 (placeholder)" },
    { src: p("ber-5", 600, 400), alt: "Berita pendukung 4 (placeholder)" },
  ],
  galeri: [
    { src: p("gal-1", 600, 600), alt: "Galeri 1 (placeholder)" },
    { src: p("gal-2", 600, 800), alt: "Galeri 2 (placeholder)" },
    { src: p("gal-3", 600, 600), alt: "Galeri 3 (placeholder)" },
    { src: p("gal-4", 600, 700), alt: "Galeri 4 (placeholder)" },
    { src: p("gal-5", 600, 600), alt: "Galeri 5 (placeholder)" },
    { src: p("gal-6", 600, 800), alt: "Galeri 6 (placeholder)" },
  ],
};

/**
 * Untuk Sprint 1B/konten: daftar yang perlu diganti.
 * Ditarik oleh halaman /admin/settings saat tooling siap.
 */
export const PLACEHOLDER_INVENTORY = [
  { key: "hero", description: "Foto hero — kegiatan rame, ukuran 1600×900, landscape" },
  { key: "about", description: "Foto/ilustrasi untuk preview Tentang Kami, ratio 4:3" },
  { key: "kegiatan[3]", description: "3 foto kegiatan terbaru (Futsal, Kerja Bakti, Pawai)" },
  { key: "beritaFeatured", description: "Cover berita utama 1200×800" },
  { key: "berita[4]", description: "4 cover berita pendukung 3:2" },
  { key: "galeri[6]", description: "6 foto galeri preview (mix portrait/square)" },
  { key: "logo", description: "Logo organisasi (saat ini lambang KT placeholder)" },
];
