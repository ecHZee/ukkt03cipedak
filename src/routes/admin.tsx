import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ambilAkunSaya } from "@/services/auth";

/**
 * Penjaga semua halaman /admin/*.
 * - Dirender di browser saja (ssr: false) karena sesi login tersimpan di browser.
 * - Belum login / profil tidak aktif → dialihkan ke /login (kembali ke halaman tujuan setelah login).
 * - Ini hanya pintu depan; data tetap dijaga RLS di database.
 */
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  beforeLoad: async ({ location }) => {
    const akun = await ambilAkunSaya();
    if (!akun) {
      throw redirect({ to: "/login", search: { ke: location.href } });
    }
    return { akun };
  },
  pendingComponent: () => (
    <div className="grid min-h-dvh place-items-center bg-muted-surface">
      <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 className="size-4 animate-spin" /> Memeriksa akses…
      </p>
    </div>
  ),
  component: () => <Outlet />,
});
