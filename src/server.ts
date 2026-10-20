import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { responsDinamis } from "./lib/respons-dinamis";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const path = new URL(request.url).pathname;
      if (path === "/sitemap.xml" || path === "/robots.txt") {
        return (await (await import("./seo/sitemap.server")).layaniSeo(request))!;
      }
      if (new URL(request.url).pathname.startsWith("/berkas/dokumen/")) {
        return await (await import("./services/dokumen-gateway.server")).layaniDokumen(request);
      }
      if (new URL(request.url).pathname.startsWith("/media/")) {
        const { layaniMedia } = await import("./services/media-gateway.server");
        // Nitro memanggil fetch(req) dan menempelkan waitUntil pada Request, tanpa argumen ctx.
        const tugas = (ctx ?? request) as { waitUntil?: (p: Promise<unknown>) => void };
        return await layaniMedia(request, { waitUntil: tugas.waitUntil?.bind(tugas) });
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const hasil = responsDinamis(await normalizeCatastrophicSsrResponse(response));
      if (
        path === "/login" ||
        path === "/admin" ||
        path.startsWith("/admin/") ||
        path.startsWith("/_server/") ||
        hasil.status >= 400
      )
        hasil.headers.set("X-Robots-Tag", "noindex, nofollow");
      hasil.headers.set("Referrer-Policy", "strict-origin");
      return hasil;
    } catch (error) {
      console.error(error);
      return responsDinamis(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
