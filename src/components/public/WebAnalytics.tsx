import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { bolehAnalitik } from "@/seo/analytics";

// Token beacon memang publik (bukan API key). Situs dimiliki akun Cloudflare organisasi.
const TOKEN_ANALYTICS = "7c4d7a5fe10f48149deb4d4cfbcded13";
export function WebAnalytics() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (!bolehAnalitik(location.hostname, path) || document.getElementById("katar-analytics"))
      return;
    const script = document.createElement("script");
    script.id = "katar-analytics";
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN_ANALYTICS, spa: true }));
    document.body.append(script);
    // Login memakai reloadDocument agar observer beacon tidak dibawa ke ruang akun.
  }, [path]);
  return null;
}
