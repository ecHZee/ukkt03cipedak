import { type ReactNode } from "react";
import { Navbar } from "@/components/public/landing/Navbar";
import { Footer } from "@/components/public/landing/Footer";

/** Layout standar halaman public (Navbar + content + Footer). */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}