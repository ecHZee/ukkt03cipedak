import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BidangData } from "@/services/organisasi";
import { gayaBidang } from "@/domains/program/style";

export function ProgramBento({ bidang }: { bidang: BidangData[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-3">
      {bidang
        .map((b) => ({ ...b, ...gayaBidang(b.slug) }))
        .map(({ icon: Icon, name, tagline, tone, iconBg }, i) => (
          <Link
            key={name}
            to="/program"
            className={`group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-xl border border-border ${tone} p-5 sm:w-auto transition shadow-tile hover:shadow-tile-hover hover:-translate-y-0.5 ${
              i === 0 ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`grid size-11 place-items-center rounded-lg ${iconBg}`}>
                <Icon className="size-5" />
              </div>
              <ArrowUpRight className="size-4 text-ink-muted transition group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <h3 className="mt-4 font-heading text-base font-semibold text-ink leading-snug">
              {name}
            </h3>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">{tagline}</p>
          </Link>
        ))}
    </div>
  );
}
