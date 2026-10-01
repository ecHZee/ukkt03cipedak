/**
 * Tes CRUD + hak akses database (RLS) memakai akun uji sementara.
 *
 * Pakai: npm run test:db
 *
 * Model role: super_admin (programmer) · admin lintas bidang (BPH) · admin bidang
 * (Kabid & anggota pilihan Kabid). Anggota lain tidak punya akun (= pengunjung).
 *
 * Alur: buat 2 bidang uji + 3 akun uji (BPH, Kabid A, Kabid B) → jalankan skenario
 * Create/Read/Update/Delete → hapus SEMUA data & akun uji.
 * Butuh SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY di .env.local.
 * Aman dijalankan berulang; tidak menyentuh data asli.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const env = parseEnv(readFileSync(".env.local", "utf8"));
const URL = env.SUPABASE_URL;
const PUBLISHABLE = env.SUPABASE_PUBLISHABLE_KEY;
const SECRET = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !PUBLISHABLE || !SECRET) {
  console.error(
    "✖ Isi SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY di .env.local",
  );
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL, SECRET, opts);
const anon = createClient(URL, PUBLISHABLE, opts);

const RUN = randomBytes(3).toString("hex"); // penanda unik per run
const slug = (s) => `uji-${RUN}-${s}`;

// ---------------------------------------------------------------- pencatat hasil
const hasil = [];
function catat(nama, lolos, detail = "") {
  hasil.push({ nama, lolos });
  console.log(`${lolos ? "  ✅" : "  ❌"} ${nama}${!lolos && detail ? `  → ${detail}` : ""}`);
}
/** Harus berhasil dan (opsional) memenuhi syarat. */
async function harusBoleh(nama, aksi, syarat = (d) => d && (!Array.isArray(d) || d.length > 0)) {
  const { data, error } = await aksi();
  catat(nama, !error && syarat(data), error?.message ?? JSON.stringify(data)?.slice(0, 80));
  return data;
}
/** Harus gagal: error, atau tidak ada baris yang tersentuh/terlihat. */
async function harusDitolak(nama, aksi) {
  const { data, error } = await aksi();
  const ditolak = Boolean(error) || data == null || (Array.isArray(data) && data.length === 0);
  catat(nama, ditolak, JSON.stringify(data)?.slice(0, 80));
}

// ---------------------------------------------------------------- setup
const akun = {}; // nama → { id, client }
const bidang = {}; // A/B → id
const pengurusUji = []; // baris pengurus sementara (tes jabatan)

async function buatAkun(nama, role, bidangId) {
  const email = `uji-${nama.toLowerCase()}-${RUN}@example.com`;
  const password = randomBytes(18).toString("base64url");
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(`buat akun ${nama}: ${error.message}`);
  const id = data.user.id;
  akun[nama] = { id, client: null }; // dicatat dulu supaya tetap dihapus bila langkah berikut gagal
  const p = await admin.from("profiles").insert({
    id,
    nama_tampilan: `Uji ${nama}`,
    role,
    bidang_id: bidangId ?? null,
  });
  if (p.error) throw new Error(`profil ${nama}: ${p.error.message}`);
  const client = createClient(URL, PUBLISHABLE, opts);
  const s = await client.auth.signInWithPassword({ email, password });
  if (s.error) throw new Error(`login ${nama}: ${s.error.message}`);
  akun[nama].client = client;
}

async function setup() {
  const { data, error } = await admin
    .from("bidang")
    .insert([
      { slug: slug("a"), nama_resmi: "Bidang Uji A", nama_singkat: "Uji A" },
      { slug: slug("b"), nama_resmi: "Bidang Uji B", nama_singkat: "Uji B" },
    ])
    .select("id, slug");
  if (error) throw new Error(`bidang uji: ${error.message}`);
  bidang.A = data.find((b) => b.slug === slug("a")).id;
  bidang.B = data.find((b) => b.slug === slug("b")).id;

  await buatAkun("bph", "admin"); // admin lintas bidang
  await buatAkun("kabidA", "admin", bidang.A);
  await buatAkun("kabidB", "admin", bidang.B);
  await buatAkun("anggotaA", "anggota", bidang.A);
  await buatAkun("anggotaJ", "anggota");
}

// ---------------------------------------------------------------- bersih-bersih
async function bersihkan() {
  const bid = [bidang.A, bidang.B].filter(Boolean);
  const users = Object.values(akun).map((a) => a.id);
  const ids = [];
  for (const t of ["berita", "kegiatan", "dokumen", "media", "album"]) {
    const or = [
      bid.length && `bidang_id.in.(${bid.join(",")})`,
      users.length && `created_by.in.(${users.join(",")})`,
    ]
      .filter(Boolean)
      .join(",");
    if (!or) continue;
    const { data } = await admin.from(t).delete().or(or).select("id");
    ids.push(...(data ?? []).map((r) => r.id));
  }
  // file uji di storage
  for (const [bucket, path] of fileUji) await admin.storage.from(bucket).remove([path]);
  for (const id of users) await admin.auth.admin.deleteUser(id); // profiles ikut terhapus (cascade)
  if (pengurusUji.length) await admin.from("pengurus").delete().in("id", pengurusUji);
  if (bid.length) await admin.from("bidang").delete().in("id", bid);
  // hapus jejak uji di audit log
  const jejak = [...ids, ...bid, ...users, ...pengurusUji];
  if (jejak.length) await admin.from("audit_log").delete().in("record_id", jejak);
  if (users.length) await admin.from("audit_log").delete().in("user_id", users);
}

// ---------------------------------------------------------------- skenario
async function tesBerita() {
  console.log("\n📰 Berita");
  const A = akun.kabidA.client;
  const Bk = akun.kabidB.client;
  const P = akun.bph.client;

  await harusDitolak("Pengunjung (tanpa akun) tidak bisa membuat berita", () =>
    anon
      .from("berita")
      .insert({ judul: "x", slug: slug("anon") })
      .select(),
  );
  const draft = await harusBoleh("Kabid A bisa membuat draft di bidangnya", () =>
    A.from("berita")
      .insert({ judul: "Draft Kabid A", slug: slug("draft"), bidang_id: bidang.A })
      .select()
      .single(),
  );
  const id = draft?.id;
  await harusBoleh(
    "Pembuat terisi otomatis (tidak bisa dipalsukan)",
    () =>
      A.from("berita")
        .insert({
          judul: "Palsu",
          slug: slug("palsu"),
          bidang_id: bidang.A,
          created_by: akun.bph.id,
        })
        .select()
        .single(),
    (d) => d?.created_by === akun.kabidA.id,
  );
  await harusDitolak("Kabid A tidak bisa membuat berita di bidang B", () =>
    A.from("berita")
      .insert({ judul: "x", slug: slug("lintas"), bidang_id: bidang.B })
      .select(),
  );
  await harusDitolak("Pengunjung tidak bisa melihat draft", () =>
    anon.from("berita").select().eq("id", id),
  );
  await harusDitolak("Kabid B tidak bisa melihat draft bidang A", () =>
    Bk.from("berita").select().eq("id", id),
  );
  await harusBoleh("BPH bisa melihat draft semua bidang", () =>
    P.from("berita").select().eq("id", id),
  );
  await harusBoleh("Kabid A bisa mengubah beritanya", () =>
    A.from("berita").update({ judul: "Draft Diubah" }).eq("id", id).select(),
  );
  await harusBoleh(
    "Kabid A bisa langsung menerbitkan & tanggal terbit terisi otomatis",
    () => A.from("berita").update({ status: "terbit" }).eq("id", id).select().single(),
    (d) => d?.status === "terbit" && Boolean(d?.terbit_at),
  );
  await harusBoleh("Pengunjung bisa melihat berita terbit", () =>
    anon.from("berita").select().eq("id", id),
  );
  await harusBoleh("Kabid B bisa melihat berita terbit bidang A", () =>
    Bk.from("berita").select().eq("id", id),
  );
  await harusDitolak("Kabid B tidak bisa mengubah berita bidang A", () =>
    Bk.from("berita").update({ judul: "Diubah B" }).eq("id", id).select(),
  );
  await harusDitolak("Kabid B tidak bisa memindahkan berita A ke bidangnya", () =>
    Bk.from("berita").update({ bidang_id: bidang.B }).eq("id", id).select(),
  );
  await harusDitolak("Kabid A tidak bisa memindahkan beritanya ke bidang B", () =>
    A.from("berita").update({ bidang_id: bidang.B }).eq("id", id).select(),
  );
  await harusDitolak("Kabid B tidak bisa menghapus berita bidang A", () =>
    Bk.from("berita").delete().eq("id", id).select(),
  );
  await harusDitolak("Pengunjung tidak bisa menghapus berita", () =>
    anon.from("berita").delete().eq("id", id).select(),
  );
  await harusBoleh("BPH bisa mengubah berita bidang mana pun", () =>
    P.from("berita").update({ ringkasan: "Dirapikan BPH" }).eq("id", id).select(),
  );
  const umum = await harusBoleh("BPH bisa membuat & menerbitkan berita umum (tanpa bidang)", () =>
    P.from("berita")
      .insert({ judul: "Pengumuman", slug: slug("umum"), status: "terbit" })
      .select()
      .single(),
  );
  await harusDitolak("Kabid A tidak bisa mengubah berita umum buatan BPH", () =>
    A.from("berita").update({ judul: "x" }).eq("id", umum?.id).select(),
  );
  await harusBoleh("Kabid A bisa menghapus beritanya sendiri", () =>
    A.from("berita").delete().eq("id", id).select(),
  );
}

async function tesDokumen() {
  console.log("\n📁 Dokumen (akses berjenjang)");
  const P = akun.bph.client;
  const A = akun.kabidA.client;
  const dasar = { kategori: "lainnya", tahun: 2026, status: "terbit", bidang_id: bidang.A };
  await harusBoleh("BPH bisa mengunggah dokumen publik, anggota, dan BPH", () =>
    P.from("dokumen")
      .insert([
        { ...dasar, judul: `publik-${RUN}`, akses: "publik" },
        { ...dasar, judul: `anggota-${RUN}`, akses: "anggota" },
        { ...dasar, judul: `bph-${RUN}`, akses: "bph" },
      ])
      .select(),
  );
  const lihat = async (c) =>
    ((await c.from("dokumen").select("akses").like("judul", `%-${RUN}`)).data ?? [])
      .map((d) => d.akses)
      .sort()
      .join(",");
  const pengunjung = await lihat(anon);
  catat("Pengunjung hanya melihat dokumen publik", pengunjung === "publik", pengunjung);
  const kabidB = await lihat(akun.kabidB.client);
  catat("Admin bidang melihat publik + anggota (tanpa BPH)", kabidB === "anggota,publik", kabidB);
  const bph = await lihat(P);
  catat("BPH melihat semua", bph === "anggota,bph,publik", bph);
  await harusDitolak("Kabid tidak bisa membuat dokumen berakses BPH", () =>
    A.from("dokumen")
      .insert({ judul: "x", kategori: "lainnya", tahun: 2026, akses: "bph", bidang_id: bidang.A })
      .select(),
  );
  await harusBoleh("Kabid bisa mengunggah dokumen publik bidangnya", () =>
    A.from("dokumen")
      .insert({ ...dasar, judul: `lpj-kabid-${RUN}`, akses: "publik", kategori: "lpj-kegiatan" })
      .select(),
  );
  await harusDitolak("Kabid tidak bisa menurunkan akses dokumen BPH jadi publik", () =>
    A.from("dokumen").update({ akses: "publik" }).eq("judul", `bph-${RUN}`).select(),
  );
}

async function tesAlbumMedia() {
  console.log("\n🖼️  Album & media");
  const A = akun.kabidA.client;
  const P = akun.bph.client;
  const album = await harusBoleh("Kabid bisa membuat album draft", () =>
    A.from("album")
      .insert({ judul: "Album Uji", slug: slug("album"), bidang_id: bidang.A })
      .select()
      .single(),
  );
  await harusBoleh("Kabid bisa menambah foto ke album", () =>
    A.from("media")
      .insert({
        album_id: album?.id,
        bidang_id: bidang.A,
        jenis: "foto",
        storage_path: `uji/${RUN}.webp`,
      })
      .select(),
  );
  await harusDitolak("Pengunjung tidak melihat foto di album draft", () =>
    anon.from("media").select().eq("album_id", album?.id),
  );
  await harusDitolak("Kabid B tidak bisa menambah foto ke album bidang A", () =>
    akun.kabidB.client
      .from("media")
      .insert({ album_id: album?.id, bidang_id: bidang.A, jenis: "foto", storage_path: "x.webp" })
      .select(),
  );
  await harusBoleh("Kabid bisa menerbitkan albumnya", () =>
    A.from("album").update({ status: "terbit" }).eq("id", album?.id).select(),
  );
  await harusBoleh("Pengunjung melihat foto setelah album terbit", () =>
    anon.from("media").select().eq("album_id", album?.id),
  );
  await harusDitolak("Link video wajib https", () =>
    P.from("media")
      .insert({
        album_id: album?.id,
        bidang_id: bidang.A,
        jenis: "embed",
        embed_url: "http://contoh.test/v",
      })
      .select(),
  );
  await harusBoleh("Link video https (YouTube/IG/TikTok) diterima", () =>
    A.from("media")
      .insert({
        album_id: album?.id,
        bidang_id: bidang.A,
        jenis: "embed",
        embed_url: "https://youtu.be/uji",
      })
      .select(),
  );
}

async function tesKegiatan() {
  console.log("\n📅 Kegiatan");
  const A = akun.kabidA.client;
  await harusBoleh("Kabid bisa membuat & menerbitkan kegiatan terjadwal", () =>
    A.from("kegiatan")
      .insert({
        judul: "Kerja Bakti Uji",
        slug: slug("kegiatan"),
        bidang_id: bidang.A,
        mulai: "2026-10-04T07:00:00+07:00",
        selesai: "2026-10-04T10:00:00+07:00",
        status: "terbit",
      })
      .select(),
  );
  await harusDitolak("Waktu selesai sebelum mulai ditolak", () =>
    A.from("kegiatan")
      .insert({
        judul: "Salah Jam",
        slug: slug("salah-jam"),
        bidang_id: bidang.A,
        mulai: "2026-10-04T10:00:00+07:00",
        selesai: "2026-10-04T07:00:00+07:00",
      })
      .select(),
  );
}

async function tesAkunDanAudit() {
  console.log("\n🔐 Akun & audit log");
  const A = akun.kabidA.client;
  const P = akun.bph.client;
  await harusDitolak("Kabid tidak bisa menjadikan dirinya Super Admin", () =>
    A.from("profiles").update({ role: "super_admin" }).eq("id", akun.kabidA.id).select(),
  );
  await harusDitolak("Kabid tidak bisa melepas batas bidangnya", () =>
    A.from("profiles").update({ bidang_id: null }).eq("id", akun.kabidA.id).select(),
  );
  await harusDitolak("BPH tidak bisa membuat akun (khusus Super Admin/programmer)", () =>
    P.from("profiles").insert({ id: akun.kabidB.id, nama_tampilan: "x", role: "admin" }).select(),
  );
  await harusDitolak("BPH tidak bisa mengubah role akun lain", () =>
    P.from("profiles").update({ role: "super_admin" }).eq("id", akun.kabidB.id).select(),
  );
  await harusDitolak("Kabid tidak bisa membaca audit log", () =>
    A.from("audit_log").select().limit(1),
  );
  await harusBoleh("BPH bisa membaca audit log", () => P.from("audit_log").select().limit(1));
  await harusBoleh(
    "Aksi Kabid tercatat di audit log dengan user yang benar",
    () => admin.from("audit_log").select("tabel, aksi").eq("user_id", akun.kabidA.id),
    (d) => d?.some((r) => r.tabel === "berita" && r.aksi === "INSERT"),
  );
}

// ---------------------------------------------------------------- storage
const fileUji = []; // [bucket, path] untuk dibersihkan
const WEBP = Buffer.from("RIFF\u0000\u0000\u0000\u0000WEBPVP8 ", "binary");
const PDF = Buffer.from("%PDF-1.4\n%uji\n", "utf8");

async function unggahUji(client, bucket, path, isi, contentType) {
  const { data, error } = await client.storage.from(bucket).upload(path, isi, { contentType });
  if (!error) fileUji.push([bucket, path]);
  return { data: error ? null : data, error };
}

async function tesStorage() {
  console.log("\n🗂️  Penyimpanan file (Storage)");
  const A = akun.kabidA.client;
  const Bk = akun.kabidB.client;
  const P = akun.bph.client;
  const sA = slug("a");
  const sB = slug("b");

  await harusDitolak("Pengunjung tidak bisa mengunggah foto", () =>
    unggahUji(anon, "media", `umum/${RUN}-anon.webp`, WEBP, "image/webp"),
  );
  await harusBoleh("Kabid A bisa mengunggah foto ke folder bidangnya", () =>
    unggahUji(A, "media", `${sA}/${RUN}-a.webp`, WEBP, "image/webp"),
  );
  await harusDitolak("Kabid A tidak bisa mengunggah ke folder bidang B", () =>
    unggahUji(A, "media", `${sB}/${RUN}-a.webp`, WEBP, "image/webp"),
  );
  await harusBoleh("Kabid A bisa mengunggah ke folder umum", () =>
    unggahUji(A, "media", `umum/${RUN}-a.webp`, WEBP, "image/webp"),
  );
  await harusDitolak("File selain gambar/video ditolak di bucket media", () =>
    unggahUji(A, "media", `${sA}/${RUN}-a.txt`, Buffer.from("halo"), "text/plain"),
  );
  const url = anon.storage.from("media").getPublicUrl(`${sA}/${RUN}-a.webp`).data.publicUrl;
  const r = await fetch(url);
  catat("Foto bisa dibuka publik lewat URL", r.ok, String(r.status));

  await Bk.storage.from("media").remove([`${sA}/${RUN}-a.webp`]);
  const masihAda = await fetch(url, { cache: "no-store" });
  catat("Kabid B tidak bisa menghapus foto bidang A", masihAda.ok, String(masihAda.status));

  await harusBoleh("Kabid A bisa mengunggah dokumen internal bidangnya", () =>
    unggahUji(A, "dokumen-internal", `${sA}/${RUN}.pdf`, PDF, "application/pdf"),
  );
  await harusDitolak("Kabid A tidak bisa mengunggah ke folder internal BPH", () =>
    unggahUji(A, "dokumen-internal", `bph/${RUN}-a.pdf`, PDF, "application/pdf"),
  );
  await harusBoleh("BPH bisa mengunggah ke folder internal BPH", () =>
    unggahUji(P, "dokumen-internal", `bph/${RUN}.pdf`, PDF, "application/pdf"),
  );
  await harusBoleh(
    "Pengurus lain (Kabid B) bisa membuka dokumen internal bidang A (link sementara)",
    () => Bk.storage.from("dokumen-internal").createSignedUrl(`${sA}/${RUN}.pdf`, 60),
  );
  await harusDitolak("Kabid tidak bisa membuka dokumen internal BPH", () =>
    A.storage.from("dokumen-internal").createSignedUrl(`bph/${RUN}.pdf`, 60),
  );
  await harusDitolak("Pengunjung tidak bisa membuka dokumen internal", () =>
    anon.storage.from("dokumen-internal").createSignedUrl(`${sA}/${RUN}.pdf`, 60),
  );
  const bocor = await fetch(
    anon.storage.from("dokumen-internal").getPublicUrl(`${sA}/${RUN}.pdf`).data.publicUrl,
  );
  catat("Dokumen internal tidak bisa dibuka lewat URL publik", !bocor.ok, String(bocor.status));
}

// ---------------------------------------------------------------- anggota & persetujuan
async function tesAnggota() {
  console.log("\n🙋 Anggota, izin kontribusi & persetujuan");
  const G = akun.anggotaA.client;
  const A = akun.kabidA.client;
  const Bk = akun.kabidB.client;

  await harusDitolak("Anggota tanpa izin tidak bisa membuat berita", () =>
    G.from("berita")
      .insert({ judul: "x", slug: slug("g-tanpa-izin"), bidang_id: bidang.A })
      .select(),
  );
  await harusDitolak("Kabid B tidak bisa memberi izin ke anggota bidang A", () =>
    Bk.rpc("atur_izin_kontribusi", { p_profil: akun.anggotaA.id, p_izin: true }).then((r) => ({
      data: r.error ? null : [1],
      error: r.error,
    })),
  );
  await harusDitolak("Anggota tidak bisa memberi izin ke dirinya sendiri", () =>
    G.rpc("atur_izin_kontribusi", { p_profil: akun.anggotaA.id, p_izin: true }).then((r) => ({
      data: r.error ? null : [1],
      error: r.error,
    })),
  );
  await harusBoleh("Kabid A bisa memberi izin kontribusi ke anggotanya", () =>
    A.rpc("atur_izin_kontribusi", { p_profil: akun.anggotaA.id, p_izin: true }).then((r) => ({
      data: r.error ? null : [1],
      error: r.error,
    })),
  );
  const draft = await harusBoleh("Anggota berizin bisa membuat draft di bidangnya", () =>
    G.from("berita")
      .insert({ judul: "Draft Anggota", slug: slug("g-draft"), bidang_id: bidang.A })
      .select()
      .single(),
  );
  await harusDitolak("Anggota berizin tidak bisa membuat di bidang lain", () =>
    G.from("berita")
      .insert({ judul: "x", slug: slug("g-lintas"), bidang_id: bidang.B })
      .select(),
  );
  await harusDitolak("Anggota tidak bisa langsung menerbitkan", () =>
    G.from("berita")
      .insert({ judul: "x", slug: slug("g-terbit"), bidang_id: bidang.A, status: "terbit" })
      .select(),
  );
  await harusBoleh("Anggota bisa mengajukan review", () =>
    G.from("berita").update({ status: "review" }).eq("id", draft?.id).select(),
  );
  await harusDitolak("Anggota tidak bisa menerbitkan draftnya", () =>
    G.from("berita").update({ status: "terbit" }).eq("id", draft?.id).select(),
  );
  await harusBoleh(
    "Kabid A menyetujui & tercatat sebagai penyetuju",
    () => A.from("berita").update({ status: "terbit" }).eq("id", draft?.id).select().single(),
    (d) => d?.status === "terbit" && d?.disetujui_oleh === akun.kabidA.id,
  );
  await harusDitolak("Anggota tidak bisa mengubah berita yang sudah terbit", () =>
    G.from("berita").update({ judul: "diam-diam" }).eq("id", draft?.id).select(),
  );
  await harusDitolak("Anggota tidak bisa menghapus berita yang sudah terbit", () =>
    G.from("berita").delete().eq("id", draft?.id).select(),
  );
  await harusBoleh("Anggota berizin bisa mengunggah foto ke folder bidangnya", () =>
    unggahUji(G, "media", `${slug("a")}/${RUN}-g.webp`, WEBP, "image/webp"),
  );
  await harusDitolak("Anggota tidak bisa mengunggah ke folder umum", () =>
    unggahUji(G, "media", `umum/${RUN}-g.webp`, WEBP, "image/webp"),
  );
  await harusBoleh("Kabid A bisa mencabut izin kontribusi", () =>
    A.rpc("atur_izin_kontribusi", { p_profil: akun.anggotaA.id, p_izin: false }).then((r) => ({
      data: r.error ? null : [1],
      error: r.error,
    })),
  );
  await harusDitolak("Setelah izin dicabut, anggota tidak bisa membuat draft lagi", () =>
    G.from("berita")
      .insert({ judul: "x", slug: slug("g-dicabut"), bidang_id: bidang.A })
      .select(),
  );

  // Profil sendiri
  await harusBoleh("Anggota bisa mengubah nama, email & no. HP sendiri", () =>
    G.rpc("ubah_profil_saya", {
      p_nama: "Anggota Uji",
      p_email: "anggota.uji@example.com",
      p_hp: "081234567890",
    }).then((r) => ({ data: r.error ? null : [1], error: r.error })),
  );
  await harusDitolak("Anggota tidak bisa langsung mengubah role/izin di tabel profiles", () =>
    G.from("profiles").update({ izin_kontribusi: true }).eq("id", akun.anggotaA.id).select(),
  );
  await harusDitolak("Anggota tidak bisa melihat akun orang lain", () =>
    G.from("profiles").select().eq("id", akun.kabidA.id),
  );
  await harusBoleh(
    "Kabid A bisa melihat kontak anggota bidangnya",
    () => A.from("profiles").select("no_hp").eq("id", akun.anggotaA.id),
    (d) => d?.[0]?.no_hp === "081234567890",
  );
  await harusDitolak("Kabid B tidak bisa melihat kontak anggota bidang A", () =>
    Bk.from("profiles").select("no_hp").eq("id", akun.anggotaA.id),
  );
  const kontakPublik = await anon.from("profiles").select("no_hp").eq("id", akun.anggotaA.id);
  catat(
    "Pengunjung tidak bisa melihat kontak pribadi",
    !kontakPublik.data?.length,
    JSON.stringify(kontakPublik.data),
  );
}

// ---------------------------------------------------------------- role dari jabatan
async function tesJabatan() {
  console.log("\n🪪 Role otomatis dari jabatan");
  const { data: periode } = await admin.from("periode").select("id").eq("aktif", true).single();
  const { data: p, error } = await admin
    .from("pengurus")
    .insert({
      periode_id: periode.id,
      nama: `Uji Jabatan ${RUN}`,
      jabatan: "Anggota Bidang",
      grup: "bidang",
      bidang_id: bidang.A,
    })
    .select("id")
    .single();
  if (error) throw new Error(`pengurus uji: ${error.message}`);
  pengurusUji.push(p.id);
  await admin
    .from("profiles")
    .update({ pengurus_id: p.id, role: "admin", bidang_id: null })
    .eq("id", akun.anggotaJ.id);
  const lihat = async () =>
    (await admin.from("profiles").select("role, bidang_id").eq("id", akun.anggotaJ.id).single())
      .data;
  let r = await lihat();
  catat(
    "Ditautkan ke 'Anggota Bidang' → role anggota (isian manual diabaikan)",
    r?.role === "anggota" && r?.bidang_id === bidang.A,
    JSON.stringify(r),
  );
  await admin.from("pengurus").update({ jabatan: "Kepala Bidang" }).eq("id", p.id);
  r = await lihat();
  catat(
    "Jabatan diubah jadi Kepala Bidang → role admin bidang",
    r?.role === "admin" && r?.bidang_id === bidang.A,
    JSON.stringify(r),
  );
  await admin
    .from("pengurus")
    .update({ grup: "bph", jabatan: "Sekretaris", bidang_id: null })
    .eq("id", p.id);
  r = await lihat();
  catat(
    "Dipindah ke BPH → admin lintas bidang",
    r?.role === "admin" && r?.bidang_id === null,
    JSON.stringify(r),
  );
}

// ---------------------------------------------------------------- jalankan
let gagalTeknis = null;
try {
  console.log(`🧪 Tes CRUD & hak akses (run ${RUN})`);
  await setup();
  await tesBerita();
  await tesDokumen();
  await tesAlbumMedia();
  await tesKegiatan();
  await tesAkunDanAudit();
  await tesStorage();
  await tesAnggota();
  await tesJabatan();
} catch (e) {
  gagalTeknis = e;
} finally {
  await bersihkan();
}

const lolos = hasil.filter((h) => h.lolos).length;
console.log(`\n${lolos}/${hasil.length} tes lolos · data & akun uji sudah dihapus`);
if (gagalTeknis) console.error("✖ Tes berhenti:", gagalTeknis.message);
process.exit(gagalTeknis || lolos !== hasil.length ? 1 : 0);
