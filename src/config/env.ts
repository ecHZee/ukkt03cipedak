/**
 * Akses environment variable terpusat — pastikan setiap pembacaan env
 * lewat file ini agar mudah di-audit dan diberi default yang aman.
 *
 * Browser-only menggunakan `import.meta.env.VITE_*`.
 * Server-only key dibaca di server function (process.env) — JANGAN diimpor di komponen.
 */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
