/**
 * Login admin (Supabase Auth, email + password).
 *
 * Akun hanya dibuat Super Admin lewat `npm run akun` — pendaftaran publik dimatikan di Supabase.
 * Setelah login, akun WAJIB punya baris `profiles` yang aktif; kalau tidak, sesi langsung ditutup.
 * Halaman admin hanya "pintu depan": hak akses sebenarnya ditegakkan RLS di database.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/constants/site";

export type Akun = {
  id: string;
  email: string;
  nama: string;
  role: Role;
  /** null = BPH / Super Admin (lintas bidang) */
  bidangId: string | null;
  bidangNama: string | null;
  /** Label siap tampil, mis. "Super Admin", "Admin · BPH", "Admin · Media". */
  label: string;
  /** Boleh melihat semua bidang (BPH & Super Admin). */
  lintasBidang: boolean;
};

function labelAkun(role: Role, bidangNama: string | null) {
  if (role === "super_admin") return "Super Admin";
  return bidangNama ? `Admin · ${bidangNama}` : "Admin · BPH";
}

/** Akun yang sedang login, atau null. Menutup sesi bila profil tidak ada / nonaktif. */
export async function ambilAkunSaya(): Promise<Akun | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  const { data: profil, error } = await supabase
    .from("profiles")
    .select("id, nama_tampilan, role, aktif, bidang_id, bidang(nama_singkat)")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profil || !profil.aktif) {
    await supabase.auth.signOut();
    return null;
  }

  const bidangNama = profil.bidang?.nama_singkat ?? null;
  return {
    id: profil.id,
    email: user.email ?? "",
    nama: profil.nama_tampilan,
    role: profil.role,
    bidangId: profil.bidang_id,
    bidangNama,
    label: labelAkun(profil.role, bidangNama),
    lintasBidang: profil.role === "super_admin" || profil.bidang_id === null,
  };
}

export type HasilMasuk = { ok: true; akun: Akun } | { ok: false; pesan: string };

export async function masuk(email: string, password: string): Promise<HasilMasuk> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) {
    // Pesan sengaja sama untuk email tak terdaftar & password salah (tidak membocorkan akun).
    if (error.status === 429) {
      return {
        ok: false,
        pesan: "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.",
      };
    }
    return { ok: false, pesan: "Email atau password salah." };
  }
  const akun = await ambilAkunSaya();
  if (!akun) {
    return {
      ok: false,
      pesan: "Akun ini belum aktif sebagai pengurus. Hubungi programmer (Super Admin).",
    };
  }
  return { ok: true, akun };
}

export async function keluar() {
  await supabase.auth.signOut();
}

/** Hanya izinkan kembali ke halaman admin (mencegah open redirect ke situs lain). */
export function tujuanAman(ke: unknown): string {
  return typeof ke === "string" && /^\/admin(\/[\w\-/]*)?(\?.*)?$/.test(ke)
    ? ke
    : "/admin/dashboard";
}
