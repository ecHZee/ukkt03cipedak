/**
 * Token desain non-CSS (untuk JS — animasi, breakpoint, dll).
 * Token warna/spacing/font tinggal di src/styles.css.
 */
export const MOTION = {
  fast: 120,
  base: 150,
  slow: 200,
  easeOut: [0.22, 1, 0.36, 1] as const,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const CONTAINER_MAX = 1280;
