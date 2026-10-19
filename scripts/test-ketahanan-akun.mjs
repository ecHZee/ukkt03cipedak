import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomInt } from "node:crypto";
import vm from "node:vm";
import ts from "typescript";

async function layanan(mode) {
  const keadaan = { flag: false, aktif: true, auth: 0, audit: 0 };
  const db = {
    from(table) {
      let aksi, isi, id;
      const q = {
        select() {
          return q;
        },
        eq(k, v) {
          id = v;
          return q;
        },
        update(v) {
          aksi = "update";
          isi = v;
          return q;
        },
        insert(v) {
          aksi = "insert";
          isi = v;
          return q;
        },
        single: () => hasil(),
        maybeSingle: () => hasil(),
        then(resolve, reject) {
          return Promise.resolve(hasil()).then(resolve, reject);
        },
      };
      function hasil() {
        if (table === "audit_log") {
          keadaan.audit++;
          return { error: mode === "audit" ? { message: "gagal" } : null };
        }
        if (aksi === "update") {
          if (isi.harus_ganti_password !== undefined) {
            if (mode === "flag") return { error: { message: "gagal" } };
            keadaan.flag = isi.harus_ganti_password;
          }
          if (isi.aktif !== undefined) keadaan.aktif = isi.aktif;
          return { error: null };
        }
        return {
          data:
            id === "pemanggil"
              ? { id, role: "super_admin", aktif: true }
              : {
                  id,
                  role: "anggota",
                  username: "uji",
                  aktif: keadaan.aktif,
                  harus_ganti_password: keadaan.flag,
                },
          error: null,
        };
      }
      return q;
    },
    auth: {
      admin: {
        async updateUserById() {
          keadaan.auth++;
          return { error: ["auth", "ban"].includes(mode) ? { message: "gagal" } : null };
        },
      },
    },
  };
  const crypto = new vm.SyntheticModule(["randomInt"], function () {
    this.setExport("randomInt", randomInt);
  });
  const client = new vm.SyntheticModule(["supabaseAdmin"], function () {
    this.setExport("supabaseAdmin", db);
  });
  const constants = new vm.SyntheticModule(["DOMAIN_AKUN"], function () {
    this.setExport("DOMAIN_AKUN", "akun.example");
  });
  const source = ts.transpileModule(
    readFileSync(new URL("../src/services/akun.server.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } },
  ).outputText;
  const m = new vm.SourceTextModule(source);
  await m.link((s) =>
    s === "node:crypto" ? crypto : s.includes("client.server") ? client : constants,
  );
  await m.evaluate();
  return { server: m.namespace, keadaan };
}
test("gagal flag wajib ganti menghentikan reset sebelum Auth berubah", async () => {
  const { server, keadaan } = await layanan("flag");
  await assert.rejects(() => server.resetPassword("pemanggil", "target"), /Reset dibatalkan/);
  assert.equal(keadaan.auth, 0);
});
test("gagal Auth mengembalikan flag sebelumnya", async () => {
  const { server, keadaan } = await layanan("auth");
  await assert.rejects(() => server.resetPassword("pemanggil", "target"), /Password lama tetap/);
  assert.equal(keadaan.flag, false);
});
test("gagal ban tidak dilaporkan sukses; database tetap menutup akses", async () => {
  const { server, keadaan } = await layanan("ban");
  await assert.rejects(
    () => server.ubahStatus("pemanggil", "target", false),
    /database sudah dinonaktifkan/,
  );
  assert.equal(keadaan.aktif, false);
});
test("gagal membuka ban tidak mengaktifkan database", async () => {
  const { server, keadaan } = await layanan("ban");
  keadaan.aktif = false;
  await assert.rejects(() => server.ubahStatus("pemanggil", "target", true), /belum diaktifkan/);
  assert.equal(keadaan.aktif, false);
});
test("gagal audit reset tetap mengembalikan password yang berlaku dengan peringatan", async () => {
  const { server, keadaan } = await layanan("audit");
  const r = await server.resetPassword("pemanggil", "target");
  assert.ok(r.password.length >= 12);
  assert.ok(r.peringatan.includes("log audit gagal"));
  assert.equal(keadaan.flag, true);
});
test("gagal audit status menampilkan keadaan parsial", async () => {
  const { server } = await layanan("audit");
  await assert.rejects(
    () => server.ubahStatus("pemanggil", "target", false),
    /diterapkan, tetapi log audit gagal/,
  );
});
test("reset normal memasang wajib ganti dan mencatat audit", async () => {
  const { server, keadaan } = await layanan("normal");
  const r = await server.resetPassword("pemanggil", "target");
  assert.equal(r.peringatan, undefined);
  assert.equal(keadaan.flag, true);
  assert.equal(keadaan.audit, 1);
});
