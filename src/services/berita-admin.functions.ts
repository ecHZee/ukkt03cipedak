import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { formulirBerita } from "@/lib/berita-admin";
import { z } from "zod";
const layanan = () => import("./berita-admin.server");
export const ruangBeritaFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => (await layanan()).ruangBerita(context.supabase, context.userId));
export const simpanBeritaFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(formulirBerita)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanBerita(context.supabase, context.userId, data),
  );

export const hapusBeritaFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({ id: z.string().uuid(), versi: z.string().datetime({ offset: true }) }).strict(),
  )
  .handler(async ({ context, data }) =>
    (await layanan()).hapusBerita(context.supabase, context.userId, data.id, data.versi),
  );
