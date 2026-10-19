export function areaPotret(w: number, h: number, zoom: number, x: number, y: number) {
  const sw = Math.min(w, (h * 3) / 4) / zoom,
    sh = (sw * 4) / 3;
  return { sx: ((w - sw) * x) / 100, sy: ((h - sh) * y) / 100, sw, sh };
}
