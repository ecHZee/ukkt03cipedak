import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/users")({ component: Page });

type Role = "Super Admin" | "Admin" | "Editor" | "Viewer";
type Status = "Aktif" | "Nonaktif" | "Diundang";

const ROLE_TONE: Record<Role, string> = {
  "Super Admin": "bg-primary/10 text-primary border-primary/20",
  "Admin":       "bg-accent/15 text-accent-foreground border-accent/30",
  "Editor":      "bg-success/10 text-success border-success/20",
  "Viewer":      "bg-muted-surface text-ink border-border",
};
const STATUS_TONE: Record<Status, string> = {
  "Aktif":    "bg-success/10 text-success",
  "Nonaktif": "bg-muted-surface text-ink-muted",
  "Diundang": "bg-warning/10 text-warning",
};

type Row = { username: string; jabatan: string; role: Role; status: Status };

const ROWS: Row[] = [
  { username: "ketua",      jabatan: "Ketua KT RW 03",        role: "Super Admin", status: "Aktif" },
  { username: "sekretaris", jabatan: "Sekretaris I",          role: "Admin",       status: "Aktif" },
  { username: "bendahara",  jabatan: "Bendahara I",           role: "Admin",       status: "Aktif" },
  { username: "media",      jabatan: "Koordinator Bid. Media",role: "Editor",      status: "Diundang" },
  { username: "okk",        jabatan: "Koordinator Bid. OKK",  role: "Editor",      status: "Nonaktif" },
];

function Page() {
  return (
    <AdminShell
      title="Users"
      description="Daftar akun pengurus yang dapat mengakses Internal CMS. Role & status hanya tampilan visual."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Plus className="size-4" /> Undang Pengguna
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted-surface text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r) => (
                <tr key={r.username} className="transition hover:bg-muted-surface/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <span className="font-semibold text-ink">@{r.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{r.jabatan}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ROLE_TONE[r.role]}`}>
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
                      Kelola
                    </button>
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