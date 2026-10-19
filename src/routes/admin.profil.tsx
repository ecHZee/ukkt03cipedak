import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Check, KeyRound, Loader2, UserRound } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAkun } from "@/hooks/use-akun";
import { supabase } from "@/integrations/supabase/client";
import { cekPassword, gantiPassword, ubahProfilSaya } from "@/services/auth";
import { FotoProfilSaya } from "@/components/admin/FotoProfilSaya";

export const Route = createFileRoute("/admin/profil")({ component: Page });

function Page() {
  return (
    <AdminShell
      title="Profil Saya"
      description="Data diri & foto. Email dan nomor HP tidak pernah tampil di website publik."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <DataDiri />
          <GantiPassword />
        </div>
        <FotoProfil />
      </div>
    </AdminShell>
  );
}

function Kartu({ judul, ikon, children }: { judul: string; ikon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-tile">
      <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-ink">
        {ikon}
        {judul}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const kelasInput =
  "mt-1.5 h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring";

function Status({ pesan, ok }: { pesan: string | null; ok: boolean }) {
  if (!pesan) return null;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`mt-3 rounded-lg px-3 py-2 text-sm ${ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
    >
      {pesan}
    </p>
  );
}

function DataDiri() {
  const akun = useAkun();
  const router = useRouter();
  const [nama, setNama] = useState(akun.nama);
  const [email, setEmail] = useState(akun.emailKontak ?? "");
  const [hp, setHp] = useState(akun.noHp ?? "");
  const [proses, setProses] = useState(false);
  const [hasil, setHasil] = useState<{ pesan: string; ok: boolean } | null>(null);

  async function simpan(e: FormEvent) {
    e.preventDefault();
    setProses(true);
    setHasil(null);
    try {
      await ubahProfilSaya(nama, email, hp);
      await router.invalidate();
      setHasil({ pesan: "Data diri tersimpan.", ok: true });
    } catch (err) {
      setHasil({ pesan: (err as Error).message, ok: false });
    } finally {
      setProses(false);
    }
  }

  return (
    <Kartu judul="Data diri" ikon={<UserRound className="size-4 text-primary" />}>
      <dl className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-muted-surface/60 p-3 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-muted">Username</dt>
          <dd className="font-semibold text-ink">{akun.username ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider text-ink-muted">Peran</dt>
          <dd className="font-semibold text-ink">{akun.label}</dd>
        </div>
      </dl>
      <form onSubmit={simpan} className="space-y-3">
        <div>
          <label htmlFor="nama" className="text-sm font-medium text-ink">
            Nama tampilan
          </label>
          <input
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={kelasInput}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email pribadi <span className="font-normal text-ink-muted">(opsional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={kelasInput}
            />
          </div>
          <div>
            <label htmlFor="hp" className="text-sm font-medium text-ink">
              No. HP <span className="font-normal text-ink-muted">(opsional)</span>
            </label>
            <input
              id="hp"
              type="tel"
              inputMode="tel"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className={kelasInput}
            />
          </div>
        </div>
        <p className="text-xs text-ink-muted">
          Email & no. HP hanya terlihat oleh kamu, Kabid bidangmu, dan BPH.
        </p>
        <button
          type="submit"
          disabled={proses}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {proses ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Simpan
        </button>
        <Status pesan={hasil?.pesan ?? null} ok={hasil?.ok ?? false} />
      </form>
    </Kartu>
  );
}

function GantiPassword() {
  const [pw, setPw] = useState("");
  const [ulang, setUlang] = useState("");
  const [proses, setProses] = useState(false);
  const [hasil, setHasil] = useState<{ pesan: string; ok: boolean } | null>(null);

  async function simpan(e: FormEvent) {
    e.preventDefault();
    const masalah = cekPassword(pw) ?? (pw !== ulang ? "Ulangi password tidak sama." : null);
    if (masalah) return setHasil({ pesan: masalah, ok: false });
    setProses(true);
    try {
      await gantiPassword(pw);
      setPw("");
      setUlang("");
      setHasil({ pesan: "Password berhasil diganti.", ok: true });
    } catch (err) {
      setHasil({ pesan: (err as Error).message, ok: false });
    } finally {
      setProses(false);
    }
  }

  return (
    <Kartu judul="Ganti password" ikon={<KeyRound className="size-4 text-primary" />}>
      <form onSubmit={simpan} className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="pw" className="text-sm font-medium text-ink">
            Password baru
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className={kelasInput}
          />
        </div>
        <div>
          <label htmlFor="pw2" className="text-sm font-medium text-ink">
            Ulangi
          </label>
          <input
            id="pw2"
            type="password"
            autoComplete="new-password"
            value={ulang}
            onChange={(e) => setUlang(e.target.value)}
            className={kelasInput}
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={proses || !pw}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {proses && <Loader2 className="size-4 animate-spin" />}
            Ganti password
          </button>
          <Status pesan={hasil?.pesan ?? null} ok={hasil?.ok ?? false} />
        </div>
      </form>
    </Kartu>
  );
}

function FotoProfil() {
  return <FotoProfilSaya />;
}
