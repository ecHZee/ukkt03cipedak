import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { formulirKegiatan } from "@/lib/kegiatan-admin";

const layanan = () => import("./kegiatan-admin.server");

export const ruangKegiatanFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).ruangKegiatan(context.supabase, context.userId),
  );

export const simpanKegiatanFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(formulirKegiatan)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanKegiatan(context.supabase, context.userId, data),
  );

export const penyimpananAdminFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).pemakaianPenyimpanan(context.supabase, context.userId),
  );
