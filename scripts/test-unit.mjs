import { spawnSync } from "node:child_process";

// Daftar eksplisit: glob test-*.mjs juga memilih suite DB yang menulis fixture nyata.
// Tambahkan hanya tes sumber/fixture tanpa jaringan. Integrasi DB dijalankan terpisah.
const files = [
  "test-berita-admin.mjs",
  "test-bersihkan-run.mjs",
  "test-filter-proxy.mjs",
  "test-foto-beranda.mjs",
  "test-galeri-admin.mjs",
  "test-galeri.mjs",
  "test-hari20.mjs",
  "test-kegiatan-admin.mjs",
  "test-ketahanan-akun.mjs",
  "test-konten-detail.mjs",
  "test-organisasi.mjs",
  "test-pengaturan.mjs",
  "test-pratinjau-media.mjs",
  "test-publik-awal.mjs",
  "test-seo.mjs",
  "test-tautan-konten.mjs",
];
const result = spawnSync(
  process.execPath,
  [
    "--experimental-vm-modules",
    "--experimental-strip-types",
    "--test",
    ...files.map((f) => `scripts/${f}`),
  ],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
