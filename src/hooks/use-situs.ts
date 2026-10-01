import { rootRouteId, useLoaderData } from "@tanstack/react-router";

/** Pengaturan situs & periode aktif (dimuat sekali di root route). */
export function useSitus() {
  return useLoaderData({ from: rootRouteId });
}
