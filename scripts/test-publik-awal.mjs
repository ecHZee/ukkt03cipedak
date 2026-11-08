import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";
import { muatTypescript } from "./helpers/muat-typescript.mjs";

async function muat(file, mocks, impor = () => {}) {
  const cache = new Map();
  async function modul(s) {
    if (cache.has(s)) return cache.get(s);
    assert.ok(Object.hasOwn(mocks, s), `Impor tidak diharapkan: ${s}`);
    const values = mocks[s];
    const m = new vm.SyntheticModule(Object.keys(values), function () {
      for (const [k, v] of Object.entries(values)) this.setExport(k, v);
    });
    cache.set(s, m);
    await m.link(() => {
      throw new Error("Mock tidak boleh memuat dependensi lain");
    });
    await m.evaluate();
    return m;
  }
  const source = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const m = new vm.SourceTextModule(source, {
    importModuleDynamically: async (s) => {
      impor(s);
      return modul(s);
    },
  });
  await m.link(modul);
  await m.evaluate();
  return m.namespace;
}
const middleware = { createMiddleware: () => ({ client: (handler) => handler }) };
const serverFn = {
  createServerFn: (opsi) => {
    assert.equal(opsi.method, "GET");
    return { handler: (fn) => fn };
  },
};

test("RPC menunda SDK sampai dipanggil dan membaca token terbaru setiap permintaan", async () => {
  let token = "fixture-token-pertama";
  const imports = [];
  const api = await muat(
    "src/lib/otentikasi-rpc.ts",
    {
      "@tanstack/react-start": middleware,
      "@/integrations/supabase/client": {
        supabase: {
          auth: {
            getSession: async () => ({ data: { session: { access_token: token } } }),
          },
        },
      },
    },
    (s) => imports.push(s),
  );
  assert.equal(imports.length, 0);
  let headers;
  const next = (x) => {
    headers = x.headers;
    return "hasil";
  };
  assert.equal(await api.lampirkanSesiRpc({ next }), "hasil");
  assert.equal(headers.Authorization, "Bearer fixture-token-pertama");
  token = "fixture-token-kedua";
  await api.lampirkanSesiRpc({ next });
  assert.equal(headers.Authorization, "Bearer fixture-token-kedua");
  assert.equal(imports.length, 2);
});

test("RPC anonim tidak membuat header Authorization", async () => {
  const api = await muat("src/lib/otentikasi-rpc.ts", {
    "@tanstack/react-start": middleware,
    "@/integrations/supabase/client": {
      supabase: {
        auth: {
          getSession: async () => ({ data: { session: null } }),
        },
      },
    },
  });
  let headers;
  await api.lampirkanSesiRpc({
    next: (x) => {
      headers = x.headers;
    },
  });
  assert.deepEqual(headers, {});
});

test("gagal membaca sesi tidak meneruskan RPC tanpa token secara diam-diam", async () => {
  const api = await muat("src/lib/otentikasi-rpc.ts", {
    "@tanstack/react-start": middleware,
    "@/integrations/supabase/client": {
      supabase: {
        auth: {
          getSession: async () => {
            throw new Error("koneksi sesi gagal");
          },
        },
      },
    },
  });
  let next = 0;
  await assert.rejects(api.lampirkanSesiRpc({ next: () => next++ }), /koneksi sesi gagal/);
  assert.equal(next, 0);
});

test("loader situs tetap memilih periode aktif dan mengembalikan objek polos", async () => {
  const calls = [];
  const api = await muat("src/services/publik.functions.ts", {
    "@tanstack/react-start": serverFn,
    "@tanstack/react-start/server": {
      getRequest: () => new Request("https://web.invalid/tentang"),
    },
    "./foto-html.server": { fotoUntukHtml: async () => null },
    "./konten": {
      ambilPengaturan: async () => {
        calls.push("pengaturan");
        return { namaOrganisasi: "Uji" };
      },
    },
    "./organisasi": {
      ambilPeriode: async () => {
        calls.push("periode");
        return [
          { id: "lama", aktif: false },
          { id: "aktif", aktif: true },
        ];
      },
    },
  });
  assert.deepEqual(await api.ambilSitusPublikFn(), {
    pengaturan: { namaOrganisasi: "Uji" },
    periodeAktif: { id: "aktif", aktif: true },
    fotoBerandaHtml: null,
  });
  assert.deepEqual(calls.sort(), ["pengaturan", "periode"]);
});

test("loader situs tanpa periode tetap null dan kegagalan data tidak disamarkan", async () => {
  let gagal = false;
  const api = await muat("src/services/publik.functions.ts", {
    "@tanstack/react-start": serverFn,
    "@tanstack/react-start/server": {
      getRequest: () => new Request("https://web.invalid/tentang"),
    },
    "./foto-html.server": { fotoUntukHtml: async () => null },
    "./konten": {
      ambilPengaturan: async () => {
        if (gagal) throw new Error("pengaturan gagal");
        return {};
      },
    },
    "./organisasi": { ambilPeriode: async () => [] },
  });
  assert.equal((await api.ambilSitusPublikFn()).periodeAktif, null);
  gagal = true;
  await assert.rejects(api.ambilSitusPublikFn(), /pengaturan gagal/);
});

test("beranda meminta kueri publik default tanpa opsi semuaStatus atau data pemanggil", async () => {
  const calls = [];
  const ambil =
    (nama, hasil) =>
    async (...args) => {
      calls.push({ nama, args });
      return hasil;
    };
  const api = await muat("src/services/publik.functions.ts", {
    "@tanstack/react-start": serverFn,
    "@tanstack/react-start/server": {
      getRequest: () => new Request("https://web.invalid/tentang"),
    },
    "./foto-html.server": { fotoUntukHtml: async () => null },
    "./konten": {
      ambilKegiatan: ambil("kegiatan", []),
      ambilBerita: ambil("berita", []),
      ambilAlbum: ambil("album", []),
    },
    "./organisasi": {
      ambilBidang: ambil("bidang", []),
      hitungPengurusAktif: ambil("pengurus", 59),
    },
  });
  assert.deepEqual(await api.ambilBerandaPublikFn({ data: { semuaStatus: true } }), {
    kegiatan: [],
    berita: [],
    album: [],
    bidang: [],
    pengurusAktif: 59,
  });
  assert.equal(calls.length, 5);
  assert.ok(calls.every((c) => c.args.length === 0));
});

test("alamat Supabase publik sama dengan SDK termasuk spasi dan Unicode", async () => {
  const lama = process.env.SUPABASE_URL;
  process.env.SUPABASE_URL = "https://storage.example.test/";
  try {
    const api = await muatTypescript("src/services/media-publik.ts");
    const db = createClient("https://storage.example.test/", "fixture-publishable", {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    for (const bucket of ["media", "dokumen-publik"]) {
      for (const path of [
        "folder/foto.webp",
        "folder/nama dengan spasi.webp",
        "arsip/catatan-é.pdf",
        "folder/a%20b.webp",
      ]) {
        assert.equal(
          api.urlPublik(bucket, path),
          db.storage.from(bucket).getPublicUrl(path).data.publicUrl,
        );
      }
    }
  } finally {
    if (lama === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = lama;
  }
});

test("alamat media mempertahankan null, URL penuh dan gateway B2 yang lama", async () => {
  const api = await muatTypescript("src/services/media-publik.ts");
  assert.equal(api.urlPublik("media", null), null);
  assert.equal(api.urlPublik("media", ""), null);
  assert.equal(
    api.urlPublik("media", "https://cdn.example.test/foto.webp"),
    "https://cdn.example.test/foto.webp",
  );
  assert.equal(
    api.urlPublik("media", "b2:galeri/media/id/foto.webp"),
    "/media/galeri/media/id/foto.webp",
  );
});

const fotoFixture = Buffer.from("RIFF0000WEBPisi-foto-uji", "utf8");
const pathFoto =
  "pengaturan/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp";
const cacheFoto = (isi = fotoFixture, headers = {}) => ({
  match: async () =>
    new Response(isi, {
      headers: {
        "content-type": "image/webp",
        "content-length": String(isi.byteLength),
        ...headers,
      },
    }),
});

test("HTML beranda memakai byte cache identik tanpa mengubah foto atau mengambil origin", async () => {
  const api = await muatTypescript("src/services/foto-html.server.ts");
  let key;
  const cache = cacheFoto();
  const match = cache.match;
  cache.match = (k) => {
    key = k.url;
    return match(k);
  };
  const hasil = await api.fotoUntukHtml(new Request("https://pages.invalid/"), pathFoto, cache);
  assert.equal(key, "https://katar-rw03.ukktrw03cipedak.workers.dev/media/situs/" + pathFoto);
  assert.ok(hasil.startsWith("data:image/webp;base64,"));
  assert.deepEqual(Buffer.from(hasil.split(",")[1], "base64"), fotoFixture);
});

test("HTML menolak profil/path bebas dan tidak membaca cache pada halaman lain/HEAD", async () => {
  const api = await muatTypescript("src/services/foto-html.server.ts");
  const cache = {
    match: () => {
      throw new Error("Tidak boleh dibaca");
    },
  };
  for (const [url, method, path] of [
    ["/tentang", "GET", pathFoto],
    ["/", "HEAD", pathFoto],
    ["/", "GET", null],
    ["/", "GET", "profil/akun/foto.webp"],
    ["/", "GET", "https://asing.invalid/foto.webp"],
  ]) {
    assert.equal(
      await api.fotoUntukHtml(new Request("https://web.invalid" + url, { method }), path, cache),
      null,
    );
  }
});

test("cache dingin/error, MIME palsu, ukuran melebihi budget atau isi rusak memakai fallback", async () => {
  const api = await muatTypescript("src/services/foto-html.server.ts");
  const req = new Request("https://web.invalid/");
  const cases = [
    { match: async () => undefined },
    {
      match: async () => {
        throw new Error("cache tidak tersedia");
      },
    },
    cacheFoto(fotoFixture, { "content-type": "text/html" }),
    cacheFoto(fotoFixture, { "content-length": String(128 * 1024 + 1) }),
    cacheFoto(fotoFixture, { "content-length": "0" }),
    cacheFoto(fotoFixture, { "content-length": "25" }),
    cacheFoto(Buffer.from("bukan-webp-yang-sah")),
  ];
  for (const cache of cases) assert.equal(await api.fotoUntukHtml(req, pathFoto, cache), null);
});

test("foto yang diganti memakai kunci baru, cache foto lama tidak dipilih", async () => {
  const api = await muatTypescript("src/services/foto-html.server.ts");
  const baru = pathFoto.replace(
    "22222222-2222-4222-8222-222222222222",
    "33333333-3333-4333-8333-333333333333",
  );
  let key;
  assert.equal(
    await api.fotoUntukHtml(new Request("https://web.invalid/"), baru, {
      match: async (k) => {
        key = k.url;
        return undefined;
      },
    }),
    null,
  );
  assert.ok(key.endsWith(baru));
  assert.ok(!key.endsWith(pathFoto));
});
