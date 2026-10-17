/**
 * Helper untuk OG image. Saat foto asli organisasi tersedia, ganti `fallback`.
 * Fungsi dipakai oleh route loader untuk meneruskan image ke `generateMetadata`.
 */
export function generateOG(input?: { image?: string | null }) {
  const fallback = "/logo/logo-512.png";
  return input?.image ?? fallback;
}
