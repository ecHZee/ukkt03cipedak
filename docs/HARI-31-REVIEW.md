# Hari 31 — Kecepatan beranda

8 November 2026. Awal `revisi`=origin/revisi `261ec0a`, working tree bersih,
port5173/8090/8788 kosong. Pekerjaan disetujui Hanif; storage/billing dan akun
asli tidak menjadi objek perubahan.

## Baseline dan diagnosis

Lighthouse13.5.0, mobile412×823 DPR1,75, simulasi slow4G RTT150ms/
1638,4Kbps dan CPU4×, browser baru/cache browser dingin, URL utama Pages anonim.
Tiga run: LCP4,205/4,274/8,723detik, median**4,274detik**. Rentang jaringan cukup
besar; baseline historis26Okt5,596detik tidak digunakan sebagai pasangan pengukuran.
CLS0,000128–0,001261; TBT5–17ms; aksesibilitas/best-practices/SEO100.

Trace menunjukkan foto hero sebagai LCP. Foto sudah ditemukan dari HTML awal,
eager dan high priority. Pada dua run awal koneksi baru ke Supabase sekitar
583/599ms; unduh total foto2,800/2,705detik pada trace observasi. Dokumen masih
menunggu SSR; latensi respons server948/411/394ms dalam tiga run. Breakdown
trace observasi bukan nilai simulasi Lighthouse dan tidak dijumlahkan untuk
mengarang hasil simulasi. Tidak mengganti desain/foto atau menambah preload.

## Perubahan

- Hero/About menggunakan `/media/situs/pengaturan/...` di origin aplikasi.
  Byte gambar asli tidak diubah, tidak menambah berkas Storage.
- Gateway anonim hanya menyajikan foto pertama yang masih tercatat di
  pengaturan `situs.tampilan` publik. Pemeriksaan ini dilakukan sebelum cache
  setiap GET/HEAD, termasuk setelah foto diganti. Gagal pemeriksaan→503,
  foto bukan aktif→404. Cookie/JWT pemanggil tidak diteruskan ke Storage.
- Cache Worker hanya menyimpan byte immutable; respons pengunjung tetap
  no-store. MIME/ukuran/status diverifikasi; POST/path bebas ditolak.
- `npm run test:unit` memakai daftar15file eksplisit agar suite DB tidak ikut
  dipilih saat menjalankan unit. Tes integrasi DB tetap perintah terpisah.

## Verifikasi sebelum produksi

- TypeScript/build exit0; lint0error/7warning bawaan.
- **156/156tes unit**, termasuk15tes gateway/path/failure/HEAD/cache/revokasi.
- Runtime Worker Wrangler4.151.1: **31HTTP** lulus, fotoGET/HEAD dan cacheMISS→HIT,
  SHA256foto identik dengan sumber Supabase. Bukan uji pemulihan atau bulk media.
- Browser dev dan Worker masing-masing5lebar360/375/768/1024/1440: tidak
  overflow, satuh1, susunan dan mask hero tetap. Verifikasi interaksi/produksi
  dicatat saat penutupan di bawah.
- Satu Lighthouse Worker lokal: LCP4,920detik, observasi trace1,367detik;
  aksesibilitas/best-practices/SEO100. HTTP lokal tidak setara CDN/h2produksi,
  sehingga tidak dipakai untuk meluluskan Q07 atau mengklaim peningkatan.

## Insiden pemanggilan tes dan pemulihan

Perintah awal memakai glob `scripts/test-*.mjs`, sehingga suite integrasi DB juga
berjalan paralel. Proses dihentikan saat diketahui; suite ini tidak dihitung lulus.
Fixture sempat dibuat pada layanan nyata. Semua26akun uji yang dibuat run ini,
dua bidang uji,3berita/1kegiatan/5dokumen/1media/1album dan3berkas sintetis
dibersihkan berdasarkan penanda/ID pembuat serta waktu run. Tidak menghapus akun
asli atau menjalankan penghapusan umum berdasar awalan saja.

Sesudah pemulihan, jumlah dan digest seluruh10tabel asli identik dengan
pembanding26Okt; Auth kembali62dan hash metadata akun asli identik. Receipt/ID
fixture, hash dan helper pemulihan disimpan privat. Runner unit diganti daftar
eksplisit dan berhasil156tes. Ini kesalahan pelaksanaan QA, bukan klaim aplikasi
tidak pernah mengalami penulisan fixture selama sesi.

## Status dan batas

Verifikasi produksi dan tiga pengukuran setara sesudah deploy belum selesai pada
commit implementasi pertama. **Q07 belum diluluskan.** Tidak mengklaim p75 pengguna
nyata/CrUX, UAT peserta, HP fisik, reset password asli atau checkpoint/launch.
Artefak privat: `katar_profile/_qa-hari31/2026-11-08/`.

Target tetap LCP≤2,5detik. Storage tetap penyedia/cap sekarang; perluasan berbayar
ditunda dan metode pembayaran tanpaCC menjadi syarat evaluasi berikutnya.

Rujukan diagnosis: [web.dev LCP](https://web.dev/articles/optimize-lcp) dan
[Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/).
