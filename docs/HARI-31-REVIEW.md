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


Iterasi prioritas7af16fc berhasil deploy18:49:51WIB,31HTTPPages lulus, tetapi
LCP3,163/6,028/6,436detik (median6,028) lebih buruk. FCP1,331/1,440/2,379detik.
Petunjuklow dicabut bersama helper/hook/dua tes khusus; pemisahan JS/CSSd77 tetap.
Tidak mempertahankan perubahan hanya karena salah satu metrik membaik.
Trace run3 menunjukkan Paint1434ms tetapi FCP/LCP2850ms danGPUTask110/153ms.
RAM kosong1,43GiB/23,31GiB, lalu1,73GiB setelah previewQA sendiri dimatikan;CPU18%.
ProtokolH2/H3 dan waktu unduh juga variatif. Faktor mesin/jaringan perlu dibedakan
dari perubahan aplikasi; belum bukti bahwa seluruh masalah berasal dari mesin.
Aplikasi pemilik tidak ditutup; diminta merapikan aplikasi/tab berat sambil diagnosis
kode dilanjutkan. Q07 tetap belum lulus dan Hari32 belum dimulai.

### Foto cache bersama HTML — 2026-11-08 19:37 WIB

Rollbackb8ab0d sukses19:05:45WIB. Setelah Hanif menutupOpera, RAMbebas7,06GiB;
3runproduksi tanpa previewQA: LCP4,906/3,442/2,238detik,median3,442,TBT0 dan
0warning. Trace menunjukkan TTFB/unduhfoto variatif;run1foto3,119detik,run2
0,916,run3 0,506. KondisiRAM berubah sehingga seluruh perbedaan tidak boleh
semata-mata dianggap dampak kode.

Kandidat berikut mengirim byteWebP publik yang sudah hangat di CacheAPI bersama
HTML beranda, maksimal128KiB, sesudah pengaturanpublik dibaca segar pada request
sama. Fotoaktif105.490byte/1200×800 tidak diubah. Tidakfetchorigin tambahan;
cachekosong/format/ukuran gagal memakai gateway sebelumnya. HTML tetapno-store;
halamanlain/HEAD/URLRPC tidak menerima DataURI. Brotli produksi tersedia; dampak
transferHTML danLCP harus diuji, bukan diasumsikan. About memakai byte yang sama.

168unit lulus(4kasusbaru),tsc/buildexit0,lintfileubah0error,133bundle/4nilaiprivat
0temuan. Worker32HTTP termasuk cachebersih→gatewayMISS→HTMLinline danSHA256identik.
Dev danWorker masing-masing5lebar360/375/768/1024/1440 tanpaoverflow/1h1;
foto/mask/desain sama. Menubuka/tutup/fokus balik danSPAgaleri→beranda lulus,
konsolerror0. Satu pengamatan dev terlalu dini sebelumCSS/viewportsettled diulang
sesudahCSS/fontsiap; hasil akhir5lebar tersimpan. Selectorheadinggaleri awal salah
(namanya generic), diperiksa DOM lalu navigasi sebenarnya lulus. Preview/dev
sendiri dihentikan dantabQA ditutup sebelum benchmarkproduksi. Hasil produksi
kandidat ini menyusul; Q07 belum lulus.

### Cabut inline foto, kelompokkan runtime — 2026-11-08 20:04 WIB

082a26d suksesdeploy19:38:42WIB;32HTTP masing-masing Pages/Worker lulus. LCP
2,315/4,560/4,414detik,median4,414: gagal. Run1loadtimeout/charsetgatherererror,
LCPcandidatebatikheader danhasilkategori tidaklengkap; tidakdipakai sebagai bukti
lulus. Run2/3fotoDataURI tetapcandidate,0TBT/CLS,kategori lain100. ByteHTMLBrotli
sekitar140KB,raw610KB karenaURI terulang. Inline dicabut seluruhnya dan4teskhusus
dilepas: gateway/foto/desain kembali persis jalurb8ab0d2. Tidak mempertahankan
kompleksitas yang tidakmembantu.

Diagnosis lokal empatvarianCSS (tanpafilter/mask/pola) pada proksi, lalu fixture
publik statis41aset, belum membuktikan satu efek sebagai penyebab utama. Tidak
mengubahdesain. Hasilproxy bukan kelulusan: HTTP1.1/payloadgzip/TTFB berbeda dari
produksi. Run GPUdisabled juga **diagnosis saja**: LCPsimulasi1,730 tetapi TTFBnyata
22,552detik danLCPobservasi22,769; tidak dapat diklaim perbaikan pengguna.
Semua flag kelulusan tetapdefault seperti baseline.

Kandidatbaru hanya pengelompokanruntimeReact/TanStack pada environmentclient
Vite8/Rolldown, importdinamisCMS/menu tetapterpisah. JumlahhintmoduleDOMWorker
29→18,closurestatis136.167bytegzip; ini bukan angka transferproduksi. OpsiRollup
onlyExplicitManualChunks sempatditolakwarningbuildlokal lalu dikoreksi denganAPI
codeSplitting.groups resmi. Pengelompokan duaruntime sempat dicoba lokal, akhir
satu kelompokruntime dipilih untuk mengurangi pecahan dan siklus lintaschunk.
Tidakmengubahdependensi/lockfile. Tsc/buildexit0,lintfileubah0,164unit,31HTTPWorker,
5lebarWorker tanpaoverflow,menu/fokus dananonimadmin→login/konsol0error lulus.
Menulazy pertama belum selesai pada batas alat awal, setelah state/DOM diperiksa
berhasil buka/tutup; tidak disembunyikan sebagai kelulusan instan.133→122filebundle,
4nilaiprivat0temuan. Proses/tabsQA lokal ditutupsebelumbenchmark. Q07 tetapberjalan.
Rujukan: https://vite.dev/guide/build dan https://rolldown.rs/in-depth/manual-code-splitting.

### Kurangi blur awal — 2026-11-08 20:17 WIB

ce803c0 deploysukses20:05:15WIB,31HTTP perorigin lulus. LCP8,050/4,604/4,267detik,
median4,604;0warning,kategorilain100,CLS0,TBT0/0/8ms. Hint lebihsedikit tidak
membuktikan lebihcepat;transferJS184–188KB,diatas kandidatd77±172KB. Konfigurasi
pengelompokan tambahan dicabut kembali; pemisahanpublik/CMS d77 tetap.

Kandidat render kini hanyaHero/Navbar: glow emas radial menggantikanblur64px;
badge/tombolhero tidak memblur ulangfoto. Header awal memakai latar solid yang
sama; kaca12px sesudahscroll tetapada pada keadaan scrolled yang sudahada.
Navigasibawahsolid memakai tokenbackground. Foto/maskpudar/warna/batik/struktur
konten/ukuran dansemua interaksi tetap; difusi glow/translusensi awal disederhanakan.
Ini perubahan aplikasi biasa untuk semua pengunjung, bukanpendeteksicrawler/timer.
Tsc/buildexit0,lintfileubah0;164unit terakhir tetaplulus (tidakmengubahlogikadata).
31HTTPWorker/hashfoto/no-store lulus,133bundle/4nilaiprivat0temuan. Dev+Worker
masing-masing5lebar tanpaoverflow/1h1;headernone diatas danblur12px setelahEnd,
menubuka/tutup/fokus/konsol0 lulus. Screenshot desktop diperiksa: arahE/foto sama.
APIPageSpeed pembanding429RESOURCE_EXHAUSTED, tidak ada bukti remote yang diklaim.
Hasilproduksi masihmenunggu; Q07 belumditutup. Server/tabQA sendiri sudahditutup.

### Gabungkan dua jalur perbaikan — 2026-11-08 20:35 WIB

240fbe3 suksesdeploy20:18:02WIB,31HTTP peroriginlulus. LCP9,904/3,635/3,904detik,
median3,904,0warning. CLS0,000128–0,000147,TBT0–54ms,kategorilain100. Trace kini
renderdelayfoto **16,109/47,780/28,483ms**, sebelumnya1,7–2,2detik. TTFB0,798–2,569
detik danunduhfoto1,423–2,290detik menjadi dominan. Ini bukti kemajuan render,
bukan kelulusan Q07.

Karena jedarender sudah turun, kandidat gabungan memasang lagi helper inline cache
≤128KiB beserta4tesnya dari082a26d, sekarang denganlapisanrender lebih ringan.
Batas/izin/fallback/freshpublicsettings tetap sama, tidakmenambahfetchorigin pada
jalurHTML. Tsc/buildexit0,lintfileubah0,168unitlulus;133bundle/4nilaiprivat0temuan.
32HTTPWorkerdenganpersistcachebaru lulus(cachekosongfallback→gatewayMISS→inline,
SHA256identik).5lebar dev+Worker1h1/tanpaoverflow;Workermemuatinline1200px danheader
none. Menu/fokus danSPAgaleri→beranda/konsol0error lulus. Kontrolbrowsersemptimeout
berulang;Hanifbukapaneulang,aksesdipulihkan tanpa menutupapp/sesipemilik. Kompilasi
devawalmelewatibatasnavigasialat,hasilDOMdiperiksasudahnormal. Hasilproduksi gabungan
belumdiluluskan; semua percobaan sebelumnya tetap disimpan. Tidakmulaipaket32.
