import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";

export async function muatLayananKegiatan(storage) {
  const modul = (path, options) =>
    new vm.SourceTextModule(
      ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
      options,
    );
  const zod = new vm.SyntheticModule(["z"], function () {
    this.setExport("z", z);
  });
  const lib = modul("../../src/lib/kegiatan-admin.ts");
  await lib.link(() => zod);
  await lib.evaluate();
  const server = modul("../../src/services/kegiatan-admin.server.ts", {
    importModuleDynamically: async (specifier) => {
      assert.equal(specifier, "@/integrations/supabase/client.server");
      if (!storage) throw new Error("Storage tidak disediakan dalam uji ini");
      const admin = new vm.SyntheticModule(["supabaseAdmin"], function () {
        this.setExport("supabaseAdmin", { storage });
      });
      await admin.link(() => {
        throw new Error("Import tak terduga");
      });
      await admin.evaluate();
      return admin;
    },
  });
  await server.link((s) => {
    assert.equal(s, "@/lib/kegiatan-admin");
    return lib;
  });
  await server.evaluate();
  return { lib: lib.namespace, server: server.namespace };
}
