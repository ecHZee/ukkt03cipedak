import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Props = {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

export function SectionHeader({
  number, eyebrow, title, description, actionLabel, actionTo,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          <span className="text-primary">{number}</span>
          <span className="h-px w-6 bg-border-strong" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="mt-3 font-heading text-3xl sm:text-[34px] font-bold text-ink leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[15px] text-ink-muted leading-relaxed">{description}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
