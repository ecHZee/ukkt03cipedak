import test from "node:test";
import assert from "node:assert/strict";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
const SITE = {
  url: "https://ukkt03cipedak.pages.dev",
  name: "Karang Taruna RW 03 Cipedak",
  shortName: "KT RW 03",
  tagline: "Kabar RW 03",
};
const mocks = { "@/constants/site": { SITE } };
const seo = await muatTypescript("src/seo/generateMetadata.ts", mocks);
const sitemap = await muatTypescript("src/seo/sitemap.ts");
const organisasi = await muatTypescript("src/seo/organisasi.ts", mocks);
const analitik = await muatTypescript("src/seo/analytics.ts");

test("analytics hanya host utama dan halaman publik; login/admin/endpoint/lokal ditolak", () => {
  for (const p of [
    "/admin",
    "/admin/users",
    "/login",
    "/_server/apa",
    "/berkas/dokumen/id",
    "/sitemap.xml",
  ])
    assert.equal(analitik.bolehAnalitik("ukkt03cipedak.pages.dev", p), false);
  for (const h of [
    "127.0.0.1",
    "localhost",
    "katar-rw03.ukktrw03cipedak.workers.dev",
    "ukkt03cipedak.pages.dev.asing.invalid",
  ])
    assert.equal(analitik.bolehAnalitik(h, "/"), false);
  assert.equal(analitik.bolehAnalitik("ukkt03cipedak.pages.dev", "/berita/kabar-rw-03"), true);
});

test("canonical dan og:url konsisten tanpa filter/hash atau trailing slash", () => {
  const r = seo.generateMetadata({ path: "/berita/?bidang=media#judul", title: "Berita" });
  assert.equal(r.links[0].href, SITE.url + "/berita");
  assert.equal(r.meta.find((m) => m.property === "og:url").content, r.links[0].href);
  assert.equal(r.meta.find((m) => m.property === "og:locale").content, "id_ID");
  assert.equal(seo.generateMetadata({}).links[0].href, SITE.url + "/");
});
test("konten dummy mendapat noindex; konten normal tidak", () => {
  assert(
    seo
      .generateMetadata({ noindex: true })
      .meta.some((m) => m.name === "robots" && m.content === "noindex, follow"),
  );
  assert(!seo.generateMetadata({}).meta.some((m) => m.name === "robots"));
});
test("gambar metadata absolut dan protokol skrip ditolak", () => {
  assert.equal(
    seo
      .generateMetadata({ image: "/logo/logo-512.png" })
      .meta.find((m) => m.property === "og:image").content,
    SITE.url + "/logo/logo-512.png",
  );
  assert.throws(() => seo.generateMetadata({ image: "javascript:alert(1)" }));
});
test("sitemap hanya halaman publik, unik, tanpa alamat luar/query/file", () => {
  const s = sitemap.buildSitemapXml(SITE.url, [
    { path: "/berita/rapat", updatedAt: "2026-10-20T01:00:00Z" },
    { path: "/berita/rapat" },
    ...[
      "/admin",
      "/login",
      "/berkas/dokumen/rahasia",
      "/media/rahasia",
      "https://asing.invalid/",
      "/berita?a=1",
      "/berita/<script>",
    ].map((path) => ({ path })),
  ]);
  assert.equal((s.match(/<loc>/g) ?? []).length, 10);
  assert.equal((s.match(/\/berita\/rapat</g) ?? []).length, 1);
  assert(!/rahasia|asing|script|\?a=1/.test(s));
});
test("lastmod valid saja; tanggal sekarang tidak dibuat-buat", () => {
  const s = sitemap.buildSitemapXml(SITE.url, [
    { path: "/berita/sah", updatedAt: "2026-10-20T01:00:00Z" },
    { path: "/kegiatan/bad", updatedAt: "invalid" },
  ]);
  assert.equal((s.match(/<lastmod>/g) ?? []).length, 1);
  assert(s.includes("2026-10-20T01:00:00.000Z"));
});
test("slug publik harus format aman; path akun dan endpoint tak dihitung sebagai halaman", () => {
  assert.equal(
    sitemap.entriKonten("program", [
      { slug: "media" },
      { slug: "../admin" },
      { slug: "a?x=1" },
      { slug: "<img>" },
    ]).length,
    1,
  );
  for (const p of ["/admin/bantuan", "/login", "/sitemap.xml", "/_server/a"])
    assert.equal(sitemap.pathPublik(p), false);
  assert.equal(sitemap.pathPublik("/tentang/pengurus"), true);
});
test("robots menunjuk sitemap utama; login/admin dapat dirayapi untuk membaca noindex", () => {
  const s = sitemap.robotsTxt(SITE.url);
  assert(s.includes(`Sitemap: ${SITE.url}/sitemap.xml`));
  assert(!s.includes("Disallow: /admin"));
  assert(!s.includes("Disallow: /login"));
  assert(s.includes("Disallow: /berkas/"));
});
test("JSON-LD hanya data organisasi publik, tidak mengarang tanggal berdiri/kontak", () => {
  const r = organisasi.dataOrganisasi(
    {
      namaOrganisasi: "KT RW 03",
      instagram: null,
      tiktok: null,
      youtube: null,
      email: null,
      alamat: null,
      whatsapp: null,
      password: "jangan-kirim",
      noHp: "jangan-kirim",
    },
    SITE.url + "/logo/logo-512.png",
  );
  assert.equal(r["@type"], "Organization");
  assert.equal(r.url, SITE.url + "/");
  for (const k of ["email", "telephone", "address", "sameAs", "foundingDate", "password", "noHp"])
    assert(!Object.hasOwn(r, k));
});
test("JSON-LD mencegah penutup script dari teks pengaturan tanpa mengubah isinya", () => {
  const r = { name: '</script><script>alert("x")</script>\u2028\u2029' };
  const s = organisasi.jsonLdAman(r);
  assert(!s.includes("<"));
  assert.deepEqual(JSON.parse(s), r);
});

function dbUji(gagal = false) {
  const calls = [];
  return {
    calls,
    from(table) {
      const q = { table, select: null, eq: [] };
      calls.push(q);
      return {
        select(s) {
          q.select = s;
          return this;
        },
        eq(k, v) {
          q.eq.push([k, v]);
          return this;
        },
        then(resolve) {
          resolve(
            gagal && table === "berita"
              ? { data: null, error: { message: "RAHASIA INTERNAL" } }
              : {
                  data: [
                    {
                      slug: table === "bidang" ? "media" : table + "-publik",
                      updated_at: "2026-10-20T01:00:00Z",
                    },
                  ],
                  error: null,
                },
          );
        },
      };
    },
  };
}
test("query sitemap memilih kolom minimum dan memfilter terbit/bukan dummy", async () => {
  const db = dbUji();
  const s = await muatTypescript("src/seo/sitemap.server.ts", mocks);
  const r = await s.ambilEntriSitemap(db);
  assert.equal(r.length, 4);
  assert.deepEqual(db.calls.map((c) => c.table).sort(), ["album", "berita", "bidang", "kegiatan"]);
  for (const c of db.calls.filter((c) => c.table !== "bidang")) {
    assert.equal(c.select, "slug,updated_at");
    assert.deepEqual(c.eq, [
      ["status", "terbit"],
      ["is_dummy", false],
    ]);
  }
});
test("endpoint GET/HEAD sama, header tepat; Authorization/cookie tidak dipakai", async () => {
  const db = dbUji();
  let opts;
  const s = await muatTypescript("src/seo/sitemap.server.ts", {
    ...mocks,
    "@supabase/supabase-js": {
      createClient: (_url, _key, options) => {
        opts = options;
        return db;
      },
    },
  });
  const r = await s.layaniSeo(
    new Request(SITE.url + "/sitemap.xml", {
      headers: { Authorization: "Bearer UJI-TIDAK-DIPAKAI", Cookie: "uji=privat" },
    }),
  );
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /application\/xml/);
  assert.match(r.headers.get("cache-control"), /no-store/);
  assert(!Object.hasOwn(opts, "global"));
  assert.equal(opts.auth.persistSession, false);
  assert((await r.text()).includes("/program/media"));
  const h = await s.layaniSeo(new Request(SITE.url + "/sitemap.xml", { method: "HEAD" }));
  assert.equal(h.status, 200);
  assert.equal(await h.text(), "");
  const p = await s.layaniSeo(new Request(SITE.url + "/sitemap.xml", { method: "POST" }));
  assert.equal(p.status, 405);
  assert.equal(p.headers.get("allow"), "GET, HEAD");
  const txt = await s.layaniSeo(new Request(SITE.url + "/robots.txt"));
  assert.match(txt.headers.get("content-type"), /text\/plain/);
  assert.equal(await s.layaniSeo(new Request(SITE.url + "/lain")), null);
});
test("gangguan database menghasilkan 503 tanpa sitemap parsial atau pesan internal", async () => {
  const s = await muatTypescript("src/seo/sitemap.server.ts", {
    ...mocks,
    "@supabase/supabase-js": { createClient: () => dbUji(true) },
  });
  const r = await s.layaniSeo(new Request(SITE.url + "/sitemap.xml"));
  assert.equal(r.status, 503);
  assert(!(await r.text()).includes("RAHASIA"));
});
