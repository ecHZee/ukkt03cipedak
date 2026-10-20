import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { IsiKonten } from "@/components/public/IsiKonten";
import { BagikanKonten } from "@/components/public/BagikanKonten";
import { ambilBeritaSlug } from "@/services/konten";
import { generateMetadata } from "@/seo/generateMetadata";
import { generateOG } from "@/seo/generateOG";
import { SITE } from "@/constants/site";
import { urlAbsolut } from "@/lib/tautan-konten";

export const Route = createFileRoute("/berita/$slug")({
  loader: async ({ params }) => {
    const berita = await ambilBeritaSlug(params.slug);
    if (!berita) throw notFound();
    return berita;
  },
  head: ({ loaderData: b }) =>
    b
      ? generateMetadata({
          title: b.judul,
          noindex: b.isDummy,
          description: b.ringkasan || undefined,
          path: `/berita/${b.slug}`,
          image: generateOG({ image: b.sampul?.url }),
          type: "article",
        })
      : { meta: [{ title: "Berita tidak ditemukan" }, { name: "robots", content: "noindex" }] },
  component: DetailBerita,
});

function DetailBerita() {
  const b = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero eyebrow={b.namaBidang ?? "Kabar RW 03"} title={b.judul}>
        {b.terbitAt && (
          <time dateTime={b.terbitAt} className="text-sm text-white/85">
            {b.tanggal}
          </time>
        )}
      </PageHero>
      <article className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-16">
        <Link
          to="/berita"
          className="mb-8 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
        >
          ← Semua berita
        </Link>
        {b.sampul && (
          <figure className="mb-8">
            <img
              src={b.sampul.url}
              alt={b.sampul.caption || b.judul}
              className="max-h-[520px] w-full rounded-xl object-cover"
              decoding="async"
            />
            {b.sampul.caption && (
              <figcaption className="mt-2 text-sm text-ink-muted">{b.sampul.caption}</figcaption>
            )}
          </figure>
        )}
        <IsiKonten isi={b.isi} ringkasan={b.ringkasan} />
        <div className="mt-10 border-t border-border pt-6">
          <BagikanKonten judul={b.judul} url={urlAbsolut(`/berita/${b.slug}`, SITE.url)} />
        </div>
      </article>
    </PageShell>
  );
}
