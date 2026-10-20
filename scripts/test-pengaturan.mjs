import assert from "node:assert/strict";
import test from "node:test";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
const lib = await muatTypescript("src/lib/pengaturan-admin.ts");
const dasar = lib.isianDariBaris([
  { key: "organisasi.nama", value: "Karang Taruna RW 03 Cipedak" },
]);
async function kontenPublik(nilai) {
  let publik;
  const chain = {
    select() {
      return chain;
    },
    eq(k, v) {
      if (k === "publik") publik = v;
      return chain;
    },
    then(ok, bad) {
      return Promise.resolve({
        data: Object.entries(nilai).map(([key, value]) => ({ key, value })),
        error: null,
      }).then(ok, bad);
    },
  };
  const api = await muatTypescript("src/services/konten.ts", {
    "@/integrations/supabase/client": {
      supabase: {
        from() {
          return chain;
        },
      },
    },
    "@/services/storage": { urlPublik: (_b, p) => (p ? `https://media.invalid/${p}` : null) },
  });
  return { api, p: await api.ambilPengaturan(), publik };
}
test("loader publik hanya meminta pengaturan publik; WA berganti dari satu sumber", async () => {
  for (const nomor of ["6281234567890", "6289876543210"]) {
    const { api, p, publik } = await kontenPublik({ ...dasar, "kontak.whatsapp": nomor });
    assert.equal(publik, true);
    assert.equal(api.linkWhatsApp(p), `https://wa.me/${nomor}`);
    assert.equal(new URL(api.linkWhatsApp(p, "Halo RW 03")).searchParams.get("text"), "Halo RW 03");
  }
  const { api, p } = await kontenPublik({ ...dasar, "kontak.whatsapp": "" });
  assert.equal(api.linkWhatsApp(p), null);
});
test("empat foto, logo dan tagline baru diteruskan loader publik", async () => {
  const path =
    "pengaturan/00000000-0000-0000-0000-000000000000/11111111-1111-1111-1111-111111111111.webp";
  const t = {
    tagline: "Kalimat RW 03",
    logo: path,
    foto: Array.from({ length: 4 }, (_, i) => ({ path, caption: `Dokumentasi ${i + 1}` })),
  };
  const { p } = await kontenPublik({ ...dasar, "situs.tampilan": t });
  assert.equal(p.logoPath, path);
  assert.equal(p.tagline, t.tagline);
  assert.equal(p.fotoBeranda.length, 4);
  assert.equal(p.fotoBeranda[3].caption, "Dokumentasi 4");
});
test("pengumuman kedaluwarsa disembunyikan dan tautan skrip tidak diteruskan", async () => {
  const { p } = await kontenPublik({
    ...dasar,
    pengumuman: { teks: "UJI", tautan: "/kegiatan", sampai: "2000-01-01" },
  });
  assert.equal(p.pengumuman, null);
  const { p: b } = await kontenPublik({
    ...dasar,
    pengumuman: { teks: "UJI", tautan: "javascript:alert(1)", sampai: "2099-01-01" },
  });
  assert.equal(b.pengumuman.tautan, null);
});
test("nomor 08 dan format berspasi dinormalisasi menjadi 62", () => {
  for (const s of ["0812 3456 7890", "+62 812-3456-7890"])
    assert.equal(
      lib.pengaturanForm.parse({ ...dasar, "kontak.whatsapp": s })["kontak.whatsapp"],
      "6281234567890",
    );
});
test("nomor tidak lengkap/asing dan email salah ditolak", () => {
  for (const s of ["123", "+12025550123", "628abc99999"])
    assert(!lib.pengaturanForm.safeParse({ ...dasar, "kontak.whatsapp": s }).success);
  assert(!lib.pengaturanForm.safeParse({ ...dasar, "kontak.email": "salah" }).success);
});
test("URL skrip, HTTP, userinfo, backslash, dan host tiruan ditolak", () => {
  for (const s of [
    "javascript:alert(1)",
    "http://instagram.com/abc",
    "https://instagram.com@evil.invalid/",
    "https://instagram.com.evil.invalid/",
    "https://instagram.com\\@evil.invalid/",
    "https://instagram.com:444/abc",
  ])
    assert(!lib.pengaturanForm.safeParse({ ...dasar, "sosmed.instagram": s }).success, s);
});
test("kanal resmi HTTPS dan kosong diterima", () => {
  for (const s of ["", "https://www.instagram.com/katar/"])
    assert(lib.pengaturanForm.safeParse({ ...dasar, "sosmed.instagram": s }).success);
});
test("pengumuman menolak protocol-relative dan mengizinkan path internal", () => {
  for (const s of ["//evil.invalid/", "/\\evil.invalid/", "javascript:alert(1)"])
    assert(
      !lib.pengaturanForm.safeParse({
        ...dasar,
        pengumuman: { teks: "UJI", tautan: s, sampai: "" },
      }).success,
    );
  assert(
    lib.pengaturanForm.safeParse({
      ...dasar,
      pengumuman: { teks: "UJI", tautan: "/kegiatan?bidang=media", sampai: "2026-10-20" },
    }).success,
  );
});
test("tanggal kalender invalid tidak melempar RangeError", () => {
  for (const s of ["2026-02-30", "2026-99-99", "2026-10-40"])
    assert.equal(
      lib.pengaturanForm.safeParse({ ...dasar, pengumuman: { teks: "UJI", tautan: "", sampai: s } })
        .success,
      false,
    );
});
test("path gambar luar namespace, traversal, URL asing ditolak", () => {
  for (const path of ["umum/a.webp", "pengaturan/../../secret.webp", "https://evil.invalid/a.webp"])
    assert(!lib.tampilanForm.safeParse({ ...lib.TAMPILAN_AWAL, logo: path }).success);
});
test("foto perlu caption dan jumlah slot harus tepat empat", () => {
  const path =
    "pengaturan/00000000-0000-0000-0000-000000000000/11111111-1111-1111-1111-111111111111.webp";
  assert(
    !lib.tampilanForm.safeParse({
      ...lib.TAMPILAN_AWAL,
      foto: [{ path, caption: "" }, ...lib.TAMPILAN_AWAL.foto.slice(1)],
    }).success,
  );
  assert(!lib.tampilanForm.safeParse({ ...lib.TAMPILAN_AWAL, foto: [] }).success);
});
test("mass assignment key publik/role tidak diterima", () => {
  assert(!lib.pengaturanForm.safeParse({ ...dasar, publik: false }).success);
  assert(
    !lib.pengaturanForm.safeParse({
      ...dasar,
      "situs.tampilan": { ...lib.TAMPILAN_AWAL, role: "super_admin" },
    }).success,
  );
});
test("filter menerima URL pagination dan menolak injeksi/rentang terbalik", () => {
  assert.equal(lib.filterAudit.parse({ halaman: "2" }).halaman, 2);
  for (const f of [
    { modul: "profiles,or.true" },
    { pelaku: "x" },
    { halaman: -1 },
    { dari: "2026-10-21", sampai: "2026-10-20" },
    { dari: "2026-99-20" },
  ])
    assert(!lib.filterAudit.safeParse(f).success);
});
test("ringkasan audit tidak membocorkan nilai sebelum/sesudah", () => {
  const r = lib.ringkasAudit({
    tabel: "profiles",
    aksi: "UPDATE",
    sebelum: { email_kontak: "rahasia@example.invalid" },
    sesudah: { email_kontak: "lain@example.invalid", password: "JANGAN_KIRIM" },
  });
  assert(!/rahasia|example|JANGAN_KIRIM/.test(r));
  assert.match(r, /2 bagian/);
});
test("reset dan username menggunakan label akun yang dikenal", () => {
  for (const [aksi, teks] of [
    ["reset_password", "Mereset password"],
    ["ganti_username", "Mengganti username"],
  ])
    assert.equal(
      lib.ringkasAudit({
        tabel: "akun",
        aksi: "UPDATE",
        sebelum: null,
        sesudah: { aksi, password: "RAHASIA" },
      }),
      teks,
    );
});
