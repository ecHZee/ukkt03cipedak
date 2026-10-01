import { useState, type FormEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { cekPassword, gantiPassword, keluar } from "@/services/auth";

/**
 * Popup wajib ganti password saat login pertama (password awal dibuat acak oleh Super Admin).
 * Tidak bisa ditutup; satu-satunya jalan keluar selain mengganti password adalah tombol Keluar.
 */
export function GantiPasswordWajib({ nama }: { nama: string }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [ulang, setUlang] = useState("");
  const [proses, setProses] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  async function simpan(e: FormEvent) {
    e.preventDefault();
    const masalah = cekPassword(pw) ?? (pw !== ulang ? "Ulangi password tidak sama." : null);
    if (masalah) return setPesan(masalah);
    setProses(true);
    setPesan(null);
    try {
      await gantiPassword(pw);
      await router.invalidate(); // muat ulang data akun → popup hilang
    } catch (err) {
      setPesan((err as Error).message);
    } finally {
      setProses(false);
    }
  }

  const kelasInput =
    "mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-ganti-pw"
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/70 p-4"
    >
      <form
        onSubmit={simpan}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-elevated"
      >
        <div className="grid size-11 place-items-center rounded-xl bg-accent/15 text-accent-foreground">
          <KeyRound className="size-5" />
        </div>
        <h2 id="judul-ganti-pw" className="mt-4 font-heading text-lg font-bold text-ink">
          Halo {nama}, buat password barumu
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Password awal hanya untuk masuk pertama kali. Buat password pribadi minimal 10 karakter,
          gabungan huruf dan angka.
        </p>

        <label htmlFor="pw-baru" className="mt-5 block text-sm font-medium text-ink">
          Password baru
        </label>
        <input
          id="pw-baru"
          type="password"
          autoComplete="new-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={kelasInput}
        />
        <label htmlFor="pw-ulang" className="mt-3 block text-sm font-medium text-ink">
          Ulangi password baru
        </label>
        <input
          id="pw-ulang"
          type="password"
          autoComplete="new-password"
          value={ulang}
          onChange={(e) => setUlang(e.target.value)}
          className={kelasInput}
        />

        {pesan && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {pesan}
          </p>
        )}

        <button
          type="submit"
          disabled={proses || !pw || !ulang}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90 disabled:opacity-60"
        >
          {proses && <Loader2 className="size-4 animate-spin" />}
          Simpan password
        </button>
        <button
          type="button"
          onClick={async () => {
            await keluar();
            window.location.href = "/login";
          }}
          className="mt-2 w-full text-center text-xs text-ink-muted hover:text-ink"
        >
          Keluar dulu
        </button>
      </form>
    </div>
  );
}
