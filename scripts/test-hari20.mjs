import assert from "node:assert/strict";
import test from "node:test";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
const lib = await muatTypescript("src/lib/hari20-admin.ts"),
  crop = await muatTypescript("src/lib/crop-potret.ts");
const id = "10000000-0000-4000-8000-000000000001";
const dasar = {
  judul: "Arsip",
  kategori: "lainnya",
  tahun: 2026,
  tanggal: null,
  bidang_id: null,
  akses: "bph",
  status: "draft",
  storage_path: null,
  ukuran_bytes: null,
};
test("Form dokumen menolak kolom asing, tanggal palsu, ukuran berlebih dan sunting tanpa versi", () => {
  assert(lib.dokumenForm.safeParse(dasar).success);
  for (const delta of [
    { created_by: id },
    { tanggal: "2026-02-31" },
    { ukuran_bytes: 20971521 },
    { tahun: 1999 },
    { id },
  ])
    assert(!lib.dokumenForm.safeParse({ ...dasar, ...delta }).success);
});
test("Lokasi arsip membatasi namespace privat, UUID dan PDF, bukan URL/traversal", () => {
  assert(lib.pathArsip(`privat:arsip/${id}/${id}.pdf`));
  for (const s of [
    `arsip/${id}/${id}.pdf`,
    `privat:arsip/${id}/../x.pdf`,
    `https://evil.invalid/x.pdf`,
    `privat:arsip/${id}/${id}.html`,
  ])
    assert(!lib.pathArsip(s));
});
const p = {
  periode_id: id,
  nama: "Pengurus",
  gelar: null,
  jabatan: "Anggota",
  grup: "bidang",
  bidang_id: id,
  urutan: 2,
  rt: null,
  aktif: true,
  instagram: null,
  izin_instagram: false,
  foto_path: null,
  izin_foto: false,
};
test("Pengurus membutuhkan bidang yang sesuai kelompok dan izin foto membutuhkan foto", () => {
  assert(lib.pengurusForm.safeParse(p).success);
  for (const delta of [
    { bidang_id: null },
    { grup: "bph" },
    { izin_foto: true },
    { aktif: false, izin_foto: true, foto_path: "x" },
    { role: "super_admin" },
    { rt: "RT 99" },
    { instagram: "https://evil.invalid" },
  ])
    assert(!lib.pengurusForm.safeParse({ ...p, ...delta }).success);
});
test("Crop potret dari gambar tegak/mendatar tetap 3:4 dan tidak keluar batas pada zoom/posisi tepi", () => {
  for (const [w, h] of [
    [1600, 900],
    [900, 1600],
    [100, 100],
    [1200, 1600],
  ])
    for (const zoom of [1, 1.5, 3])
      for (const x of [0, 50, 100])
        for (const y of [0, 50, 100]) {
          const a = crop.areaPotret(w, h, zoom, x, y);
          assert(Math.abs(a.sw / a.sh - 0.75) < 1e-8);
          assert(a.sx >= 0 && a.sy >= 0 && a.sx + a.sw <= w + 1e-8 && a.sy + a.sh <= h + 1e-8);
        }
});
test("Akun nonaktif ditolak layanan sebelum membaca berkas atau mutasi", async () => {
  let mutasi = 0;
  const mock = {
    from: () => ({
      select: () => ({
        eq: () => ({ single: async () => ({ data: { aktif: false }, error: null }) }),
      }),
    }),
    rpc: () => {
      mutasi++;
    },
  };
  const s = await muatTypescript("src/services/hari20-admin.server.ts", {
    "@/integrations/supabase/client.server": { supabaseAdmin: {} },
  });
  await assert.rejects(() => s.simpanDokumen(mock, id, dasar), /Akses akun/);
  await assert.rejects(() => s.simpanPengurus(mock, id, p), /Akses akun/);
  assert.equal(mutasi, 0);
});
test("Anggota tidak dapat membuka pengelolaan pengurus walaupun JWT sah", async () => {
  const mock = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: { id, role: "anggota", aktif: true, bidang_id: id, izin_kontribusi: true },
            error: null,
          }),
        }),
      }),
    }),
  };
  const s = await muatTypescript("src/services/hari20-admin.server.ts", {
    "@/integrations/supabase/client.server": { supabaseAdmin: {} },
  });
  await assert.rejects(() => s.ruangPengurus(mock, id), /hanya untuk BPH/);
});
