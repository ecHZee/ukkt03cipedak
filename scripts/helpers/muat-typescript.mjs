import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import vm from "node:vm";
import ts from "typescript";
/** Muat sumber nyata dalam tes Node; hanya batas jaringan yang diganti mock eksplisit. */
export async function muatTypescript(path, mocks = {}) {
  const cache = new Map();
  function muat(file) {
    if (cache.has(file)) return cache.get(file);
    const p = (async () => {
      let m;
      if (Object.hasOwn(mocks, file)) {
        const nilai = mocks[file];
        m = new vm.SyntheticModule(Object.keys(nilai), function () {
          for (const [k, v] of Object.entries(nilai)) this.setExport(k, v);
        });
      } else if (!file.endsWith(".ts")) {
        const nilai = await import(file);
        m = new vm.SyntheticModule(Object.keys(nilai), function () {
          for (const [k, v] of Object.entries(nilai)) this.setExport(k, v);
        });
      } else
        m = new vm.SourceTextModule(
          ts.transpileModule(readFileSync(file, "utf8"), {
            compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
          }).outputText,
          { identifier: file },
        );
      await m.link((s) =>
        muat(
          Object.hasOwn(mocks, s)
            ? s
            : s.startsWith("@/")
              ? resolve("src", s.slice(2) + ".ts")
              : s.startsWith(".")
                ? resolve(dirname(file), s + ".ts")
                : s,
        ),
      );
      await m.evaluate();
      return m;
    })();
    cache.set(file, p);
    return p;
  }
  return (await muat(resolve(path))).namespace;
}
