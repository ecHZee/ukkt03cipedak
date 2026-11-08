type Elemen = { setAttribute: (nama: string, nilai: string) => unknown };
type PenulisHtml = {
  on: (selector: string, handler: { element: (e: Elemen) => void }) => PenulisHtml;
  transform: (response: Response) => Response;
};
type PembuatHtml = new () => PenulisHtml;

/** Foto/CSS boleh mendahului JS hidrasi; script tetap dimuat tanpa timer atau pemblokiran. */
export function aturPrioritasBeranda(
  request: Request,
  response: Response,
  Pembuat: PembuatHtml | undefined = (globalThis as { HTMLRewriter?: PembuatHtml }).HTMLRewriter,
) {
  if (
    request.method !== "GET" ||
    new URL(request.url).pathname !== "/" ||
    response.status !== 200 ||
    !response.headers.get("content-type")?.includes("text/html") ||
    !Pembuat
  )
    return response;
  const prioritas = {
    element: (e: Elemen) => {
      e.setAttribute("fetchpriority", "low");
    },
  };
  return new Pembuat()
    .on('link[rel="modulepreload"]', prioritas)
    .on('script[type="module"]', prioritas)
    .transform(response);
}
