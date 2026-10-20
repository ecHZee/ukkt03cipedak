import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { IsiKonten } from "@/components/public/IsiKonten";
import { BagikanKonten } from "@/components/public/BagikanKonten";
import { ambilKegiatanSlug, formatTanggal } from "@/services/konten";
import { generateMetadata } from "@/seo/generateMetadata";
import { generateOG } from "@/seo/generateOG";
import { SITE } from "@/constants/site";
import { tautanKalender, urlAbsolut } from "@/lib/tautan-konten";

export const Route = createFileRoute("/kegiatan/$slug")({
  loader: async ({ params }) => {
    const kegiatan = await ambilKegiatanSlug(params.slug);
    if (!kegiatan) throw notFound();
    return kegiatan;
  },
  head: ({ loaderData: k }) =>
    k
      ? generateMetadata({
          title: k.judul,
          noindex: k.isDummy,
          description: k.ringkasan || undefined,
          path: `/kegiatan/${k.slug}`,
          image: generateOG({ image: k.sampul?.url }),
        })
      : { meta: [{ title: "Kegiatan tidak ditemukan" }, { name: "robots", content: "noindex" }] },
  component: DetailKegiatan,
});

function DetailKegiatan() {
  const k = Route.useLoaderData();
  const url = urlAbsolut(`/kegiatan/${k.slug}`, SITE.url);
  const kalender = tautanKalender(k, url);
  const status = { rencana: "Rencana", berjalan: "Berjalan", selesai: "Selesai", batal: "Batal" }[
    k.tahap
  ];
  return (
    <PageShell>
      <PageHero eyebrow={k.namaBidang ?? "Kegiatan RW 03"} title={k.judul}>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">
          <span className="rounded-full border border-white/30 px-3 py-1">{status}</span>
          {k.jadwal && (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden />
              {k.jadwal}
            </span>
          )}
          {k.lokasi && (
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden />
              {k.lokasi}
            </span>
          )}
        </div>
      </PageHero>
      <article className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-16">
        <Link
          to="/kegiatan"
          className="mb-8 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
        >
          ← Semua kegiatan
        </Link>
        {k.sampul && (
          <figure className="mb-8">
            <img
              src={k.sampul.url}
              alt={k.sampul.caption || k.judul}
              className="max-h-[520px] w-full rounded-xl object-cover"
              decoding="async"
            />
            {k.sampul.caption && (
              <figcaption className="mt-2 text-sm text-ink-muted">{k.sampul.caption}</figcaption>
            )}
          </figure>
        )}
        <IsiKonten isi={k.isi} ringkasan={k.ringkasan} />
        {k.selesai && (
          <p className="mt-6 text-sm text-ink-muted">
            Selesai: {formatTanggal(k.selesai)} ·{" "}
            {new Date(k.selesai).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Jakarta",
            })}{" "}
            WIB
          </p>
        )}
        <div className="mt-10 border-t border-border pt-6">
          <BagikanKonten
            judul={k.judul}
            url={url}
            kalender={kalender}
            durasiSementara={!k.selesai}
          />
        </div>
      </article>
    </PageShell>
  );
}
