import { ImageIcon } from "lucide-react";
import { Placeholder } from "@/components/public/Placeholder";

const TILES = [
  { label: "Slot dokumentasi 1", tone: "neutral" as const },
  { label: "Slot dokumentasi 2", tone: "accent" as const },
  { label: "Slot dokumentasi 3", tone: "neutral" as const },
  { label: "Slot dokumentasi 4", tone: "neutral" as const },
  { label: "Slot dokumentasi 5", tone: "accent" as const },
  { label: "Slot dokumentasi 6", tone: "neutral" as const },
];

export function GaleriPreview() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
      {TILES.map((t, i) => (
        <div
          key={i}
          className={`relative ${
            i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
          }`}
        >
          <Placeholder
            label={t.label}
            caption="Foto menyusul"
            icon={ImageIcon}
            tone={t.tone}
          />
        </div>
      ))}
    </div>
  );
}
