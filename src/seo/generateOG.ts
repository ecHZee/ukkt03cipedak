/**
 * Helper untuk OG image. Saat foto asli organisasi tersedia, ganti `fallback`.
 * Fungsi dipakai oleh route loader untuk meneruskan image ke `generateMetadata`.
 */
export function generateOG(input?: { image?: string | null }) {
  const fallback = "/__l5e/assets-v1/og-default.jpg"; // TODO: upload OG default via lovable-assets
  return input?.image ?? fallback;
}
