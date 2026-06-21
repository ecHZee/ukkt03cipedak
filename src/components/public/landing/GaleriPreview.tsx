import { PLACEHOLDERS } from "./placeholders";

export function GaleriPreview() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
      {PLACEHOLDERS.galeri.map((g, i) => (
        <a
          key={i}
          href="#"
          className={`group relative block overflow-hidden rounded-xl border border-border bg-muted-surface shadow-tile ${
            i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
          }`}
        >
          <img
            src={g.src}
            alt={g.alt}
            loading="lazy"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );
}
