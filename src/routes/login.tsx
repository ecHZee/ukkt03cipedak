import { useEffect, useState, type FormEvent } from "react";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { ambilAkunSaya, masuk, tujuanAman } from "@/services/auth";

type Cari = { ke?: string };

export const Route = createFileRoute("/login")({
  // Dirender di browser saja: status login tersimpan di browser.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Masuk Pengurus — Karang Taruna RW 03 Cipedak" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Cari => ({
    ke: typeof s.ke === "string" ? s.ke : undefined,
  }),
  // Sudah login → langsung ke tujuan.
  beforeLoad: async ({ search }) => {
    if (await ambilAkunSaya()) throw redirect({ href: tujuanAman(search.ke) });
  },
  component: Page,
});

// Pembatas di sisi browser: 5× gagal → form dikunci 60 detik.
// (Supabase Auth juga punya pembatas sendiri di server.)
const KUNCI_KEY = "katar.masuk.gagal";
const MAKS_GAGAL = 5;
const LAMA_KUNCI_MS = 60_000;

type Gagal = { jumlah: number; sampai: number };
function bacaGagal(): Gagal {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_KEY) ?? "") as Gagal;
  } catch {
    return { jumlah: 0, sampai: 0 };
  }
}
function simpanGagal(g: Gagal) {
  try {
    localStorage.setItem(KUNCI_KEY, JSON.stringify(g));
  } catch {
    /* penyimpanan browser tidak tersedia — abaikan */
  }
}

function Page() {
  const { ke } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihat, setLihat] = useState(false);
  const [proses, setProses] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sisaKunci, setSisaKunci] = useState(0);

  // Hitung mundur kunci
  useEffect(() => {
    const tick = () =>
      setSisaKunci(Math.max(0, Math.ceil((bacaGagal().sampai - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function kirim(e: FormEvent) {
    e.preventDefault();
    if (sisaKunci > 0 || proses) return;
    setProses(true);
    setPesan(null);
    const hasil = await masuk(email, password);
    setProses(false);

    if (hasil.ok) {
      simpanGagal({ jumlah: 0, sampai: 0 });
      navigate({ href: tujuanAman(ke), replace: true });
      return;
    }
    const g = bacaGagal();
    const jumlah = (g.jumlah ?? 0) + 1;
    if (jumlah >= MAKS_GAGAL) {
      simpanGagal({ jumlah: 0, sampai: Date.now() + LAMA_KUNCI_MS });
      setSisaKunci(Math.ceil(LAMA_KUNCI_MS / 1000));
      setPesan(`${hasil.pesan} Form dikunci 1 menit karena terlalu banyak percobaan.`);
    } else {
      simpanGagal({ jumlah, sampai: 0 });
      setPesan(hasil.pesan);
    }
    setPassword("");
  }

  const terkunci = sisaKunci > 0;

  return (
    <div className="relative grid min-h-dvh place-items-center bg-muted-surface px-4 py-10">
      <div className="pointer-events-none absolute inset-0 batik-kawung batik-op-2" aria-hidden />
      <div className="relative w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Kembali ke website
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-ink">Masuk Pengurus</h1>
              <p className="text-xs text-ink-muted">Karang Taruna RW 03 Cipedak</p>
            </div>
          </div>

          <form onSubmit={kirim} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={lihat ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-surface pl-3 pr-11 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setLihat((v) => !v)}
                  aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-muted hover:text-ink"
                >
                  {lihat ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {pesan && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {pesan}
              </p>
            )}

            <button
              type="submit"
              disabled={proses || terkunci || !email || !password}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {proses && <Loader2 className="size-4 animate-spin" />}
              {terkunci ? `Coba lagi dalam ${sisaKunci} detik` : proses ? "Memeriksa…" : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
