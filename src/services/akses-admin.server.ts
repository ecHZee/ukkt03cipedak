import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { AksesKegiatan } from "@/lib/kegiatan-admin";
/** JWT sah saja belum cukup: setiap fungsi membaca ulang peran dan keaktifan dari DB. */
export async function aksesAdmin(db: SupabaseClient<Database>, id: string): Promise<AksesKegiatan> {
  const r = await db
    .from("profiles")
    .select("id,role,bidang_id,izin_kontribusi,aktif")
    .eq("id", id)
    .single();
  if (r.error || !r.data?.aktif)
    throw new Error("Akses akun tidak tersedia. Muat ulang atau hubungi BPH.");
  const p = r.data;
  return {
    id: p.id,
    role: p.role,
    bidangId: p.bidang_id,
    bolehKontribusi: p.role !== "anggota" || p.izin_kontribusi,
  };
}
