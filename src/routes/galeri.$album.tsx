import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { IsiAlbum } from "@/components/public/IsiAlbum";
import { BagikanKonten } from "@/components/public/BagikanKonten";
import { ambilAlbumSlug } from "@/services/konten";
import { generateMetadata } from "@/seo/generateMetadata";
import { urlAbsolut } from "@/lib/tautan-konten";
import { SITE } from "@/constants/site";

export const Route = createFileRoute("/galeri/$album")({
  loader: async ({ params }) => {
    const album = await ambilAlbumSlug(params.album);
    if (!album) throw notFound();
    return album;
  },
  head: ({ loaderData: a }) =>
    a
      ? generateMetadata({
          title: a.judul,
          noindex: a.isDummy,
          description: a.deskripsi || `Foto dan video ${a.judul}.`,
          path: `/galeri/${a.slug}`,
          image: a.sampul?.url,
        })
      : { meta: [{ title: "Album tidak ditemukan" }, { name: "robots", content: "noindex" }] },
  component: DetailAlbum,
});

function DetailAlbum() {
  const a = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero
        eyebrow={a.namaBidang ?? "Galeri RW 03"}
        title={a.judul}
        description={a.deskripsi || undefined}
      >
        <p className="text-sm text-white/85">
          {[a.tanggal, `${a.jumlahMedia} dokumentasi`].filter(Boolean).join(" · ")}
        </p>
      </PageHero>
      <section
        aria-label="Isi album"
        className="mx-auto w-full max-w-[1280px] px-6 py-10 md:px-10 lg:px-16"
      >
        <Link
          to="/galeri"
          className="mb-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
        >
          ← Semua album
        </Link>
        {a.gdriveUrl && (
          <a
            href={a.gdriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex min-h-11 w-fit items-center rounded-lg border border-primary/25 px-4 py-2 text-sm font-semibold text-primary underline underline-offset-4"
          >
            Unduh foto asli di Google Drive ↗
          </a>
        )}
        <IsiAlbum key={a.id} album={a} />
        <div className="mt-10 border-t border-border pt-6">
          <BagikanKonten judul={a.judul} url={urlAbsolut(`/galeri/${a.slug}`, SITE.url)} />
        </div>
      </section>
    </PageShell>
  );
}
