import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Rocket, Sparkles, Star } from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { BIDANG_LIST } from "@/domains/program/data";
import { APP_CONFIG } from "@/config/app";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Program Kerja — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Tujuh bidang program kerja Karang Taruna RW 03 Cipedak periode 2025–2028: OKK, Kerohanian, Kemasyarakatan, Usaha, Olahraga, Media, dan Inventarisasi.",
      },
    ],
  }),
  component: ProgramPage,
});

const TIMELINE = [
  { fase: "Tahun ke-1 (2025–2026)", title: "Konsolidasi & Aktivasi", points: [
    "Pelantikan & rapat konsolidasi bidang",
    "Penyusunan agenda kerja masing-masing bidang",
    "Aktivasi kanal media sosial resmi",
  ]},
  { fase: "Tahun ke-2 (2026–2027)", title: "Implementasi & Kemitraan", points: [
    "Eksekusi program rutin lintas bidang",
    "Kemitraan dengan RT, RW, dan lembaga warga",
    "Pendataan aset & arsip dokumen organisasi",
  ]},
  { fase: "Tahun ke-3 (2027–2028)", title: "Evaluasi & Regenerasi", points: [
    "Evaluasi pelaksanaan program kerja",
    "Penyusunan LPJ akhir periode",
    "Kaderisasi pengurus periode selanjutnya",
  ]},
];

const PRIORITAS = [
  { title: "Aktivasi 7 Bidang", desc: "Setiap bidang memiliki agenda kerja terdokumentasi." },
  { title: "Transparansi LPJ", desc: "Setiap kegiatan didokumentasikan dan dipublikasikan." },
  { title: "Kaderisasi Pengurus", desc: "Mempersiapkan pemuda RW 03 untuk periode berikutnya." },
];

const KONTRIBUSI = [
  "Wadah kegiatan positif bagi pemuda lintas RT di RW 03.",
  "Kegiatan kerohanian, olahraga, dan sosial yang dapat diikuti warga.",
  "Dokumentasi & arsip publik yang transparan lintas periode.",
  "Kemitraan organisasi untuk mendukung program RW.",
];

function whatsapp() {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent("Halo, saya ingin berpartisipasi dalam program Karang Taruna RW 03.")}`;
}

function ProgramPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Periode 2025 – 2028"
        title="Program Kerja Karang Taruna RW 03 Cipedak"
        description="Tujuh bidang gerakan yang dirancang untuk menjawab kebutuhan pemuda dan warga RW 03."
      />

      {/* Ringkasan */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                01 · Ringkasan Program
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-ink leading-tight">
                Tujuh bidang. Satu arah: pemuda RW 03 yang aktif & berdampak.
              </h2>
              <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
                Program kerja Karang Taruna RW 03 Cipedak periode 2025–2028
                disusun mengikuti struktur tujuh bidang resmi sebagaimana
                tercantum dalam SK organisasi.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {PRIORITAS.map((p) => (
                <li
                  key={p.title}
                  className="rounded-lg border border-border bg-surface p-3 shadow-tile"
                >
                  <p className="font-heading font-semibold text-ink">{p.title}</p>
                  <p className="text-ink-muted">{p.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7 Bidang detail */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            02 · 7 Bidang
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Bidang & fokus kerja</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {BIDANG_LIST.map(({ slug, name, description, fokus, icon: Icon, iconBg }) => (
              <article
                key={slug}
                className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-tile transition hover:shadow-tile-hover"
              >
                <div className={`grid size-11 place-items-center rounded-lg ${iconBg}`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-ink leading-snug">
                  {name}
                </h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{description}</p>
                <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
                  {fokus.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            03 · Timeline Program
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
            Tiga tahun, tiga fase
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TIMELINE.map((t, i) => (
              <div key={t.fase} className="rounded-xl border border-border bg-surface p-5 shadow-tile">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary tabular-nums">
                  <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground text-[11px]">
                    {i + 1}
                  </span>
                  {t.fase}
                </div>
                <h3 className="mt-3 font-heading text-base font-bold text-ink">{t.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prioritas */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-tile">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Star className="size-3.5" />
              04 · Program Prioritas
            </div>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-ink leading-snug">
              Tiga prioritas utama periode 2025–2028.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {PRIORITAS.map((p, i) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-border bg-muted-surface/40 p-5"
                >
                  <p className="font-heading text-3xl font-bold text-primary tabular-nums">
                    0{i + 1}
                  </p>
                  <p className="mt-2 font-heading font-bold text-ink">{p.title}</p>
                  <p className="mt-1 text-sm text-ink-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kontribusi Untuk Warga */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="size-3.5" />
                05 · Kontribusi Untuk Warga
              </div>
              <h2 className="mt-2 font-heading text-3xl font-bold text-ink leading-tight">
                Manfaat nyata bagi warga RW 03.
              </h2>
              <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
                Program kerja dirancang agar dampaknya dirasakan langsung oleh warga RW 03 Cipedak.
              </p>
            </div>
            <ul className="space-y-3">
              {KONTRIBUSI.map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-tile"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  <p className="text-[15px] text-ink leading-relaxed">{k}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Partisipasi */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16">
          <div className="overflow-hidden rounded-2xl border border-accent/30 bg-accent/10 p-8 sm:p-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                  06 · Partisipasi
                </p>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-ink leading-snug">
                  Punya ide program? Hubungi pengurus bidang terkait.
                </h2>
                <p className="mt-3 text-sm text-ink-muted">
                  Kolaborasi terbuka untuk warga, RT, dan organisasi mitra di lingkungan RW 03.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={whatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90"
                >
                  <Rocket className="size-4" />
                  Hubungi Sekretariat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
