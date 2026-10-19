import assert from "node:assert/strict";
import { buatFixtureKegiatan, bersihkanFixtureKegiatan } from "./helpers/fixture-kegiatan.mjs";
import { muatLayananBerita } from "./helpers/layanan-berita.mjs";
const { lib, server, foto } = await muatLayananBerita();
let f,
  jumlah = 0,
  pid,
  gid;
const berkas = [];
async function uji(nama, fn) {
  await fn();
  console.log(`Lolos ${++jumlah}: ${nama}`);
}
try {
  f = await buatFixtureKegiatan();
  const dasar = {
    judul: `UJI H18 ${f.run}`,
    slug: `uji-h18-${f.run}`,
    ringkasan: "Data uji sementara",
    isi: "Paragraf satu\n\n<script>alert(1)</script>",
    bidang_id: f.bidangA,
    pinned: false,
    status: "draft",
    cover_id: null,
  };
  const simpan = (nama, d = {}) =>
    server.simpanBerita(
      f.akun[nama].client,
      f.akun[nama].id,
      lib.formulirBerita.parse({ ...dasar, ...d }),
    );
  const row = async (id) => (await f.admin.from("berita").select("*").eq("id", id).single()).data;
  let b;
  await uji("anggota berizin menyimpan draf sendiri", async () => {
    b = await simpan("anggota");
    assert.equal(b.status, "draft");
  });
  await uji("draf tidak dapat dibaca anonim", async () => {
    assert.equal((await f.anon.from("berita").select("id").eq("id", b.id)).data.length, 0);
  });
  await uji("anggota tidak menerbitkan", () =>
    assert.rejects(async () =>
      simpan("anggota", {
        ...(b && { id: b.id, versi: "2026-01-01T00:00:00Z" }),
        status: "terbit",
      }),
    ),
  );
  await uji("Kabid bidang lain tidak bisa mengubah", async () =>
    assert.rejects(async () => simpan("kabidB", { id: b.id, versi: (await row(b.id)).updated_at })),
  );
  await uji("anggota tidak membuat bidang lain", () =>
    assert.rejects(async () => simpan("anggota", { bidang_id: f.bidangB })),
  );
  await uji("pembaca tanpa kontribusi ditolak", () =>
    assert.rejects(async () => simpan("pembaca")),
  );
  await uji("akun nonaktif ditolak", () => assert.rejects(async () => simpan("nonaktif")));
  await uji("anggota mengajukan review", async () => {
    await simpan("anggota", { id: b.id, versi: (await row(b.id)).updated_at, status: "review" });
    assert.equal((await row(b.id)).status, "review");
  });
  await uji("Kabid menyetujui dan metadata penerbit benar", async () => {
    await simpan("kabidA", { id: b.id, versi: (await row(b.id)).updated_at, status: "terbit" });
    const d = await row(b.id);
    assert.equal(d.disetujui_oleh, f.akun.kabidA.id);
    assert.ok(d.terbit_at);
  });
  await uji("terbit terbaca publik dan teks HTML tetap data", async () => {
    const d = await f.anon.from("berita").select("isi").eq("id", b.id).single();
    assert.equal(d.data.isi, dasar.isi);
  });
  await uji("anggota tidak mengubah berita terbit", async () =>
    assert.rejects(async () =>
      simpan("anggota", { id: b.id, versi: (await row(b.id)).updated_at }),
    ),
  );
  await uji("berita terbit tidak boleh dihapus langsung", async () => {
    await assert.rejects(
      () =>
        server.hapusBerita(f.akun.kabidA.client, f.akun.kabidA.id, b.id, "2020-01-01T00:00:00Z"),
      /Tarik berita/,
    );
  });
  await uji("BPH menarik ke draf dan hilang dari publik", async () => {
    await simpan("bph", { id: b.id, versi: (await row(b.id)).updated_at, status: "draft" });
    assert.equal((await f.anon.from("berita").select("id").eq("id", b.id)).data.length, 0);
  });
  await uji("konflik versi tidak menimpa suntingan", () =>
    assert.rejects(
      async () => simpan("kabidA", { id: b.id, versi: "2020-01-01T00:00:00Z" }),
      /sudah berubah/,
    ),
  );
  await uji("slug duplikat ditolak", () =>
    assert.rejects(async () => simpan("kabidA"), /Alamat berita/),
  );
  await uji("ruang anggota tidak mengirim draf orang lain", async () => {
    await simpan("kabidA", { slug: `uji-h18-admin-${f.run}` });
    const r = await server.ruangBerita(f.akun.anggota.client, f.akun.anggota.id);
    assert.ok(r.berita.every((x) => x.created_by === f.akun.anggota.id));
  });
  await uji("RPC langsung anonim dan lintas bidang ditolak RLS", async () => {
    for (const db of [f.anon, f.akun.kabidB.client]) {
      const r = await db.rpc("simpan_berita_admin", { p_data: dasar });
      assert.ok(r.error);
    }
  });
  const img = Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "base64");
  const path = `berita/${f.akun.anggota.id}/uji-${f.run}.webp`,
    thumbPath = path.replace(".webp", "_thumb.webp");
  for (const p of [path, thumbPath]) {
    const r = await f.akun.anggota.client.storage
      .from("media")
      .upload(p, img, { contentType: "image/webp", cacheControl: "0" });
    assert.ifError(r.error);
    berkas.push(p);
  }
  const sampul = {
    path,
    thumbPath,
    lebar: 1,
    tinggi: 1,
    ukuranByte: img.length,
    caption: "Gambar sintetis",
  };
  await uji("sampul dan berita disimpan atomik", async () => {
    const r = await simpan("anggota", { slug: `uji-h18-sampul-${f.run}`, sampul });
    const d = await row(r.id);
    assert.ok(d.cover_id);
    assert.equal(
      (await f.admin.from("media").select("storage_path").eq("id", d.cover_id).single()).data
        .storage_path,
      path,
    );
  });
  await uji("gagal slug tidak menyisakan baris media", async () => {
    const sebelum = (
      await f.admin
        .from("media")
        .select("id", { head: true, count: "exact" })
        .eq("created_by", f.akun.anggota.id)
    ).count;
    await assert.rejects(async () => simpan("anggota", { sampul }));
    const sesudah = (
      await f.admin
        .from("media")
        .select("id", { head: true, count: "exact" })
        .eq("created_by", f.akun.anggota.id)
    ).count;
    assert.equal(sesudah, sebelum);
  });
  await uji("path sampul asing ditolak", () =>
    assert.rejects(async () =>
      simpan("anggota", {
        slug: `uji-h18-asing-${f.run}`,
        sampul: { ...sampul, path: `berita/${f.akun.kabidA.id}/asing.webp` },
      }),
    ),
  );
  const p = await f.admin
    .from("periode")
    .insert({ label: `UJI H18 ${f.run}`, aktif: false })
    .select("id")
    .single();
  assert.ifError(p.error);
  pid = p.data.id;
  const g = await f.admin
    .from("pengurus")
    .insert({
      periode_id: pid,
      nama: `UJI H18 ${f.run}`,
      jabatan: "Anggota Bidang",
      grup: "bidang",
      bidang_id: f.bidangA,
    })
    .select("id")
    .single();
  assert.ifError(g.error);
  gid = g.data.id;
  assert.ifError(
    (await f.admin.from("profiles").update({ pengurus_id: gid }).eq("id", f.akun.anggota.id)).error,
  );
  const photo = `profil/${f.akun.anggota.id}/uji-${f.run}.webp`;
  berkas.push(photo);
  assert.ifError(
    (
      await f.akun.anggota.client.storage
        .from("media")
        .upload(photo, img, { contentType: "image/webp", cacheControl: "0" })
    ).error,
  );
  await uji("profil aktif menerima foto sendiri", async () => {
    await foto.simpanFotoProfil(f.akun.anggota.client, f.akun.anggota.id, photo, true);
  });
  await uji("ganti foto membersihkan objek sebelumnya", async () => {
    const baru = `profil/${f.akun.anggota.id}/ganti-${f.run}.webp`;
    berkas.push(baru);
    assert.ifError(
      (
        await f.akun.anggota.client.storage
          .from("media")
          .upload(baru, img, { contentType: "image/webp", cacheControl: "0" })
      ).error,
    );
    await foto.simpanFotoProfil(f.akun.anggota.client, f.akun.anggota.id, baru, true);
    const url = f.anon.storage.from("media").getPublicUrl(photo).data.publicUrl;
    assert.notEqual((await fetch(url + "?uji=" + Date.now())).status, 200);
  });
  await uji("RPC langsung tidak melepas foto sebelum objek dihapus", async () => {
    const r = await f.akun.anggota.client.rpc("ubah_foto_saya", {
      p_foto_path: null,
      p_izin: false,
    });
    assert.ok(r.error);
  });
  await uji("cabut izin menghapus objek dan referensi", async () => {
    await foto.simpanFotoProfil(f.akun.anggota.client, f.akun.anggota.id, null, false);
    const r = await f.admin.from("pengurus").select("foto_path,izin_foto").eq("id", gid).single();
    assert.equal(r.data.foto_path, null);
    assert.equal(r.data.izin_foto, false);
    const url = f.anon.storage.from("media").getPublicUrl(photo).data.publicUrl;
    assert.notEqual((await fetch(url + "?uji=" + Date.now())).status, 200);
    const urlBaru = f.anon.storage
      .from("media")
      .getPublicUrl(`profil/${f.akun.anggota.id}/ganti-${f.run}.webp`).data.publicUrl;
    assert.notEqual((await fetch(urlBaru + "?uji=" + Date.now())).status, 200);
  });
  await uji("foto profil nonaktif dan path asing ditolak service", async () => {
    await assert.rejects(() =>
      foto.simpanFotoProfil(f.akun.nonaktif.client, f.akun.nonaktif.id, null, false),
    );
    await assert.rejects(() =>
      foto.simpanFotoProfil(
        f.akun.anggota.client,
        f.akun.anggota.id,
        `profil/${f.akun.kabidA.id}/asing.webp`,
        true,
      ),
    );
  });
  await uji("hapus draf dibatasi bidang dan versi", async () => {
    const r = await simpan("kabidA", { slug: `uji-h18-hapus-${f.run}` });
    await assert.rejects(() =>
      server.hapusBerita(f.akun.kabidB.client, f.akun.kabidB.id, r.id, "2020-01-01T00:00:00Z"),
    );
    await assert.rejects(() =>
      server.hapusBerita(f.akun.kabidA.client, f.akun.kabidA.id, r.id, "2020-01-01T00:00:00Z"),
    );
    await server.hapusBerita(
      f.akun.kabidA.client,
      f.akun.kabidA.id,
      r.id,
      (await row(r.id)).updated_at,
    );
    assert.equal((await f.admin.from("berita").select("id").eq("id", r.id)).data.length, 0);
  });
  console.log(`${jumlah}/${jumlah} integrasi berita/foto lolos.`);
} finally {
  if (f) {
    const ids = Object.values(f.akun).map((a) => a.id),
      records = [];
    for (const t of ["berita", "media"]) {
      const r = await f.admin.from(t).delete().in("created_by", ids).select("id");
      assert.ifError(r.error);
      records.push(...r.data.map((x) => x.id));
    }
    if (berkas.length) assert.ifError((await f.admin.storage.from("media").remove(berkas)).error);
    if (gid) {
      assert.ifError(
        (await f.admin.from("profiles").update({ pengurus_id: null }).eq("id", f.akun.anggota.id))
          .error,
      );
      assert.ifError((await f.admin.from("pengurus").delete().eq("id", gid)).error);
      records.push(gid);
    }
    if (pid) {
      assert.ifError((await f.admin.from("periode").delete().eq("id", pid)).error);
      records.push(pid);
    }
    if (records.length)
      assert.ifError((await f.admin.from("audit_log").delete().in("record_id", records)).error);
    await bersihkanFixtureKegiatan(f);
    for (const t of ["berita", "media"]) {
      const r = await f.admin
        .from(t)
        .select("id", { head: true, count: "exact" })
        .in("created_by", ids);
      assert.ifError(r.error);
      assert.equal(r.count, 0);
    }
    console.log("Fixture berita/foto/akun dibersihkan; sisa baris 0.");
  }
}
