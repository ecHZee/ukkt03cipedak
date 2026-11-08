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

## Hasil produksi — 8 November 2026

Kode `2f4a629` berhasil dideploy dari `revisi` pada 17:35:22 WIB; Worker versi
`379ef310-cfdb-4f88-ba9a-622b454643a2`. Dua build awal berhenti pada instalasi alat/
dependensi sebelum build aplikasi. Sesudah cache build sementara dibersihkan,
commit identik berhasil: Bun1.4.3 frozen lockfile, Node24.22.1, Wrangler4.158.0.
Tidak mengganti lockfile, versi paket, runtime secret, branch atau konfigurasi biaya.

- **31 pemeriksaan HTTP per origin**, Pages dan Worker, lulus; bukan 62 kasus unik.
  Penanda baru `/media/situs/` hadir di HTML, foto SHA256 identik, GET/HEAD cache
  MISS/HIT, no-store, path bukan foto aktif ditolak. Pages tetap `pages-v1`.
- Lima lebar produksi **360/375/768/1024/1440px**, masing-masing tinggi900px:
  satu h1 dan tanpa overflow. Foto selesai dimuat, mask asli tetap. Menu HP
 375×740 dapat dibuka/ditutup; CTA kegiatan dan arsip menuju halaman benar.
  Filter bidang galeri menghasilkan1album lalu4setelah reset; lightbox dapat
  dibuka, berpindah1/3→2/3 dan ditutup. Konsol0error.
- Inventaris ulang Storage/B2 identik dengan28Okt: **8objek Supabase/792.282byte**,
  **22versi B2/2.713.394byte**, unfinished0. ID/path/ukuran sama. Panggilan pertama
  inventaris B2 sempat gagal DNS; pengulangan read-only berhasil. Ini bukan
  verifikasi hash isi seluruh storage baru atau uji kapasitas/restore penuh.

### Performa sebelum/sesudah dengan kondisi mobile setara

| Nilai | Baseline sesi | Sesudah deploy |
| --- | --- | --- |
| LCP run1/2/3 | 4,205 / 4,274 / 8,723 detik | 3,462 / 4,881 / 4,807 detik |
| Median LCP | **4,274 detik** | **4,807 detik** |
| CLS | 0,000128–0,001261 | 0 pada ketiga run |
| TBT | 5–17ms | 11–37ms |
| Skor performance | 78 / 73 / 71 | 85 / 74 / 74 |
| Aksesibilitas / best-practices / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

Median LCP terukur **12,5% lebih lambat**, bukan bukti peningkatan keseluruhan.
Rentang hasil saling tumpang tindih dan hanya tiga run per kelompok; tidak
menetapkan signifikansi statistik atau menisbatkan seluruh variasi ke satu perubahan.
Byte foto yang sama pada trace observasi kini selesai dimuat0,747/0,420/0,337detik
(baseline dua awal2,800/2,705detik). Namun jeda setelah foto selesai sampai LCP
pada trace masih1,747/2,069/2,154detik. Nilai trace observasi berbeda dari simulasi
Lighthouse pada tabel; jangan dicampur atau dijumlahkan lintas metode.

Satu run desktop1350×940: LCP2,510detik, CLS0,004658, TBT0,
performance73 dan tiga kategori lainnya100. Tidak ada baseline desktop sesi ini;
ini smoke pengukuran, bukan median atau klaim desktop membaik.

Diagnosis tambahan memblokir seluruh `/assets/*.js` pada satu run: LCP2,496detik,
FCP0,996detik, TBT0 dan jeda render trace0,475detik. Ini menguatkan dugaan pengaruh
persaingan jaringan/inisialisasi JS terhadap render; belum memisahkan kontribusi
masing-masing. **Tidak dipakai untuk kelulusan**: navigasi interaktif tidak bekerja
normal ketika script diblokir. Tidak menerapkan penundaan script buatan hanya untuk
mengejar skor. Perbaikan berikutnya perlu mengisolasi dependensi publik dari kode
admin, memeriksa rantai module-preload/hydration dan mengukur per perubahan kecil.
Jangan menghilangkan pemeriksaan izin atau meng-cache HTML demi target.

## Status dan batas

**Paket diagnosis, implementasi dan verifikasi Hari31 selesai; target Q07 belum
tercapai.** Gateway mengurangi jalur unduh foto, tetapi belum membuktikan peningkatan
LCP halaman. Tindak lanjut Q07 tetap backlog penghambat kesiapan launch, terpisah
dari paket32. Tidak mengklaim p75 pengguna nyata/CrUX, UAT peserta, HP fisik,
reset password asli atau checkpoint/launch.
Artefak privat: `katar_profile/_qa-hari31/2026-11-08/`.

Target tetap LCP≤2,5detik. Storage tetap penyedia/cap sekarang; perluasan berbayar
ditunda dan metode pembayaran tanpaCC menjadi syarat evaluasi berikutnya.

Rujukan diagnosis: [web.dev LCP](https://web.dev/articles/optimize-lcp) dan
[Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/).

Penutupan 2026-11-08 17:48 WIB: server dev/preview/Worker dihentikan, port5173/8090/8788 kosong,
`.output/server/.dev.vars` tidak ada. Tab QA dan emulasi ditutup; dashboard Cloudflare
kembali ke daftar Workers & Pages, tab/sesi pemilik dipertahankan. Laporan penutup
dipush hanya ke `revisi`; cek deploy commit dokumentasi dicatat dalam laporan sesi.


## Lanjutan Hari31 — kandidat JS/render (8 November 2026)

Hanif meminta Q07 dituntaskan dahulu dan tidak berpindah Hari32. Status "paket
selesai" di atas adalah catatan sesi pertama; Hari31 kini dilanjutkan.

Baseline baru pada produksi68e0e8d: LCP4,660/3,973/4,582detik, median4,582detik,
metode Lighthouse mobile sama. Ketiga run selesai sebelum build eksperimen dimulai.

Kandidat mempertahankan desain/foto serta kueri/hak akses:
- Pisahkan helper URL/video/teks publik dari modul unggah dan kueri CMS.
- Loader route dimuat sesuai halaman. Situs/beranda memakai fungsi GET server
  dengan kueri publik yang sama; tidak mengirim opsi status/hak akses dari pemanggil.
- Middleware RPC global memuat SDK Auth saat RPC diperlukan, tetap membaca token
  terbaru setiap permintaan. Guard login/admin tetap memeriksa sesi sebelum akses.
- Dialog menu dimuat saat dipakai, tetap memakai komponen yang sama dan memulihkan
  fokus. CSS diimpor sebagai side-effect agar inlining SSR bawaan Start bekerja;
  foto/mask/font/warna/susunan tetap, stylesheet kini hadir dalam HTML awal.

Statis: tsc/buildexit0, lint0error/7warning bawaan;164unit termasuk8tes baru token/
loaderpublik/URLyangdibandingkanSDK.31HTTPWorker lokal lulus.5lebar360/375/768/1024/
1440tanpaoverflow;menu/fokus/navigasi/filter sertaCMSanonim→login dan konsol0error.
Belum melakukan reset/login akun asli, migrasi atau menulis fixture cloud.

Helper analisis bundle yang memakai Vite.build hanya membangun client; satu pengukuran
lokal memakai manifest server lama dan dikeluarkan dari pembanding. Build lengkap
npm run build kemudian diulang dan pasangan manifest diverifikasi. EBUSY saat build
pertama diperbaiki dengan menghentikan preview terlebih dahulu. Ukuran jalur JS statis
kandidat sempat191→136KB gzip pada metadata build lokal, bukan total transfer halaman
atau hasil performa produksi. Hasil akhir produksi ditambahkan setelah deploy.

**Status kandidat:** menunggu verifikasi produksi dan target Q07; Hari32 belum dimulai.


### Iterasi prioritas jaringan — 2026-11-08 18:49 WIB

Kandidatd77b69a berhasil deploy18:39:42WIB setelah kegagalan instalasiBun dan retry
commitidentik dengan cachebuildsementara dibersihkan.31HTTPPages lulus. LCPproduksi
5,899/2,987/2,440detik,median2,987; **belum lulus**. Runpertama memperingatkan load
timeout dan tiga asetJS tidak selesai; ketiganya diperiksa ulang200. Semua hasil tetap
disimpan, tidak memilih hanya runtercepat. TransferJS awal sekitar172KB dibanding
baseline259–264KB. Ini mencakup resourcehalaman, berbeda dari closurestatis bundle.

Iterasi berikut memberi fetchpriority=low pada modulepreload/scriptmodule beranda
melalui HTMLRewriter Worker. Tidak menghapus script, memblokir URL atau memasang timer;
foto tetap high dan CSSinline. Halamanlain/API/HEAD/error tidak diubah;cache/no-store
serta metode tetap.166unit(2batasbaru),tsc/build0,lintfilebaru0;31HTTPWorkerlokal
lulus pada pengulangan setelah1timeout jaringanlokal. DOM membuktikan prioritaslow,
menu/fokus/konsol tetapbenar. Klikotomatis saat animasimenu sempatmeleset lalu diuji
ulang setelah status stabil, bukan dinyatakan bug aplikasi. SatuLHlokal mengalami
TTFB25,477detik dan tidakdipakaiuntuk kelulusan produksi.133bundle/4nilaiprivat0temuan.
Hasilproduksi iterasiprioritas menyusul; Hari31 tetapberjalan.
