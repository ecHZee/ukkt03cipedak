import assert from "node:assert/strict";
import test from "node:test";
import { muatTypescript } from "./helpers/muat-typescript.mjs";

const { urlPratinjauMedia } = await muatTypescript("src/lib/pratinjau-media.ts");
const path =
  "/media/galeri/media/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.webp";

test("kartu foto B2 memakai pasangan thumbnail yang tersedia saat unggah", () => {
  assert.equal(urlPratinjauMedia(path), path.replace(".webp", "_thumb.webp"));
});

test("thumbnail yang sudah dipilih tidak diberi akhiran dua kali", () => {
  const thumb = path.replace(".webp", "_thumb.webp");
  assert.equal(urlPratinjauMedia(thumb), thumb);
});

for (const [label, url] of [
  ["Supabase", "https://media.invalid/storage/v1/object/public/media/foto.webp"],
  ["video", path.replace(".webp", ".mp4")],
  ["staging", path.replace("/galeri/media/", "/galeri/staging/")],
  ["host eksternal", `https://media.invalid${path}`],
  ["query URL", `${path}?mode=asli`],
  ["path di luar galeri", path.replace("/galeri/", "/profil/")],
]) {
  test(`${label} tetap memakai sumber asli tanpa menebak pasangan thumbnail`, () => {
    assert.equal(urlPratinjauMedia(url), url);
  });
}
