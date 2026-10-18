import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { KartuAgenda } from "@/components/public/KartuAgenda";
import { DaftarPengurus } from "@/components/public/anggota/HumanDirectory";
import { ambilDetailBidang } from "@/services/program";
import { gayaBidang } from "@/domains/program/style";
import { generateMetadata } from "@/seo/generateMetadata";

export const Route = createFileRoute("/program/$bidang")({
  loader: async ({ params }) => {
    const data = await ambilDetailBidang(params.bidang);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData: data }) =>
    data
      ? generateMetadata({
          title: data.bidang.name,
          description:
            data.bidang.description ||
            `Pengurus dan kegiatan ${data.bidang.name} Karang Taruna RW 03 Cipedak.`,
          path: `/program/${data.bidang.slug}`,
        })
      : { meta: [{ title: "Bidang tidak ditemukan" }, { name: "robots", content: "noindex" }] },
  component: BidangPage,
});

function BidangPage() {
  const { bidang: b, periode, pengurus, kegiatan } = Route.useLoaderData();
  const { icon: Icon, iconBg } = gayaBidang(b.slug);
  return (
    <PageShell>
      <PageHero
        eyebrow={`Bidang · Periode ${periode}`}
        title={b.name}
        description={b.description || undefined}
      />
      <div className="mx-auto max-w-[1280px] space-y-10 px-6 py-10 md:px-10 lg:px-16">
        <Link
          to="/program"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
        >
          ← Semua bidang kerja
        </Link>
        {b.fokus.length > 0 && (
          <section
            aria-labelledby="fokus-bidang"
            className="rounded-xl border border-border bg-surface p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className={`grid size-11 shrink-0 place-items-center rounded-lg ${iconBg}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 id="fokus-bidang" className="font-heading text-xl font-bold text-ink">
                Fokus kerja
              </h2>
            </div>
            <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-ink-muted sm:grid-cols-2">
              {b.fokus.map((f) => (
                <li key={f} className="flex min-w-0 gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}
        {pengurus.length > 0 && (
          <section aria-labelledby="pengurus-bidang">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 id="pengurus-bidang" className="font-heading text-2xl font-bold text-ink">
                Pengurus bidang{" "}
                <span className="text-sm font-medium text-ink-muted">
                  · {pengurus.length} orang
                </span>
              </h2>
              <Link
                to="/tentang/pengurus"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
              >
                Direktori lengkap →
              </Link>
            </div>
            <DaftarPengurus pengurus={pengurus} />
          </section>
        )}
        {kegiatan.length > 0 && (
          <section aria-labelledby="kegiatan-bidang">
            <h2 id="kegiatan-bidang" className="mb-5 font-heading text-2xl font-bold text-ink">
              Kegiatan bidang{" "}
              <span className="text-sm font-medium text-ink-muted">
                · {kegiatan.length} kegiatan
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {kegiatan.map((k) => (
                <KartuAgenda key={k.id} kegiatan={k} namaBidang={b.singkat} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
