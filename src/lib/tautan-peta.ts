/** Pengaturan dapat berisi tautan berbagi atau embed; hanya host Google Maps resmi yang diterima. */
export function bacaPeta(nilai: string | null) {
  if (!nilai) return null;
  try {
    const u = new URL(nilai);
    if (u.protocol !== "https:" || u.username || u.password || u.port) return null;
    const hostMaps = [
      "www.google.com",
      "google.com",
      "maps.google.com",
      "www.google.co.id",
      "google.co.id",
      "maps.google.co.id",
    ];
    const pendek = u.hostname === "maps.app.goo.gl";
    if (!pendek && (!hostMaps.includes(u.hostname) || !u.pathname.startsWith("/maps"))) return null;
    const sematan =
      !pendek && (u.pathname.startsWith("/maps/embed") || u.searchParams.get("output") === "embed");
    return { tautan: u.href, sematan: sematan ? u.href : null };
  } catch {
    return null;
  }
}
