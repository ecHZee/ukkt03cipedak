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
  for (const id of users) await admin.auth.admin.deleteUser(id); // profiles ikut terhapus (cascade)
  if (bid.length) await admin.from("bidang").delete().in("id", bid);
  // hapus jejak uji di audit log
  const jejak = [...ids, ...bid, ...users];
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
} catch (e) {
  gagalTeknis = e;
} finally {
  await bersihkan();
}

const lolos = hasil.filter((h) => h.lolos).length;
console.log(`\n${lolos}/${hasil.length} tes lolos · data & akun uji sudah dihapus`);
if (gagalTeknis) console.error("✖ Tes berhenti:", gagalTeknis.message);
process.exit(gagalTeknis || lolos !== hasil.length ? 1 : 0);
