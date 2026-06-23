import { AlertTriangle, Ban, FileQuestion, ServerCrash } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "404" | "403" | "500" | "no-data";

const MAP = {
  "404": { icon: FileQuestion, title: "Halaman tidak ditemukan", code: "404" },
  "403": { icon: Ban,           title: "Akses ditolak",          code: "403" },
  "500": { icon: ServerCrash,   title: "Terjadi kesalahan",      code: "500" },
  "no-data": { icon: AlertTriangle, title: "Belum ada data",     code: "—"   },
} as const;

export function ErrorState({
  variant = "no-data",
  description,
  action,
}: {
  variant?: Variant;
  description?: string;
  action?: ReactNode;
}) {
  const { icon: Icon, title, code } = MAP[variant];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-primary/8 text-primary">
        <Icon className="size-7" />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        Error · {code}
      </p>
      <h1 className="mt-2 font-heading text-2xl font-bold text-ink">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}