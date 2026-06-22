import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BIDANG_LIST } from "@/domains/program/data";

export function ProgramBento() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BIDANG_LIST.map(({ icon: Icon, name, short, tone, iconBg }, i) => (
        <Link
          key={name}
          to="/program"
          className={`group relative overflow-hidden rounded-xl border border-border ${tone} p-5 transition shadow-tile hover:shadow-tile-hover hover:-translate-y-0.5 ${
            i === 0 ? "lg:col-span-2" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`grid size-11 place-items-center rounded-lg ${iconBg}`}>
              <Icon className="size-5" />
            </div>
            <ArrowUpRight className="size-4 text-ink-muted transition group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <h3 className="mt-4 font-heading text-base font-semibold text-ink leading-snug">{name}</h3>
          <p className="mt-1 text-sm text-ink-muted leading-relaxed">{short}</p>
        </Link>
      ))}
    </div>
  );
}
