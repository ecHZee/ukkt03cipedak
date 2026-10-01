/**
 * Kelola akun admin — KHUSUS programmer (Super Admin). Pendaftaran publik dimatikan,
 * jadi semua akun dibuat lewat skrip ini.
 *
 *   npm run akun -- buat            → buat akun baru (Super Admin / Admin BPH / Admin bidang)
 *   npm run akun -- daftar          → lihat semua akun
 *   npm run akun -- reset <email>   → ganti password akun
 *   npm run akun -- nonaktif <email>
 *   npm run akun -- aktifkan <email>
 *
 * Password diketik langsung di terminal (tersembunyi). Jangan pernah mengirim password lewat chat.
 * Butuh SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parseEnv } from "node:util";

const env = parseEnv(readFileSync(".env.local", "utf8"));
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("✖ Isi SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local");
  process.exit(1);
}
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ------------------------------------------------------------------ input terminal
const rl = createInterface({ input: process.stdin, output: process.stdout });
const tanya = async (q) => (await rl.question(q)).trim();

/**
 * Input tersembunyi. readline sendiri ikut menggemakan ketikan, jadi selama input rahasia
 * semua keluaran readline dibisukan dan hanya "*" yang ditulis.
 */
async function tanyaRahasia(q) {
  const NL = String.fromCharCode(10);
  const CR = String.fromCharCode(13);
  const HAPUS_BARIS = String.fromCharCode(27) + "[K";
  process.stdout.write(q);
  const asli = rl._writeToOutput;
  rl._writeToOutput = (str) => {
    if (str.includes(NL) || str.includes(CR)) return process.stdout.write(NL);
    // Hanya bintang sepanjang ketikan — huruf asli tidak pernah ditulis.
    process.stdout.write(CR + q + "*".repeat(rl.line.length) + HAPUS_BARIS);
  };
  try {
    return await rl.question("");
  } finally {
    rl._writeToOutput = asli;
  }
}

async function tanyaPasswordBaru() {
  for (;;) {
    const p1 = await tanyaRahasia("Password (min. 10 karakter): ");
    if (p1.length < 10) {
      console.log("  ✖ Terlalu pendek, minimal 10 karakter.");
      continue;
    }
    const p2 = await tanyaRahasia("Ulangi password: ");
    if (p1 !== p2) {
      console.log("  ✖ Tidak sama, ulangi.");
      continue;
    }
    return p1;
  }
}

async function cariUser(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (u || data.users.length < 200) return u ?? null;
  }
}

// ------------------------------------------------------------------ perintah
async function buat() {
  console.log("\n➕ Buat akun admin baru\n");
  const email = (await tanya("Email: ")).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Format email tidak valid");
  if (await cariUser(email))
    throw new Error("Email sudah terdaftar. Pakai `reset` untuk ganti password.");
  const nama = await tanya("Nama tampilan (mis. Hanif — Bid. Media): ");
  if (!nama) throw new Error("Nama wajib diisi");

  console.log(
    "\nPeran:\n  1) Super Admin  (programmer — kelola akun)\n  2) Admin BPH    (semua bidang)\n  3) Admin bidang (Kabid / anggota pilihan Kabid)",
  );
  const pilih = await tanya("Pilih 1/2/3: ");
  let role = "admin";
  let bidang_id = null;
  if (pilih === "1") role = "super_admin";
  else if (pilih === "3") {
    const { data: bidang, error } = await db
      .from("bidang")
      .select("id, nama_singkat")
      .order("urutan");
    if (error) throw error;
    bidang.forEach((b, i) => console.log(`  ${i + 1}) ${b.nama_singkat}`));
    const nb = Number(await tanya("Nomor bidang: "));
    if (!bidang[nb - 1]) throw new Error("Nomor bidang tidak valid");
    bidang_id = bidang[nb - 1].id;
  } else if (pilih !== "2") throw new Error("Pilihan peran tidak valid");

  const password = await tanyaPasswordBaru();
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const p = await db
    .from("profiles")
    .insert({ id: data.user.id, nama_tampilan: nama, role, bidang_id });
  if (p.error) {
    await db.auth.admin.deleteUser(data.user.id); // jangan tinggalkan akun setengah jadi
    throw p.error;
  }
  console.log(`\n✅ Akun dibuat: ${email} (${role === "super_admin" ? "Super Admin" : "Admin"})`);
  console.log("   Login di /admin/masuk");
}

async function daftar() {
  const { data: profil, error } = await db
    .from("profiles")
    .select("id, nama_tampilan, role, aktif, bidang(nama_singkat)")
    .order("role");
  if (error) throw error;
  const { data: users } = await db.auth.admin.listUsers({ perPage: 1000 });
  const emailOf = Object.fromEntries(users.users.map((u) => [u.id, u.email]));
  if (!profil.length) return console.log("Belum ada akun.");
  console.table(
    profil.map((p) => ({
      email: emailOf[p.id] ?? "?",
      nama: p.nama_tampilan,
      peran:
        p.role === "super_admin"
          ? "Super Admin"
          : p.bidang
            ? `Admin · ${p.bidang.nama_singkat}`
            : "Admin · BPH",
      status: p.aktif ? "aktif" : "NONAKTIF",
    })),
  );
}

async function ubahAktif(email, aktif) {
  const u = await cariUser(email ?? "");
  if (!u) throw new Error("Email tidak ditemukan");
  const { error } = await db.from("profiles").update({ aktif }).eq("id", u.id);
  if (error) throw error;
  console.log(`✅ ${email} sekarang ${aktif ? "aktif" : "NONAKTIF (tidak bisa masuk admin)"}`);
}

async function reset(email) {
  const u = await cariUser(email ?? "");
  if (!u) throw new Error("Email tidak ditemukan");
  console.log(`\n🔑 Ganti password ${email}`);
  const password = await tanyaPasswordBaru();
  const { error } = await db.auth.admin.updateUserById(u.id, { password });
  if (error) throw error;
  console.log("✅ Password diganti.");
}

const [perintah, arg] = process.argv.slice(2);
try {
  if (perintah === "buat") await buat();
  else if (perintah === "daftar") await daftar();
  else if (perintah === "reset") await reset(arg);
  else if (perintah === "nonaktif") await ubahAktif(arg, false);
  else if (perintah === "aktifkan") await ubahAktif(arg, true);
  else
    console.log(
      "Pakai: npm run akun -- buat | daftar | reset <email> | nonaktif <email> | aktifkan <email>",
    );
} catch (e) {
  console.error("✖", e.message ?? e);
  process.exitCode = 1;
} finally {
  rl.close();
}
