import type { Pengaturan } from "@/domains/konten/types";
import { SITE } from "@/constants/site";

/** Hanya pengaturan publik; tanggal SK tidak dianggap sebagai tanggal berdiri. */
export function dataOrganisasi(p: Pengaturan, logo: string) {
  const url = new URL(SITE.url).origin + "/";
  const sameAs = [p.instagram, p.tiktok, p.youtube].filter(
    (s): s is string => !!s && /^https:\/\//.test(s),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organisasi`,
    name: p.namaOrganisasi,
    url,
    logo,
    ...(p.alamat ? { address: p.alamat } : {}),
    ...(p.email ? { email: p.email } : {}),
    ...(p.whatsapp ? { telephone: `+${p.whatsapp}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
/** Mencegah teks pengaturan menutup tag script JSON-LD. */
export function jsonLdAman(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
