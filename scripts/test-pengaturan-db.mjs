import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { buatFixtureKegiatan, bersihkanFixtureKegiatan } from "./helpers/fixture-kegiatan.mjs";
import { muatTypescript } from "./helpers/muat-typescript.mjs";
const e = parseEnv(readFileSync(".env.local", "utf8"));
let f,
  jumlah = 0;
const objek = [];
const cek = (r) => {
  if (r.error) throw new Error(r.error.message);
  return r.data;
};
async function uji(n, fn) {
  await fn();
  console.log(`Lolos ${++jumlah}: ${n}`);
}
async function sql(query) {
  const r = await fetch(
    "https://api.supabase.com/v1/projects/twmbcxjojknjtjwtntxr/database/query",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${e.SUPABASE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );
  if (!r.ok)
    throw new Error(
      `Transaksi uji SQL gagal (${r.status}); periksa assertion lokal tanpa mencetak data.`,
    );
  return r.json();
}
try {
  f = await buatFixtureKegiatan();
  const lib = await muatTypescript("src/lib/pengaturan-admin.ts");
  const s = await muatTypescript("src/services/pengaturan-admin.server.ts", {
    "@/integrations/supabase/client.server": { supabaseAdmin: f.admin },
    "@/constants/site": { DOMAIN_AKUN: "akun.katar-rw03.internal" },
  });
  const akun = await muatTypescript("src/services/akun.server.ts", {
    "@/integrations/supabase/client.server": { supabaseAdmin: f.admin },
    "@/constants/site": { DOMAIN_AKUN: "akun.katar-rw03.internal" },
  });
  const awal = cek(await f.admin.from("pengaturan").select("key,value,updated_at").order("key"));
  const ruang = await s.ruangPengaturan(f.akun.bph.client, f.akun.bph.id);
  await uji("BPH dan Super Admin membaca form nyata", async () => {
    assert.equal(Object.keys(ruang.versi).length, 12);
    await s.ruangPengaturan(f.akun.super.client, f.akun.super.id);
  });
  for (const n of ["kabidA", "anggota", "pembaca", "nonaktif"])
    await uji(`${n} ditolak layanan pengaturan dan audit`, async () => {
      await assert.rejects(() => s.ruangPengaturan(f.akun[n].client, f.akun[n].id));
      await assert.rejects(() =>
        s.daftarAudit(f.akun[n].client, f.akun[n].id, lib.filterAudit.parse({})),
      );
      assert(
        (
          await f.akun[n].client.rpc("simpan_pengaturan_situs", {
            p_data: ruang.nilai,
            p_versi: ruang.versi,
          })
        ).error,
      );
    });
  await uji("anon tidak dapat menyimpan atau membaca audit", async () => {
    assert(
      (await f.anon.rpc("simpan_pengaturan_situs", { p_data: ruang.nilai, p_versi: ruang.versi }))
        .error,
    );
    assert.equal(cek(await f.anon.from("audit_log").select("id")).length, 0);
  });
  await uji("BPH tidak dapat melewati RPC dengan update langsung", async () => {
    const r = await f.akun.bph.client
      .from("pengaturan")
      .update({ value: "UJI" })
      .eq("key", "kontak.whatsapp")
      .select();
    assert(r.error || r.data.length === 0);
  });
  await uji("versi usang dan payload tambahan ditolak tanpa perubahan", async () => {
    assert(
      (
        await f.akun.bph.client.rpc("simpan_pengaturan_situs", {
          p_data: ruang.nilai,
          p_versi: { ...ruang.versi, "organisasi.nama": "2000-01-01T00:00:00Z" },
        })
      ).error,
    );
    assert(
      (
        await f.akun.bph.client.rpc("simpan_pengaturan_situs", {
          p_data: { ...ruang.nilai, "rahasia.token": "UJI" },
          p_versi: ruang.versi,
        })
      ).error,
    );
  });
  // Menguji WA/pengumuman dan CAS dalam transaksi yang DIBATALKAN: tidak pernah terbit di web bersama.
  const d = lib.pengaturanForm.parse(ruang.nilai);
  await uji(
    "SQL transaksi: simpan atomik, audit pelaku, CAS usang, tautan berbahaya, lalu ROLLBACK",
    async () => {
      const query = `begin; set local role authenticated; select set_config('request.jwt.claim.sub','${f.akun.bph.id}',true);
 do $uji$ declare d jsonb := '${JSON.stringify({ ...d, "kontak.whatsapp": "6281234567890", pengumuman: { teks: "UJI TRANS K21", tautan: "/kegiatan", sampai: "2026-10-20" } }).replaceAll("'", "''")}'::jsonb; v jsonb; r jsonb; ditolak boolean; begin
 select jsonb_object_agg(key,to_jsonb(updated_at)) into v from public.pengaturan where key=any(array[${lib.KUNCI_SITUS.map((k) => `'${k}'`).join(",")}]);
 r:=public.simpan_pengaturan_situs(d,v);
 if (select value#>>'{}' from public.pengaturan where key='kontak.whatsapp')<>'6281234567890' then raise exception 'WA tidak berubah';end if;
 if not exists(select 1 from public.audit_log where tabel='pengaturan' and user_id='${f.akun.bph.id}') then raise exception 'audit pelaku kosong';end if;
 ditolak:=false;begin perform public.simpan_pengaturan_situs(d,v);exception when sqlstate 'P0021' then ditolak:=true;end;if not ditolak then raise exception 'CAS gagal';end if;
 ditolak:=false;begin perform public.simpan_pengaturan_situs(jsonb_set(d,'{sosmed.instagram}','"https://instagram.com@evil.invalid/"'),r);exception when others then ditolak:=true;end;if not ditolak then raise exception 'URL berbahaya lolos';end if;
 if (select value#>>'{}' from public.pengaturan where key='kontak.whatsapp')<>'6281234567890' then raise exception 'atomisitas gagal';end if;
 end $uji$; rollback;`;
      await sql(query);
      assert.deepEqual(
        cek(await f.admin.from("pengaturan").select("key,value,updated_at").order("key")),
        awal,
      );
    },
  );
  const path = `pengaturan/${f.akun.bph.id}/${randomUUID()}.webp`;
  objek.push(path);
  const isi = readFileSync("public/logo/logo-192.webp");
  await uji("Storage: BPH unggah WebP unik; Kabid dan path akun lain ditolak", async () => {
    cek(
      await f.akun.bph.client.storage
        .from("media")
        .upload(path, isi, { contentType: "image/webp" }),
    );
    for (const n of ["kabidA", "anggota", "nonaktif"])
      assert(
        (
          await f.akun[n].client.storage
            .from("media")
            .upload(`pengaturan/${f.akun[n].id}/${randomUUID()}.webp`, isi, {
              contentType: "image/webp",
            })
        ).error,
      );
    assert(
      (
        await f.akun.super.client.storage
          .from("media")
          .upload(path.replace(path.split("/")[2], randomUUID() + ".webp"), isi, {
            contentType: "image/webp",
          })
      ).error,
    );
  });
  await uji("Storage: nama sama tidak bisa ditimpa; SVG/MIME lain ditolak", async () => {
    assert(
      (
        await f.akun.bph.client.storage
          .from("media")
          .upload(path, isi, { contentType: "image/webp", upsert: true })
      ).error,
    );
    assert(
      (
        await f.akun.bph.client.storage
          .from("media")
          .upload(`pengaturan/${f.akun.bph.id}/${randomUUID()}.webp`, Buffer.from("<svg/>"), {
            contentType: "image/svg+xml",
          })
      ).error,
    );
  });
  await uji(
    "SQL transaksi: aset dipakai terlindung; pencabutan masuk antrean; ROLLBACK",
    async () => {
      const foto = { ...d["situs.tampilan"], logo: path };
      await sql(`begin;set local role authenticated;select set_config('request.jwt.claim.sub','${f.akun.bph.id}',true);do $uji$ declare d jsonb:='${JSON.stringify({ ...d, "situs.tampilan": foto }).replaceAll("'", "''")}';v jsonb;r jsonb;begin
  select jsonb_object_agg(key,to_jsonb(updated_at)) into v from public.pengaturan where key=any(array[${lib.KUNCI_SITUS.map((k) => `'${k}'`).join(",")}]);r:=public.simpan_pengaturan_situs(d,v);
  if public.aset_situs_boleh_hapus('${path}') then raise exception 'aset aktif boleh dihapus';end if;
  r:=public.simpan_pengaturan_situs(jsonb_set(d,'{situs.tampilan,logo}','""'),r);
  if not exists(select 1 from public.aset_situs_sampah where path='${path}') then raise exception 'antrean kosong';end if;
  end $uji$;rollback;`);
    },
  );
  await uji(
    "Super Admin: ubah username, reset, nonaktif/aktif dan audit tanpa password",
    async () => {
      const target = f.akun.pembaca.id,
        actor = f.akun.super.id;
      await akun.gantiUsername(actor, target, `uji.h21.${f.run}`);
      const hasil = await akun.resetPassword(actor, target);
      assert(hasil.password);
      await akun.ubahStatus(actor, target, false);
      await akun.ubahStatus(actor, target, true);
      const log = cek(
        await f.admin
          .from("audit_log")
          .select("sesudah")
          .eq("tabel", "akun")
          .eq("record_id", target),
      );
      assert(log.length >= 4);
      assert(!JSON.stringify(log).includes(hasil.password));
      await assert.rejects(() => akun.gantiUsername(f.akun.bph.id, target, `uji.tolak.${f.run}`));
    },
  );
  await uji("Audit: filter pelaku/modul, pagination stabil, DTO tanpa JSON pribadi", async () => {
    for (let i = 0; i < 27; i++)
      cek(
        await f.admin.from("audit_log").insert({
          tabel: "akun",
          aksi: "UPDATE",
          record_id: f.akun.super.id,
          user_id: f.akun.super.id,
          sesudah: { aksi: "reset_password", email: "JANGAN_KIRIM", password: "RAHASIA_UJI" },
        }),
      );
    const a = await s.daftarAudit(
      f.akun.bph.client,
      f.akun.bph.id,
      lib.filterAudit.parse({ modul: "akun", pelaku: f.akun.super.id }),
    );
    const b = await s.daftarAudit(
      f.akun.bph.client,
      f.akun.bph.id,
      lib.filterAudit.parse({ modul: "akun", pelaku: f.akun.super.id, halaman: 1 }),
    );
    assert.equal(a.baris.length, 25);
    assert(b.baris.length);
    assert(!a.baris.some((x) => b.baris.some((y) => x.id === y.id)));
    assert(!/JANGAN_KIRIM|RAHASIA_UJI|sesudah|sebelum/.test(JSON.stringify(a)));
  });
  await uji("konflik versi memberi SQLSTATE aplikasi dalam 15 detik", async () => {
    const r = await f.akun.bph.client
      .rpc("simpan_pengaturan_situs", {
        p_data: ruang.nilai,
        p_versi: { ...ruang.versi, "organisasi.nama": "2000-01-01T00:00:00Z" },
      })
      .abortSignal(AbortSignal.timeout(15000));
    assert.equal(r.error?.code, "P0021");
  });
  await uji("reservasi persisten dan buang unggahan batal", async () => {
    const { path: p } = await s.siapkanAsetSitus(f.akun.bph.client, f.akun.bph.id);
    objek.push(p);
    cek(
      await f.akun.bph.client.storage.from("media").upload(p, isi, { contentType: "image/webp" }),
    );
    assert(cek(await f.admin.from("aset_situs_sampah").select("path").eq("path", p)).length);
    await s.buangUnggahanSitus(f.akun.bph.client, f.akun.bph.id, p);
    assert.equal(
      cek(await f.admin.from("aset_situs_sampah").select("path").eq("path", p)).length,
      0,
    );
  });
  await uji("WebP palsu ditolak layanan sebelum publikasi", async () => {
    const { path: p } = await s.siapkanAsetSitus(f.akun.bph.client, f.akun.bph.id);
    objek.push(p);
    cek(
      await f.akun.bph.client.storage
        .from("media")
        .upload(p, Buffer.from("BUKAN WEBP"), { contentType: "image/webp" }),
    );
    await assert.rejects(
      () =>
        s.simpanPengaturan(
          f.akun.bph.client,
          f.akun.bph.id,
          { ...d, "situs.tampilan": { ...d["situs.tampilan"], logo: p } },
          ruang.versi,
        ),
      /bukan WebP/,
    );
    await s.buangUnggahanSitus(f.akun.bph.client, f.akun.bph.id, p);
  });
  await uji(
    "unggahan aktif disunting dilindungi sejam; unggahan lepas lama dibersihkan",
    async () => {
      const { path: p } = await s.siapkanAsetSitus(f.akun.bph.client, f.akun.bph.id);
      objek.push(p);
      cek(
        await f.akun.bph.client.storage.from("media").upload(p, isi, { contentType: "image/webp" }),
      );
      await s.bersihkanAsetSitus(f.akun.bph.client, f.akun.bph.id);
      assert((await f.admin.storage.from("media").download(p)).data);
      cek(
        await f.admin
          .from("aset_situs_sampah")
          .update({ created_at: "2000-01-01T00:00:00Z" })
          .eq("path", p),
      );
      await s.bersihkanAsetSitus(f.akun.bph.client, f.akun.bph.id);
      assert.equal(
        cek(await f.admin.from("aset_situs_sampah").select("path").eq("path", p)).length,
        0,
      );
    },
  );
  await uji("data pengaturan asli identik setelah seluruh uji", async () =>
    assert.deepEqual(
      cek(await f.admin.from("pengaturan").select("key,value,updated_at").order("key")),
      awal,
    ),
  );
} finally {
  if (f) {
    if (objek.length) cek(await f.admin.storage.from("media").remove(objek));
    if (objek.length) cek(await f.admin.from("aset_situs_sampah").delete().in("path", objek));
    for (const a of Object.values(f.akun))
      cek(
        await f.admin
          .from("audit_log")
          .delete()
          .eq("tabel", "aset_situs_sampah")
          .or(`sebelum->>path.like.pengaturan/${a.id}/*,sesudah->>path.like.pengaturan/${a.id}/*`),
      );
    await bersihkanFixtureKegiatan(f);
  }
}
console.log(
  `${jumlah}/${jumlah} skenario integrasi Hari 21 lolos; akun, objek, dan audit uji dibersihkan.`,
);
