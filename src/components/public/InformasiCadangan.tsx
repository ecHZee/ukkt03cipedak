import { Link } from "@tanstack/react-router";
import { PageHero } from "@/components/public/PageHero";
import { informasiCadangan, type BagianInformasiCadangan } from "@/domains/cadangan/informasi";

export function InformasiCadangan({ bagian }: { bagian: BagianInformasiCadangan }) {
  const isi = informasiCadangan[bagian];
  const tautan = [
    { bagian: "aplikasi", label: "Informasi aplikasi", to: "/cadangan-website" },
    { bagian: "privasi", label: "Kebijakan privasi", to: "/cadangan-website/privasi" },
    { bagian: "ketentuan", label: "Ketentuan penggunaan", to: "/cadangan-website/ketentuan" },
  ] as const;

  return (
    <>
      <PageHero eyebrow="Aplikasi pengelola" title={isi.judul} description={isi.deskripsi} />
      <article className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
        <nav
          aria-label="Informasi aplikasi cadangan"
          className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6 text-sm"
        >
          {tautan.map((t) => (
            <Link
              key={t.bagian}
              to={t.to}
              activeOptions={{ exact: true }}
              aria-current={bagian === t.bagian ? "page" : undefined}
              className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <p className="mb-8 text-sm text-ink-muted">Terakhir diperbarui: 26 Oktober 2026.</p>
        <div className="space-y-9">
          {isi.bagian.map((s) => (
            <section key={s.judul}>
              <h2 className="font-heading text-xl font-semibold text-ink md:text-2xl">{s.judul}</h2>
              <div className="mt-3 space-y-4 text-base leading-7 text-ink-muted">
                {s.paragraf.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <section className="mt-10 border-t border-line pt-7">
          <h2 className="font-heading text-xl font-semibold text-ink">Hubungi pengelola</h2>
          <p className="mt-3 leading-7 text-ink-muted">Karang Taruna RW 03 Cipedak</p>
          <a
            href="mailto:ukktrw03cipedak@gmail.com"
            className="mt-1 inline-block break-all text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            ukktrw03cipedak@gmail.com
          </a>
        </section>
      </article>
    </>
  );
}
