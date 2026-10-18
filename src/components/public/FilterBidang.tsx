import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export function FilterBidang({
  bidang,
  nilai,
  onChange,
}: {
  bidang: Array<{ slug: string; singkat: string }>;
  nilai?: string;
  onChange: (nilai: string | undefined) => void;
}) {
  const id = useId();
  const wadah = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wadah.current;
    const aktif = el?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (el && aktif && el.scrollWidth > el.clientWidth) {
      const luar = el.getBoundingClientRect();
      const dalam = aktif.getBoundingClientRect();
      el.scrollBy({
        left: dalam.left - luar.left - (el.clientWidth - dalam.width) / 2,
        behavior: "instant",
      });
    }
  }, [nilai]);
  return (
    <div className="min-w-0" data-filter-bidang>
      <p id={id} className="mb-2 text-sm font-semibold text-ink">
        Bidang
      </p>
      <div
        role="group"
        ref={wadah}
        aria-labelledby={id}
        className="flex min-w-0 snap-x gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible"
      >
        {[{ slug: "", singkat: "Semua" }, { slug: "umum", singkat: "Umum" }, ...bidang].map((b) => (
          <button
            key={b.slug}
            type="button"
            aria-pressed={(nilai ?? "") === b.slug}
            onClick={() => onChange(b.slug || undefined)}
            className={cn(
              "min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full border px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
              (nilai ?? "") === b.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-ink hover:border-primary/40",
            )}
          >
            {b.singkat}
          </button>
        ))}
      </div>
    </div>
  );
}
