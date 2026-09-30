import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ROLE_LABEL, type Role } from "@/constants/site";

export const Route = createFileRoute("/admin/users")({ component: Page });

type Status = "Aktif" | "Nonaktif" | "Diundang";

const ROLE_TONE: Record<Role, string> = {
  super_admin: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-accent/15 text-accent-foreground border-accent/30",
};
const STATUS_TONE: Record<Status, string> = {
  Aktif: "bg-success/10 text-success",
  Nonaktif: "bg-muted-surface text-ink-muted",
  Diundang: "bg-warning/10 text-warning",
};

type Row = { username: string; jabatan: string; role: Role; status: Status };

const ROWS: Row[] = [
  { username: "programmer", jabatan: "Programmer", role: "super_admin", status: "Aktif" },
  { username: "ketua", jabatan: "Ketua · semua bidang", role: "admin", status: "Aktif" },
  { username: "sekretaris", jabatan: "Sekretaris · semua bidang", role: "admin", status: "Aktif" },
  { username: "media", jabatan: "Kepala Bidang Media", role: "admin", status: "Diundang" },
  { username: "okk", jabatan: "Kepala Bidang OKK & SDM", role: "admin", status: "Nonaktif" },
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
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ROLE_TONE[r.role]}`}
                    >
                      {ROLE_LABEL[r.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[r.status]}`}
                    >
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
