import assert from "node:assert/strict";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const transpile = (path) =>
  ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;

async function service(baris, error = null, path = "../src/services/konten.ts") {
  const calls = [];
  const client = new vm.SyntheticModule(["supabase"], function () {
    this.setExport("supabase", {
      from(tabel) {
        const call = { tabel, filter: {}, urutan: [], select: "" };
        calls.push(call);
        const hasil = () => ({
          data: Array.isArray(baris)
            ? baris.filter((b) => Object.entries(call.filter).every(([k, v]) => b[k] === v))
            : baris && Object.entries(call.filter).every(([k, v]) => baris[k] === v)
              ? baris
              : null,
          error,
        });
        const chain = {
          select(s) {
            call.select = s;
            return chain;
          },
          eq(k, v) {
            call.filter[k] = v;
            return chain;
          },
          order(k, opsi) {
            call.urutan.push([k, opsi]);
            return chain;
          },
          async maybeSingle() {
            return hasil();
          },
          then(resolve, reject) {
            return Promise.resolve(hasil()).then(resolve, reject);
          },
        };
        return chain;
      },
    });
  });
  const storage = new vm.SyntheticModule(["urlPublik"], function () {
    this.setExport("urlPublik", (_bucket, path) => (path ? `https://media.invalid/${path}` : null));
  });
  const mod = new vm.SourceTextModule(transpile(path));
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

const album = {
  id: "album-uji",
  slug: "album-terbit",
  status: "terbit",
  judul: "Album uji",
  deskripsi: "Deskripsi asli",
  tanggal: "2026-10-18",
  bidang: { slug: "media", nama_singkat: "Media" },
  cover: { jenis: "foto", storage_path: "media/cover.webp", caption: "Sampul asli" },
  media: [
    {
      id: "foto",
      jenis: "foto",
      storage_path: "media/01.webp",
      embed_url: null,
      caption: "<script>teks saja</script>",
      lebar: 1920,
      tinggi: 1280,
      mime: "image/webp",
    },
    {
      id: "video",
      jenis: "video",
      storage_path: "media/02.webm",
      embed_url: null,
      caption: null,
      lebar: null,
      tinggi: null,
      mime: "video/webm",
    },
    {
      id: "embed",
      jenis: "embed",
      storage_path: null,
      embed_url: "https://youtu.be/abcdefghijk",
      caption: null,
      lebar: null,
      tinggi: null,
      mime: null,
    },
  ],
};

test("album: data terbit, relasi FK eksplisit, urutan stabil dan plain object", async () => {
  const { api, calls } = await service(album);
  const a = await api.ambilAlbumSlug(album.slug);
  assert.deepEqual(calls[0].filter, { slug: album.slug, status: "terbit" });
  assert.match(calls[0].select, /media!media_album_id_fkey/);
  assert.match(calls[0].select, /media!album_cover_id_fkey/);
  assert.deepEqual(calls[0].urutan, [
    ["urutan", { referencedTable: "media", ascending: true }],
    ["id", { referencedTable: "media", ascending: true }],
  ]);
  assert.equal(a.jumlahMedia, 3);
  assert.equal(a.namaBidang, "Media");
  assert.equal(a.media[0].url, "https://media.invalid/media/01.webp");
  assert.equal(a.media[0].caption, album.media[0].caption);
  assert.equal(a.media[2].url, album.media[2].embed_url);
  assert.equal(a.sampul.url, "https://media.invalid/media/cover.webp");
  assert.doesNotThrow(() => structuredClone(a));
  assert.deepEqual(JSON.parse(JSON.stringify(a)), a);
});

test("album: draft/review tidak dibaca walaupun pemanggil admin", async () => {
  for (const status of ["draft", "review"]) {
    const { api } = await service({ ...album, status });
    assert.equal(await api.ambilAlbumSlug(album.slug), null);
  }
});

test("album: slug hilang/invalid berbeda dari gangguan query", async () => {
  const { api, calls } = await service(null);
  assert.equal(await api.ambilAlbumSlug("hilang"), null);
  assert.equal(await api.ambilAlbumSlug("../admin"), null);
  assert.equal(calls.length, 1);
  const gagal = await service(null, { message: "koneksi terputus" });
  await assert.rejects(() => gagal.api.ambilAlbumSlug(album.slug), /Gagal memuat isi album/);
});

test("album: kosong, tanggal/bidang null, cover video tidak menjadi foto", async () => {
  const { api } = await service({
    ...album,
    tanggal: null,
    bidang: null,
    cover: { ...album.cover, jenis: "video" },
    media: [],
  });
  const a = await api.ambilAlbumSlug(album.slug);
  assert.equal(a.jumlahMedia, 0);
  assert.equal(a.sampul, null);
  assert.equal(a.tahun, null);
  assert.equal(a.namaBidang, null);
});

test("album: 50 foto utuh tanpa menggandakan hitungan atau ikon di loader", async () => {
  const media = Array.from({ length: 50 }, (_, i) => ({ ...album.media[0], id: `foto-${i}` }));
  const { api } = await service({ ...album, media });
  const a = await api.ambilAlbumSlug(album.slug);
  assert.equal(a.media.length, 50);
  assert.equal(new Set(a.media.map((m) => m.id)).size, 50);
  assert.doesNotThrow(() => structuredClone(a));
});

test("daftar album: jumlah, cover dan filter terbit tetap eksplisit", async () => {
  const { api, calls } = await service([
    { ...album, media: [{ count: 50 }] },
    { ...album, status: "draft" },
  ]);
  const a = await api.ambilAlbum();
  assert.equal(a.length, 1);
  assert.equal(a[0].jumlahMedia, 50);
  assert.equal(a[0].tahun, 2026);
  assert.equal(a[0].sampul.caption, "Sampul asli");
  assert.deepEqual(calls[0].filter, { status: "terbit" });
});

test("video: YouTube watch/shorts, Instagram dan TikTok menjadi URL iframe penyedia", async () => {
  const { api } = await service(null, null, "../src/services/storage.ts");
  const baca = api.bacaLinkVideo;
  assert.equal(
    baca("https://youtu.be/abcdefghijk").embedUrl,
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  assert.equal(
    baca("https://www.youtube.com/watch?v=abcdefghijk&feature=share").penyedia,
    "youtube",
  );
  assert.equal(baca("https://m.youtube.com/shorts/abcdefghijk").penyedia, "youtube");
  assert.equal(
    baca("https://www.instagram.com/reel/Abc-123/").embedUrl,
    "https://www.instagram.com/reel/Abc-123/embed",
  );
  assert.equal(
    baca("https://www.tiktok.com/@akun/video/1234567890123456789").embedUrl,
    "https://www.tiktok.com/player/v1/1234567890123456789",
  );
  assert.equal(baca("https://www.tiktok.com/embed/v2/1234567890123456789").penyedia, "tiktok");
});

test("video: tolak skema, host tiruan, kredensial URL, port dan ID invalid", async () => {
  const { api } = await service(null, null, "../src/services/storage.ts");
  for (const link of [
    "javascript:alert(1)",
    "http://youtu.be/abcdefghijk",
    "https://evilyoutube.com/watch?v=abcdefghijk",
    "https://youtube.com.evil.test/watch?v=abcdefghijk",
    "https://user:password@youtube.com/watch?v=abcdefghijk",
    "https://youtube.com:8443/watch?v=abcdefghijk",
    "https://youtube.com/watch?v=abc%22%3E",
    "https://instagram.com.evil.test/reel/Abc/",
    "https://tiktok.com/@akun/video/tidak-valid",
    "https://example.com/video/123",
  ]) {
    assert.equal(api.bacaLinkVideo(link), null, link);
  }
});
