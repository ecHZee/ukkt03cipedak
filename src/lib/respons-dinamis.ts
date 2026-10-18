/** Berlaku juga pada URL workers.dev langsung; aset statis ditangani Assets sebelum SSR. */
export function responsDinamis(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  const vary = new Set(
    (headers.get("Vary") ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  vary.add("authorization");
  vary.add("cookie");
  headers.set("Vary", [...vary].join(", "));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
