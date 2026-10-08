/** Logo resmi Karang Taruna RW 03 Cipedak (PNG transparan di public/logo). */
export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <img
      src="/logo/logo-192.png"
      alt="Logo Karang Taruna RW 03 Cipedak"
      width={192}
      height={192}
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}
