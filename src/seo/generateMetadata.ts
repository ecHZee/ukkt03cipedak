import { SITE } from "@/constants/site";

type MetaArgs = {
  title?: string;
  description?: string;
  path?: string;       // relatif, mis. "/berita/judul-berita"
  image?: string;      // URL absolut/relatif
  type?: "website" | "article";
};

/** Bangun array `meta` untuk `head()` TanStack Router. */
export function generateMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: MetaArgs) {
  const fullTitle = title ? `${title} — ${SITE.shortName}` : SITE.name;
  const desc = description ?? SITE.tagline;

  const meta = [
    { title: fullTitle },
    { name: "description", content: desc },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: desc },
  ];

  if (image) {
    meta.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    );
  }

  return { meta, links: [{ rel: "canonical", href: path }] };
}
