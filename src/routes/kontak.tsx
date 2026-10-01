import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { KontakSection } from "@/components/public/landing/KontakSection";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Kanal resmi Karang Taruna RW 03 Cipedak untuk pertanyaan, kemitraan, dan usulan kegiatan warga.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Sekretariat Karang Taruna RW 03 Cipedak."
        description="Silakan terhubung melalui kanal resmi di bawah. Kami terbuka untuk pertanyaan, kemitraan, atau usulan kegiatan dari warga."
        variant="friendly"
      />
      <section className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12">
        <KontakSection />
      </section>
    </PageShell>
  );
}
