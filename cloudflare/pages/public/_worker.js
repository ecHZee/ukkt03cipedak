/** Pintu masuk Pages; aplikasi dan secret tetap berada di Worker katar-rw03. */
export default {
  async fetch(request, env) {
    if (!env.KATAR_APP)
      return new Response("Layanan sedang disiapkan. Coba kembali sebentar lagi.", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    try {
      const response = await env.KATAR_APP.fetch(request);
      const headers = new Headers(response.headers);
      const url = new URL(request.url);
      const aset =
        url.pathname.startsWith("/assets/") ||
        url.pathname.startsWith("/logo/") ||
        url.pathname === "/favicon.ico";
      const publik =
        ["GET", "HEAD"].includes(request.method) &&
        !request.headers.has("authorization") &&
        !request.headers.has("cookie") &&
        !headers.has("set-cookie");
      // Hanya aset anonim boleh mempertahankan cache asal; HTML/API/admin selalu no-store.
      if (!aset || !publik || !response.ok) {
        headers.set("Cache-Control", "no-store");
        headers.set("CDN-Cache-Control", "no-store");
        headers.set("Cloudflare-CDN-Cache-Control", "no-store");
      }
      const tujuan = headers.get("Location");
      if (tujuan) {
        const lokasi = new URL(tujuan, request.url);
        if (lokasi.hostname === "katar-rw03.ukktrw03cipedak.workers.dev") {
          headers.set("Location", url.origin + lokasi.pathname + lokasi.search + lokasi.hash);
        }
      }
      headers.set("X-Katar-Gateway", "pages-v1");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch {
      return new Response("Layanan belum dapat dihubungi. Silakan coba lagi.", {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      });
    }
  },
};
