import assert from "node:assert/strict";
import test from "node:test";
import { tautanKalender, tautanWhatsApp, urlAbsolut } from "../src/lib/tautan-konten.ts";

const url = "https://contoh.invalid/kegiatan/rapat";
const agenda = {
  judul: "Rapat & diskusi",
  ringkasan: "Tujuh bidang\nRW 03",
  mulai: "2026-10-18T23:30:00+07:00",
  lokasi: "Pos RW #03",
};
const params = (a) => new URL(tautanKalender(a, url)).searchParams;

test("WIB lintas tengah malam tidak bergeser hari saat dibaca Calendar", () => {
  const p = params({ ...agenda, selesai: "2026-10-19T01:00:00+07:00" });
  assert.equal(p.get("dates"), "20261018T163000Z/20261018T180000Z");
  assert.equal(p.get("ctz"), "Asia/Jakarta");
});
test("waktu selesai kosong mendapat satu jam tanpa memutasi acara", () => {
  const a = Object.freeze({ ...agenda, selesai: null });
  assert.equal(params(a).get("dates"), "20261018T163000Z/20261018T173000Z");
  assert.equal(a.selesai, null);
});
test("akhir sebelum mulai atau tidak valid tidak menghasilkan rentang negatif", () => {
  for (const selesai of ["2026-10-17T01:00:00Z", "bukan-tanggal"]) {
    assert.equal(params({ ...agenda, selesai }).get("dates"), "20261018T163000Z/20261018T173000Z");
  }
});
test("rutin tanpa tanggal, tanggal invalid, dan acara batal tidak menawarkan Calendar", () => {
  for (const a of [
    { ...agenda, mulai: null },
    { ...agenda, mulai: "tidak-valid" },
    { ...agenda, tahap: "batal" },
  ])
    assert.equal(tautanKalender(a, url), null);
});
test("judul/lokasi/link dan baris baru tetap utuh setelah encoding Calendar", () => {
  const p = params(agenda);
  assert.equal(p.get("text"), agenda.judul);
  assert.equal(p.get("location"), agenda.lokasi);
  assert.equal(p.get("details"), `${agenda.ringkasan}\n\n${url}`);
});
test("share WA mempertahankan judul dan URL yang mengandung ampersand", () => {
  assert.equal(
    new URL(tautanWhatsApp(agenda.judul, `${url}?a=1&b=2`)).searchParams.get("text"),
    `${agenda.judul}\n${url}?a=1&b=2`,
  );
});
test("metadata memakai URL absolut dan menolak protokol skrip", () => {
  assert.equal(
    urlAbsolut("/berita/kabar", "https://contoh.invalid/"),
    "https://contoh.invalid/berita/kabar",
  );
  assert.equal(
    urlAbsolut("https://gambar.invalid/foto.webp", url),
    "https://gambar.invalid/foto.webp",
  );
  for (const path of ["javascript:alert(1)", "data:text/html,uji"])
    assert.throws(() => urlAbsolut(path, url));
});
