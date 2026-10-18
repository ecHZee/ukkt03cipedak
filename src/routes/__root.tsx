import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?inline";
import fontInter from "../assets/fonts/inter-latin.woff2?url";
import fontJakarta from "../assets/fonts/plus-jakarta-sans-latin.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ambilPengaturan } from "@/services/konten";
import { ambilPeriode } from "@/services/organisasi";
import { SITE } from "@/constants/site";

function NotFoundComponent() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terjadi kendala di sistem kami. Coba muat ulang, atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Coba lagi
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Karang Taruna RW 03 Cipedak — Platform Digital" },
      {
        name: "description",
        content:
          "Platform digital resmi Karang Taruna RW 03 Cipedak: kegiatan, berita, galeri, dan transparansi LPJ lintas periode kepengurusan.",
      },
      { name: "author", content: "Karang Taruna RW 03 Cipedak" },
      { property: "og:title", content: "Karang Taruna RW 03 Cipedak" },
      {
        property: "og:description",
        content: "Markas digital Karang Taruna RW 03 Cipedak.",
      },
      { property: "og:type", content: "website" },
      // Gambar pratinjau saat link dibagikan (WA, IG, dll.) — wajib URL absolut
      { property: "og:image", content: `${SITE.url}/logo/logo-512.png` },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#0047AB" },
    ],
    // CSS langsung di HTML menghapus satu putaran request sebelum teks bisa digambar.
    styles: [{ children: appCss, "data-katar-css": "inline-v1" }],
    links: [
      { rel: "icon", type: "image/png", href: "/logo/favicon-48.png" },
      { rel: "apple-touch-icon", href: "/logo/apple-touch-icon.png" },
      {
        rel: "preload",
        href: fontInter,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: fontJakarta,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  // Pengaturan & periode aktif dipakai Navbar/Footer di semua halaman → dimuat sekali di root.
  loader: async () => {
    const [pengaturan, periode] = await Promise.all([ambilPengaturan(), ambilPeriode()]);
    return { pengaturan, periodeAktif: periode.find((p) => p.aktif) ?? periode[0] ?? null };
  },
  staleTime: 5 * 60_000,
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#konten-utama" className="tautan-lompat">
          Lewati ke konten utama
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
