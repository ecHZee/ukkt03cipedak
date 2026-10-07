import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Check, Copy, KeyRound, Loader2, Pencil, Power, Search, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BarisAkun } from "@/services/akun.server";
import {
  daftarAkunFn,
  gantiUsernameFn,
  resetPasswordFn,
  ubahStatusFn,
} from "@/services/akun.functions";

export const Route = createFileRoute("/admin/users")({
  // Halaman akun khusus Super Admin (programmer). Server juga memeriksa ulang di setiap aksi.
  beforeLoad: ({ context }) => {
    if (context.akun?.role !== "super_admin") throw redirect({ to: "/admin/dashboard" });
  },
  loader: () => daftarAkunFn(),
  component: Page,
});

type Filter = "semua" | "belum-ganti" | "nonaktif" | "admin";
const FILTER: Array<{ v: Filter; label: string }> = [
  { v: "semua", label: "Semua" },
  { v: "admin", label: "Admin" },
  { v: "belum-ganti", label: "Belum ganti password" },
  { v: "nonaktif", label: "Nonaktif" },
];

const URUT_ROLE = { super_admin: 0, admin: 1, anggota: 2 } as const;

function labelPeran(a: BarisAkun) {
  if (a.role === "super_admin") return "Super Admin";
  if (a.role === "admin") return a.kelompok === "BPH" ? "Admin Level 1" : "Admin Level 2";
  return a.kelompok === "Penasihat" ? "Penasihat" : "Anggota";
}

const waktu = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

type Dialog =
  | { jenis: "username"; a: BarisAkun }
  | { jenis: "reset"; a: BarisAkun }
  | { jenis: "status"; a: BarisAkun }
  | { jenis: "password"; username: string | null; password: string };

function Page() {
  const akun = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const daftar = useMemo(() => {
    const s = q.trim().toLowerCase();
    return akun
      .filter(
        (a) =>
          (filter === "semua" ||
            (filter === "admin" && a.role !== "anggota") ||
            (filter === "belum-ganti" && a.aktif && a.harusGantiPassword) ||
            (filter === "nonaktif" && !a.aktif)) &&
          (s === "" ||
            a.nama.toLowerCase().includes(s) ||
            (a.username ?? "").includes(s) ||
            (a.jabatan ?? "").toLowerCase().includes(s) ||
            (a.kelompok ?? "").toLowerCase().includes(s)),
      )
      .sort((x, y) => URUT_ROLE[x.role] - URUT_ROLE[y.role] || x.nama.localeCompare(y.nama));
  }, [akun, q, filter]);

  const jumlah = {
    total: akun.length,
    belumGanti: akun.filter((a) => a.aktif && a.harusGantiPassword).length,
    nonaktif: akun.filter((a) => !a.aktif).length,
  };

  return (
    <AdminShell
      title="Akun"
      description="Kelola akun login pengurus: ganti username, reset password, dan nonaktifkan akun. Peran mengikuti jabatan di tab Pengurus."
    >
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Angka label="Akun" nilai={jumlah.total} />
        <Angka label="Belum ganti password" nilai={jumlah.belumGanti} />
        <Angka label="Nonaktif" nilai={jumlah.nonaktif} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama, username, jabatan, bidang…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FILTER.map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.v
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-ink hover:border-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {daftar.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Tidak ada akun cocok"
          description="Ubah kata kunci atau filter."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted-surface text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Akun</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Terakhir masuk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {daftar.map((a) => (
                  <tr
                    key={a.id}
                    className={`transition hover:bg-muted-surface/60 ${a.aktif ? "" : "opacity-60"}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">
                        {a.nama}
                        {a.diriSendiri && (
                          <span className="ml-1.5 text-[11px] font-normal text-ink-muted">
                            (kamu)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-muted">
                        @{a.username ?? "—"}
                        {a.emailAsli && <span> · login: {a.emailAsli}</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{labelPeran(a)}</p>
                      <p className="text-xs text-ink-muted">
                        {[a.jabatan, a.kelompok].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusAkun a={a} />
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-ink-muted">
                      {a.terakhirMasuk ? waktu.format(new Date(a.terakhirMasuk)) : "Belum pernah"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Aksi
                          label="Ganti username"
                          onClick={() => setDialog({ jenis: "username", a })}
                        >
                          <Pencil className="size-3.5" />
                        </Aksi>
                        {!a.diriSendiri && (
                          <>
                            <Aksi
                              label="Reset password"
                              onClick={() => setDialog({ jenis: "reset", a })}
                            >
                              <KeyRound className="size-3.5" />
                            </Aksi>
                            {a.role !== "super_admin" && (
                              <Aksi
                                label={a.aktif ? "Nonaktifkan" : "Aktifkan"}
                                bahaya={a.aktif}
                                onClick={() => setDialog({ jenis: "status", a })}
                              >
                                <Power className="size-3.5" />
                              </Aksi>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-4 py-3 text-xs text-ink-muted">
            {daftar.length} dari {akun.length} akun · Password tidak bisa dilihat siapa pun
            (tersimpan teracak). Bila lupa, gunakan Reset.
          </p>
        </div>
      )}

      {dialog &&
        createPortal(
          <DialogAkun
            dialog={dialog}
            onTutup={() => setDialog(null)}
            onSelesai={async (berikut) => {
              await router.invalidate();
              setDialog(berikut ?? null);
            }}
          />,
          document.body,
        )}
    </AdminShell>
  );
}

function Angka({ label, nilai }: { label: string; nilai: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 shadow-tile">
      <p className="text-2xl font-bold tabular-nums text-ink">{nilai}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function StatusAkun({ a }: { a: BarisAkun }) {
  const [teks, tone] = !a.aktif
    ? ["Nonaktif", "bg-muted-surface text-ink-muted"]
    : a.harusGantiPassword
      ? ["Belum ganti password", "bg-warning/10 text-warning"]
      : ["Aktif", "bg-success/10 text-success"];
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}
    >
      {teks}
    </span>
  );
}

function Aksi({
  label,
  bahaya,
  onClick,
  children,
}: {
  label: string;
  bahaya?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid size-8 place-items-center rounded-md border border-border text-ink transition ${
        bahaya
          ? "hover:border-destructive hover:text-destructive"
          : "hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function DialogAkun({
  dialog,
  onTutup,
  onSelesai,
}: {
  dialog: Dialog;
  onTutup: () => void;
  onSelesai: (berikut?: Dialog) => Promise<void>;
}) {
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [username, setUsername] = useState(
    dialog.jenis === "username" ? (dialog.a.username ?? "") : "",
  );
  const [tersalin, setTersalin] = useState(false);
  // Jendela password sementara tidak ikut tertutup oleh Esc/klik luar: jangan sampai hilang sebelum dicatat.
  const kunci = dialog.jenis === "password" || proses;

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && !kunci && onTutup();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [kunci, onTutup]);

  async function jalankan(aksi: () => Promise<Dialog | void>) {
    setProses(true);
    setGalat(null);
    try {
      await onSelesai((await aksi()) ?? undefined);
    } catch (err) {
      setGalat((err as Error).message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  let judul: string;
  let isi: ReactNode;
  let tombol: ReactNode;

  if (dialog.jenis === "password") {
    judul = "Password sementara";
    isi = (
      <>
        <p className="text-sm text-ink-muted">
          Berikan ke <b className="text-ink">@{dialog.username}</b> lewat chat pribadi. Password ini{" "}
          <b className="text-ink">hanya tampil sekali</b>; ia wajib menggantinya saat login.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted-surface px-3 py-2.5">
          <code className="flex-1 select-all font-mono text-base font-semibold text-ink">
            {dialog.password}
          </code>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(dialog.password);
              setTersalin(true);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
          >
            {tersalin ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {tersalin ? "Tersalin" : "Salin"}
          </button>
        </div>
      </>
    );
    tombol = <Tombol onClick={onTutup}>Sudah dicatat, tutup</Tombol>;
  } else if (dialog.jenis === "username") {
    const a = dialog.a;
    judul = "Ganti username";
    isi = (
      <form
        id="form-username"
        onSubmit={(e) => {
          e.preventDefault();
          void jalankan(() => gantiUsernameFn({ data: { id: a.id, username } }));
        }}
      >
        <p className="text-sm text-ink-muted">
          {a.nama} akan login dengan username baru. Password tidak berubah.
        </p>
        <label className="mt-4 block text-xs font-semibold text-ink">
          Username baru
          <input
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
            placeholder="mis. nama.belakang"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-normal outline-none focus:border-primary"
          />
        </label>
        <p className="mt-1 text-[11px] text-ink-muted">
          3–41 karakter: huruf kecil, angka, titik, strip.
        </p>
      </form>
    );
    tombol = (
      <Tombol form="form-username" proses={proses} disabled={username === a.username}>
        Simpan
      </Tombol>
    );
  } else if (dialog.jenis === "reset") {
    const a = dialog.a;
    judul = "Reset password?";
    isi = (
      <p className="text-sm text-ink-muted">
        Password <b className="text-ink">{a.nama}</b> (@{a.username}) diganti dengan password
        sementara acak. Password lama langsung tidak berlaku.
      </p>
    );
    tombol = (
      <Tombol
        proses={proses}
        onClick={() =>
          jalankan(async () => {
            const r = await resetPasswordFn({ data: { id: a.id } });
            return { jenis: "password", username: r.username, password: r.password };
          })
        }
      >
        Reset password
      </Tombol>
    );
  } else {
    const a = dialog.a;
    judul = a.aktif ? "Nonaktifkan akun?" : "Aktifkan akun?";
    isi = (
      <p className="text-sm text-ink-muted">
        {a.aktif ? (
          <>
            <b className="text-ink">{a.nama}</b> tidak bisa login lagi dan sesi yang sedang terbuka
            akan berakhir. Kontennya tetap ada. Bisa diaktifkan kembali kapan saja.
          </>
        ) : (
          <>
            <b className="text-ink">{a.nama}</b> bisa login lagi dengan password terakhirnya.
          </>
        )}
      </p>
    );
    tombol = (
      <Tombol
        bahaya={a.aktif}
        proses={proses}
        onClick={() => jalankan(() => ubahStatusFn({ data: { id: a.id, aktif: !a.aktif } }))}
      >
        {a.aktif ? "Nonaktifkan" : "Aktifkan"}
      </Tombol>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={judul}
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 animate-fade-in"
      onClick={() => !kunci && onTutup()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-elevated animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-ink">{judul}</h2>
        <div className="mt-2">{isi}</div>
        {galat && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {galat}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          {dialog.jenis !== "password" && (
            <button
              onClick={onTutup}
              disabled={proses}
              className="rounded-lg border border-border px-3.5 py-2 text-sm font-semibold text-ink hover:bg-muted-surface disabled:opacity-50"
            >
              Batal
            </button>
          )}
          {tombol}
        </div>
      </div>
    </div>
  );
}

function Tombol({
  children,
  onClick,
  form,
  proses,
  disabled,
  bahaya,
}: {
  children: ReactNode;
  onClick?: () => void;
  form?: string;
  proses?: boolean;
  disabled?: boolean;
  bahaya?: boolean;
}) {
  return (
    <button
      type={form ? "submit" : "button"}
      form={form}
      onClick={onClick}
      disabled={proses || disabled}
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold shadow-tile transition disabled:opacity-50 ${
        bahaya
          ? "bg-destructive text-white hover:bg-destructive/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {proses && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
