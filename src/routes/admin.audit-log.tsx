import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/audit-log")({ component: Page });

const ROWS = [
  { waktu: "09 Jun 2025 · 10:12", user: "@ketua",      aktivitas: "Mengunggah SK Pengurus 2025–2028", modul: "Dokumen" },
  { waktu: "09 Jun 2025 · 10:30", user: "@sekretaris", aktivitas: "Memperbarui Profil Sekretariat",   modul: "Settings" },
  { waktu: "TBA",                  user: "@media",     aktivitas: "Menambahkan album Pelantikan",     modul: "Galeri" },
  { waktu: "TBA",                  user: "@okk",       aktivitas: "Menjadwalkan Rapat Konsolidasi",   modul: "Kegiatan" },
  { waktu: "TBA",                  user: "@bendahara", aktivitas: "Mengarsipkan laporan kas",         modul: "Dokumen" },
];

function Page() {
  return (
    <AdminShell
      title="Audit Log"
      description="Tampilan UI riwayat aktivitas pengurus di Internal CMS. Logika & sumber data akan diisi di fase Software Engineering."
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
        <div className="flex items-center gap-2 border-b border-border bg-muted-surface px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <History className="size-3.5" /> Aktivitas Terbaru
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Aktivitas</th>
                <th className="px-4 py-3">Modul</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r, i) => (
                <tr key={i} className="transition hover:bg-muted-surface/60">
                  <td className="px-4 py-3 tabular-nums text-ink-muted">{r.waktu}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{r.user}</td>
                  <td className="px-4 py-3 text-ink">{r.aktivitas}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {r.modul}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}