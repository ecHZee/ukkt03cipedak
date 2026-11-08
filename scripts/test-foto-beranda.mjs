import test from "node:test";
import assert from "node:assert/strict";
import { muatTypescript } from "./helpers/muat-typescript.mjs";

const { urlFotoBeranda } = await muatTypescript("src/lib/foto-beranda.ts");
const { layaniFotoBeranda } = await muatTypescript("src/services/foto-beranda.server.ts", {
  "@supabase/supabase-js": {
    createClient: () => {
      throw Error("Tes tidak boleh membuka jaringan.");
    },
  },
});
const path =
  "pengaturan/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp";
const url = "https://contoh.invalid/media/situs/" + path;
const byte = new TextEncoder().encode("RIFF1234WEBPdata");
const asal = (headers = {}, status = 200) =>
  new Response(byte, {
    status,
    headers: { "content-type": "image/webp", "content-length": String(byte.length), ...headers },
  });
function batas({ aktif = path, hit = false, gagalCache = false, response = asal } = {}) {
  const panggilan = { aktif: 0, baca: 0, match: 0, put: 0 };
  let tersimpan;
  return {
    panggilan,
    tersimpan: () => tersimpan,
    opsi: {
      aktif: async () => {
        panggilan.aktif++;
        return aktif;
      },
      baca: async (p, method) => {
        assert.equal(p, path);
        assert.ok(["GET", "HEAD"].includes(method));
        panggilan.baca++;
        return response();
      },
      cache: {
        match: async (key) => {
          panggilan.match++;
          assert.equal(new URL(key.url).pathname, "/media/situs/" + path);
          return hit
            ? asal({ "set-cookie": "tidak-boleh-dikirim", "cache-control": "public" })
            : undefined;
        },
        put: async (_key, r) => {
          panggilan.put++;
          if (gagalCache) throw Error("Cache tidak tersedia.");
          tersimpan = {
            cache: r.headers.get("cache-control"),
            byte: [...new Uint8Array(await r.arrayBuffer())],
          };
        },
      },
    },
  };
}

test("alamat foto hanya menerima path aset Pengaturan, bukan URL/profil/path bebas", () => {
  assert.equal(urlFotoBeranda(path), "/media/situs/" + path);
  for (const p of [
    null,
    undefined,
    "",
    "https://asing.invalid/a.webp",
    "profil/a.webp",
    "../a.webp",
    path + "?x=1",
    path.replace(".webp", ".svg"),
  ]) {
    assert.equal(urlFotoBeranda(p), null);
  }
});

test("POST ditolak sebelum membaca pengaturan/cache/Storage", async () => {
  const b = batas();
  assert.equal(
    (await layaniFotoBeranda(new Request(url, { method: "POST" }), {}, b.opsi)).status,
    405,
  );
  assert.deepEqual(b.panggilan, { aktif: 0, baca: 0, match: 0, put: 0 });
});

test("path tidak sah ditolak sebelum akses jaringan", async () => {
  const b = batas();
  assert.equal(
    (await layaniFotoBeranda(new Request(url.replace(".webp", ".png")), {}, b.opsi)).status,
    404,
  );
  assert.equal(b.panggilan.aktif, 0);
});

test("foto yang dicabut/berganti ditolak sebelum cache lama dibaca", async () => {
  const b = batas({ aktif: null, hit: true });
  const r = await layaniFotoBeranda(new Request(url), {}, b.opsi);
  assert.equal(r.status, 404);
  assert.equal(b.panggilan.match, 0);
  assert.equal(b.panggilan.baca, 0);
  assert.equal(r.headers.get("cache-control"), "no-store");
});

test("pengaturan berbeda tidak membuka foto lama meskipun pemanggil membawa sesi", async () => {
  const b = batas({ aktif: path.replace("2222", "3333"), hit: true });
  const r = await layaniFotoBeranda(
    new Request(url, { headers: { Cookie: "sesi=uji", Authorization: "Bearer sintetis" } }),
    {},
    b.opsi,
  );
  assert.equal(r.status, 404);
  assert.equal(b.panggilan.match, 0);
});

test("gagal memeriksa pengaturan mengembalikan503 tanpa menyajikan cache", async () => {
  const b = batas({ hit: true });
  b.opsi.aktif = async () => {
    throw Error("DB gagal");
  };
  const r = await layaniFotoBeranda(new Request(url), {}, b.opsi);
  assert.equal(r.status, 503);
  assert.equal(b.panggilan.match, 0);
});

test("cache HIT mempertahankan byte, no-store keluar dan tidak meneruskan cookie asal", async () => {
  const b = batas({ hit: true });
  const r = await layaniFotoBeranda(new Request(url), {}, b.opsi);
  assert.equal(r.headers.get("X-Katar-Foto-Cache"), "HIT");
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.equal(r.headers.get("set-cookie"), null);
  assert.deepEqual([...new Uint8Array(await r.arrayBuffer())], [...byte]);
  assert.equal(b.panggilan.baca, 0);
});

test("cache MISS menyimpan hanya byte immutable, respons pengunjung tetap no-store", async () => {
  const b = batas();
  const r = await layaniFotoBeranda(new Request(url), {}, b.opsi);
  assert.equal(r.headers.get("X-Katar-Foto-Cache"), "MISS");
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.deepEqual([...new Uint8Array(await r.arrayBuffer())], [...byte]);
  assert.match(b.tersimpan().cache, /immutable/);
  assert.deepEqual(b.tersimpan().byte, [...byte]);
});

test("HEAD pada cache hangat tidak membawa body", async () => {
  const b = batas({ hit: true });
  const r = await layaniFotoBeranda(new Request(url, { method: "HEAD" }), {}, b.opsi);
  assert.equal((await r.arrayBuffer()).byteLength, 0);
  assert.equal(r.headers.get("content-length"), String(byte.length));
});

test("HEAD pada cache kosong tidak menyimpan body kosong sebagai gambar", async () => {
  const b = batas();
  const r = await layaniFotoBeranda(new Request(url, { method: "HEAD" }), {}, b.opsi);
  assert.equal(r.status, 200);
  assert.equal((await r.arrayBuffer()).byteLength, 0);
  assert.equal(b.panggilan.put, 0);
});

for (const [label, response] of [
  ["MIME HTML", () => asal({ "content-type": "text/html" })],
  ["status asal gagal", () => asal({}, 403)],
  ["gambar di atas batas2MiB", () => asal({ "content-length": String(2 * 1024 * 1024 + 1) })],
  ["ukuran kosong", () => asal({ "content-length": "0" })],
]) {
  test(label + " ditolak dan tidak dimasukkan cache", async () => {
    const b = batas({ response });
    assert.equal((await layaniFotoBeranda(new Request(url), {}, b.opsi)).status, 404);
    assert.equal(b.panggilan.put, 0);
  });
}

test("kegagalan cache put tidak menggagalkan foto yang valid", async () => {
  const b = batas({ gagalCache: true });
  const r = await layaniFotoBeranda(new Request(url), {}, b.opsi);
  assert.equal(r.status, 200);
  assert.equal((await r.arrayBuffer()).byteLength, byte.length);
});
