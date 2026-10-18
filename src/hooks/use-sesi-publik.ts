import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** SSR tetap anonim. Pergantian sesi memberi kunci baru agar data akun lama langsung tidak dipakai. */
export function useSesiPublik() {
  const [sesi, setSesi] = useState<{ id: string | null; versi: number }>({ id: null, versi: 0 });
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Jangan menunggu query Supabase di callback Auth: callback ini berjalan di dalam lock sesi.
      setSesi((lama) => ({ id: session?.user.id ?? null, versi: lama.versi + 1 }));
    });
    return () => subscription.unsubscribe();
  }, []);
  return sesi;
}
