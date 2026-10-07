/**
 * Kelola akun — KHUSUS programmer (Super Admin). Pendaftaran publik dimatikan,
 * jadi semua akun dibuat lewat skrip ini.
 *
 *   npm run akun -- generate [--coba]      → buat akun untuk SEMUA pengurus periode aktif yang belum punya
 *                                            (username otomatis, password awal acak, wajib ganti saat login)
 *   npm run akun -- buat                   → buat akun manual (mis. Super Admin)
 *   npm run akun -- daftar                 → lihat semua akun
 *   npm run akun -- username <lama> <baru> → ganti username
 *   npm run akun -- reset <username|email> → ganti password (pengguna wajib ganti lagi saat login)
 *   npm run akun -- nonaktif <username|email>
 *   npm run akun -- aktifkan <username|email>
 *
 * Username = kata pertama + kata terakhir nama (mis. "Hanif Muhammad Zhafran Sutisna" → hanif.sutisna).
 * Login memakai email internal <username>@akun.katar-rw03.internal (tidak pernah dikirimi email).
 * Password awal disimpan di folder rahasia/ (diabaikan git). Bagikan lewat chat pribadi, lalu HAPUS file-nya.
 */
import { createClient } from "@supabase/supabase-js";
import { randomInt } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parseEnv } from "node:util";

const DOMAIN = "akun.katar-rw03.internal";
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

/** Input tersembunyi: keluaran readline dibisukan, hanya "*" yang ditulis. */
async function tanyaRahasia(q) {
  const NL = String.fromCharCode(10);
  const CR = String.fromCharCode(13);
  const HAPUS_BARIS = String.fromCharCode(27) + "[K";
  process.stdout.write(q);
  const asli = rl._writeToOutput;
  rl._writeToOutput = (str) => {
    if (str.includes(NL) || str.includes(CR)) return process.stdout.write(NL);
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
    const p1 = await tanyaRahasia("Password (min. 10 karakter, huruf + angka): ");
    if (p1.length < 10 || !/[a-zA-Z]/.test(p1) || !/[0-9]/.test(p1)) {
      console.log("  ✖ Minimal 10 karakter, gabungan huruf dan angka.");
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

// ------------------------------------------------------------------ utilitas
const KATA = [
  "Kopi",
  "Mangga",
  "Rambutan",
  "Melati",
  "Kenari",
  "Merpati",
  "Elang",
  "Bambu",
  "Cemara",
  "Jati",
  "Pelangi",
  "Samudra",
  "Gunung",
  "Sungai",
  "Mentari",
  "Bintang",
  "Purnama",
  "Angsa",
];
/** Password awal mudah dibacakan, mis. "Mangga-4821-Elang". */
function passwordAcak() {
  const k = () => KATA[randomInt(KATA.length)];
  return `${k()}-${String(randomInt(1000, 10000))}-${k()}`;
}

/** Kata pertama + terakhir, huruf kecil, tanpa simbol. */
function usernameDariNama(nama) {
  const kata = nama
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (kata.length === 0) return null;
  return kata.length === 1 ? kata[0] : `${kata[0]}.${kata[kata.length - 1]}`;
}

const emailDari = (username) => `${username}@${DOMAIN}`;

async function semuaUser() {
  const hasil = [];
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    hasil.push(...data.users);
    if (data.users.length < 200) return hasil;
  }
}

/** Cari akun dari username atau email. */
async function cariAkun(identitas) {
  if (!identitas) throw new Error("Sebutkan username atau email.");
  const s = identitas.trim().toLowerCase();
  if (!s.includes("@")) {
    const { data } = await db
      .from("profiles")
      .select("id, username, role")
      .eq("username", s)
      .maybeSingle();
    if (!data) throw new Error(`Username "${s}" tidak ditemukan.`);
    return data;
  }
  const u = (await semuaUser()).find((x) => x.email?.toLowerCase() === s);
  if (!u) throw new Error(`Email "${s}" tidak ditemukan.`);
  const { data } = await db
    .from("profiles")
    .select("id, username, role")
    .eq("id", u.id)
    .maybeSingle();
  return data ?? { id: u.id, username: null, role: null };
}

// ------------------------------------------------------------------ perintah
async function generate(coba) {
  const { data: periode, error: e1 } = await db
    .from("periode")
    .select("id, label")
    .eq("aktif", true)
    .single();
  if (e1) throw e1;
  const { data: pengurus, error: e2 } = await db
    .from("pengurus")
    .select("id, nama, jabatan, grup, urutan, bidang(nama_singkat, urutan)")
    .eq("periode_id", periode.id);
  if (e2) throw e2;
  const urutGrup = { penasihat: 0, bph: 1, bidang: 2 };
  pengurus.sort(
    (a, b) =>
      urutGrup[a.grup] - urutGrup[b.grup] ||
      (a.bidang?.urutan ?? 0) - (b.bidang?.urutan ?? 0) ||
      a.urutan - b.urutan,
  );
  const { data: profil } = await db.from("profiles").select("username, pengurus_id");
  const sudahPunya = new Set(profil.map((p) => p.pengurus_id).filter(Boolean));
  const dipakai = new Set(profil.map((p) => p.username).filter(Boolean));

  const rencana = [];
  for (const p of pengurus) {
    if (sudahPunya.has(p.id)) continue;
    const dasar = usernameDariNama(p.nama);
    if (!dasar) continue;
    let username = dasar;
    for (let i = 2; dipakai.has(username); i++) username = `${dasar}${i}`;
    dipakai.add(username);
    rencana.push({ ...p, username });
  }

  const labelBidang = (r) =>
    r.bidang?.nama_singkat ??
    (r.grup === "bph" ? "BPH" : r.grup === "penasihat" ? "Penasihat" : "—");
  console.log(
    `\nPeriode ${periode.label}: ${pengurus.length} pengurus, ${rencana.length} belum punya akun.\n`,
  );
  console.table(
    rencana.map((r) => ({
      username: r.username,
      nama: r.nama,
      jabatan: r.jabatan,
      bidang: labelBidang(r),
    })),
  );
  if (coba || rencana.length === 0) {
    if (coba)
      console.log("Mode coba: belum ada akun yang dibuat. Jalankan tanpa --coba untuk membuat.");
    return;
  }
  const yakin = await tanya(`Buat ${rencana.length} akun sekarang? (ketik YA): `);
  if (yakin !== "YA") return console.log("Dibatalkan.");

  const baris = ["username,password_awal,nama,jabatan,bidang"];
  let ok = 0;
  for (const r of rencana) {
    const password = passwordAcak();
    const { data, error } = await db.auth.admin.createUser({
      email: emailDari(r.username),
      password,
      email_confirm: true,
    });
    if (error) {
      console.log(`  ✖ ${r.username}: ${error.message}`);
      continue;
    }
    const ins = await db.from("profiles").insert({
      id: data.user.id,
      username: r.username,
      nama_tampilan: r.nama,
      pengurus_id: r.id,
      harus_ganti_password: true,
    });
    if (ins.error) {
      await db.auth.admin.deleteUser(data.user.id);
      console.log(`  ✖ ${r.username}: ${ins.error.message}`);
      continue;
    }
    ok++;
    baris.push(
      [r.username, password, r.nama, r.jabatan, labelBidang(r)].map((x) => `"${x}"`).join(","),
    );
  }

  mkdirSync("rahasia", { recursive: true });
  const file = `rahasia/akun-awal-${new Date().toISOString().slice(0, 10)}.csv`;
  writeFileSync(file, "﻿" + baris.join("\n") + "\n", "utf8");
  console.log(`\n✅ ${ok} akun dibuat. Password awal tersimpan di ${file}`);
  console.log("   ⚠️ Bagikan ke masing-masing lewat chat PRIBADI, lalu HAPUS file tersebut.");
  console.log("   Semua akun wajib mengganti password saat login pertama.");
}

async function buat() {
  console.log("\n➕ Buat akun manual\n");
  const username = (await tanya("Username: ")).toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{2,40}$/.test(username)) {
    throw new Error("Username: huruf kecil/angka/titik/strip, 3–41 karakter");
  }
  const emailAsli = (
    await tanya("Email asli untuk login (kosongkan bila pakai username saja): ")
  ).toLowerCase();
  const nama = await tanya("Nama tampilan: ");
  if (!nama) throw new Error("Nama wajib diisi");
  const superAdmin = (await tanya("Jadikan Super Admin? (y/N): ")).toLowerCase() === "y";
  const password = await tanyaPasswordBaru();
  const { data, error } = await db.auth.admin.createUser({
    email: emailAsli || emailDari(username),
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const p = await db.from("profiles").insert({
    id: data.user.id,
    username,
    nama_tampilan: nama,
    role: superAdmin ? "super_admin" : "anggota",
    harus_ganti_password: false,
  });
  if (p.error) {
    await db.auth.admin.deleteUser(data.user.id);
    throw p.error;
  }
  console.log(
    `\n✅ Akun dibuat: ${username}${superAdmin ? " (Super Admin)" : ""}. Login di /login`,
  );
  if (!superAdmin) {
    console.log("   Tautkan ke data pengurus (profiles.pengurus_id) agar role mengikuti jabatan.");
  }
}

async function daftar() {
  const { data: profil, error } = await db
    .from("profiles")
    .select(
      "id, username, nama_tampilan, role, aktif, izin_kontribusi, harus_ganti_password, bidang(nama_singkat)",
    )
    .order("role")
    .order("username");
  if (error) throw error;
  if (!profil.length) return console.log("Belum ada akun.");
  console.table(
    profil.map((p) => ({
      username: p.username ?? "—",
      nama: p.nama_tampilan,
      peran:
        p.role === "super_admin"
          ? "Super Admin"
          : p.role === "admin"
            ? p.bidang
              ? `Admin · ${p.bidang.nama_singkat}`
              : "Admin · BPH"
            : `Anggota${p.bidang ? " · " + p.bidang.nama_singkat : ""}${p.izin_kontribusi ? " (+izin)" : ""}`,
      status: !p.aktif ? "NONAKTIF" : p.harus_ganti_password ? "belum ganti pw" : "aktif",
    })),
  );
}

async function gantiUsername(lama, baru) {
  if (!baru || !/^[a-z0-9][a-z0-9._-]{2,40}$/.test(baru)) {
    throw new Error("Username baru: huruf kecil/angka/titik/strip, 3–41 karakter.");
  }
  const a = await cariAkun(lama);
  const { data: u } = await db.auth.admin.getUserById(a.id);
  const { error } = await db.from("profiles").update({ username: baru }).eq("id", a.id);
  if (error) {
    throw new Error(
      error.message.includes("duplicate") ? "Username sudah dipakai." : error.message,
    );
  }
  // Email internal ikut diganti; email asli (mis. Super Admin) dibiarkan.
  if (u?.user?.email?.endsWith(`@${DOMAIN}`)) {
    const r = await db.auth.admin.updateUserById(a.id, {
      email: emailDari(baru),
      email_confirm: true,
    });
    if (r.error) throw r.error;
  }
  console.log(`✅ Username ${a.username ?? lama} → ${baru}`);
}

async function reset(identitas) {
  const a = await cariAkun(identitas);
  console.log(`\n🔑 Ganti password ${a.username ?? identitas}`);
  const password = await tanyaPasswordBaru();
  const { error } = await db.auth.admin.updateUserById(a.id, { password });
  if (error) throw error;
  // Selain Super Admin, pengguna wajib mengganti lagi password yang diberikan programmer.
  if (a.role !== "super_admin") {
    await db.from("profiles").update({ harus_ganti_password: true }).eq("id", a.id);
  }
  console.log("✅ Password diganti.");
}

async function ubahAktif(identitas, aktif) {
  const a = await cariAkun(identitas);
  const { error } = await db.from("profiles").update({ aktif }).eq("id", a.id);
  if (error) throw error;
  // Sama dengan halaman Akun: blokir juga di Supabase Auth agar sesi terbuka tidak bisa diperpanjang.
  const b = await db.auth.admin.updateUserById(a.id, { ban_duration: aktif ? "none" : "876000h" });
  if (b.error) throw b.error;
  console.log(
    `✅ ${a.username ?? identitas} sekarang ${aktif ? "aktif" : "NONAKTIF (tidak bisa masuk)"}`,
  );
}

const [perintah, arg1, arg2] = process.argv.slice(2);
try {
  if (perintah === "generate") await generate(process.argv.includes("--coba"));
  else if (perintah === "buat") await buat();
  else if (perintah === "daftar") await daftar();
  else if (perintah === "username") await gantiUsername(arg1, arg2?.toLowerCase());
  else if (perintah === "reset") await reset(arg1);
  else if (perintah === "nonaktif") await ubahAktif(arg1, false);
  else if (perintah === "aktifkan") await ubahAktif(arg1, true);
  else {
    console.log(
      "Pakai: npm run akun -- generate [--coba] | buat | daftar | username <lama> <baru> | reset <user> | nonaktif <user> | aktifkan <user>",
    );
  }
} catch (e) {
  console.error("✖", e.message ?? e);
  process.exitCode = 1;
} finally {
  rl.close();
}
