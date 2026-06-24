import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  Compass,
  Eye,
  FileArchive,
  Flag,
  Handshake,
  Home,
  Map,
  Rocket,
  Sparkles,
  Target,
  Users,
  Users2,
} from "lucide-react";
import { PageShell } from "@/components/public/PageShell";
import { PageHero } from "@/components/public/PageHero";
import { Placeholder } from "@/components/public/Placeholder";
import { HumanDirectory } from "@/components/public/anggota/HumanDirectory";
import { PERIODE_AKTIF, PERIODE_HISTORY, STRUKTUR_2025_2028 } from "@/domains/anggota/data";
import { BIDANG_LIST } from "@/domains/program/data";
import { APP_CONFIG } from "@/config/app";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang — Karang Taruna RW 03 Cipedak" },
      {
        name: "description",
        content:
          "Profil resmi Karang Taruna RW 03 Cipedak: visi, misi, struktur organisasi, wilayah kerja, dan periode kepengurusan 2025–2028.",
      },
    ],
  }),
  component: TentangPage,
});

const MISI = [
  "Membina pemuda RW 03 Cipedak menjadi pribadi yang aktif, kreatif, dan berkarakter.",
  "Menyelenggarakan kegiatan sosial, olahraga, kerohanian, dan lingkungan yang berkelanjutan.",
  "Membangun kemitraan dengan warga, RT/RW, dan lembaga kemasyarakatan lainnya.",
  "Mendokumentasikan dan mengarsipkan seluruh kegiatan secara transparan lintas periode.",
];

const TIMELINE = [
  {
    tanggal: "09 Juni 2025",
    judul: "Pelantikan",
    desc: "Pengurus periode 2025–2028 resmi dilantik berdasarkan SK organisasi.",
    icon: Flag,
    tone: "bg-primary text-primary-foreground",
  },
  {
    tanggal: "Juni – Juli 2025",
    judul: "Konsolidasi",
    desc: "Rapat antar-bidang, penyusunan struktur kerja, dan pemetaan kebutuhan warga.",
    icon: Handshake,
    tone: "bg-accent text-accent-foreground",
  },
  {
    tanggal: "2025 – 2028",
    judul: "Program Kerja",
    desc: "Eksekusi tujuh bidang gerakan dan dokumentasi LPJ tiap kegiatan.",
    icon: Compass,
    tone: "bg-success text-white",
  },
];

function whatsapp() {
  const num = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent("Halo, saya tertarik gabung Karang Taruna RW 03.")}`;
}

function TentangPage() {
  const totalPengurus = STRUKTUR_2025_2028.length;
  const totalBPH = STRUKTUR_2025_2028.filter((a) => a.group === "BPH").length;
  const totalBidang = BIDANG_LIST.length;

  return (
    <PageShell>
      <PageHero
        eyebrow={`Periode ${PERIODE_AKTIF.label} · ${PERIODE_AKTIF.status}`}
        title="Tentang Karang Taruna RW 03 Cipedak"
        description="Organisasi kepemudaan resmi yang menjadi rumah bagi pemuda-pemudi RW 03 Cipedak. Dilantik 09 Juni 2025."
        variant="split"
      />

      {/* Profil + foto kebersamaan */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                01 · Profil Organisasi
              </p>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-ink leading-tight">
                Markas digital pemuda RW 03 Cipedak.
              </h2>
              <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
                Karang Taruna RW 03 Cipedak adalah organisasi kepemudaan resmi
                yang berkedudukan di lingkungan RW 03, Kelurahan Cipedak,
                Kecamatan Jagakarsa, Jakarta Selatan. Kepengurusan periode
                2025–2028 dilantik pada 09 Juni 2025 berdasarkan SK resmi.
              </p>
              <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
                Platform ini menjadi <span className="font-semibold text-ink">markas digital</span>
                {" "}— rumah arsip kegiatan, berita, LPJ, dan struktur pengurus
                yang dirancang untuk diwariskan lintas periode kepengurusan.
              </p>
            </div>
            <div className="aspect-[4/3]">
              <Placeholder
                label="Foto kebersamaan pengurus 2025–2028"
                caption="Dokumentasi pelantikan menyusul"
                icon={Users2}
                rounded="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline (pengganti Sejarah) */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            02 · Linimasa
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Perjalanan periode 2025–2028</h2>

          <ol className="relative mt-10 grid gap-8 md:grid-cols-3">
            <span className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {TIMELINE.map((t, i) => (
              <li
                key={t.judul}
                className="relative rounded-2xl border border-border bg-surface p-6 shadow-tile animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute -top-5 left-6 grid size-12 place-items-center rounded-xl shadow-tile ${t.tone}`}>
                  <t.icon className="size-5" />
                </div>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary tabular-nums">
                  {t.tanggal}
                </p>
                <h3 className="mt-1 font-heading text-lg font-bold text-ink leading-snug">{t.judul}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-tile">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                <Eye className="size-3.5" />
                03 · Visi
              </div>
              <p className="mt-4 font-heading text-2xl font-bold leading-snug">
                Membangun generasi muda RW 03 Cipedak yang aktif, kreatif, dan berdampak bagi masyarakat.
              </p>
            </div>
            <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-6 shadow-tile">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Target className="size-3.5" />
                04 · Misi
              </div>
              <ol className="mt-4 space-y-3">
                {MISI.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary tabular-nums">
                      {i + 1}
                    </span>
                    <p className="text-[15px] text-ink leading-relaxed">{m}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border rounded-xl border border-border bg-surface shadow-tile">
            <Stat icon={Users} value={totalPengurus.toString()} label="Total Pengurus" />
            <Stat icon={Sparkles} value={totalBPH.toString()} label="BPH" />
            <Stat icon={FileArchive} value={totalBidang.toString()} label="Bidang Aktif" />
            <Stat icon={CalendarCheck} value={PERIODE_AKTIF.label} label="Periode Aktif" />
          </div>
        </div>
      </section>

      {/* Struktur Organisasi — Human Directory */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            05 · Struktur Organisasi
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">
            Pengurus Periode {PERIODE_AKTIF.label}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink-muted leading-relaxed">
            Klik kartu pengurus untuk melihat detail. Nama yang masih tertulis
            <span className="font-semibold text-ink"> "Belum diisi"</span> akan
            di-update sesuai SK resmi Karang Taruna RW 03 Cipedak.
          </p>
          <div className="mt-8">
            <HumanDirectory />
          </div>
        </div>
      </section>

      {/* Wilayah RW 03 */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                06 · Wilayah Kerja
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-ink">RW 03 Cipedak, Jagakarsa</h2>
              <p className="mt-4 text-[15px] text-ink-muted leading-relaxed">
                Karang Taruna RW 03 berkedudukan di lingkungan RW 03, Kelurahan
                Cipedak, Kecamatan Jagakarsa, Jakarta Selatan. Wilayah kerja
                mencakup seluruh RT di bawah naungan RW 03.
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {["RT 01","RT 02","RT 03","RT 04","RT 05","RT 06","RT 07"].map((rt) => (
                  <li
                    key={rt}
                    className="flex items-center gap-2 rounded-md border border-border bg-muted-surface/50 px-3 py-2 text-ink"
                  >
                    <Home className="size-3.5 text-primary" />
                    {rt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-border shadow-tile min-h-[320px]">
              <iframe
                title="Peta wilayah RW 03 Cipedak"
                src="https://www.google.com/maps?q=Cipedak,+Jagakarsa,+Jakarta+Selatan&output=embed"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Periode Kepengurusan */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            07 · Periode Kepengurusan
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Garis waktu kepengurusan</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-tile">
            <table className="w-full text-sm">
              <thead className="bg-muted-surface/60 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-5 py-3">Periode</th>
                  <th className="px-5 py-3">Pelantikan</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PERIODE_HISTORY.map((p) => (
                  <tr key={p.label} className="text-ink">
                    <td className="px-5 py-3 font-semibold tabular-nums">{p.label}</td>
                    <td className="px-5 py-3 tabular-nums">{p.pelantikan}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                        <span className="size-1.5 rounded-full bg-success" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dokumentasi */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            08 · Dokumentasi
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-ink">Momentum penting</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "Pelantikan 09 Juni 2025",
              "Rapat konsolidasi",
              "Kerja bakti perdana",
              "Latihan rutin futsal",
            ].map((label, i) => (
              <div key={label} className="aspect-square">
                <Placeholder
                  label={label}
                  caption="Foto menyusul"
                  icon={Map}
                  tone={i % 2 === 0 ? "neutral" : "accent"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Gabung */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 pb-20">
          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary p-8 sm:p-10 text-primary-foreground shadow-tile">
            <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  09 · Ajakan
                </p>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold leading-snug">
                  Pemuda RW 03 Cipedak — mari jadi bagian Karang Taruna.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
                  Tidak ada pendaftaran online. Hubungi sekretariat melalui WhatsApp.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={whatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-tile transition hover:bg-accent/90"
                >
                  <Rocket className="size-4" />
                  Jadi Bagian Katar RW03
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({
  icon: Icon, value, label,
}: { icon: typeof Users; value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-6 sm:items-center sm:text-center">
      <Icon className="size-5 text-primary" />
      <div className="font-heading text-2xl sm:text-3xl font-bold text-ink tabular-nums leading-none">
        {value}
      </div>
      <div className="text-xs sm:text-[13px] text-ink-muted font-medium">{label}</div>
    </div>
  );
}
