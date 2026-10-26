/** Thumbnail pasangan foto B2 sudah dibuat saat unggah; URL lain tetap memakai sumbernya. */
export function urlPratinjauMedia(url: string) {
  return url.replace(
    /^(\/media\/galeri\/(?!staging\/)[a-z0-9-]+\/[0-9a-f-]{36}\/[0-9a-f-]{36})\.webp$/,
    "$1_thumb.webp",
  );
}
