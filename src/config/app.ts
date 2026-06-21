/** Konfigurasi runtime aplikasi (non-secret). */
export const APP_CONFIG = {
  defaultLocale: "id-ID",
  defaultTimezone: "Asia/Jakarta",
  itemsPerPage: 12,
  whatsappNumber: "+62 812-0000-0000", // TODO: ganti dengan nomor sekretariat
  whatsappCtaText: "Halo Karang Taruna RW 03, saya tertarik bergabung.",
  socials: {
    instagram: "https://instagram.com/karangtaruna.rw03",
    youtube: "https://youtube.com/@karangtaruna-rw03",
    maps: "https://maps.google.com/?q=Cipedak+Jagakarsa+Jakarta+Selatan",
    email: "halo@karangtaruna-rw03.id",
  },
} as const;
