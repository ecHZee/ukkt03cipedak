/** Temukan ulang fixture dari penanda run: respons INSERT bisa hilang setelah server menyimpan. */
export async function bersihkanRunDatabase(admin, run, fileUji = []) {
  if (!/^[0-9a-f]{6}$/.test(run)) throw new Error("Penanda run uji tidak valid.");
  const cek = (r, tahap) => {
    if (r.error) throw new Error(`Cleanup ${tahap} gagal; run ${run} belum bersih.`);
    return r.data;
  };
  const slug = ["a", "b"].map((s) => `uji-${run}-${s}`);
  const bid = cek(await admin.from("bidang").select("id").in("slug", slug), "cari bidang").map(
    (r) => r.id,
  );
  const email = new Set(
    ["bph", "kabida", "kabidb", "anggotaa", "anggotaj"].map((n) => `uji-${n}-${run}@example.com`),
  );
  const users = [];
  for (let page = 1; ; page++) {
    const r = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (r.error) throw new Error(`Cleanup daftar Auth gagal; run ${run} belum bersih.`);
    users.push(...r.data.users.filter((u) => email.has(u.email)).map((u) => u.id));
    if (r.data.users.length < 1000) break;
  }
  const pengurus = cek(
    await admin.from("pengurus").select("id").eq("nama", `Uji Jabatan ${run}`),
    "cari pengurus",
  ).map((r) => r.id);
  const ids = [...bid, ...users, ...pengurus];
  const or = [
    bid.length && `bidang_id.in.(${bid.join(",")})`,
    users.length && `created_by.in.(${users.join(",")})`,
  ]
    .filter(Boolean)
    .join(",");
  if (or) {
    for (const t of ["berita", "kegiatan", "dokumen", "media", "album"])
      ids.push(...cek(await admin.from(t).delete().or(or).select("id"), t).map((r) => r.id));
  }
  if (users.length)
    ids.push(
      ...cek(
        await admin.from("galeri_unggahan").delete().in("created_by", users).select("id"),
        "antrean galeri",
      ).map((r) => r.id),
    );
  if (fileUji.length) {
    ids.push(
      ...cek(
        await admin
          .from("arsip_sampah")
          .delete()
          .in(
            "path",
            fileUji.map(([, p]) => p),
          )
          .select("id"),
        "antrean arsip",
      ).map((r) => r.id),
    );
    for (const [bucket, path] of fileUji)
      cek(await admin.storage.from(bucket).remove([path]), "berkas");
  }
  for (const id of users) cek(await admin.auth.admin.deleteUser(id), "hapus Auth");
  if (pengurus.length)
    cek(await admin.from("pengurus").delete().in("id", pengurus), "hapus pengurus");
  if (bid.length) cek(await admin.from("bidang").delete().in("id", bid), "hapus bidang");
  if (ids.length) cek(await admin.from("audit_log").delete().in("record_id", ids), "audit record");
  if (users.length)
    cek(await admin.from("audit_log").delete().in("user_id", users), "audit pelaku");

  for (const [t, kolom, nilai] of [
    ["bidang", "slug", slug],
    ["pengurus", "id", pengurus],
    ["profiles", "id", users],
    ["audit_log", "record_id", ids],
    ["audit_log", "user_id", users],
    ...["berita", "kegiatan", "dokumen", "media", "album", "galeri_unggahan"].map((t) => [
      t,
      "created_by",
      users,
    ]),
  ]) {
    if (!nilai.length) continue;
    if (cek(await admin.from(t).select("id").in(kolom, nilai), `verifikasi ${t}`).length)
      throw new Error(`Cleanup ${t} masih menyisakan fixture run ${run}.`);
  }
  for (const id of users) {
    const r = await admin.auth.admin.getUserById(id);
    if (r.data?.user || (r.error && r.error.status !== 404))
      throw new Error(`Cleanup Auth belum terverifikasi; run ${run}.`);
  }
  return { bidang: bid.length, akun: users.length, pengurus: pengurus.length, tersisa: 0 };
}
