import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const simpanFotoProfilFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ path: z.string().max(300).nullable(), izin: z.boolean() }).strict())
  .handler(async ({ context, data }) =>
    (await import("./foto-profil.server")).simpanFotoProfil(
      context.supabase,
      context.userId,
      data.path,
      data.izin,
    ),
  );
