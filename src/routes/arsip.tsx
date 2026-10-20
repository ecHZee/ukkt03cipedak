import { generateMetadata } from "@/seo/generateMetadata";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { FilterBidang } from "@/components/public/FilterBidang";
import { KartuDokumen } from "@/components/public/KartuDokumen";
import { EmptyState } from "@/components/shared/EmptyState";
import { DOKUMEN_KATEGORI_LABEL, type DokumenKategori } from "@/domains/dokumen/types";
import { bacaFilterArsip, cocokBidang } from "@/lib/filter-publik";
import { ambilDokumenArsip, ambilDokumenPublik } from "@/services/konten";
import { ambilBidang } from "@/services/organisasi";
import { useSesiPublik } from "@/hooks/use-sesi-publik";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/arsip")({
  validateSearch: bacaFilterArsip,
  head: () =>
    generateMetadata({
      title: "Arsip Digital",
      description:
        "Arsip SK, LPJ, proposal dan surat Karang Taruna RW 03 Cipedak. Akses dokumen sesuai hak akun.",
      path: "/arsip",
    }),
  // Loader SSR hanya publik. Dokumen bersesi tidak pernah diserialisasi ke HTML atau cache route.
  loader: async () => {
    const [dokumen, bidang] = await Promise.all([ambilDokumenPublik(), ambilBidang()]);
    return { dokumen, bidang };
  },
  component: ArsipPage,
});

function ArsipPage() {
  const publik = Route.useLoaderData();
  const search = Route.useSearch();
  const parameterMasuk = new URLSearchParams(
    Object.entries(search)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const tujuanMasuk = "/arsip" + (parameterMasuk ? "?" + parameterMasuk : "");
  const navigate = Route.useNavigate();
  const sesi = useSesiPublik();
  const arsip = useQuery({
    queryKey: ["arsip-bersesi", sesi.id, sesi.versi],
    queryFn: ambilDokumenArsip,
    enabled: Boolean(sesi.id),
    gcTime: 0,
    staleTime: 0,
    retry: 1,
  });
  const semua = sesi.id ? (arsip.data ?? []) : publik.dokumen;
  const tahun = Array.from(new Set(semua.map((d) => d.tahun))).sort((a, b) => b - a);
  const hasil = semua.filter(
    (d) =>
      cocokBidang(d.bidang, search.bidang) &&
      (!search.tahun || d.tahun === search.tahun) &&
      (!search.kategori || d.kategori === search.kategori) &&
      (!search.q ||
        d.judul.toLocaleLowerCase("id-ID").includes(search.q.toLocaleLowerCase("id-ID"))),
  );
  const ubah = (nilai: Partial<typeof search>) =>
    navigate({ search: (lama) => ({ ...lama, ...nilai }), resetScroll: false });
  const kelas =
    "min-h-11 min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
  return (
    <PageShell>
      <PageHero
        eyebrow="Arsip Digital"
        title="Arsip Karang Taruna RW 03"
        description="SK, LPJ, proposal dan surat organisasi. Dokumen yang tampil mengikuti hak akses akun."
      />
      <section
        className="mx-auto max-w-[1280px] space-y-6 px-6 py-10 md:px-10 lg:px-16"
        data-arsip="berjenjang"
      >
        <h2 className="sr-only">Daftar arsip dan filter dokumen</h2>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted-surface p-4 text-sm text-ink-muted">
          <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            {sesi.id ? (
              "Kamu melihat dokumen terbit yang dapat diakses akunmu."
            ) : (
              <>
                Dokumen publik dapat dibuka siapa saja.{" "}
                <Link
                  to="/login"
                  reloadDocument
                  search={{ ke: tujuanMasuk }}
                  className="inline-flex min-h-11 items-center font-semibold text-primary underline"
                >
                  Masuk sebagai pengurus
                </Link>{" "}
                untuk mengakses arsip internal sesuai hak akun.
              </>
            )}
          </p>
        </div>
        <FilterBidang
          bidang={publik.bidang}
          nilai={search.bidang}
          onChange={(bidang) => ubah({ bidang })}
        />
        <form
          key={search.q ?? ""}
          onSubmit={(e) => {
            e.preventDefault();
            const q = String(new FormData(e.currentTarget).get("q") ?? "")
              .trim()
              .slice(0, 120);
            void ubah({ q: q || undefined });
          }}
          className="flex min-w-0 flex-wrap gap-3"
        >
          <label className="flex min-w-0 flex-1 basis-52 flex-col gap-1 text-sm font-medium">
            Cari dokumen
            <input
              name="q"
              type="search"
              defaultValue={search.q}
              maxLength={120}
              placeholder="Nama dokumen…"
              className={kelas}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Tahun
            <select
              value={search.tahun ?? ""}
              onChange={(e) =>
                void ubah({ tahun: e.target.value ? Number(e.target.value) : undefined })
              }
              className={kelas}
            >
              <option value="">Semua tahun</option>
              {Array.from(new Set([...tahun, ...(search.tahun ? [search.tahun] : [])]))
                .sort((a, b) => b - a)
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-sm font-medium">
            Kategori
            <select
              value={search.kategori ?? ""}
              onChange={(e) => void ubah({ kategori: e.target.value || undefined })}
              className={kelas}
            >
              <option value="">Semua kategori</option>
              {(Object.keys(DOKUMEN_KATEGORI_LABEL) as DokumenKategori[]).map((k) => (
                <option key={k} value={k}>
                  {DOKUMEN_KATEGORI_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className={cn(kelas, "self-end bg-primary font-semibold text-primary-foreground")}
          >
            Cari
          </button>
          <button
            type="button"
            onClick={() => void navigate({ search: {}, resetScroll: false })}
            className={kelas + " self-end"}
          >
            Hapus filter
          </button>
        </form>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {hasil.length} dokumen
        </p>
        {sesi.id && arsip.isPending ? (
          <p role="status">Memuat arsip sesuai akses akun…</p>
        ) : arsip.isError && sesi.id ? (
          <div role="alert" className="space-y-3 text-sm">
            <p>Arsip belum dapat dimuat. Periksa koneksi atau sesi akun.</p>
            <button type="button" className={kelas} onClick={() => void arsip.refetch()}>
              Coba lagi
            </button>
          </div>
        ) : hasil.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hasil.map((d) => (
              <KartuDokumen key={sesi.id + ":" + d.id} dokumen={d} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title={semua.length ? "Tidak ada dokumen yang cocok" : "Arsip belum tersedia"}
            description={
              semua.length
                ? "Coba ubah kata kunci atau hapus filter."
                : "Dokumen terbit akan tampil di sini sesuai hak akses akun."
            }
          />
        )}
      </section>
    </PageShell>
  );
}
