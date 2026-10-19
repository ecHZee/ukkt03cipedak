import { AwsClient } from "aws4fetch";
import { thumbB2 } from "@/lib/galeri-admin";

function konfigurasi() {
  const { B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET, B2_ENDPOINT } = process.env;
  if (
    !B2_KEY_ID ||
    !B2_APPLICATION_KEY ||
    B2_BUCKET !== "katar-rw03-media" ||
    B2_ENDPOINT !== "https://s3.us-west-004.backblazeb2.com"
  )
    throw new Error("Penyimpanan album belum siap. Hubungi BPH.");
  return {
    bucket: B2_BUCKET,
    endpoint: B2_ENDPOINT,
    aws: new AwsClient({
      accessKeyId: B2_KEY_ID,
      secretAccessKey: B2_APPLICATION_KEY,
      service: "s3",
      region: "us-west-004",
      retries: 2,
    }),
  };
}
export function pastikanB2Siap() {
  konfigurasi();
}
function alamat(path: string) {
  if (!/^galeri\/[a-z0-9_/-]+\.(webp|mp4|webm|mov)$/.test(path) || path.includes(".."))
    throw new Error("Lokasi media tidak valid.");
  const c = konfigurasi();
  return { ...c, url: new URL(`${c.endpoint}/${c.bucket}/${path}`) };
}
export async function tandaPutB2(path: string, mime: string, ukuran?: number) {
  if (!path.startsWith("galeri/staging/")) throw new Error("PUT hanya untuk staging.");
  const { aws, url } = alamat(path);
  url.searchParams.set("X-Amz-Expires", "300");
  return (
    await aws.sign(url, {
      method: "PUT",
      headers: { "Content-Type": mime, ...(ukuran ? { "Content-Length": String(ukuran) } : {}) },
      aws: { signQuery: true, allHeaders: true },
    })
  ).url;
}
export async function tandaGetB2(path: string, detik = 300) {
  const { aws, url } = alamat(path);
  url.searchParams.set("X-Amz-Expires", String(detik));
  return (await aws.sign(url, { aws: { signQuery: true } })).url;
}
export async function bacaB2(path: string, method = "GET", range?: string) {
  const { aws, url } = alamat(path);
  return aws.fetch(url, {
    method,
    headers: range ? { Range: range } : {},
    signal: AbortSignal.timeout(30_000),
  });
}
export async function hapusB2(path: string) {
  const { aws, url } = alamat(path);
  const r = await aws.fetch(url, { method: "DELETE", signal: AbortSignal.timeout(30_000) });
  if (!r.ok && r.status !== 404)
    throw new Error("Berkas belum dapat dibersihkan. Coba bersihkan lagi.");
  await r.body?.cancel();
}
async function verifikasiObjek(path: string, mime: string, ukuran: number) {
  const head = await bacaB2(path, "HEAD");
  if (
    !head.ok ||
    Number(head.headers.get("content-length")) !== ukuran ||
    head.headers.get("content-type")?.split(";")[0] !== mime
  )
    throw new Error("Berkas belum lengkap atau format/ukurannya berbeda. Coba unggah lagi.");
  const etag = head.headers.get("etag");
  if (!etag) throw new Error("Metadata berkas belum tersedia.");
  const awal = await bacaB2(path, "GET", "bytes=0-31");
  if (awal.status !== 206 || Number(awal.headers.get("content-length")) > 32) {
    await awal.body?.cancel();
    throw new Error("Verifikasi berkas gagal.");
  }
  const b = new Uint8Array(await awal.arrayBuffer());
  const teks = new TextDecoder();
  const sah =
    mime === "image/webp"
      ? teks.decode(b.slice(0, 4)) === "RIFF" && teks.decode(b.slice(8, 12)) === "WEBP"
      : mime === "video/webm"
        ? b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3
        : teks.decode(b.slice(4, 8)) === "ftyp";
  if (!sah) throw new Error("Isi file tidak cocok dengan formatnya.");
  return etag;
}
async function salinTerverifikasi(staging: string, final: string, mime: string, ukuran: number) {
  const etag = await verifikasiObjek(staging, mime, ukuran);
  const { aws, url, bucket } = alamat(final);
  const r = await aws.fetch(url, {
    method: "PUT",
    headers: { "x-amz-copy-source": `/${bucket}/${staging}`, "x-amz-copy-source-if-match": etag },
    signal: AbortSignal.timeout(60_000),
  });
  if (!r.ok || !(await r.text()).includes("CopyObjectResult"))
    throw new Error("Berkas belum dapat disimpan. Coba lagi.");
}
export type ObjekUnggahan = {
  staging_path: string;
  final_path: string;
  mime: string;
  ukuran_bytes: number;
  thumb_bytes: number | null;
};
export async function finalkanObjekB2(u: ObjekUnggahan) {
  await salinTerverifikasi(u.staging_path, u.final_path, u.mime, u.ukuran_bytes);
  if (u.thumb_bytes !== null)
    await salinTerverifikasi(
      thumbB2(u.staging_path),
      thumbB2(u.final_path),
      "image/webp",
      u.thumb_bytes,
    );
}
export async function bersihkanObjekB2(u: ObjekUnggahan, final = false) {
  const paths = [u.staging_path, ...(final ? [u.final_path] : [])];
  if (u.thumb_bytes !== null) paths.push(...paths.map(thumbB2));
  for (const path of paths) await hapusB2(path);
}
