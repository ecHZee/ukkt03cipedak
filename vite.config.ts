// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [
      {
        name: "runtime-browser-ringkas",
        configEnvironment(name) {
          if (name !== "client") return;
          return {
            build: {
              rolldownOptions: {
                output: {
                  codeSplitting: {
                    // Runtime bersama satu kelompok; import dinamis fitur tetap terpisah.
                    groups: [
                      {
                        name: "runtime-browser",
                        test: /[\\/]node_modules[\\/](react|react-dom|scheduler|@tanstack)[\\/]/,
                      },
                    ],
                  },
                },
              },
            },
          };
        },
      },
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server", build: { inlineCss: true } },
    router: {
      codeSplittingOptions: {
        // Loader halaman lain dimuat saat navigasi; beranda tidak perlu seluruh akses datanya.
        defaultBehavior: [
          ["loader"],
          ["component"],
          ["pendingComponent"],
          ["errorComponent"],
          ["notFoundComponent"],
        ],
      },
    },
  },
});
