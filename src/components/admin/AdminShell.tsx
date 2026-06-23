import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users2, Newspaper, CalendarRange, Images, FileText,
  Settings, ShieldCheck, History, LogOut, Menu, X,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/routes";

const NAV = [
  { to: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: ADMIN_ROUTES.anggota,   label: "Anggota",   icon: Users2 },
  { to: ADMIN_ROUTES.berita,    label: "Berita",    icon: Newspaper },
  { to: ADMIN_ROUTES.kegiatan,  label: "Kegiatan",  icon: CalendarRange },
  { to: ADMIN_ROUTES.galeri,    label: "Galeri",    icon: Images },
  { to: ADMIN_ROUTES.dokumen,   label: "Dokumen",   icon: FileText },
  { to: ADMIN_ROUTES.settings,  label: "Settings",  icon: Settings },
  { to: ADMIN_ROUTES.users,     label: "Users",     icon: ShieldCheck },
  { to: ADMIN_ROUTES.auditLog,  label: "Audit Log", icon: History },
] as const;

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh bg-muted-surface">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-[252px] shrink-0 flex-col border-r border-border bg-sidebar">
        <SidebarHeader />
        <SidebarNav pathname={pathname} />
        <SidebarFooter />
      </aside>

      {/* Sidebar — mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col border-r border-border bg-sidebar animate-fade-in">
            <div className="flex items-center justify-between px-5 h-[64px] border-b border-border">
              <SidebarBrand />
              <button aria-label="Tutup" onClick={() => setOpen(false)} className="p-2">
                <X className="size-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
            className="grid size-9 place-items-center rounded-md border border-border bg-surface lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Internal CMS · KT RW 03
            </p>
            <h1 className="truncate font-heading text-base font-semibold text-ink sm:text-lg">
              {title}
            </h1>
          </div>
          {actions && <div className="hidden sm:flex shrink-0 gap-2">{actions}</div>}
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 animate-fade-in">
          {description && (
            <p className="mb-5 max-w-2xl text-sm text-ink-muted">{description}</p>
          )}
          {actions && <div className="mb-5 flex flex-wrap gap-2 sm:hidden">{actions}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-tile">
        KT
      </div>
      <div className="leading-tight">
        <p className="font-heading text-sm font-semibold text-ink">Karang Taruna</p>
        <p className="text-[11px] text-ink-muted">Admin · RW 03</p>
      </div>
    </div>
  );
}
function SidebarHeader() {
  return (
    <div className="flex items-center px-5 h-[64px] border-b border-border">
      <SidebarBrand />
    </div>
  );
}
function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        Menu
      </p>
      <ul className="space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-ink hover:bg-muted-surface hover:text-primary"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
function SidebarFooter() {
  return (
    <div className="border-t border-border p-3">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-muted-surface hover:text-ink"
      >
        <LogOut className="size-4" />
        Keluar
      </button>
      <p className="mt-2 px-3 text-[10px] text-ink-muted">v0.1 · UI Preview</p>
    </div>
  );
}