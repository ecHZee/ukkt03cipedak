/** Konten disajikan sebagai teks React agar HTML dari database tidak bisa mengeksekusi skrip. */
export function IsiKonten({ isi, ringkasan }: { isi: string | null; ringkasan: string }) {
  const teks = isi?.trim() || ringkasan.trim();
  if (!teks) return null;
  return (
    <div className="space-y-5 text-base leading-8 text-ink [overflow-wrap:anywhere]">
      {isi?.trim() && ringkasan.trim() && isi.trim() !== ringkasan.trim() && (
        <p className="text-lg font-medium leading-8">{ringkasan}</p>
      )}
      {teks.split(/\r?\n\s*\r?\n/).map((paragraf, i) => (
        <p key={i} className="whitespace-pre-line">
          {paragraf}
        </p>
      ))}
    </div>
  );
}
