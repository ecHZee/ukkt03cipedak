import assert from "node:assert/strict";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Jalankan service asli dengan transport Supabase terisolasi, tanpa kredensial/data produksi.
const source = ts.transpileModule(
  readFileSync(new URL("../src/services/konten.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } },
).outputText;
async function service(baris, gagal = false, alamatSampul) {
  const calls = [];
  const supabase = {
    from(tabel) {
      const filter = {};
      calls.push({ tabel, filter });
      const chain = {
        select() {
          return chain;
        },
        eq(k, v) {
          filter[k] = v;
          return chain;
        },
        order() {
          return chain;
        },
        then(resolve, reject) {
          const cocok = baris && Object.entries(filter).every(([k, v]) => baris[k] === v);
          return Promise.resolve({
            data: cocok ? [baris] : [],
            error: gagal ? { message: "koneksi terputus" } : null,
          }).then(resolve, reject);
        },
        async maybeSingle() {
          const cocok = baris && Object.entries(filter).every(([k, v]) => baris[k] === v);
          return {
            data: cocok ? baris : null,
            error: gagal ? { message: "koneksi terputus" } : null,
          };
        },
      };
      return chain;
    },
  };
  const client = new vm.SyntheticModule(["supabase"], function () {
    this.setExport("supabase", supabase);
  });
  const storage = new vm.SyntheticModule(["urlPublik"], function () {
    this.setExport("urlPublik", (_bucket, path) => alamatSampul ?? `https://media.invalid/${path}`);
  });
  const mod = new vm.SourceTextModule(source);
  const nilaiPengaturan = await muatTypescript("src/lib/pengaturan-admin.ts");
  const pengaturan = new vm.SyntheticModule(Object.keys(nilaiPengaturan), function () {
    for (const [k, v] of Object.entries(nilaiPengaturan)) this.setExport(k, v);
  });
  await mod.link((specifier) => {
    if (specifier === "@/integrations/supabase/client") return client;
    if (specifier === "@/services/storage") return storage;
    if (specifier === "@/lib/pengaturan-admin") return pengaturan;
    throw new Error(`Import tak terduga: ${specifier}`);
  });
  await mod.evaluate();
  return { api: mod.namespace, calls };
}

const contoh = {
  id: "konten-uji",
  slug: "kabar-uji",
  judul: "Judul asli",
  status: "terbit",
  ringkasan: "Ringkasan",
  isi: "Paragraf pertama\n\nParagraf kedua",
  mulai: "2026-10-18T19:30:00+07:00",
  selesai: null,
  rutin: null,
  lokasi: "Pos RW",
  tahap: "rencana",
  terbit_at: null,
  pinned: false,
  bidang: { slug: "media", nama_singkat: "Media" },
  cover: { jenis: "foto", storage_path: "media/uji.webp", caption: "Keterangan" },
};

test("sampul B2 memakai gateway publik; staging dan path luar ditolak", async () => {
  const prefix = "/media/galeri/umum/11111111-1111-4111-8111-111111111111/";
  const valid = prefix + "22222222-2222-4222-8222-222222222222.webp";
  const { api } = await service(contoh, false, valid);
  assert.equal((await api.ambilBeritaSlug(contoh.slug)).sampul.url, valid);
  for (const url of [
    "/media/galeri/staging/11111111-1111-4111-8111-111111111111/foto.webp",
    prefix + "../../rahasia.webp",
    "//asing.invalid/foto.webp",
    "javascript:alert(1)",
  ]) {
    const s = await service(contoh, false, url);
    assert.equal((await s.api.ambilBeritaSlug(contoh.slug)).sampul, null);
  }
});

test("daftar berita mengirim sampul asli dan tetap membatasi status terbit", async () => {
  const { api, calls } = await service(contoh);
  const rows = await api.ambilBerita();
  assert.equal(rows[0].sampul.url, "https://media.invalid/media/uji.webp");
  assert.equal(calls[0].filter.status, "terbit");
  const draf = await service({ ...contoh, status: "draft" });
  assert.equal((await draf.api.ambilBerita()).length, 0);
});

for (const [nama, tabel] of [
  ["ambilKegiatanSlug", "kegiatan"],
  ["ambilBeritaSlug", "berita"],
]) {
  test(`${tabel}: memuat isi, bidang, sampul dan filter terbit`, async () => {
    const { api, calls } = await service(contoh);
    const data = await api[nama](contoh.slug);
    assert.equal(data.isi, contoh.isi);
    assert.equal(data.namaBidang, "Media");
    assert.equal(data.sampul.url, "https://media.invalid/media/uji.webp");
    assert.equal(calls[0].tabel, tabel);
    assert.deepEqual(calls[0].filter, { slug: contoh.slug, status: "terbit" });
    assert.doesNotThrow(() => structuredClone(data));
  });
  test(`${tabel}: draft/review tidak bocor walaupun transport mengizinkan membaca semua status`, async () => {
    for (const status of ["draft", "review"]) {
      const { api } = await service({ ...contoh, status });
      assert.equal(await api[nama](contoh.slug), null);
    }
  });
  test(`${tabel}: penanda dummy diteruskan untuk noindex halaman detail`, async () => {
    const { api } = await service({ ...contoh, is_dummy: true });
    assert.equal((await api[nama](contoh.slug)).isDummy, true);
  });
  test(`${tabel}: slug hilang/invalid dan kegagalan jaringan dibedakan`, async () => {
    const { api, calls } = await service(null);
    assert.equal(await api[nama]("tidak-ada"), null);
    assert.equal(await api[nama]("../admin"), null);
    assert.equal(calls.length, 1);
    const failed = await service(null, true);
    await assert.rejects(() => failed.api[nama](contoh.slug), /Gagal memuat/);
  });
  test(`${tabel}: cover nonfoto tidak dipakai sebagai gambar OG`, async () => {
    const { api } = await service({ ...contoh, cover: { ...contoh.cover, jenis: "video" } });
    assert.equal((await api[nama](contoh.slug)).sampul, null);
  });
}

test("kegiatan rutin bertanggal hanya muncul sekali dalam pilihan beranda", async () => {
  const { api } = await service(null);
  const k = {
    id: "rutin-bertanggal",
    mulai: "2026-10-24T12:30:00Z",
    rutin: true,
    tahap: "rencana",
  };
  const pilihan = api.pilihKegiatanTerdekat([k], 3, new Date("2026-10-18T00:00:00Z"));
  assert.equal(pilihan.items.length, 1);
  assert.equal(pilihan.items[0].id, k.id);
});
