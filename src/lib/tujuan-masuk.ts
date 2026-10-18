/** Tujuan login hanya path admin atau arsip sendiri; URL luar dan backslash tidak diterima. */
export function tujuanAman(ke: unknown): string {
  if (typeof ke !== "string" || /[\\\r\n]/.test(ke)) return "/admin/dashboard";
  return /^\/(?:admin(?:\/[\w\-/]*)?|arsip)(?:\?.*)?$/.test(ke) ? ke : "/admin/dashboard";
}
