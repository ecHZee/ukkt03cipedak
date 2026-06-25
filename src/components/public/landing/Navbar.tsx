import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Rocket, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/config/app";

const NAV = [
  { to: PUBLIC_ROUTES.home, label: "Beranda" },
  { to: PUBLIC_ROUTES.tentang, label: "Tentang" },
  { to: PUBLIC_ROUTES.program, label: "Program" },
  { to: PUBLIC_ROUTES.kegiatan, label: "Kegiatan" },
  { to: PUBLIC_ROUTES.berita, label: "Berita" },
  { to: PUBLIC_ROUTES.galeri, label: "Galeri" },
  { to: PUBLIC_ROUTES.lpj, label: "Arsip Digital" },
  { to: PUBLIC_ROUTES.kontak, label: "Kontak" },
] as const;

function ctaHref() {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(APP_CONFIG.whatsappCtaText)}`;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-150 ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/60 backdrop-blur"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 batik-kawung batik-op-2" aria-hidden />
      <div className="mx-auto flex h-[68px] sm:h-[72px] max-w-[1280px] items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-tile">
            KT
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-heading text-[15px] font-semibold text-ink truncate">
              Karang Taruna
            </span>
            <span className="text-[11px] text-ink-muted truncate">RW 03 Cipedak</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary bg-primary/8" }}
              inactiveProps={{ className: "text-ink hover:text-primary hover:bg-muted-surface" }}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-tile transition-transform duration-200 hover:-translate-y-0.5"
          >
            <a href={ctaHref()} target="_blank" rel="noopener noreferrer">
              <Rocket className="size-4" />
              Jadi Bagian Katar RW03
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 [&>button]:hidden">
              <div className="flex items-center justify-between border-b border-border px-5 h-[72px]">
                <span className="font-heading font-semibold text-ink">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Tutup" className="p-2">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col p-3">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-[15px] font-medium text-ink hover:bg-muted-surface"
                    activeProps={{ className: "text-primary bg-primary/8" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-5 pt-2">
                <Button
                  asChild
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  <a href={ctaHref()} target="_blank" rel="noopener noreferrer">
                    <Rocket className="size-4" />
                    Jadi Bagian Katar RW03
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
