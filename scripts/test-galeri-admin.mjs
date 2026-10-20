import assert from "node:assert/strict";
import test from "node:test";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
const lib = await muatTypescript("src/lib/galeri-admin.ts");
const id = "10000000-0000-4000-8000-000000000001";
const dasar = {
  judul: "Dokumentasi",
  slug: "dokumentasi",
  deskripsi: "",
  bidang_id: null,
  tanggal: null,
  status: "draft",
  gdrive_url: "",
};
test("Folder Drive dinormalisasi tanpa parameter berbagi", () => {
  assert.equal(
    lib.folderDrive("https://drive.google.com/drive/u/0/folders/abc_123?usp=sharing"),
    "https://drive.google.com/drive/folders/abc_123",
  );
  for (const s of [
    "http://drive.google.com/drive/folders/abc",
    "https://drive.google.com.evil.invalid/drive/folders/abc",
    "https://u:p@drive.google.com/drive/folders/abc",
    "https://drive.google.com/file/d/abc/view",
    "javascript:alert(1)",
  ])
    assert.equal(lib.folderDrive(s), null);
});
test("Form album menolak tanggal palsu, slug liar dan versi hilang", () => {
  assert.equal(lib.formulirAlbum.safeParse(dasar).success, true);
  for (const delta of [
    { tanggal: "2026-02-31" },
    { id },
    { slug: "../x" },
    { unknown: true },
    { gdrive_url: "https://evil.invalid" },
  ])
    assert.equal(lib.formulirAlbum.safeParse({ ...dasar, ...delta }).success, false);
});
test("File album kosong, HEIC dan file terlalu besar ditolak", () => {
  for (const f of [
    { type: "image/jpeg", size: 0 },
    { type: "image/heic", size: 100 },
    { type: "image/jpeg", size: lib.BATAS_GALERI.foto + 1 },
    { type: "video/mp4", size: lib.BATAS_GALERI.video + 1 },
  ])
    assert.throws(() => lib.cekFileAlbum(f));
  for (const type of [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ])
    assert.doesNotThrow(() => lib.cekFileAlbum({ type, size: 100 }));
});
test("Reservasi hanya menerima ukuran/format yang sesuai; path tidak berasal browser", () => {
  const r = {
    album_id: id,
    hash_sumber: "a".repeat(64),
    jenis: "foto",
    mime: "image/webp",
    ukuran_bytes: 100,
    thumb_bytes: 50,
    lebar: 100,
    tinggi: 100,
    caption: "",
  };
  assert.equal(lib.reservasiAlbum.safeParse(r).success, true);
  for (const d of [
    { mime: "video/mp4" },
    { thumb_bytes: null },
    { lebar: 1921 },
    { ukuran_bytes: lib.BATAS_GALERI.foto + 1 },
    { staging_path: "palsu" },
    { hash_sumber: "x" },
  ])
    assert.equal(lib.reservasiAlbum.safeParse({ ...r, ...d }).success, false);
});
const gateway = await muatTypescript("src/services/media-gateway.server.ts", {
  "./b2.server": {
    bacaB2() {
      throw new Error("Tes tidak boleh memakai B2 asli");
    },
  },
});

async function layananCleanup(expiry, { gagalHapus = false, aktif = true } = {}) {
  const jejak = { hapusRow: 0, hapusObjek: 0, rpc: 0 };
  const row = {
    id,
    album_id: id,
    created_by: id,
    status: "batal",
    put_berlaku_sampai: expiry,
    staging_path: `galeri/staging/${id}/${id}/${id}.webp`,
    final_path: `galeri/media/${id}/${id}.webp`,
    mime: "image/webp",
    ukuran_bytes: 100,
    thumb_bytes: 50,
  };
  const chain = (hasil) => {
    const c = {
      select: () => c,
      eq: () => c,
      maybeSingle: async () => hasil,
      single: async () => hasil,
      then: (r, j) => Promise.resolve(hasil).then(r, j),
    };
    return c;
  };
  const admin = {
    from() {
      return {
        select: () => chain({ data: [row], error: null }),
        delete() {
          jejak.hapusRow++;
          return chain({ error: null });
        },
      };
    },
  };
  const db = {
    from(t) {
      return chain({
        error: null,
        data:
          t === "profiles"
            ? { id, role: "admin", bidang_id: null, izin_kontribusi: false, aktif }
            : { id, created_by: id, bidang_id: null, status: "draft" },
      });
    },
    async rpc() {
      jejak.rpc++;
      return { data: {}, error: null };
    },
  };
  const server = await muatTypescript("src/services/galeri-admin.server.ts", {
    "@/integrations/supabase/client.server": { supabaseAdmin: admin },
    "./storage": { bacaLinkVideo: () => null },
    "./b2.server": {
      tandaGetB2() {},
      tandaPutB2() {},
      finalkanObjekB2() {},
      pastikanB2Siap() {},
      async bersihkanObjekB2() {
        jejak.hapusObjek++;
        if (gagalHapus) throw new Error("B2 sementara putus");
      },
    },
  });
  return { server, db, jejak };
}
test("Cleanup mempertahankan jejak sampai URL PUT terakhir kedaluwarsa", async () => {
  const t = await layananCleanup(new Date(Date.now() + 300_000).toISOString());
  const hasil = await t.server.aturMediaAlbum(t.db, id, {
    album_id: id,
    versi: new Date().toISOString(),
    aksi: "bersihkan",
  });
  assert.equal(t.jejak.hapusObjek, 1);
  assert.equal(t.jejak.hapusRow, 0);
  assert.match(hasil.peringatan, /kedaluwarsa/);
});
test("Cleanup menghapus jejak kedaluwarsa sesudah objek bersih; gagal B2 mempertahankan jejak", async () => {
  const t = await layananCleanup(new Date(Date.now() - 1000).toISOString());
  const hasil = await t.server.aturMediaAlbum(t.db, id, {
    album_id: id,
    versi: new Date().toISOString(),
    aksi: "bersihkan",
  });
  assert.equal(t.jejak.hapusRow, 1);
  assert.equal(hasil.peringatan, null);
  const gagal = await layananCleanup(new Date(Date.now() - 1000).toISOString(), {
    gagalHapus: true,
  });
  await assert.rejects(() =>
    gagal.server.aturMediaAlbum(gagal.db, id, {
      album_id: id,
      versi: new Date().toISOString(),
      aksi: "bersihkan",
    }),
  );
  assert.equal(gagal.jejak.hapusRow, 0);
});
test("Akun nonaktif ditolak server sebelum mutasi/cleanup B2", async () => {
  const t = await layananCleanup(new Date().toISOString(), { aktif: false });
  await assert.rejects(() =>
    t.server.aturMediaAlbum(t.db, id, {
      album_id: id,
      versi: new Date().toISOString(),
      aksi: "bersihkan",
    }),
  );
  assert.equal(t.jejak.rpc, 0);
  assert.equal(t.jejak.hapusObjek, 0);
});
const path = `galeri/media/${id}/${id}.webp`,
  url = `https://ukkt03cipedak.pages.dev/media/${path}`;
function cachePalsu() {
  const isi = new Map();
  let lookup = 0;
  return {
    isi,
    get lookup() {
      return lookup;
    },
    async match(k) {
      lookup++;
      return isi.get(k.url)?.clone();
    },
    async put(k, r) {
      isi.set(k.url, new Response(await r.arrayBuffer(), { status: r.status, headers: r.headers }));
    },
  };
}
test("GET kedua memakai cache tanpa membaca B2 lagi", async () => {
  const cache = cachePalsu(),
    tugas = [];
  let baca = 0,
    cek = 0;
  const opsi = {
    cache,
    publik: async () => {
      cek++;
      return true;
    },
    baca: async () => {
      baca++;
      return new Response("RIFFtestWEBP", {
        headers: { "content-type": "image/webp", "content-length": "12" },
      });
    },
  };
  const ctx = { waitUntil: (p) => tugas.push(p) };
  const a = await gateway.layaniMedia(new Request(url), ctx, opsi);
  assert.equal(a.headers.get("X-Katar-Media-Cache"), "MISS");
  await a.text();
  await Promise.all(tugas);
  const b = await gateway.layaniMedia(new Request(url), ctx, opsi);
  assert.equal(b.headers.get("X-Katar-Media-Cache"), "HIT");
  assert.equal(b.headers.get("Cache-Control"), "no-store");
  await b.text();
  assert.equal(baca, 1);
  assert.equal(cek, 2);
});
test("Album ditarik tetap 404 walaupun cache berisi objek", async () => {
  const cache = cachePalsu();
  cache.isi.set(url, new Response("privat"));
  const r = await gateway.layaniMedia(
    new Request(url),
    {},
    {
      cache,
      publik: async () => false,
      baca: async () => {
        throw new Error("B2 tidak boleh dibaca");
      },
    },
  );
  assert.equal(r.status, 404);
  assert.equal(cache.lookup, 0);
});
test("Path staging, SSRF, traversal dan metode tulis tidak menyentuh DB/B2", async () => {
  const opsi = {
    publik: async () => {
      throw new Error("DB tidak boleh dibaca");
    },
  };
  for (const target of [
    "/media/galeri/staging/a.webp",
    "/media/https://evil.invalid/x",
    "/media/galeri/../x.webp",
  ]) {
    const r = await gateway.layaniMedia(new Request("https://example.invalid" + target), {}, opsi);
    assert.equal(r.status, 404);
  }
  assert.equal(
    (await gateway.layaniMedia(new Request(url, { method: "POST" }), {}, opsi)).status,
    405,
  );
});
test("HEAD tanpa body dan Range dingin diteruskan; multipart range ditolak", async () => {
  const panggilan = [],
    opsi = {
      publik: async () => true,
      baca: async (p, m, r) => {
        panggilan.push([p, m, r]);
        return new Response(m === "HEAD" ? null : "abc", {
          status: r ? 206 : 200,
          headers: {
            "content-type": "image/webp",
            "content-length": "3",
            ...(r ? { "content-range": "bytes 0-2/12" } : {}),
          },
        });
      },
    };
  const head = await gateway.layaniMedia(new Request(url, { method: "HEAD" }), {}, opsi);
  assert.equal(await head.text(), "");
  assert.equal(panggilan[0][1], "HEAD");
  const range = await gateway.layaniMedia(
    new Request(url, { headers: { Range: "bytes=0-2" } }),
    {},
    opsi,
  );
  assert.equal(range.status, 206);
  assert.equal(await range.text(), "abc");
  assert.equal(panggilan[1][2], "bytes=0-2");
  const salah = await gateway.layaniMedia(
    new Request(url, { headers: { Range: "bytes=0-1,3-4" } }),
    {},
    opsi,
  );
  assert.equal(salah.status, 416);
  assert.equal(panggilan.length, 2);
});
test("Error pemeriksaan izin gagal tertutup dan MIME asal liar tidak dilayani", async () => {
  const gagal = await gateway.layaniMedia(
    new Request(url),
    {},
    {
      publik: async () => {
        throw new Error("offline");
      },
    },
  );
  assert.equal(gagal.status, 503);
  const liar = await gateway.layaniMedia(
    new Request(url),
    {},
    {
      publik: async () => true,
      baca: async () => new Response("<script>", { headers: { "content-type": "text/html" } }),
    },
  );
  assert.equal(liar.status, 404);
});
test("Presigned PUT dibatasi staging, expiry 5 menit dan Content-Type ditandatangani", async () => {
  const keys = ["B2_KEY_ID", "B2_APPLICATION_KEY", "B2_BUCKET", "B2_ENDPOINT"],
    lama = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  Object.assign(process.env, {
    B2_KEY_ID: "UJI_ID_BUKAN_KEY_ASLI",
    B2_APPLICATION_KEY: "UJI_SECRET_BUKAN_KEY_ASLI",
    B2_BUCKET: "katar-rw03-media",
    B2_ENDPOINT: "https://s3.us-west-004.backblazeb2.com",
  });
  try {
    const b2 = await muatTypescript("src/services/b2.server.ts");
    await assert.rejects(() => b2.tandaPutB2(path, "image/webp"));
    const u = new URL(await b2.tandaPutB2(`galeri/staging/${id}/${id}/${id}.webp`, "image/webp"));
    assert.equal(u.searchParams.get("X-Amz-Expires"), "300");
    assert.match(u.searchParams.get("X-Amz-SignedHeaders"), /content-type/);
    assert.equal(u.hostname, "s3.us-west-004.backblazeb2.com");
  } finally {
    for (const k of keys)
      if (lama[k] === undefined) delete process.env[k];
      else process.env[k] = lama[k];
  }
});

async function denganB2Palsu(fetch, jalankan) {
  const keys = ["B2_KEY_ID", "B2_APPLICATION_KEY", "B2_BUCKET", "B2_ENDPOINT"],
    lama = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  Object.assign(process.env, {
    B2_KEY_ID: "UJI_ID",
    B2_APPLICATION_KEY: "UJI_SECRET",
    B2_BUCKET: "katar-rw03-media",
    B2_ENDPOINT: "https://s3.us-west-004.backblazeb2.com",
  });
  try {
    const b2 = await muatTypescript("src/services/b2.server.ts", {
      aws4fetch: {
        AwsClient: class {
          fetch = fetch;
        },
      },
    });
    await jalankan(b2);
  } finally {
    for (const k of keys)
      if (lama[k] === undefined) delete process.env[k];
      else process.env[k] = lama[k];
  }
}
test("Hapus B2 menghapus versi/marker persis path, mengikuti pagination tanpa menghapus prefix lain", async () => {
  const daftar = [],
    hapus = [];
  await denganB2Palsu(
    async (u, init) => {
      const url = new URL(u);
      if (init?.method === "DELETE") {
        hapus.push([url.pathname, url.searchParams.get("versionId")]);
        return new Response(null, { status: 204 });
      }
      daftar.push(url);
      return new Response(
        daftar.length === 1
          ? `<ListVersionsResult><IsTruncated>true</IsTruncated><NextKeyMarker>${path}</NextKeyMarker><NextVersionIdMarker>v1</NextVersionIdMarker><Version><Key>${path}</Key><VersionId>v1</VersionId></Version><Version><Key>${path}-milik-lain</Key><VersionId>asing</VersionId></Version></ListVersionsResult>`
          : `<ListVersionsResult><IsTruncated>false</IsTruncated><DeleteMarker><Key>${path}</Key><VersionId>v2&amp;id</VersionId></DeleteMarker></ListVersionsResult>`,
      );
    },
    async (b2) => b2.hapusB2(path),
  );
  assert.equal(daftar.length, 2);
  assert.equal(daftar[0].searchParams.get("prefix"), path);
  assert.equal(daftar[1].searchParams.get("version-id-marker"), "v1");
  assert.deepEqual(hapus, [
    [`/katar-rw03-media/${path}`, "v1"],
    [`/katar-rw03-media/${path}`, "v2&id"],
  ]);
});
test("Listing versi gagal tidak dianggap cleanup berhasil dan tidak mengirim DELETE", async () => {
  for (const response of [
    () => new Response("gangguan", { status: 503 }),
    () => new Response("<Error>bad</Error>"),
  ]) {
    let del = 0;
    await denganB2Palsu(
      async (u, init) => {
        if (init?.method === "DELETE") del++;
        return response();
      },
      async (b2) => assert.rejects(() => b2.hapusB2(path), /belum dapat dibersihkan/),
    );
    assert.equal(del, 0);
  }
});

test("Bacaan B2 bertanda tangan melewati cache fetch; metode HEAD dan Range tetap", async () => {
  const keys = ["B2_KEY_ID", "B2_APPLICATION_KEY", "B2_BUCKET", "B2_ENDPOINT"];
  const lama = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  const calls = [];
  Object.assign(process.env, {
    B2_KEY_ID: "ID_UJI",
    B2_APPLICATION_KEY: "RAHASIA_SINTETIS",
    B2_BUCKET: "katar-rw03-media",
    B2_ENDPOINT: "https://s3.us-west-004.backblazeb2.com",
  });
  try {
    const b2 = await muatTypescript("src/services/b2.server.ts", {
      aws4fetch: {
        AwsClient: class {
          async fetch(url, init) {
            calls.push({ url: url.toString(), init });
            return new Response(null, { headers: { "content-type": "image/webp" } });
          }
        },
      },
    });
    await b2.bacaB2(`galeri/umum/${id}/${id}.webp`, "HEAD");
    await b2.bacaB2(`galeri/umum/${id}/${id}.webp`, "GET", "bytes=0-31");
    assert.equal(calls[0].init.method, "HEAD");
    assert.equal(calls[1].init.method, "GET");
    assert.equal(calls[1].init.headers.Range, "bytes=0-31");
    assert.ok(calls.every((c) => c.init.cache === "no-store"));
    assert.ok(
      calls.every((c) =>
        c.url.startsWith("https://s3.us-west-004.backblazeb2.com/katar-rw03-media/"),
      ),
    );
  } finally {
    for (const k of keys) {
      if (lama[k] === undefined) delete process.env[k];
      else process.env[k] = lama[k];
    }
  }
});
