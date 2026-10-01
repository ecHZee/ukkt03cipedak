import { useRouteContext } from "@tanstack/react-router";
import type { Akun } from "@/services/auth";

/** Akun yang sedang login (diisi penjaga di routes/admin.tsx). */
export function useAkun(): Akun {
  const { akun } = useRouteContext({ from: "/admin" });
  if (!akun) throw new Error("useAkun dipakai di luar halaman admin yang terlindungi");
  return akun;
}
