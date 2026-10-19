import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { pathArsip } from "@/lib/hari20-admin";
export async function layaniDokumen(request: Request) {
  const h = {
    "Cache-Control": "no-store",
    "CDN-Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const id = new URL(request.url).pathname.slice("/berkas/dokumen/".length);
  if (!["GET", "HEAD"].includes(request.method))
    return new Response(null, { status: 405, headers: h });
  if (!/^[0-9a-f-]{36}$/.test(id))
    return new Response("Dokumen tidak tersedia.", { status: 404, headers: h });
  try {
    const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const r = await db
      .from("dokumen")
      .select("storage_path,judul")
      .eq("id", id)
      .eq("status", "terbit")
      .eq("akses", "publik")
      .maybeSingle();
    if (r.error) throw new Error("Gangguan izin");
    if (!r.data?.storage_path || !pathArsip(r.data.storage_path))
      return new Response("Dokumen tidak tersedia.", { status: 404, headers: h });
    const file = await supabaseAdmin.storage
      .from("dokumen-internal")
      .download(r.data.storage_path.slice(7));
    if (file.error) throw new Error("Gangguan berkas");
    return new Response(request.method === "HEAD" ? null : file.data, {
      headers: {
        ...h,
        "Content-Type": "application/pdf",
        "Content-Length": String(file.data.size),
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(r.data.judul)}.pdf`,
      },
    });
  } catch {
    return new Response("Dokumen belum dapat dibuka. Coba lagi.", { status: 503, headers: h });
  }
}
