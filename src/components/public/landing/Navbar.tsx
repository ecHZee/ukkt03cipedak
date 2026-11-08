import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, Images, LayoutGrid, Menu, Rocket, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { useSitus } from "@/hooks/use-situs";
import { linkWhatsApp } from "@/lib/konten-publik";

const muatMenu = () => import("./MenuLainnya");
const MenuLainnya = lazy(muatMenu);

type Tautan = { to: string; label: string; labelNavbar?: string; ket?: string };

/** Kategori untuk hamburger/Lainnya; desktop memakai tautan langsung dari daftar yang sama. */
const GRUP: Array<{ label: string; isi: Tautan[] }> = [
  {
    label: "Tentang",
    isi: [
      {
        to: PUBLIC_ROUTES.tentang,
        label: "Profil & Pengurus",
        labelNavbar: "Tentang",
        ket: "Siapa kami, struktur SK",
      },
      {
        to: PUBLIC_ROUTES.program,
        label: "Program & Bidang",
        labelNavbar: "Program",
        ket: "7 bidang kerja",
      },
    ],
  },
  {
    label: "Kabar",
    isi: [
      { to: PUBLIC_ROUTES.kegiatan, label: "Kegiatan", ket: "Agenda & kegiatan terdekat" },
      { to: PUBLIC_ROUTES.berita, label: "Berita", ket: "Cerita dari lapangan" },
      { to: PUBLIC_ROUTES.galeri, label: "Galeri", ket: "Album foto & video" },
    ],
  },
];
const TUNGGAL: Tautan[] = [
  { to: PUBLIC_ROUTES.arsip, label: "Arsip" },
  { to: PUBLIC_ROUTES.kontak, label: "Kontak" },
];
const MENU_SEJAJAR = [...GRUP.flatMap((grup) => grup.isi), ...TUNGGAL];

const PESAN_GABUNG = "Halo Karang Taruna RW 03, saya tertarik bergabung.";

export function Navbar() {
  const { pengaturan: p } = useSitus();
  const cta = linkWhatsApp(p, PESAN_GABUNG);
  const [scrolled, setScrolled] = useState(false);
  const [lainnya, setLainnya] = useState(false);
  const [menuPernahDibuka, setMenuPernahDibuka] = useState(false);
  const idMenu = useId();
  const pemicuMenu = useRef<HTMLButtonElement | null>(null);

  const bukaMenu = (pemicu: HTMLButtonElement) => {
    pemicuMenu.current = pemicu;
    setMenuPernahDibuka(true);
    setLainnya(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-150 ${
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-background"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 batik-kawung batik-op-2" aria-hidden />
        <div className="relative mx-auto flex h-[64px] sm:h-[72px] max-w-[1280px] items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-10 lg:px-16">
          <Link
            to="/"
            className="flex min-h-11 max-w-[55%] sm:max-w-[230px] items-center gap-2.5 shrink-0"
          >
            <Logo className="size-10" />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="font-heading text-[15px] font-semibold text-ink truncate">
                {p.namaOrganisasi === "Karang Taruna RW 03 Cipedak"
                  ? "Karang Taruna"
                  : p.namaOrganisasi}
              </span>
              {p.namaOrganisasi === "Karang Taruna RW 03 Cipedak" && (
                <span className="text-[11px] text-ink-muted truncate">RW 03 Cipedak</span>
              )}
            </div>
          </Link>

          {/* Desktop: semua halaman dapat dibuka sekali klik. */}
          <nav
            className="mx-auto hidden shrink-0 items-center gap-0.5 lg:flex"
            aria-label="Menu utama"
          >
            {MENU_SEJAJAR.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeProps={{ className: "text-primary bg-primary/8" }}
                inactiveProps={{ className: "text-ink hover:text-primary hover:bg-muted-surface" }}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t.labelNavbar ?? t.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Tombol Gabung hanya muncul bila nomor WhatsApp sudah diisi di pengaturan */}
            {cta && (
              <Button
                asChild
                className="hidden h-11 lg:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-tile transition-transform duration-200 hover:-translate-y-0.5"
              >
                <a href={cta} target="_blank" rel="noopener noreferrer">
                  <Rocket className="size-4" />
                  Gabung
                </a>
              </Button>
            )}

            {/* Masuk pengurus — sengaja kecil (ikon) supaya tidak mengganggu warga */}
            <Link
              to="/login"
              reloadDocument
              aria-label="Masuk pengurus"
              title="Masuk pengurus"
              className="grid size-11 place-items-center rounded-full border border-border bg-surface text-ink-muted transition hover:border-primary/40 hover:text-primary"
            >
              <UserRound className="size-4" />
            </Link>
            <button
              type="button"
              aria-label="Buka menu navigasi"
              onPointerEnter={() => void muatMenu()}
              onFocus={() => void muatMenu()}
              aria-haspopup="dialog"
              aria-expanded={lainnya}
              aria-controls={lainnya ? idMenu : undefined}
              onClick={(event) => bukaMenu(event.currentTarget)}
              className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-ink transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
              <span className="hidden text-sm font-semibold sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <NavigasiBawah cta={cta} onLainnya={bukaMenu} idMenu={idMenu} menuTerbuka={lainnya} />

      {/* Menu "Lainnya" (HP): semua halaman, dikelompokkan sama seperti desktop */}
      {menuPernahDibuka && (
        <Suspense
          fallback={
            <p
              role="status"
              className="fixed inset-x-0 bottom-0 z-[60] rounded-t-2xl border border-border bg-surface p-6 text-sm text-ink"
            >
              Menyiapkan menu…
            </p>
          }
        >
          <MenuLainnya
            terbuka={lainnya}
            ubahTerbuka={setLainnya}
            idMenu={idMenu}
            grup={[...GRUP, { label: "Lainnya", isi: TUNGGAL }]}
            kembalikanFokus={() => pemicuMenu.current?.focus()}
          />
        </Suspense>
      )}
    </>
  );
}

/** Navigasi bawah ala aplikasi — hanya di HP/tablet (< lg). */
function NavigasiBawah({
  cta,
  onLainnya,
  idMenu,
  menuTerbuka,
}: {
  cta: string | null;
  onLainnya: (pemicu: HTMLButtonElement) => void;
  idMenu: string;
  menuTerbuka: boolean;
}) {
  const item =
    "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-ink-muted";
  const aktif = { className: "text-primary" };
  return (
    <nav
      aria-label="Navigasi cepat"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className={`mx-auto grid max-w-md ${cta ? "grid-cols-5" : "grid-cols-4"}`}>
        <Link to="/" className={item} activeProps={aktif} activeOptions={{ exact: true }}>
          <Home className="size-5" />
          Beranda
        </Link>
        <Link to={PUBLIC_ROUTES.kegiatan} className={item} activeProps={aktif}>
          <CalendarDays className="size-5" />
          Agenda
        </Link>
        {cta && (
          <a href={cta} target="_blank" rel="noopener noreferrer" className={item}>
            <span className="-mt-5 grid size-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-elevated ring-4 ring-background">
              <Rocket className="size-5" />
            </span>
            <span className="font-semibold text-ink">Gabung</span>
          </a>
        )}
        <Link to={PUBLIC_ROUTES.galeri} className={item} activeProps={aktif}>
          <Images className="size-5" />
          Galeri
        </Link>
        <button
          type="button"
          onClick={(event) => onLainnya(event.currentTarget)}
          aria-haspopup="dialog"
          aria-expanded={menuTerbuka}
          aria-controls={menuTerbuka ? idMenu : undefined}
          className={item}
        >
          <LayoutGrid className="size-5" />
          Lainnya
        </button>
      </div>
    </nav>
  );
}
