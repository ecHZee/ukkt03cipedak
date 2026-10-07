/**
 * Fungsi server halaman Akun (Super Admin). Browser memanggilnya seperti fungsi biasa; isi handler
 * hanya berjalan di server. Token login dilampirkan otomatis (attachSupabaseAuth) dan diverifikasi
 * `requireSupabaseAuth`; pengecekan Super Admin ada di `akun.server.ts`.
 * Pakai `.inputValidator` (bukan `.validator`): versi di bun.lock yang dipasang Cloudflare belum mengenal `.validator`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const akunServer = () => import("./akun.server");
const id = z.string().uuid();

export const daftarAkunFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => (await akunServer()).daftarAkun(context.userId));

export const gantiUsernameFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id, username: z.string().max(60) }))
  .handler(async ({ context, data }) =>
    (await akunServer()).gantiUsername(context.userId, data.id, data.username),
  );

export const resetPasswordFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id }))
  .handler(async ({ context, data }) =>
    (await akunServer()).resetPassword(context.userId, data.id),
  );

export const ubahStatusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id, aktif: z.boolean() }))
  .handler(async ({ context, data }) =>
    (await akunServer()).ubahStatus(context.userId, data.id, data.aktif),
  );
