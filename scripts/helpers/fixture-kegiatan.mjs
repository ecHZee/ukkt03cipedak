import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

/** Fixture sementara; tidak menautkan atau mengubah pengurus/akun asli. */
export async function buatFixtureKegiatan() {
  const env = parseEnv(readFileSync(new URL("../../.env.local", import.meta.url), "utf8"));
  const opts = { auth: { persistSession: false, autoRefreshToken: false } };
  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, opts);
  const anon = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, opts);
  const run = randomBytes(5).toString("hex");
  const akun = {};
  const fixture = {
    run,
    akun,
    admin,
    anon,
    url: env.SUPABASE_URL,
    key: env.SUPABASE_PUBLISHABLE_KEY,
  };
  try {
    const b = await admin.from("bidang").select("id, slug").in("slug", ["media", "pendidikan"]);
    const p = await admin.from("periode").select("id").eq("aktif", true).single();
    if (b.error || p.error) throw new Error("Pilihan bidang/periode uji tidak tersedia");
    fixture.bidangA = b.data.find((r) => r.slug === "media").id;
    fixture.bidangB = b.data.find((r) => r.slug === "pendidikan").id;
    fixture.periode = p.data.id;
    for (const [nama, role, bidang_id, izin_kontribusi, aktif] of [
      ["bph", "admin", null, false, true],
      ["super", "super_admin", null, false, true],
      ["kabidA", "admin", fixture.bidangA, false, true],
      ["kabidB", "admin", fixture.bidangB, false, true],
      ["anggota", "anggota", fixture.bidangA, true, true],
      ["pembaca", "anggota", fixture.bidangA, false, true],
      ["nonaktif", "admin", fixture.bidangA, false, false],
    ]) {
      const email = `uji-h17-${nama.toLowerCase()}-${run}@example.com`;
      const password = randomBytes(20).toString("base64url");
      const u = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (u.error) throw new Error(`Gagal membuat akun uji ${nama}`);
      akun[nama] = { id: u.data.user.id, email, password };
      const r = await admin.from("profiles").insert({
        id: u.data.user.id,
        nama_tampilan: `UJI Hari 17 ${nama}`,
        role,
        bidang_id,
        izin_kontribusi,
        aktif,
        harus_ganti_password: false,
      });
      if (r.error) throw new Error(`Gagal membuat profil uji ${nama}: ${r.error.message}`);
      const client = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, opts);
      const login = await client.auth.signInWithPassword({ email, password });
      if (login.error) throw new Error(`Gagal masuk akun uji ${nama}`);
      akun[nama].client = client;
    }
    return fixture;
  } catch (e) {
    await bersihkanFixtureKegiatan(fixture);
    throw e;
  }
}

export async function bersihkanFixtureKegiatan(f) {
  const users = Object.values(f.akun).map((a) => a.id);
  if (!users.length) return;
  const catat = (r, label) => {
    if (r.error) throw new Error(`Pembersihan ${label} gagal: ${r.error.message}`);
  };
  const k = await f.admin.from("kegiatan").delete().in("created_by", users).select("id");
  catat(k, "kegiatan");
  for (const id of users) catat(await f.admin.auth.admin.deleteUser(id), "akun");
  const records = [...users, ...(k.data ?? []).map((r) => r.id)];
  catat(await f.admin.from("audit_log").delete().in("record_id", records), "audit record");
  catat(await f.admin.from("audit_log").delete().in("user_id", users), "audit pengguna");
  for (const [t, kolom, ids] of [
    ["profiles", "id", users],
    ["kegiatan", "created_by", users],
    ["audit_log", "record_id", records],
    ["audit_log", "user_id", users],
  ]) {
    const r = await f.admin.from(t).select("*", { count: "exact", head: true }).in(kolom, ids);
    catat(r, t);
    if (r.count !== 0) throw new Error(`Pembersihan ${t} belum tuntas`);
  }
  for (const id of users) {
    const r = await f.admin.auth.admin.getUserById(id);
    if (r.data?.user) throw new Error("Akun Auth uji masih tersisa");
  }
}
