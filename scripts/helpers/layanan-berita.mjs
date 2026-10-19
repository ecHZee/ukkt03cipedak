import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";
export async function muatLayananBerita() {
  const cache = new Map();
  const zod = new vm.SyntheticModule(["z"], function () {
    this.setExport("z", z);
  });
  await zod.link(() => {});
  await zod.evaluate();
  async function muat(path) {
    if (cache.has(path)) return cache.get(path);
    const m = new vm.SourceTextModule(
      ts.transpileModule(readFileSync(new URL("../../" + path, import.meta.url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    );
    cache.set(path, m);
    await m.link((s) =>
      s === "zod"
        ? zod
        : muat(
            s === "@/lib/berita-admin" ? "src/lib/berita-admin.ts" : "src/lib/kegiatan-admin.ts",
          ),
    );
    await m.evaluate();
    return m;
  }
  return {
    lib: (await muat("src/lib/berita-admin.ts")).namespace,
    server: (await muat("src/services/berita-admin.server.ts")).namespace,
    foto: (await muat("src/services/foto-profil.server.ts")).namespace,
  };
}
