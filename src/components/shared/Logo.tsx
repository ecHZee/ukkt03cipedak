import { useSitus } from "@/hooks/use-situs";
import { urlPublik } from "@/services/storage";
/** Logo unggahan dapat dikosongkan untuk kembali ke aset resmi bawaan. */
export function Logo({ className = "size-9" }: { className?: string }) {
  const { pengaturan: p } = useSitus();
  const url = p.logoPath ? urlPublik("media", p.logoPath) : null;
  return (
    <img
      src={url ?? "/logo/logo-96.webp"}
      srcSet={url ? undefined : "/logo/logo-96.webp 96w, /logo/logo-192.webp 192w"}
      sizes="48px"
      alt="Logo Karang Taruna RW 03 Cipedak"
      width={192}
      height={192}
      className={`shrink-0 rounded-full object-contain ${className}`}
    />
  );
}
