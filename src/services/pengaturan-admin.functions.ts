import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { simpanSitusForm, filterAudit, pathAsetSitus } from "@/lib/pengaturan-admin";
const layanan = () => import("./pengaturan-admin.server");
export const siapkanAsetSitusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).siapkanAsetSitus(context.supabase, context.userId),
  );
export const ruangPengaturanFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).ruangPengaturan(context.supabase, context.userId),
  );
export const simpanPengaturanFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(simpanSitusForm)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanPengaturan(context.supabase, context.userId, data.nilai, data.versi),
  );
export const bersihkanAsetSitusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).bersihkanAsetSitus(context.supabase, context.userId),
  );
export const buangUnggahanSitusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ path: z.string().regex(pathAsetSitus) }).strict())
  .handler(async ({ context, data }) =>
    (await layanan()).buangUnggahanSitus(context.supabase, context.userId, data.path),
  );
export const daftarAuditFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(filterAudit)
  .handler(async ({ context, data }) =>
    (await layanan()).daftarAudit(context.supabase, context.userId, data),
  );
