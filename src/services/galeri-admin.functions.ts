import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { formulirAlbum, reservasiAlbum, aksiMediaAlbum } from "@/lib/galeri-admin";
const layanan = () => import("./galeri-admin.server");
export const ruangGaleriFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ albumId: z.string().uuid().optional() }).strict())
  .handler(async ({ context, data }) =>
    (await layanan()).ruangGaleri(context.supabase, context.userId, data.albumId),
  );
export const simpanAlbumFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(formulirAlbum)
  .handler(async ({ context, data }) =>
    (await layanan()).simpanAlbum(context.supabase, context.userId, data),
  );
export const reservasiGaleriFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(reservasiAlbum)
  .handler(async ({ context, data }) =>
    (await layanan()).reservasiGaleri(context.supabase, context.userId, data),
  );
export const selesaikanGaleriFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).strict())
  .handler(async ({ context, data }) =>
    (await layanan()).selesaikanGaleri(context.supabase, context.userId, data.id),
  );
export const aturMediaAlbumFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(aksiMediaAlbum)
  .handler(async ({ context, data }) =>
    (await layanan()).aturMediaAlbum(context.supabase, context.userId, data),
  );
export const pratinjauMediaFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).strict())
  .handler(async ({ context, data }) =>
    (await layanan()).pratinjauMedia(context.supabase, context.userId, data.id),
  );
