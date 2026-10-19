/**
 * Kelola akun pengurus — KHUSUS SERVER (memakai service role, melewati RLS).
 * Jangan diimpor dari komponen/route; panggil lewat `akun.functions.ts`.
 *
 * Setiap fungsi wajib diawali `pastikanSuperAdmin(userId)`: userId berasal dari token yang sudah
 * diverifikasi middleware `requireSupabaseAuth`, jadi tidak bisa dipalsukan dari browser.
 * Padanan terminalnya: `npm run akun -- …` (scripts/akun.mjs).
 */
import { randomInt } from "node:crypto";
import { supabaseAdmin as db } from "@/integrations/supabase/client.server";
import { DOMAIN_AKUN, type Role } from "@/constants/site";

export type BarisAkun = {
  id: string;
  username: string | null;
  nama: string;
  role: Role;
  jabatan: string | null;
  /** "BPH" / "Penasihat" / nama singkat bidang / null (Super Admin) */
  kelompok: string | null;
  aktif: boolean;
  harusGantiPassword: boolean;
  izinKontribusi: boolean;
  /** Login memakai email asli (bukan username), mis. akun lama. */
  emailAsli: string | null;
  terakhirMasuk: string | null;
  diriSendiri: boolean;
};

export const POLA_USERNAME = /^[a-z0-9][a-z0-9._-]{2,40}$/;

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
/** Password sementara mudah dibacakan, mis. "Mangga-4821-Elang" (sama dengan scripts/akun.mjs). */
function passwordAcak() {
  const k = () => KATA[randomInt(KATA.length)];
  return `${k()}-${String(randomInt(1000, 10000))}-${k()}`;
}

/** Tolak bila pemanggil bukan Super Admin aktif. */
async function pastikanSuperAdmin(userId: string) {
  const { data, error } = await db
    .from("profiles")
    .select("role, aktif")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error("Gagal memeriksa hak akses. Coba lagi.");
  if (!data || !data.aktif || data.role !== "super_admin") {
    throw new Error("Hanya Super Admin yang boleh mengelola akun.");
  }
}

/** Akun target; Super Admin tidak boleh menjalankan aksi berbahaya pada dirinya sendiri. */
async function ambilTarget(userId: string, id: string, bolehDiriSendiri = false) {
  if (!bolehDiriSendiri && id === userId) {
    throw new Error("Untuk akunmu sendiri, gunakan halaman Profil Saya.");
  }
  const { data, error } = await db
    .from("profiles")
    .select("id, username, role, harus_ganti_password, aktif")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) throw new Error("Akun tidak ditemukan.");
  return data;
}

/** Catatan audit dengan pelaku yang benar (perubahan via service role tercatat tanpa pelaku). */
async function catat(userId: string, targetId: string, aksi: string, rincian: object = {}) {
  const { error } = await db.from("audit_log").insert({
    tabel: "akun",
    aksi: "UPDATE",
    record_id: targetId,
    user_id: userId,
    sesudah: { aksi, ...rincian },
  });
  if (error)
    throw new Error(
      "Perubahan akun diterapkan, tetapi log audit gagal disimpan. Hubungi Super Admin sebelum mengulang.",
    );
}

export async function daftarAkun(userId: string): Promise<BarisAkun[]> {
  await pastikanSuperAdmin(userId);
  const [profil, users] = await Promise.all([
    db
      .from("profiles")
      .select(
        "id, username, nama_tampilan, role, aktif, izin_kontribusi, harus_ganti_password, bidang(nama_singkat), pengurus(jabatan, grup)",
      ),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  if (profil.error) throw new Error("Gagal memuat daftar akun.");
  if (users.error) throw new Error("Gagal memuat data login.");
  const auth = new Map(users.data.users.map((u) => [u.id, u]));

  return profil.data.map((p) => {
    const u = auth.get(p.id);
    const email = u?.email ?? null;
    const grup = p.pengurus?.grup;
    return {
      id: p.id,
      username: p.username,
      nama: p.nama_tampilan,
      role: p.role,
      jabatan: p.role === "super_admin" ? "Programmer" : (p.pengurus?.jabatan ?? null),
      kelompok:
        p.bidang?.nama_singkat ??
        (grup === "bph" ? "BPH" : grup === "penasihat" ? "Penasihat" : null),
      aktif: p.aktif,
      harusGantiPassword: p.harus_ganti_password,
      izinKontribusi: p.izin_kontribusi,
      emailAsli: email && !email.endsWith(`@${DOMAIN_AKUN}`) ? email : null,
      terakhirMasuk: u?.last_sign_in_at ?? null,
      diriSendiri: p.id === userId,
    };
  });
}

export async function gantiUsername(userId: string, id: string, baru: string) {
  await pastikanSuperAdmin(userId);
  const username = baru.trim().toLowerCase();
  if (!POLA_USERNAME.test(username)) {
    throw new Error("Username: 3–41 karakter, huruf kecil/angka/titik/strip, diawali huruf/angka.");
  }
  const t = await ambilTarget(userId, id, true);
  if (t.username === username) return;

  const { data: u, error: eu } = await db.auth.admin.getUserById(id);
  if (eu || !u.user) throw new Error("Akun login tidak ditemukan.");
  const emailLama = u.user.email ?? "";

  const { error } = await db.from("profiles").update({ username }).eq("id", id);
  if (error) {
    throw new Error(error.code === "23505" ? "Username sudah dipakai akun lain." : error.message);
  }
  // Email internal mengikuti username; email asli dibiarkan.
  if (emailLama.endsWith(`@${DOMAIN_AKUN}`)) {
    const r = await db.auth.admin.updateUserById(id, {
      email: `${username}@${DOMAIN_AKUN}`,
      email_confirm: true,
    });
    if (r.error) {
      const pulih = await db.from("profiles").update({ username: t.username }).eq("id", id);
      throw new Error(
        pulih.error
          ? "Login gagal diubah dan username profil belum berhasil dipulihkan. Hubungi Super Admin sebelum mencoba lagi."
          : "Gagal mengganti username login. Tidak ada yang berubah.",
      );
    }
  }
  await catat(userId, id, "ganti_username", { dari: t.username, ke: username });
}

/** Password sementara baru; dikembalikan SEKALI ke Super Admin dan tidak disimpan di mana pun. */
export async function resetPassword(userId: string, id: string) {
  await pastikanSuperAdmin(userId);
  const t = await ambilTarget(userId, id);
  const password = passwordAcak();
  // Wajib ganti lebih dulu: kegagalan DB tidak boleh menghasilkan password baru tanpa penjagaan.
  const flag = await db.from("profiles").update({ harus_ganti_password: true }).eq("id", id);
  if (flag.error) throw new Error("Reset dibatalkan: gagal mengaktifkan kewajiban ganti password.");
  const { error } = await db.auth.admin.updateUserById(id, { password });
  if (error) {
    const pulih = await db
      .from("profiles")
      .update({ harus_ganti_password: t.harus_ganti_password })
      .eq("id", id);
    throw new Error(
      pulih.error
        ? "Reset gagal. Kewajiban ganti password masih aktif; ulangi reset atau hubungi Super Admin."
        : "Gagal mereset password. Password lama tetap berlaku.",
    );
  }
  let peringatan: string | undefined;
  try {
    await catat(userId, id, "reset_password", { username: t.username });
  } catch {
    peringatan =
      "Password sudah diganti dan wajib diganti saat login, tetapi log audit gagal. Catat password ini dan laporkan ke Super Admin.";
  }
  // Tetap tampilkan password yang sudah berlaku bila hanya audit gagal, agar tidak hilang.
  return { username: t.username, password, peringatan };
}

export async function ubahStatus(userId: string, id: string, aktif: boolean) {
  await pastikanSuperAdmin(userId);
  const t = await ambilTarget(userId, id);
  if (!aktif && t.role === "super_admin") {
    throw new Error("Akun Super Admin tidak bisa dinonaktifkan dari sini.");
  }
  if (aktif) {
    const auth = await db.auth.admin.updateUserById(id, { ban_duration: "none" });
    if (auth.error) throw new Error("Akun belum diaktifkan: gagal membuka blokir login.");
  }
  const { error } = await db.from("profiles").update({ aktif }).eq("id", id);
  if (error)
    throw new Error(
      "Status akses belum berubah. Coba lagi; pemeriksaan database tetap membatasi akun.",
    );
  if (!aktif) {
    const auth = await db.auth.admin.updateUserById(id, { ban_duration: "876000h" });
    if (auth.error) {
      let pesan =
        "Akses database sudah dinonaktifkan, tetapi pemblokiran login belum berhasil. Ulangi Nonaktifkan; jangan anggap proses selesai.";
      try {
        await catat(userId, id, "nonaktifkan_sebagian", { aktif: false, blokir_login: false });
      } catch {
        pesan += " Log audit juga gagal disimpan.";
      }
      throw new Error(pesan);
    }
  }
  await catat(userId, id, aktif ? "aktifkan" : "nonaktifkan", { username: t.username });
}
