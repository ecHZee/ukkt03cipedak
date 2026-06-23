import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight, CalendarRange, FileText, Images, Newspaper,
  Plus, ShieldCheck, Users2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_ROUTES } from "@/constants/routes";
import { STRUKTUR_2025_2028 } from "@/domains/anggota/data";
import { BERITA_LIST } from "@/domains/berita/data";
import { KEGIATAN_LIST } from "@/domains/kegiatan/data";
import { DOKUMEN_LIST } from "@/domains/dokumen/data";

export const Route = createFileRoute("/admin/dashboard")({ component: Page });

function Page() {
  const kpis = [
    { label: "Total Anggota",  value: STRUKTUR_2025_2028.length, hint: "Periode 2025–2028", icon: Users2,        tone: "bg-primary/10 text-primary" },
    { label: "Total Kegiatan", value: KEGIATAN_LIST.length,       hint: "Aktif & rencana",  icon: CalendarRange, tone: "bg-success/10 text-success" },
    { label: "Total Berita",   value: BERITA_LIST.length,         hint: "Termasuk draft",   icon: Newspaper,     tone: "bg-warning/10 text-warning" },
    { label: "Total Dokumen",  value: DOKUMEN_LIST.length,        hint: "LPJ & SK",         icon: FileText,      tone: "bg-accent/15 text-accent-foreground" },
  ];

  const aktivitas = [
    { who: "Sekretariat", what: "menambahkan SK Pengurus 2025–2028", when: "09 Jun 2025", mod: "Dokumen" },
    { who: "Bidang OKK",  what: "menjadwalkan rapat konsolidasi",     when: "TBA",         mod: "Kegiatan" },
    { who: "Bidang Media",what: "menyiapkan kanal media sosial",      when: "TBA",         mod: "Settings" },
    { who: "Bendahara",   what: "mengarsipkan laporan kas awal",      when: "TBA",         mod: "Dokumen" },
  ];

  const upcoming = KEGIATAN_LIST.filter((k) => k.status !== "selesai").slice(0, 4);

  const shortcuts = [
    { to: ADMIN_ROUTES.berita,   label: "Tulis Berita",       icon: Newspaper },
    { to: ADMIN_ROUTES.kegiatan, label: "Tambah Kegiatan",    icon: CalendarRange },
    { to: ADMIN_ROUTES.galeri,   label: "Unggah Foto",        icon: Images },
    { to: ADMIN_ROUTES.dokumen,  label: "Unggah Dokumen",     icon: FileText },
    { to: ADMIN_ROUTES.anggota,  label: "Kelola Anggota",     icon: Users2 },
    { to: ADMIN_ROUTES.users,    label: "Kelola Akun Admin",  icon: ShieldCheck },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Ringkasan organisasi & aktivitas terbaru di Internal CMS Karang Taruna RW 03."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, tone }, i) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className={`grid size-10 place-items-center rounded-lg ${tone}`}>
                <Icon className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-ink-muted" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums text-ink">{value}</p>
            <p className="mt-1 text-xs text-ink-muted">{hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Aktivitas Terbaru" subtitle="20 entri terakhir akan tampil di Audit Log lengkap.">
          <ul className="divide-y divide-border">
            {aktivitas.map((a, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {a.who[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    <span className="font-semibold">{a.who}</span>{" "}
                    <span className="text-ink-muted">{a.what}</span>
                  </p>
                  <p className="text-[11px] tabular-nums text-ink-muted">
                    {a.when} · Modul {a.mod}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Kegiatan Terdekat" subtitle="Disusun dari modul Kegiatan.">
          <ul className="space-y-3">
            {upcoming.map((k) => (
              <li key={k.id} className="rounded-lg border border-border p-3">
                <p className="font-heading text-sm font-semibold text-ink leading-snug line-clamp-2">{k.judul}</p>
                <p className="mt-1 text-[11px] tabular-nums text-ink-muted">
                  {k.tanggal} · {k.lokasi}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Shortcut" subtitle="Akses cepat ke modul yang paling sering dipakai pengurus.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {shortcuts.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col items-start gap-2 rounded-lg border border-border bg-surface p-3 transition hover:border-primary/40 hover:shadow-tile-hover"
              >
                <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-semibold text-ink group-hover:text-primary">{label}</span>
                <Plus className="ml-auto size-3.5 text-ink-muted" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Panel({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-tile">
      <header className="mb-4">
        <h2 className="font-heading text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}