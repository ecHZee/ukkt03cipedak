import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dokumenForm, pengurusForm, idVersi } from "@/lib/hari20-admin";
const layanan = () => import("./hari20-admin.server");
export const ruangDokumenFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => (await layanan()).ruangDokumen(context.supabase, context.userId));
export const simpanDokumenFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(dokumenForm)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanDokumen(context.supabase, context.userId, data),
  );
export const hapusDokumenFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(idVersi)
  .handler(async ({ context, data }) =>
    (await layanan()).hapusDokumen(context.supabase, context.userId, data),
  );
export const bersihkanArsipFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).bersihkanArsip(context.supabase, context.userId),
  );
export const bukaDokumenFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).strict())
  .handler(async ({ context, data }) =>
    (await layanan()).bukaDokumen(context.supabase, context.userId, data.id),
  );
export const ruangPengurusFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    (await layanan()).ruangPengurus(context.supabase, context.userId),
  );
export const simpanPengurusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(pengurusForm)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanPengurus(context.supabase, context.userId, data),
  );
