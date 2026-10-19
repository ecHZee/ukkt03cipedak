import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { buatFixtureKegiatan, bersihkanFixtureKegiatan } from "./helpers/fixture-kegiatan.mjs";
import { muatTypescript } from "./helpers/muat-typescript.mjs";

// Layanan sumber nyata + Storage/RLS nyata. Tidak memakai dokumen atau akun asli.
let f,
  jumlah = 0;
const ids = [],
  objek = [],
  pengurus = [];
const pdf = Buffer.from("%PDF-1.4\n%UJI H20\n");
const cek = (r) => {
  if (r.error) throw new Error(r.error.message);
  return r.data;
};
async function uji(nama, fn) {
  await fn();
  console.log(`Lolos ${++jumlah}: ${nama}`);
}
try {
  f = await buatFixtureKegiatan();
  const mocks = { "@/integrations/supabase/client.server": { supabaseAdmin: f.admin } };
  const s = await muatTypescript("src/services/hari20-admin.server.ts", mocks);
  process.env.SUPABASE_URL = f.url;
  process.env.SUPABASE_PUBLISHABLE_KEY = f.key;
  const gateway = await muatTypescript("src/services/dokumen-gateway.server.ts", mocks);
  const dasar = {
    judul: `UJI H20 ${f.run}`,
    kategori: "lainnya",
    tahun: 2026,
    tanggal: null,
    bidang_id: f.bidangA,
    akses: "anggota",
    status: "draft",
    storage_path: null,
    ukuran_bytes: null,
  };
  async function unggah(nama, isi = pdf, bucket = "dokumen-internal", path) {
    path ??= `arsip/${f.akun[nama].id}/${randomUUID()}.pdf`;
    objek.push({ bucket, path });
    cek(
      await f.akun[nama].client.storage
        .from(bucket)
        .upload(path, isi, { contentType: "application/pdf" }),
    );
    return bucket === "dokumen-internal" ? `privat:${path}` : path;
  }
  const simpan = (nama, data) => s.simpanDokumen(f.akun[nama].client, f.akun[nama].id, data);
  let d;
  await uji("PDF palsu ditolak layanan meski MIME application/pdf", async () => {
    const path = await unggah("kabidA", Buffer.from("BUKAN PDF"));
    await assert.rejects(
      () => simpan("kabidA", { ...dasar, storage_path: path, ukuran_bytes: 9 }),
      /Isi\/ukuran/,
    );
  });
  await uji("ukuran PDF yang tidak cocok ditolak layanan", async () => {
    const path = await unggah("kabidA");
    await assert.rejects(
      () => simpan("kabidA", { ...dasar, storage_path: path, ukuran_bytes: 999 }),
      /Isi\/ukuran/,
    );
  });
  await uji("dokumen baru menolak jalur legacy melalui RPC langsung", async () => {
    const r = await f.akun.bph.client.rpc("simpan_dokumen_admin", {
      p_data: { ...dasar, storage_path: "umum/tidak-ada.pdf" },
    });
    assert(r.error);
  });
  await uji("kontributor menyimpan PDF privat; draf tidak dibuka gateway", async () => {
    const path = await unggah("anggota");
    d = (await simpan("anggota", { ...dasar, storage_path: path, ukuran_bytes: pdf.length }))
      .dokumen;
    ids.push(d.id);
    assert.equal(
      (await gateway.layaniDokumen(new Request(`https://qa.invalid/berkas/dokumen/${d.id}`)))
        .status,
      404,
    );
  });
  await uji("layanan menolak pembaca, nonaktif dan Kabid lintas bidang", async () => {
    for (const nama of ["pembaca", "nonaktif", "kabidB"])
      await assert.rejects(() => simpan(nama, { ...dasar, id: d.id, versi: d.updated_at }));
  });
  await uji("review dan penerbitan oleh Kabid tersimpan dengan penyetuju", async () => {
    d = (await simpan("anggota", { ...d, id: d.id, versi: d.updated_at, status: "review" }))
      .dokumen;
    d = (
      await simpan("kabidA", {
        ...d,
        id: d.id,
        versi: d.updated_at,
        akses: "publik",
        status: "terbit",
      })
    ).dokumen;
    assert.equal(d.disetujui_oleh, f.akun.kabidA.id);
  });
  await uji("gateway GET/HEAD publik menyajikan PDF no-store; POST ditolak", async () => {
    const url = `https://qa.invalid/berkas/dokumen/${d.id}`;
    const r = await gateway.layaniDokumen(new Request(url));
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("cache-control"), "no-store");
    assert.equal(r.headers.get("content-type"), "application/pdf");
    assert.equal(await r.text(), pdf.toString());
    const head = await gateway.layaniDokumen(new Request(url, { method: "HEAD" }));
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal((await gateway.layaniDokumen(new Request(url, { method: "POST" }))).status, 405);
  });
  await uji("publik ke BPH mencabut gateway dan URL baru pengunggah", async () => {
    d = (await simpan("bph", { ...d, id: d.id, versi: d.updated_at, akses: "bph" })).dokumen;
    assert.equal(
      (await gateway.layaniDokumen(new Request(`https://qa.invalid/berkas/dokumen/${d.id}`)))
        .status,
      404,
    );
    await assert.rejects(() => s.bukaDokumen(f.akun.anggota.client, f.akun.anggota.id, d.id));
    assert((await s.bukaDokumen(f.akun.bph.client, f.akun.bph.id, d.id)).url.includes("token="));
  });
  await uji("versi lama tidak menimpa dokumen", async () => {
    await assert.rejects(
      () => simpan("bph", { ...d, id: d.id, versi: "2020-01-01T00:00:00Z" }),
      /berubah/,
    );
  });
  let legacy;
  await uji("legacy publik wajib reupload sebelum dijadikan internal", async () => {
    const path = await unggah("bph", pdf, "dokumen-publik", `umum/${randomUUID()}.pdf`);
    legacy = cek(
      await f.admin
        .from("dokumen")
        .insert({
          ...dasar,
          created_by: f.akun.bph.id,
          storage_path: path,
          ukuran_bytes: pdf.length,
          status: "terbit",
          akses: "publik",
        })
        .select()
        .single(),
    );
    ids.push(legacy.id);
    await assert.rejects(
      () => simpan("bph", { ...legacy, versi: legacy.updated_at, akses: "bph" }),
      /Unggah ulang/,
    );
    const r = await f.akun.bph.client.rpc("simpan_dokumen_admin", {
      p_data: { ...legacy, versi: legacy.updated_at, akses: "bph" },
    });
    assert(r.error);
  });
  await uji("legacy dipindah privat dan URL publik fisik lama tidak lagi 200", async () => {
    const oldPath = legacy.storage_path;
    const path = await unggah("bph");
    legacy = (
      await simpan("bph", { ...legacy, versi: legacy.updated_at, storage_path: path, akses: "bph" })
    ).dokumen;
    const oldUrl = f.admin.storage.from("dokumen-publik").getPublicUrl(oldPath).data.publicUrl;
    assert.notEqual(
      (await fetch(oldUrl, { headers: { "Cache-Control": "no-cache" } })).status,
      200,
    );
  });
  await uji("hapus arsip draf membersihkan metadata dan objek fisik", async () => {
    d = (await simpan("bph", { ...d, versi: d.updated_at, status: "draft" })).dokumen;
    assert.equal(
      (await s.hapusDokumen(f.akun.bph.client, f.akun.bph.id, { id: d.id, versi: d.updated_at }))
        .peringatan,
      null,
    );
    assert(
      (await f.admin.storage.from("dokumen-internal").download(d.storage_path.slice(7))).error,
    );
    assert.equal(cek(await f.admin.from("dokumen").select("id").eq("id", d.id)).length, 0);
  });
  let p;
  await uji("BPH menambah dan menyunting pengurus sintetis tanpa membuat akun", async () => {
    p = await s.simpanPengurus(f.akun.bph.client, f.akun.bph.id, {
      periode_id: f.periode,
      nama: `UJI H20 ${f.run}`,
      gelar: null,
      jabatan: "Anggota Bidang",
      grup: "bidang",
      bidang_id: f.bidangA,
      urutan: 999,
      rt: null,
      aktif: true,
      instagram: null,
      izin_instagram: false,
      foto_path: null,
      izin_foto: false,
    });
    pengurus.push(p.id);
    p = await s.simpanPengurus(f.akun.bph.client, f.akun.bph.id, {
      ...p,
      versi: p.updated_at,
      nama: `UJI H20 sunting ${f.run}`,
    });
    assert(p.nama.includes("sunting"));
    assert.equal(
      cek(await f.admin.from("profiles").select("id").eq("pengurus_id", p.id)).length,
      0,
    );
  });
  await uji("Kabid dan anggota ditolak pengelolaan pengurus di layanan", async () => {
    for (const nama of ["kabidA", "anggota", "nonaktif"])
      await assert.rejects(() =>
        s.simpanPengurus(f.akun[nama].client, f.akun[nama].id, { ...p, versi: p.updated_at }),
      );
  });
  await uji("RPC langsung tidak menonaktifkan pengurus sambil membiarkan izin foto", async () => {
    p = cek(
      await f.admin
        .from("pengurus")
        .update({ foto_path: `pengurus/${p.id}/uji.webp`, izin_foto: true })
        .eq("id", p.id)
        .select()
        .single(),
    );
    const r = await f.akun.bph.client.rpc("simpan_pengurus_admin", {
      p_data: { ...p, versi: p.updated_at, aktif: false },
    });
    assert(r.error);
    p = cek(
      await f.admin
        .from("pengurus")
        .update({ foto_path: null, izin_foto: false })
        .eq("id", p.id)
        .select()
        .single(),
    );
  });
  await uji("cleanup gagal tercatat dan dapat dicoba ulang tanpa mengulang simpan", async () => {
    const oldPath = legacy.storage_path.slice(7);
    const path = await unggah("bph");
    const fault = await muatTypescript("src/services/hari20-admin.server.ts", {
      "@/integrations/supabase/client.server": {
        supabaseAdmin: {
          from: f.admin.from.bind(f.admin),
          storage: {
            from: (bucket) => ({
              download: (p) => f.admin.storage.from(bucket).download(p),
              remove: async () => ({ error: { message: "UJI gangguan pembersihan" } }),
            }),
          },
        },
      },
    });
    const r = await fault.simpanDokumen(f.akun.bph.client, f.akun.bph.id, {
      ...legacy,
      versi: legacy.updated_at,
      storage_path: path,
    });
    legacy = r.dokumen;
    assert(r.peringatan);
    assert.equal(
      cek(await f.admin.from("arsip_sampah").select("id").eq("path", oldPath)).length,
      1,
    );
    assert((await s.bersihkanArsip(f.akun.bph.client, f.akun.bph.id)).jumlah >= 1);
    assert((await f.admin.storage.from("dokumen-internal").download(oldPath)).error);
    assert.equal(
      cek(await f.admin.from("arsip_sampah").select("id").eq("path", oldPath)).length,
      0,
    );
  });
  await uji("BPH tidak menyunting pengurus terkait Super Admin", async () => {
    cek(await f.admin.from("profiles").update({ pengurus_id: p.id }).eq("id", f.akun.super.id));
    await assert.rejects(
      () => s.simpanPengurus(f.akun.bph.client, f.akun.bph.id, { ...p, versi: p.updated_at }),
      /Super Admin/,
    );
    const r = await f.akun.bph.client.rpc("simpan_pengurus_admin", {
      p_data: { ...p, versi: p.updated_at, nama: "Tidak boleh" },
    });
    assert(r.error);
  });
  console.log(`${jumlah}/${jumlah} integrasi arsip/pengurus lolos.`);
} finally {
  if (f) {
    const users = Object.values(f.akun).map((a) => a.id);
    const jejakAwal = cek(await f.admin.from("audit_log").select("record_id").in("user_id", users));
    cek(await f.admin.from("dokumen").delete().in("created_by", users));
    const tasks = cek(
      await f.admin
        .from("arsip_sampah")
        .select("id")
        .in(
          "path",
          objek.map((o) => o.path),
        ),
    );
    for (const o of objek) cek(await f.admin.storage.from(o.bucket).remove([o.path]));
    cek(
      await f.admin
        .from("arsip_sampah")
        .delete()
        .in(
          "path",
          objek.map((o) => o.path),
        ),
    );
    await bersihkanFixtureKegiatan(f);
    cek(await f.admin.from("pengurus").delete().in("id", pengurus));
    const records = [
      ...new Set([
        ...ids,
        ...pengurus,
        ...tasks.map((t) => t.id),
        ...jejakAwal.map((t) => t.record_id).filter(Boolean),
      ]),
    ];
    cek(await f.admin.from("audit_log").delete().in("record_id", records));
    for (const [t, col, values] of [
      ["dokumen", "id", ids],
      ["pengurus", "id", pengurus],
      ["audit_log", "record_id", records],
    ])
      assert.equal(cek(await f.admin.from(t).select("id").in(col, values)).length, 0);
    for (const o of objek) assert((await f.admin.storage.from(o.bucket).download(o.path)).error);
    console.log("Pembersihan dokumen/pengurus/objek/Auth/audit uji terverifikasi 0.");
  }
}
