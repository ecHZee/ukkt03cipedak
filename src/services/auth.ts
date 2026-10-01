/**
 * Login pengurus (Supabase Auth).
 *
 * - Login memakai USERNAME (mis. `nama.belakang`). Di balik layar diubah menjadi email internal
 *   `<username>@akun.katar-rw03.internal` yang tidak pernah dikirimi email. Email asli juga diterima
 *   (dipakai akun Super Admin).
 * - Akun dibuat Super Admin lewat `npm run akun`; pendaftaran publik dimatikan di Supabase.
 * - Role diturunkan dari jabatan di tabel pengurus (lihat migrasi akun_dari_jabatan).
 * - Halaman admin hanya "pintu depan": hak akses sebenarnya ditegakkan RLS di database.
 */
import { supabase } from "@/integrations/supabase/client";
import { DOMAIN_AKUN, type Role } from "@/constants/site";

export type Akun = {
  id: string;
  username: string | null;
  nama: string;
  role: Role;
  /** null = BPH / Super Admin / Penasihat */
  bidangId: string | null;
  bidangNama: string | null;
  pengurusId: string | null;
  /** Label siap tampil, mis. "Super Admin", "Admin · BPH", "Admin · Media", "Anggota · Media". */
  label: string;
  /** Boleh melihat & menyetujui semua bidang (BPH & Super Admin). */
  lintasBidang: boolean;
  /** Admin (bisa menyetujui di jangkauannya). */
  admin: boolean;
  /** Boleh membuat/mengubah konten: admin, atau anggota yang diberi izin kontribusi. */
  bolehKontribusi: boolean;
  harusGantiPassword: boolean;
  emailKontak: string | null;
  noHp: string | null;
};

function labelAkun(role: Role, bidangNama: string | null) {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return bidangNama ? `Admin · ${bidangNama}` : "Admin · BPH";
  return bidangNama ? `Anggota · ${bidangNama}` : "Penasihat";
}

/** Akun yang sedang login, atau null. Menutup sesi bila profil tidak ada / nonaktif. */
export async function ambilAkunSaya(): Promise<Akun | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  const { data: p, error } = await supabase
    .from("profiles")
    .select(
      "id, username, nama_tampilan, role, aktif, bidang_id, pengurus_id, izin_kontribusi, harus_ganti_password, email_kontak, no_hp, bidang(nama_singkat)",
    )
    .eq("id", user.id)
    .maybeSingle();

  // Gangguan sementara (jaringan, server sedang dimuat ulang) TIDAK boleh mengeluarkan pengguna.
  if (error) throw new Error("Gagal memeriksa akun. Periksa koneksi lalu muat ulang halaman.");
  // Hanya profil yang memang tidak ada / dinonaktifkan yang menutup sesi.
  if (!p || !p.aktif) {
    await supabase.auth.signOut({ scope: "local" });
    return null;
  }

  const bidangNama = p.bidang?.nama_singkat ?? null;
  const admin = p.role === "super_admin" || p.role === "admin";
  return {
    id: p.id,
    username: p.username,
    nama: p.nama_tampilan,
    role: p.role,
    bidangId: p.bidang_id,
    bidangNama,
    pengurusId: p.pengurus_id,
    label: labelAkun(p.role, bidangNama),
    lintasBidang: p.role === "super_admin" || (p.role === "admin" && p.bidang_id === null),
    admin,
    bolehKontribusi: admin || p.izin_kontribusi,
    harusGantiPassword: p.harus_ganti_password,
    emailKontak: p.email_kontak,
    noHp: p.no_hp,
  };
}

/** Username atau email → email untuk Supabase Auth. */
export function keEmailLogin(identitas: string) {
  const s = identitas.trim().toLowerCase();
  return s.includes("@") ? s : `${s}@${DOMAIN_AKUN}`;
}

export type HasilMasuk = { ok: true; akun: Akun } | { ok: false; pesan: string };

export async function masuk(identitas: string, password: string): Promise<HasilMasuk> {
  const { error } = await supabase.auth.signInWithPassword({
    email: keEmailLogin(identitas),
    password,
  });
  if (error) {
    // Pesan sengaja sama untuk akun tak terdaftar & password salah (tidak membocorkan akun).
    if (error.status === 429) {
      return {
        ok: false,
        pesan: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.",
      };
    }
    return { ok: false, pesan: "Username atau password salah." };
  }
  const akun = await ambilAkunSaya();
  if (!akun) {
    return { ok: false, pesan: "Akun ini sedang tidak aktif. Hubungi Kabid atau BPH." };
  }
  return { ok: true, akun };
}

export async function keluar() {
  await supabase.auth.signOut();
}

/** Syarat password: minimal 10 karakter, ada huruf & angka. Null = valid. */
export function cekPassword(pw: string): string | null {
  if (pw.length < 10) return "Minimal 10 karakter.";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "Gabungkan huruf dan angka.";
  return null;
}

export async function gantiPassword(baru: string) {
  const masalah = cekPassword(baru);
  if (masalah) throw new Error(masalah);
  const { error } = await supabase.auth.updateUser({ password: baru });
  if (error) {
    if (/different from the old/i.test(error.message)) {
      throw new Error("Password baru harus berbeda dari yang lama.");
    }
    throw new Error("Gagal mengganti password. Coba lagi.");
  }
  const r = await supabase.rpc("selesai_ganti_password");
  if (r.error)
    throw new Error("Password terganti, tapi status belum tersimpan. Muat ulang halaman.");
}

export async function ubahProfilSaya(nama: string, email: string, hp: string) {
  const { error } = await supabase.rpc("ubah_profil_saya", {
    p_nama: nama,
    p_email: email,
    p_hp: hp,
  });
  if (error) {
    if (/email_kontak/i.test(error.message)) throw new Error("Format email tidak valid.");
    if (/no_hp/i.test(error.message)) throw new Error("Format nomor HP tidak valid.");
    throw new Error(error.message);
  }
}

export async function ubahFotoSaya(fotoPath: string | null, izinTampil: boolean) {
  const { error } = await supabase.rpc("ubah_foto_saya", {
    p_foto_path: fotoPath as string,
    p_izin: izinTampil,
  });
  if (error) throw new Error(error.message);
}

export async function aturIzinKontribusi(profilId: string, izin: boolean) {
  const { error } = await supabase.rpc("atur_izin_kontribusi", {
    p_profil: profilId,
    p_izin: izin,
  });
  if (error) throw new Error("Kamu tidak berhak mengatur izin akun ini.");
}

/** Hanya izinkan kembali ke halaman admin (mencegah open redirect ke situs lain). */
export function tujuanAman(ke: unknown): string {
  return typeof ke === "string" && /^\/admin(\/[\w\-/]*)?(\?.*)?$/.test(ke)
    ? ke
    : "/admin/dashboard";
}
