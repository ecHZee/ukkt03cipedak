import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lpj")({
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Sprint 0 · Skeleton</p>
      <h1 className="mt-3 text-3xl font-semibold text-foreground">Laporan Pertanggungjawaban</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Route placeholder. UI akan dibangun pada sprint berikutnya sesuai Visual Design Final.
      </p>
    </main>
  );
}
