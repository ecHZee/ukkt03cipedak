/** WebP dari PNG resmi yang sama; PNG asli tetap untuk ikon dan pratinjau tautan. */
export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <img
      src="/logo/logo-96.webp"
      srcSet="/logo/logo-96.webp 96w, /logo/logo-192.webp 192w"
      sizes="48px"
      alt="Logo Karang Taruna RW 03 Cipedak"
      width={192}
      height={192}
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}
