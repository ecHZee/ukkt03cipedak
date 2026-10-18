import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const baca = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const bidang = ["okk", "kerohanian", "lingkungan", "ekonomi", "pendidikan", "media", "inventaris"];
const periode = {
  id: "periode",
  label: "2025–2028",
  nomor_sk: "003/SK/KT-Cipedak/VI/2025",
  tanggal_sk: "2025-06-05",
  tanggal_pelantikan: null,
  aktif: true,
};
// Lampiran SK yang sudah menjadi seed repo menjadi pembanding, bukan daftar buatan baru.
const seed = [
  ...baca("../supabase/migrations/20260930162925_data_awal.sql").matchAll(
    /\((\d+),\s*'(penasihat|bph|bidang)',\s*(null|'[^']+'),\s*'([^']+)',\s*'([^']+)',\s*(null|'[^']+')\)/g,
  ),
].map((m, i) => ({
  id: `orang-${i}`,
  periode_id: periode.id,
  urutan: Number(m[1]),
  grup: m[2],
  bidang:
    m[3] === "null"
      ? null
      : {
          slug: m[3].slice(1, -1),
          nama_resmi: m[3].slice(1, -1),
          nama_singkat: m[3].slice(1, -1),
          urutan: bidang.indexOf(m[3].slice(1, -1)) + 1,
        },
  jabatan: m[4],
  nama: m[5],
  gelar: m[6] === "null" ? null : m[6].slice(1, -1),
  rt: null,
  foto_path: null,
  instagram: null,
  izin_foto: false,
  izin_instagram: false,
}));
const dataAwal = () => ({
  periode: [periode],
  bidang: bidang.map((slug) => ({
    slug,
    nama_resmi: slug,
    nama_singkat: slug,
    tagline: null,
    deskripsi: null,
    fokus: [],
  })),
  pengurus: [...seed].reverse(),
  kegiatan: [],
});

async function muat(data = dataAwal(), rusak = null) {
  const calls = [];
  const client = new vm.SyntheticModule(["supabase"], function () {
    this.setExport("supabase", {
      from(tabel) {
        const call = { tabel, select: "", filter: {} };
        calls.push(call);
        const chain = {
          select(s) {
            call.select = s;
            return chain;
          },
          eq(k, v) {
            call.filter[k] = v;
            return chain;
          },
          order() {
            return chain;
          },
          then(resolve, reject) {
            return Promise.resolve({
              data:
                data[tabel]?.filter((r) =>
                  Object.entries(call.filter).every(([k, v]) => r[k] === v),
                ) ?? null,
              error: tabel === rusak ? { message: "uji koneksi gagal" } : null,
            }).then(resolve, reject);
          },
        };
        return chain;
      },
    });
  });
  const storage = new vm.SyntheticModule(["urlPublik"], function () {
    this.setExport("urlPublik", (_bucket, path) => (path ? `https://media.invalid/${path}` : null));
  });
  const modules = new Map();
  const berkas = {
    "@/services/organisasi": "../src/services/organisasi.ts",
    "@/services/konten": "../src/services/konten.ts",
    "@/services/program": "../src/services/program.ts",
  };
  async function impor(specifier) {
    if (specifier === "@/integrations/supabase/client") return client;
    if (specifier === "@/services/storage") return storage;
    if (modules.has(specifier)) return modules.get(specifier);
    assert.ok(berkas[specifier], `Import tak terduga: ${specifier}`);
    const mod = new vm.SourceTextModule(
      ts.transpileModule(baca(berkas[specifier]), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    );
    modules.set(specifier, mod);
    await mod.link(impor);
    return mod;
  }
  const mod = await impor("@/services/program");
  await mod.evaluate();
  return {
    organisasi: modules.get("@/services/organisasi").namespace,
    program: mod.namespace,
    calls,
  };
}

test("61 nama, gelar, jabatan dan bidang sesuai lampiran seed; urutan stabil walau input terbalik", async () => {
  assert.equal(seed.length, 61);
  const { organisasi } = await muat();
  const hasil = await organisasi.ambilOrganisasi();
  assert.deepEqual(
    Array.from(hasil.pengurus, (p) => [p.nama, p.gelar ?? null, p.jabatan, p.bidang ?? null]),
    seed.map((p) => [p.nama, p.gelar, p.jabatan, p.bidang?.slug ?? null]),
  );
  assert.equal(hasil.pengurus.filter((p) => p.group === "BPH").length, 8);
  assert.equal(hasil.pengurus.filter((p) => p.group === "PENASIHAT").length, 2);
  assert.equal(hasil.pengurus.filter((p) => p.group === "BIDANG").length, 51);
  assert.doesNotThrow(() => structuredClone(hasil));
});

test("izin foto/Instagram dicek sebelum serialisasi meski baris lama masih menyimpan nilainya", async () => {
  const d = dataAwal();
  d.pengurus = [
    {
      ...seed[0],
      foto_path: "belum-diizinkan.webp",
      instagram: "@uji",
      email: "privat.invalid",
      telepon: "privat",
    },
  ];
  const { organisasi, calls } = await muat(d);
  const [p] = await organisasi.ambilPengurus({ id: periode.id, label: periode.label });
  assert.equal(p.fotoUrl, undefined);
  assert.equal(p.instagram, undefined);
  assert.doesNotMatch(JSON.stringify(p), /privat|belum-diizinkan|@uji/);
  assert.doesNotMatch(calls[0].select, /email|telepon|\*/);
  assert.match(calls[0].select, /izin_foto, izin_instagram/);
});

test("foto dan Instagram berizin tampil; izin terpisah tidak saling mengaktifkan", async () => {
  for (const [izin_foto, izin_instagram] of [
    [true, true],
    [true, false],
    [false, true],
  ]) {
    const d = dataAwal();
    d.pengurus = [
      { ...seed[0], foto_path: "berizin.webp", instagram: "@uji.rw03", izin_foto, izin_instagram },
    ];
    const { organisasi } = await muat(d);
    const [p] = await organisasi.ambilPengurus({ id: periode.id, label: periode.label });
    assert.equal(p.fotoUrl, izin_foto ? "https://media.invalid/berizin.webp" : undefined);
    assert.equal(p.instagram, izin_instagram ? "@uji.rw03" : undefined);
  }
});

test("handle Instagram invalid tidak menjadi tautan profil", async () => {
  for (const instagram of ["https://evil.invalid", "../admin", "", "@nama/uji"]) {
    const d = dataAwal();
    d.pengurus = [{ ...seed[0], instagram, izin_instagram: true }];
    const { organisasi } = await muat(d);
    const [p] = await organisasi.ambilPengurus({ id: periode.id, label: periode.label });
    assert.equal(p.instagram, undefined);
  }
});

test("periode aktif dipilih; tanggal SK tidak disamakan dengan pelantikan", async () => {
  const d = dataAwal();
  d.periode.unshift({ ...periode, id: "lama", aktif: false, label: "Lama" });
  const { organisasi, calls } = await muat(d);
  const hasil = await organisasi.ambilOrganisasi();
  assert.equal(hasil.periodeAktif.id, periode.id);
  assert.equal(hasil.periodeAktif.tanggalSK, "05 Juni 2025");
  assert.equal(hasil.periodeAktif.tanggalPelantikan, null);
  assert.equal(calls.find((c) => c.tabel === "pengurus").filter.periode_id, periode.id);
});

test("tujuh detail bidang hanya berisi anggota dan kegiatan terbit miliknya", async () => {
  const jumlah = [7, 4, 8, 8, 13, 7, 4];
  for (const [i, slug] of bidang.entries()) {
    const d = dataAwal();
    d.kegiatan = [
      {
        id: "terbit",
        slug: "agenda",
        judul: "Agenda bidang",
        status: "terbit",
        bidang: { slug },
        mulai: null,
        rutin: "Setiap minggu",
        tahap: "rencana",
      },
      { id: "draft", status: "draft", bidang: { slug } },
      { id: "lain", status: "terbit", bidang: { slug: "bidang-lain" }, mulai: null },
    ];
    const { program, calls } = await muat(d);
    const hasil = await program.ambilDetailBidang(slug);
    assert.equal(hasil.pengurus.length, jumlah[i]);
    assert.equal(hasil.pengurus[0].jabatan, "Kepala Bidang");
    assert.ok(hasil.pengurus.every((p) => p.bidang === slug && p.group === "BIDANG"));
    assert.deepEqual(
      Array.from(hasil.kegiatan, (k) => k.id),
      ["terbit"],
    );
    assert.equal(calls.find((c) => c.tabel === "kegiatan").filter.status, "terbit");
    assert.doesNotThrow(() => structuredClone(hasil));
  }
});

test("slug hilang/invalid menghasilkan null, berbeda dari gangguan layanan", async () => {
  const { program, calls } = await muat();
  assert.equal(await program.ambilDetailBidang("../admin"), null);
  assert.equal(calls.length, 0);
  assert.equal(await program.ambilDetailBidang("tidak-ada"), null);
  assert.equal(calls.filter((c) => c.tabel === "kegiatan").length, 0);
  for (const tabel of ["periode", "bidang", "pengurus", "kegiatan"]) {
    const gagal = await muat(dataAwal(), tabel);
    await assert.rejects(() => gagal.program.ambilDetailBidang("media"), /Gagal memuat/);
  }
});

test("bidang tanpa pengurus/kegiatan tetap valid; periode kosong gagal jelas", async () => {
  const d = dataAwal();
  d.pengurus = [];
  const { program } = await muat(d);
  const hasil = await program.ambilDetailBidang("media");
  assert.equal(hasil.pengurus.length, 0);
  assert.equal(hasil.kegiatan.length, 0);
  d.periode = [];
  const kosong = await muat(d);
  await assert.rejects(() => kosong.organisasi.ambilOrganisasi(), /Gagal memuat periode aktif/);
});
