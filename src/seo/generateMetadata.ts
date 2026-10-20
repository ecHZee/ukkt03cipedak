import { SITE } from "@/constants/site";
import { urlAbsolut } from "@/lib/tautan-konten";

type MetaArgs = {
  title?: string;
  description?: string;
  path?: string; // relatif, mis. "/berita/judul-berita"
  image?: string; // URL absolut/relatif
  type?: "website" | "article";
  noindex?: boolean;
};

/** Bangun array `meta` untuk `head()` TanStack Router. */
export function generateMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
}: MetaArgs) {
  const fullTitle = title ? `${title} — ${SITE.shortName}` : SITE.name;
  const desc = description ?? SITE.tagline;
  const canonical = new URL(urlAbsolut(path, SITE.url));
  canonical.search = "";
  canonical.hash = "";
  canonical.pathname = canonical.pathname.replace(/\/+$/, "") || "/";
  const url = canonical.href;
  const gambar = urlAbsolut(image || "/logo/logo-512.png", SITE.url);

  const meta = [
    { title: fullTitle },
    { name: "description", content: desc },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: "id_ID" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: desc },
  ];

  meta.push({ property: "og:image", content: gambar }, { name: "twitter:image", content: gambar });
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });

  return { meta, links: [{ rel: "canonical", href: url }] };
}
