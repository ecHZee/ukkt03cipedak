import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import proxy from "../cloudflare/pages/public/_worker.js";

async function muat(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
}
const filter = await muat("../src/lib/filter-publik.ts");
const { bacaPeta } = await muat("../src/lib/tautan-peta.ts");
const { tujuanAman } = await muat("../src/lib/tujuan-masuk.ts");

test("login dapat kembali ke arsip berfilter, tetapi tidak dapat diarahkan ke situs luar", () => {
  assert.equal(tujuanAman("/arsip?bidang=media&q=rapat"), "/arsip?bidang=media&q=rapat");
  assert.equal(tujuanAman("/admin/users"), "/admin/users");
  for (const nilai of [
    "https://evil.test",
    "//evil.test",
    "/arsip-lain",
    "/arsip/../admin",
    "/\\evil.test",
    "/arsip?x=\nLocation: https://evil.test",
    null,
  ])
    assert.equal(tujuanAman(nilai), "/admin/dashboard");
});

test("filter URL memulihkan bidang/status/tahun/kategori dan kata kunci", () => {
  assert.deepEqual(filter.bacaFilterKegiatan({ bidang: "media", status: "batal" }), {
    bidang: "media",
    status: "batal",
  });
  assert.deepEqual(
    filter.bacaFilterArsip({
      bidang: "umum",
      tahun: "2026",
      kategori: "proposal",
      q: "  rapat RW 03  ",
    }),
    { bidang: "umum", tahun: 2026, kategori: "proposal", q: "rapat RW 03" },
  );
});
test("parameter asing, array dan tahun tidak sah tidak menjadi filter aktif", () => {
  for (const tahun of ["", "NaN", "Infinity", "2026.5", "1800", "2200", ["2026"], {}]) {
    assert.equal(filter.bacaFilterArsip({ tahun }).tahun, undefined);
  }
  assert.deepEqual(filter.bacaFilterKegiatan({ bidang: ["media"], status: "draft", bebas: "x" }), {
    bidang: undefined,
    status: undefined,
  });
  assert.equal(filter.bacaFilterArsip({ kategori: "__proto__", q: [] }).kategori, undefined);
  assert.equal(filter.bacaFilterArsip({ q: "a".repeat(200) }).q.length, 120);
});
test("Semua dan Umum membedakan dokumen tanpa bidang dari bidang tertentu", () => {
  assert.equal(filter.cocokBidang("media"), true);
  assert.equal(filter.cocokBidang(null, "umum"), true);
  assert.equal(filter.cocokBidang("media", "umum"), false);
  assert.equal(filter.cocokBidang(null, "media"), false);
});
test("peta kosong/berbahaya tidak di-embed dan tautan berbagi tidak direka menjadi lokasi", () => {
  for (const nilai of [
    null,
    "",
    "javascript:alert(1)",
    "http://www.google.com/maps/embed",
    "https://www.google.com.evil.test/maps/embed",
    "https://user:pw@www.google.com/maps/embed",
    "https://www.google.com:8443/maps/embed",
    "https://www.google.com/search?q=rw03",
  ])
    assert.equal(bacaPeta(nilai), null);
  assert.equal(bacaPeta("https://maps.app.goo.gl/contoh").sematan, null);
  assert.equal(bacaPeta("https://www.google.com/maps/place/contoh").sematan, null);
  assert.ok(bacaPeta("https://www.google.com/maps/embed?pb=contoh").sematan);
});

test("proxy meneruskan POST, query, body, cookie dan authorization tanpa mengonsumsinya", async () => {
  const req = new Request("https://ukkt03cipedak.pages.dev/_server/tes?pilihan=media", {
    method: "POST",
    headers: {
      authorization: "Bearer token-uji-buatan",
      cookie: "uji=sesi",
      "content-type": "application/json",
    },
    body: JSON.stringify({ nilai: 7 }),
  });
  const res = await proxy.fetch(req, {
    KATAR_APP: {
      fetch: async (r) => {
        assert.equal(r, req);
        assert.equal(r.method, "POST");
        assert.equal(new URL(r.url).searchParams.get("pilihan"), "media");
        assert.equal(r.headers.get("authorization"), "Bearer token-uji-buatan");
        assert.equal(r.headers.get("cookie"), "uji=sesi");
        assert.deepEqual(await r.json(), { nilai: 7 });
        return new Response("hasil", { headers: { "Cache-Control": "public, max-age=86400" } });
      },
    },
  });
  assert.equal(await res.text(), "hasil");
  assert.equal(res.headers.get("Cache-Control"), "no-store");
  assert.equal(res.headers.get("Cloudflare-CDN-Cache-Control"), "no-store");
});
test("HTML/admin dan aset bersesi tidak dapat memakai cache bersama", async () => {
  for (const [path, headers] of [
    ["/arsip", {}],
    ["/admin", {}],
    ["/assets/app.js", { authorization: "Bearer uji" }],
    ["/logo/logo-48.png", { cookie: "sesi=uji" }],
  ]) {
    const res = await proxy.fetch(
      new Request("https://ukkt03cipedak.pages.dev" + path, { headers }),
      {
        KATAR_APP: {
          fetch: async () =>
            new Response("uji", { headers: { "Cache-Control": "public, max-age=3600" } }),
        },
      },
    );
    assert.equal(res.headers.get("Cache-Control"), "no-store");
  }
});
test("aset anonim mempertahankan cache asal, tetapi Set-Cookie dan error tidak", async () => {
  const req = new Request("https://ukkt03cipedak.pages.dev/assets/app.js");
  for (const [status, extra, expected] of [
    [200, {}, "public, max-age=3600"],
    [200, { "Set-Cookie": "sesi=uji" }, "no-store"],
    [404, {}, "no-store"],
  ]) {
    const res = await proxy.fetch(req, {
      KATAR_APP: {
        fetch: async () =>
          new Response("uji", {
            status,
            headers: { "Cache-Control": "public, max-age=3600", ...extra },
          }),
      },
    });
    assert.equal(res.headers.get("Cache-Control"), expected);
  }
});
test("redirect Worker tetap di origin Pages, redirect file eksternal tetap utuh", async () => {
  for (const [lokasi, expected] of [
    [
      "https://katar-rw03.ukktrw03cipedak.workers.dev/arsip?bidang=media#hasil",
      "https://ukkt03cipedak.pages.dev/arsip?bidang=media#hasil",
    ],
    ["https://storage.example.test/berkas.pdf", "https://storage.example.test/berkas.pdf"],
  ]) {
    const res = await proxy.fetch(new Request("https://ukkt03cipedak.pages.dev/lpj"), {
      KATAR_APP: {
        fetch: async () => new Response(null, { status: 301, headers: { Location: lokasi } }),
      },
    });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get("Location"), expected);
    assert.equal(res.headers.get("X-Katar-Gateway"), "pages-v1");
  }
});
test("upstream gagal dan binding kosong memberi respons aman tanpa detail secret", async () => {
  const req = new Request("https://ukkt03cipedak.pages.dev/");
  assert.equal((await proxy.fetch(req, {})).status, 503);
  const res = await proxy.fetch(req, {
    KATAR_APP: {
      fetch: async () => {
        throw new Error("jangan tampilkan rahasia");
      },
    },
  });
  assert.equal(res.status, 502);
  assert.doesNotMatch(await res.text(), /rahasia/);
  assert.equal(res.headers.get("Cache-Control"), "no-store");
});

const { responsDinamis } = await muat("../src/lib/respons-dinamis.ts");
test("Worker: respons RPC/HTML langsung selalu privat dan no-store", async () => {
  const asal = new Response("data privat", {
    headers: { "cache-control": "public, max-age=3600", "content-type": "application/json" },
  });
  const r = responsDinamis(asal);
  assert.equal(r.headers.get("cache-control"), "private, no-store");
  assert.equal(r.headers.get("pragma"), "no-cache");
  assert.equal(r.headers.get("expires"), "0");
  assert.equal(asal.bodyUsed, false);
  assert.equal(await r.text(), "data privat");
});
test("Worker: redirect dengan header immutable tetap bisa dibungkus", () => {
  const r = responsDinamis(Response.redirect("https://contoh.invalid/arsip", 301));
  assert.equal(r.status, 301);
  assert.equal(r.headers.get("location"), "https://contoh.invalid/arsip");
  assert.equal(r.headers.get("cache-control"), "private, no-store");
});
test("Worker: cookie, status dan variasi header dipertahankan tanpa duplikasi", () => {
  const asal = new Response(null, {
    status: 403,
    headers: { "set-cookie": "uji=nilai; HttpOnly", vary: "Origin, Cookie" },
  });
  const r = responsDinamis(asal);
  assert.equal(r.status, 403);
  assert.equal(r.headers.get("set-cookie"), asal.headers.get("set-cookie"));
  assert.equal(r.headers.get("vary"), "origin, cookie, authorization");
});
test("Worker: respons streaming tidak dibaca atau dipotong saat memasang no-store", async () => {
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(new TextEncoder().encode("bagian pertama"));
      c.enqueue(new TextEncoder().encode(" dan kedua"));
      c.close();
    },
  });
  const r = responsDinamis(new Response(stream));
  assert.equal(r.bodyUsed, false);
  assert.equal(await r.text(), "bagian pertama dan kedua");
});
