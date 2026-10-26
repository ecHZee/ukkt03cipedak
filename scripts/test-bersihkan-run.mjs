import assert from "node:assert/strict";
import test from "node:test";
import { bersihkanRunDatabase } from "./helpers/bersihkan-run-db.mjs";

const run = "a1b2c3";
function fixture(opsi = {}) {
  const data = {
    bidang: [
      { id: "a", slug: `uji-${run}-a` },
      { id: "b", slug: `uji-${run}-b` },
      { id: "asli", slug: "media" },
    ],
    pengurus: [
      { id: "p", nama: `Uji Jabatan ${run}` },
      { id: "asli", nama: "Pengurus asli" },
    ],
    profiles: [{ id: "u" }, { id: "asli" }],
    berita: [
      { id: "n", bidang_id: "a" },
      { id: "asli", bidang_id: "asli" },
    ],
    audit_log: [
      { id: "log", record_id: "a" },
      { id: "asli", record_id: "asli" },
    ],
    auth: [
      { id: "u", email: `uji-bph-${run}@example.com` },
      { id: "asli", email: "pemilik@example.com" },
    ],
  };
  const admin = {
    from(t) {
      const filters = [];
      let hapus = false;
      const q = {
        select() {
          return q;
        },
        delete() {
          hapus = true;
          return q;
        },
        in(k, values) {
          filters.push((r) => values.includes(r[k]));
          return q;
        },
        eq(k, value) {
          filters.push((r) => r[k] === value);
          return q;
        },
        or(text) {
          const terms = [...text.matchAll(/(\w+)\.in\.\(([^)]+)\)/g)];
          filters.push((r) => terms.some(([, k, values]) => values.split(",").includes(r[k])));
          return q;
        },
        then(ok, fail) {
          if (hapus && opsi.errorDelete === t)
            return Promise.resolve({ error: { code: "network" } }).then(ok, fail);
          const rows = (data[t] ?? []).filter((r) => filters.every((f) => f(r)));
          if (hapus && opsi.ignoreDelete !== t)
            data[t] = (data[t] ?? []).filter((r) => !rows.includes(r));
          return Promise.resolve({ data: rows, error: null }).then(ok, fail);
        },
      };
      return q;
    },
    auth: {
      admin: {
        async listUsers() {
          return opsi.authError ? { error: {} } : { data: { users: data.auth }, error: null };
        },
        async deleteUser(id) {
          data.auth = data.auth.filter((u) => u.id !== id);
          data.profiles = data.profiles.filter((p) => p.id !== id);
          return { data: {}, error: null };
        },
        async getUserById(id) {
          return { data: { user: data.auth.find((u) => u.id === id) }, error: { status: 404 } };
        },
      },
    },
  };
  return { admin, data };
}
test("cleanup menolak run tidak valid sebelum mengakses database", async () => {
  await assert.rejects(bersihkanRunDatabase({}, "../asli"), /tidak valid/);
});
test("fixture ditemukan ulang walau ID respons INSERT tidak pernah diterima client", async () => {
  const { admin, data } = fixture();
  assert.deepEqual(await bersihkanRunDatabase(admin, run), {
    bidang: 2,
    akun: 1,
    pengurus: 1,
    tersisa: 0,
  });
  for (const t of ["bidang", "pengurus", "profiles", "berita", "audit_log", "auth"])
    assert.deepEqual(
      data[t].map((r) => r.id),
      ["asli"],
      t,
    );
});
test("error penghapusan tidak dilaporkan sebagai cleanup berhasil", async () => {
  const { admin, data } = fixture({ errorDelete: "bidang" });
  await assert.rejects(bersihkanRunDatabase(admin, run), /belum bersih/);
  assert.equal(data.bidang.length, 3);
});
test("respons sukses dengan fixture masih tersisa ditolak oleh pembacaan ulang", async () => {
  const { admin } = fixture({ ignoreDelete: "bidang" });
  await assert.rejects(bersihkanRunDatabase(admin, run), /masih menyisakan fixture/);
});
test("kegagalan penemuan Auth menghentikan cleanup sebelum penghapusan", async () => {
  const { admin, data } = fixture({ authError: true });
  await assert.rejects(bersihkanRunDatabase(admin, run), /daftar Auth gagal/);
  assert.equal(data.bidang.length, 3);
  assert.equal(data.berita.length, 2);
});
