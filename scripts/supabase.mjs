/**
 * Jalankan Supabase CLI memakai token akun Karang Taruna dari `.env.local`,
 * bukan token global di komputer (yang mungkin milik akun pribadi).
 *
 * Pakai:  npm run db -- <perintah supabase>
 * Contoh: npm run db -- link
 *         npm run db -- migration list
 *         npm run db -- db push
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const PROJECT_REF = "twmbcxjojknjtjwtntxr";
const ENV_FILE = ".env.local";

if (!existsSync(ENV_FILE)) {
  console.error(`✖ ${ENV_FILE} tidak ditemukan. Salin dari .env.example lalu isi.`);
  process.exit(1);
}
// Sengaja dibaca langsung dari file: token global di sistem TIDAK boleh ikut terpakai.
const fileEnv = parseEnv(readFileSync(ENV_FILE, "utf8"));
const token = fileEnv.SUPABASE_ACCESS_TOKEN;
if (!token || !token.startsWith("sbp_")) {
  console.error(
    "✖ SUPABASE_ACCESS_TOKEN di .env.local kosong atau bukan token akun (harus diawali sbp_).\n" +
      "  Buat di: Supabase (akun Katar) → Account Preferences → Access Tokens.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("✖ Contoh: npm run db -- migration list");
  process.exit(1);
}

// `link` tanpa --project-ref otomatis diarahkan ke proyek Katar.
if (args[0] === "link" && !args.includes("--project-ref")) {
  args.push("--project-ref", PROJECT_REF);
}

// Pengaman: tolak bila folder ini tersambung ke proyek lain.
const refFile = "supabase/.temp/project-ref";
if (existsSync(refFile)) {
  const linked = readFileSync(refFile, "utf8").trim();
  if (linked !== PROJECT_REF) {
    console.error(
      `✖ Folder ini tersambung ke proyek ${linked}, bukan proyek Katar (${PROJECT_REF}).`,
    );
    console.error("  Jalankan: npm run db -- link");
    if (args[0] !== "link") process.exit(1);
  }
}

const result = spawnSync("npx", ["--yes", "supabase@2", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
});
process.exit(result.status ?? 1);
