import { type ReactNode } from "react";

/**
 * Skeleton ThemeProvider. MVP hanya light mode; dark disiapkan di styles.css.
 * Provider ini akan menambah toggling saat dibutuhkan.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
