import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Save, Upload } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Placeholder } from "@/components/public/Placeholder";
import { APP_CONFIG } from "@/config/app";
import { SITE } from "@/constants/site";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  return (
    <AdminShell
      title="Website Settings"
      description="Identitas organisasi, kanal resmi, dan aset visual yang ditampilkan di public portal."
      actions={
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-tile transition hover:bg-primary/90">
          <Save className="size-4" /> Simpan Perubahan
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Section title="Identitas Organisasi">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Organisasi" defaultValue={SITE.name} />
            <Field label="Tagline" defaultValue={SITE.tagline} />
          </div>
        </Section>

        <Section title="Logo">
          <div className="flex items-center gap-4">
            <div className="size-20 overflow-hidden rounded-xl">
              <Placeholder label="Logo Resmi" caption="Belum diunggah" icon={ImageIcon} tone="neutral" />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
              <Upload className="size-3.5" /> Unggah Logo
            </button>
          </div>
        </Section>

        <Section title="Kanal Resmi" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp" defaultValue={APP_CONFIG.whatsappNumber} />
            <Field label="Email" defaultValue={APP_CONFIG.socials.email} />
            <Field label="Instagram" defaultValue={APP_CONFIG.socials.instagram} />
            <Field label="YouTube" defaultValue={APP_CONFIG.socials.youtube} />
          </div>
        </Section>

        <Section title="Hero Image" className="lg:col-span-2">
          <div className="aspect-[21/9] overflow-hidden rounded-xl">
            <Placeholder
              label="Hero Image Halaman Beranda"
              caption="Foto landscape 16/9 — menunggu dokumentasi asli"
              icon={ImageIcon}
              tone="accent"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
              <Upload className="size-3.5" /> Ganti Hero Image
            </button>
          </div>
        </Section>
      </div>
    </AdminShell>
  );
}

function Section({
  title, children, className = "",
}: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-5 shadow-tile ${className}`}>
      <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        type="text"
        defaultValue={defaultValue}
        className="mt-1 h-10 w-full rounded-lg border border-border bg-muted-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}