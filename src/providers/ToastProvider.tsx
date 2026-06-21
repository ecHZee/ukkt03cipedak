import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

/** Membungkus aplikasi dengan toast surface (Sonner — shadcn). */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" />
    </>
  );
}
