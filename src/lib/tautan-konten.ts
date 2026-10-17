/** URL konten dan gambar harus HTTP(S) absolut untuk crawler WA dan tombol berbagi. */
export function urlAbsolut(path: string, situs: string): string {
  const url = new URL(path, situs.endsWith("/") ? situs : `${situs}/`);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Alamat konten harus memakai HTTP atau HTTPS.");
  }
  return url.href;
}

export function tautanWhatsApp(judul: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${judul}\n${url}`)}`;
}

type AgendaKalender = {
  judul: string;
  mulai: string | null;
  selesai?: string | null;
  lokasi?: string | null;
  ringkasan: string;
  tahap?: string;
};

export function tautanKalender(agenda: AgendaKalender, url: string): string | null {
  if (!agenda.mulai || agenda.tahap === "batal") return null;
  const mulai = new Date(agenda.mulai);
  if (!Number.isFinite(mulai.getTime())) return null;
  const akhir = agenda.selesai ? new Date(agenda.selesai) : null;
  // Durasi satu jam hanya praisian Calendar; tidak ditulis ke data acara.
  const selesai = akhir && akhir > mulai ? akhir : new Date(mulai.getTime() + 60 * 60_000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: agenda.judul,
    dates: `${stamp(mulai)}/${stamp(selesai)}`,
    ctz: "Asia/Jakarta",
    details: [agenda.ringkasan, url].filter(Boolean).join("\n\n"),
  });
  if (agenda.lokasi) params.set("location", agenda.lokasi);
  return `https://calendar.google.com/calendar/render?${params}`;
}
