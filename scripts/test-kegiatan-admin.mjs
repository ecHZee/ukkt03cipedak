import assert from "node:assert/strict";
import test from "node:test";
import { muatLayananKegiatan } from "./helpers/layanan-kegiatan.mjs";

const { lib } = await muatLayananKegiatan();
const dasar = {
  judul: "Kerja bakti",
  slug: "kerja-bakti",
  ringkasan: "Bersih lingkungan RW 03",
  isi: "",
  bidang_id: null,
  periode_id: "11111111-1111-4111-8111-111111111111",
  mulai: "2026-10-24T19:30",
  selesai: "2026-10-24T21:00",
  rutin: "",
  lokasi: "Pos RW 03",
  tahap: "rencana",
  status: "draft",
};
const cek = (d) => lib.formulirKegiatan.safeParse({ ...dasar, ...d });
test("slug otomatis menangani aksen, tanda baca dan batas panjang", () => {
  assert.equal(lib.slugKegiatan("  Café & RW 03!! "), "cafe-rw-03");
  assert.ok(lib.slugKegiatan("a-".repeat(100)).length <= 120);
});
test("konversi tanggal tetap WIB meskipun TZ proses berbeda", () => {
  for (const tz of ["UTC", "America/Los_Angeles", "Asia/Makassar"]) {
    process.env.TZ = tz;
    assert.equal(lib.waktuWib("2026-10-24T19:30"), "2026-10-24T12:30:00.000Z");
    assert.equal(lib.keInputWib("2026-10-24T12:30:00Z"), "2026-10-24T19:30");
  }
});
test("tanggal mustahil dan format tak lengkap ditolak", () => {
  for (const v of [
    "2026-02-30T10:00",
    "2026-13-01T10:00",
    "2026-01-01T25:00",
    "2026-01-01",
    "bukan tanggal",
  ])
    assert.equal(cek({ mulai: v }).success, false, v);
  assert.equal(lib.waktuWib("2028-02-29T10:00"), "2028-02-29T03:00:00.000Z");
});
test("selesai sebelum mulai atau tanpa mulai ditolak", () => {
  assert.equal(cek({ selesai: "2026-10-24T18:30" }).success, false);
  assert.equal(cek({ mulai: "" }).success, false);
  assert.equal(cek({ selesai: dasar.mulai }).success, true);
});
test("draft boleh belum lengkap, review/terbit memerlukan ringkasan dan jadwal", () => {
  assert.equal(cek({ mulai: "", selesai: "", ringkasan: "" }).success, true);
  for (const status of ["review", "terbit"]) {
    assert.equal(cek({ status, ringkasan: "" }).success, false);
    assert.equal(cek({ status, mulai: "", selesai: "" }).success, false);
    assert.equal(
      cek({ status, mulai: "", selesai: "", rutin: "Setiap Jumat malam" }).success,
      true,
    );
  }
});
test("kolom tak dikenal/metadata, judul kosong, slug tak aman dan enum ditolak", () => {
  for (const nilai of [
    { created_by: dasar.periode_id },
    { disetujui_oleh: dasar.periode_id },
    { is_dummy: true },
    { judul: "  " },
    { slug: "../../admin" },
    { slug: "Nama Besar" },
    { status: "publik" },
    { tahap: "draft" },
    { ringkasan: "a".repeat(501) },
  ])
    assert.equal(cek(nilai).success, false);
});
test("sunting wajib membawa versi dan payload tidak memuat metadata", () => {
  assert.equal(cek({ id: dasar.periode_id }).success, false);
  const valid = cek({ id: dasar.periode_id, versi: "2026-10-18T12:00:00Z" });
  assert.equal(valid.success, true);
  assert.equal(Object.hasOwn(lib.dataSimpanKegiatan(valid.data), "versi"), false);
  assert.equal(Object.hasOwn(lib.dataSimpanKegiatan(valid.data), "created_by"), false);
});
test("hak UI: anggota hanya draft sendiri, Kabid bidangnya + umum sendiri, BPH lintas", () => {
  const a = { id: "a", role: "anggota", bidangId: "media", bolehKontribusi: true };
  const k = { bidang_id: "media", created_by: "a", status: "draft" };
  assert.equal(lib.bolehKelolaKegiatan(a, k), true);
  assert.equal(lib.bolehTerbitKegiatan(a, k), false);
  for (const patch of [{ created_by: "b" }, { bidang_id: "lain" }, { status: "terbit" }])
    assert.equal(lib.bolehKelolaKegiatan(a, { ...k, ...patch }), false);
  assert.equal(lib.bolehKelolaKegiatan({ ...a, bolehKontribusi: false }, k), false);
  const kabid = { ...a, role: "admin" };
  assert.equal(lib.bolehTerbitKegiatan(kabid, { ...k, created_by: "b" }), true);
  assert.equal(lib.bolehTerbitKegiatan(kabid, { ...k, bidang_id: null }), true);
  assert.equal(lib.bolehTerbitKegiatan(kabid, { ...k, bidang_id: null, created_by: "b" }), false);
  assert.equal(
    lib.bolehTerbitKegiatan({ ...kabid, bidangId: null }, { ...k, bidang_id: "lain" }),
    true,
  );
});

const dbBph = {
  from() {
    return {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      async single() {
        return {
          data: { id: "bph", role: "admin", bidang_id: null, aktif: true, izin_kontribusi: false },
          error: null,
        };
      },
    };
  },
};
test("Storage: jumlahkan semua halaman dan subfolder, jangan kirim path privat", async () => {
  const calls = [];
  const { server } = await muatLayananKegiatan({
    from(bucket) {
      return {
        async list(path, { offset }) {
          calls.push({ bucket, path, offset });
          const data =
            bucket !== "dokumen-internal"
              ? []
              : path
                ? [{ id: "sub", name: "rahasia.pdf", metadata: { size: 8 } }]
                : offset === 0
                  ? Array.from({ length: 100 }, (_, i) => ({
                      id: String(i),
                      name: String(i),
                      metadata: { size: 1 },
                    }))
                  : [{ id: null, name: "folder-privat" }];
          return { data, error: null };
        },
      };
    },
  });
  const r = await server.pemakaianPenyimpanan(dbBph, "bph");
  assert.equal(r.tersedia, true);
  assert.equal(r.berkas, 101);
  assert.equal(r.bytes, 108);
  assert.ok(calls.some((c) => c.offset === 100));
  assert.ok(calls.some((c) => c.path === "folder-privat"));
  assert.equal(JSON.stringify(r).includes("rahasia"), false);
});
test("Storage gagal di halaman berikutnya tidak menghasilkan total parsial", async () => {
  const { server } = await muatLayananKegiatan({
    from() {
      return {
        async list(_p, { offset }) {
          return offset
            ? { error: { message: "jaringan" }, data: null }
            : {
                data: Array.from({ length: 100 }, () => ({ id: "x", metadata: { size: 10 } })),
                error: null,
              };
        },
      };
    },
  });
  const r = await server.pemakaianPenyimpanan(dbBph, "bph");
  assert.equal(r.tersedia, false);
  assert.equal(r.bytes, null);
  assert.equal(r.berkas, null);
});
test("Storage tanpa metadata ukuran ditandai tidak tersedia", async () => {
  const { server } = await muatLayananKegiatan({
    from() {
      return {
        async list() {
          return { data: [{ id: "x", metadata: null }], error: null };
        },
      };
    },
  });
  assert.equal((await server.pemakaianPenyimpanan(dbBph, "bph")).tersedia, false);
});
test("Storage membatasi pemindaian tanpa menyajikan hasil terpotong", async () => {
  let calls = 0;
  const { server } = await muatLayananKegiatan({
    from() {
      return {
        async list() {
          calls++;
          return { data: [{ id: null, name: "nested" }], error: null };
        },
      };
    },
  });
  const r = await server.pemakaianPenyimpanan(dbBph, "bph");
  assert.equal(r.tersedia, false);
  assert.equal(r.bytes, null);
  assert.equal(calls, 200);
});
