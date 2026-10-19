import test from "node:test";
import assert from "node:assert/strict";
import { muatLayananBerita } from "./helpers/layanan-berita.mjs";
const { lib, foto } = await muatLayananBerita();
const dasar = {
  judul: "Berita uji",
  slug: "berita-uji",
  ringkasan: "",
  isi: "",
  bidang_id: null,
  pinned: false,
  status: "draft",
  cover_id: null,
};
test("draf kosong boleh disimpan tetapi review/terbit memerlukan ringkasan dan isi", () => {
  assert.ok(lib.formulirBerita.safeParse(dasar).success);
  for (const status of ["review", "terbit"]) {
    assert.ok(!lib.formulirBerita.safeParse({ ...dasar, status }).success);
    assert.ok(
      lib.formulirBerita.safeParse({ ...dasar, status, isi: "Isi", ringkasan: "Ringkas" }).success,
    );
  }
});
test("judul, slug, batas panjang, versi dan kolom metadata diperiksa", () => {
  for (const d of [
    { judul: "" },
    { slug: "../x" },
    { isi: "x".repeat(30001) },
    { ringkasan: "x".repeat(501) },
    { created_by: "palsu" },
    { id: "11111111-1111-4111-8111-111111111111" },
  ])
    assert.ok(!lib.formulirBerita.safeParse({ ...dasar, ...d }).success);
  assert.equal(lib.slugBerita("Café RW 03!"), "cafe-rw-03");
});
test("anggota hanya mengelola draf sendiri dan tidak menerbitkan", () => {
  const a = { id: "a", role: "anggota", bidangId: "media", bolehKontribusi: true };
  const d = { bidang_id: "media", created_by: "a", status: "draft" };
  assert.ok(lib.bolehKelolaBerita(a, d));
  assert.ok(!lib.bolehKelolaBerita(a, { ...d, status: "terbit" }));
  assert.ok(!lib.bolehKelolaBerita(a, { ...d, created_by: "b" }));
  assert.ok(!lib.bolehTerbitBerita(a, d));
});
test("Kabid hanya jangkauannya, BPH semua bidang", () => {
  const a = { id: "a", role: "admin", bidangId: "media", bolehKontribusi: true };
  assert.ok(!lib.bolehTerbitBerita(a, { bidang_id: "pendidikan", created_by: "a" }));
  assert.ok(
    lib.bolehTerbitBerita({ ...a, bidangId: null }, { bidang_id: "pendidikan", created_by: "b" }),
  );
});
test("ukuran sampul, jenis data dan kolom asing ditolak", () => {
  const s = {
    path: "berita/a/x.webp",
    thumbPath: "berita/a/x_thumb.webp",
    lebar: 1200,
    tinggi: 630,
    ukuranByte: 4000,
    caption: "",
  };
  assert.ok(lib.sampulBerita.safeParse(s).success);
  for (const d of [{ lebar: 0 }, { tinggi: 2000 }, { ukuranByte: -1 }, { mime: "text/html" }])
    assert.ok(!lib.sampulBerita.safeParse({ ...s, ...d }).success);
});

test("gagal menghapus objek profil tidak mencabut referensi/izin", async () => {
  let rpc = 0;
  const db = {
    from(t) {
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async single() {
          return {
            data:
              t === "profiles"
                ? { aktif: true, pengurus_id: "p" }
                : { foto_path: "profil/u/lama.webp" },
            error: null,
          };
        },
      };
    },
    storage: {
      from() {
        return {
          async remove() {
            return { data: null, error: { message: "gagal" } };
          },
        };
      },
    },
    async rpc() {
      rpc++;
      return { error: null };
    },
  };
  await assert.rejects(() => foto.simpanFotoProfil(db, "u", null, false), /belum berhasil dihapus/);
  assert.equal(rpc, 0);
});
test("Storage tidak menghapus baris: service tidak mengumumkan sukses palsu", async () => {
  let rpc = 0;
  const db = {
    from(t) {
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async single() {
          return {
            data:
              t === "profiles"
                ? { aktif: true, pengurus_id: "p" }
                : { foto_path: "profil/u/lama.webp" },
            error: null,
          };
        },
      };
    },
    storage: {
      from() {
        return {
          async remove() {
            return { data: [], error: null };
          },
        };
      },
    },
    async rpc() {
      rpc++;
      return { error: null };
    },
  };
  await assert.rejects(() => foto.simpanFotoProfil(db, "u", null, false), /belum berhasil dihapus/);
  assert.equal(rpc, 0);
});
