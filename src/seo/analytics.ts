import { pathPublik } from "./sitemap";

export function bolehAnalitik(hostname: string, path: string) {
  return hostname === "ukkt03cipedak.pages.dev" && pathPublik(path);
}
