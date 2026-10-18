import assert from "node:assert/strict";
import { muatLayananKegiatan } from "./helpers/layanan-kegiatan.mjs";
import { buatFixtureKegiatan, bersihkanFixtureKegiatan } from "./helpers/fixture-kegiatan.mjs";

const { lib, server } = await muatLayananKegiatan();
let f,
  jumlah = 0;
async function uji(nama, fn) {
  await fn();
  jumlah++;
  console.log(`Lolos ${jumlah}: ${nama}`);
}
try {
  f = await buatFixtureKegiatan();
  const dasar = {
    judul: `UJI H17 ${f.run}`,
    slug: `uji-h17-${f.run}`,
    ringkasan: "Data uji sementara, segera dihapus",
    isi: "Uji alur kegiatan",
    bidang_id: f.bidangA,
    periode_id: f.periode,
    mulai: "",
    selesai: "",
    rutin: "Setiap Jumat malam",
    lokasi: "Lokasi uji",
    tahap: "rencana",
    status: "draft",
  };
  const simpan = (nama, d) =>
    server.simpanKegiatan(
      f.akun[nama].client,
      f.akun[nama].id,
      lib.formulirKegiatan.parse({ ...dasar, ...d }),
    );
  const ruang = (nama) => server.ruangKegiatan(f.akun[nama].client, f.akun[nama].id);
  const baris = async (id) => {
    const r = await f.admin.from("kegiatan").select("*").eq("id", id).single();
    assert.ifError(r.error);
    return r.data;
  };
  let hasil, lama, versi;
  await uji("anggota berizin membuat draft sendiri", async () => {
    hasil = await simpan("anggota", {});
    lama = await baris(hasil.id);
    assert.equal(lama.created_by, f.akun.anggota.id);
  });
  await uji("draft tidak terbaca pengunjung", async () => {
    const r = await f.anon.from("kegiatan").select("id").eq("id", hasil.id);
    assert.equal(r.data.length, 0);
  });
  await uji("Kabid bidang lain tidak menerima draft", async () => {
    assert.equal(
      (await ruang("kabidB")).kegiatan.some((r) => r.id === hasil.id),
      false,
    );
  });
  await uji("anggota tidak dapat menerbitkan via service", async () => {
    await assert.rejects(
      simpan("anggota", { id: hasil.id, versi: lama.updated_at, status: "terbit" }),
      /berhak/,
    );
    assert.equal((await baris(hasil.id)).status, "draft");
  });
  await uji("RLS menolak publish langsung, melewati service", async () => {
    const r = await f.akun.anggota.client
      .from("kegiatan")
      .update({ status: "terbit" })
      .eq("id", hasil.id)
      .select();
    assert.ok(r.error || r.data?.length === 0);
    assert.equal((await baris(hasil.id)).status, "draft");
  });
  await uji("anggota tidak dapat memindah draft ke bidang lain", async () => {
    await assert.rejects(
      simpan("anggota", { id: hasil.id, versi: lama.updated_at, bidang_id: f.bidangB }),
      /berhak/,
    );
  });
  await uji("akun tanpa izin kontribusi ditolak", async () => {
    await assert.rejects(simpan("pembaca", { slug: `${dasar.slug}-pembaca` }), /berhak/);
    assert.equal((await ruang("pembaca")).kegiatan.length, 0);
  });
  await uji("akun nonaktif ditolak oleh server", async () => {
    await assert.rejects(ruang("nonaktif"), /Akses akun/);
  });
  await uji("anggota mengajukan draft ke review", async () => {
    await simpan("anggota", { id: hasil.id, versi: lama.updated_at, status: "review" });
    lama = await baris(hasil.id);
    assert.equal(lama.status, "review");
  });
  await uji("review tetap privat dan tersedia bagi Kabid bidangnya", async () => {
    const r = await f.anon.from("kegiatan").select("id").eq("id", hasil.id);
    assert.equal(r.data.length, 0);
    assert.ok((await ruang("kabidA")).kegiatan.some((k) => k.id === hasil.id));
  });
  await uji("Kabid bidang lain tidak dapat mengubah via service", async () => {
    await assert.rejects(
      simpan("kabidB", { id: hasil.id, versi: lama.updated_at, judul: "Dilarang" }),
      /hak akses/,
    );
  });
  await uji("slug duplikat ditolak tanpa menimpa baris awal", async () => {
    await assert.rejects(simpan("kabidA", {}), /sudah digunakan/);
    assert.equal((await baris(hasil.id)).judul, dasar.judul);
  });
  await uji("Kabid menyetujui, metadata trigger dan publik langsung benar", async () => {
    versi = lama.updated_at;
    await simpan("kabidA", { id: hasil.id, versi, status: "terbit" });
    lama = await baris(hasil.id);
    assert.equal(lama.disetujui_oleh, f.akun.kabidA.id);
    assert.ok(lama.terbit_at);
    const r = await f.anon.from("kegiatan").select("slug").eq("id", hasil.id);
    assert.equal(r.data[0].slug, dasar.slug);
  });
  await uji("sunting versi lama ditolak, tidak menimpa terbit", async () => {
    await assert.rejects(
      simpan("kabidA", { id: hasil.id, versi, judul: "Versi lama" }),
      /sudah berubah/,
    );
    assert.equal((await baris(hasil.id)).judul, dasar.judul);
  });
  await uji("anggota tidak dapat mengubah kegiatan yang sudah terbit", async () => {
    await assert.rejects(simpan("anggota", { id: hasil.id, versi: lama.updated_at }), /hak akses/);
    assert.equal((await ruang("anggota")).kegiatan.length, 0);
  });
  await uji("BPH lintas bidang dapat menarik terbit menjadi draft", async () => {
    await simpan("bph", { id: hasil.id, versi: lama.updated_at, status: "draft" });
    lama = await baris(hasil.id);
    assert.equal(lama.terbit_at, null);
    assert.equal(lama.disetujui_oleh, null);
  });
  await uji("Super Admin dapat mengubah bidang dan menerbitkan", async () => {
    await simpan("super", {
      id: hasil.id,
      versi: lama.updated_at,
      bidang_id: f.bidangB,
      status: "terbit",
      tahap: "batal",
    });
    lama = await baris(hasil.id);
    assert.equal(lama.bidang_id, f.bidangB);
    assert.equal(lama.tahap, "batal");
  });
  await uji("Kabid hanya mengelola kegiatan umum buatannya", async () => {
    const umum = await simpan("kabidA", { slug: `${dasar.slug}-umum`, bidang_id: null });
    const row = await baris(umum.id);
    await assert.rejects(
      simpan("kabidB", { id: umum.id, versi: row.updated_at, bidang_id: null }),
      /hak akses/,
    );
  });
  await uji("angka penyimpanan tidak dapat diminta anggota/Kabid", async () => {
    for (const n of ["anggota", "kabidA"])
      await assert.rejects(
        server.pemakaianPenyimpanan(f.akun[n].client, f.akun[n].id),
        /hanya untuk/,
      );
  });
  await uji("JWT anonim tidak diterima sebagai akun aktif", async () => {
    await assert.rejects(server.ruangKegiatan(f.anon, f.akun.bph.id), /Akses akun/);
  });
} finally {
  if (f) {
    await bersihkanFixtureKegiatan(f);
    console.log("Pembersihan terbukti: kegiatan/profil/Auth/audit uji 0 tersisa.");
  }
}
console.log(`${jumlah}/${jumlah} uji integrasi service + RLS lolos.`);
