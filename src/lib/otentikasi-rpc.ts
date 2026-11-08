import { createMiddleware } from "@tanstack/react-start";

// Membaca sesi hanya saat RPC dijalankan; beranda tidak perlu mengunduh SDK Auth dulu.
export const lampirkanSesiRpc = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
