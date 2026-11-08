/** Hanya aset yang dibuat form Pengaturan; tidak menerima URL/profil/path bebas. */
export const polaFotoBeranda = /^pengaturan\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/;

export function urlFotoBeranda(path: string | null | undefined) {
  return path && polaFotoBeranda.test(path) ? `/media/situs/${path}` : null;
}
