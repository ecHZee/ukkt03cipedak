import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Markas digital Karang Taruna RW 03 Cipedak — kegiatan, berita, galeri, dan transparansi LPJ lintas periode.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Sprint 0 · Foundation Setup
      </p>
      <h1 className="mt-3 font-[var(--font-heading)] text-4xl font-bold text-foreground">
        Karang Taruna RW 03 Cipedak
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        Skeleton siap. Design tokens, typography, routing, dan integrasi backend
        sudah terpasang. Halaman beranda akan dibangun pada Sprint berikutnya
        sesuai Visual Design Final (Markas Digital × Balai Modern × Pemuda Cipedak).
      </p>
    </main>
  );
}
