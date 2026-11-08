import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as reactQuery from "@tanstack/react-query";
import { renderToString } from "react-dom/server";

async function muat(file, mocks, impor = () => {}, globals) {
  const context = globals ? vm.createContext(globals) : undefined;
  const cache = new Map();
  async function modul(s) {
    if (cache.has(s)) return cache.get(s);
    assert.ok(Object.hasOwn(mocks, s), `Impor tidak diharapkan: ${s}`);
    const values = mocks[s];
    const m = new vm.SyntheticModule(
      Object.keys(values),
      function () {
        for (const [k, v] of Object.entries(values)) this.setExport(k, v);
      },
      { context },
    );
    cache.set(s, m);
    await m.link(() => {
      throw new Error("Mock tidak boleh memuat dependensi lain");
    });
    await m.evaluate();
    return m;
  }
  const source = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const m = new vm.SourceTextModule(source, {
    context,
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
  });
  assert.deepEqual(calls.sort(), ["pengaturan", "periode"]);
});

test("loader situs tanpa periode tetap null dan kegagalan data tidak disamarkan", async () => {
  let gagal = false;
  const api = await muat("src/services/publik.functions.ts", {
    "@tanstack/react-start": serverFn,
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

test("cache query Arsip tidak dibagi antardua render SSR", async () => {
  const { PenyediaCacheArsip } = await muat("src/components/public/PenyediaCacheArsip.tsx", {
    react: React,
    "react/jsx-runtime": jsxRuntime,
    "@tanstack/react-query": reactQuery,
  });
  const clients = [];
  function Isi() {
    const client = reactQuery.useQueryClient();
    clients.push(client);
    const lama = client.getQueryData(["arsip-bersesi", "fixture"]);
    client.setQueryData(["arsip-bersesi", "fixture"], "isi-permintaan-lain");
    return React.createElement("span", null, lama ?? "kosong");
  }
  const render = () =>
    renderToString(React.createElement(PenyediaCacheArsip, null, React.createElement(Isi)));
  assert.equal(render(), "<span>kosong</span>");
  assert.equal(render(), "<span>kosong</span>");
  assert.notEqual(clients[0], clients[1]);
  clients.forEach((client) => client.clear());
});

async function analitikFixture(idle = true) {
  const script = [],
    queue = new Map();
  const lokasi = new URL("https://ukkt03cipedak.pages.dev/");
  let cleanup;
  const api = await muat(
    "src/components/public/WebAnalytics.tsx",
    {
      react: {
        useEffect: (fn) => {
          cleanup = fn();
        },
      },
      "@tanstack/react-router": {
        useRouterState: ({ select }) => select({ location: { pathname: lokasi.pathname } }),
      },
      "@/seo/analytics": await muatTypescript("src/seo/analytics.ts"),
    },
    () => {},
    {
      location: lokasi,
      document: {
        getElementById: (id) => script.find((s) => s.id === id),
        createElement: () => ({
          setAttribute(k, v) {
            this[k] = v;
          },
        }),
        body: { append: (s) => script.push(s) },
      },
      window: idle
        ? {
            requestIdleCallback: (fn) => {
              queue.set(1, fn);
              return 1;
            },
            cancelIdleCallback: (id) => queue.delete(id),
          }
        : {},
    },
  );
  return { api, script, queue, lokasi, cleanup: () => cleanup?.() };
}

test("analitik menunggu idle dan tetap dimuat sekali dengan prioritas rendah", async () => {
  const f = await analitikFixture();
  f.api.WebAnalytics();
  assert.equal(f.script.length, 0);
  assert.equal(f.queue.size, 1);
  f.queue.get(1)();
  assert.equal(f.script.length, 1);
  assert.equal(f.script[0].fetchPriority, "low");
  assert.equal(f.script[0].src, "https://static.cloudflareinsights.com/beacon.min.js");
  f.api.WebAnalytics();
  assert.equal(f.script.length, 1);
});

test("callback analitik tertunda menolak route privat dan dapat dibatalkan", async () => {
  const f = await analitikFixture();
  f.api.WebAnalytics();
  f.lokasi.pathname = "/admin/settings";
  f.queue.get(1)();
  assert.equal(f.script.length, 0);
  f.cleanup();
  assert.equal(f.queue.size, 0);
});

test("browser tanpa idle API memakai fallback dan route login tidak memasang analitik", async () => {
  const f = await analitikFixture(false);
  f.lokasi.pathname = "/login";
  f.api.WebAnalytics();
  assert.equal(f.script.length, 0);
  f.lokasi.pathname = "/";
  f.api.WebAnalytics();
  assert.equal(f.script.length, 1);
});
