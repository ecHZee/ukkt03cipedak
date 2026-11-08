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

### Bukti alat dan cache Arsip — 2026-11-08 21:05 WIB

73a8e24 berhasildeploy20:36:04WIB,32HTTP peroriginlulus. LH13.5 normal saatRAM2,09GiB:
LCP4,939/6,086/4,368median4,939;RAMlega6,96GiB tanpaubahkode:4,548/4,472/1,725median
4,472. JadiRAMbukanpenjelasantunggal. Kontrol13.5 dengansemuaflagdefaultdipertahankan
kecualiRenderDocument keluar daridisablelist:3,599/2,162/3,833median3,599;run1timeout,
run2TBT1018ms. Itu diagnosis, bukan kelulusan atau pengganti hasil yang gagal.

Pencarian sumberprimer menemukan lighthouse#17148 danperbaikanchrome-launcher#372
(merged5Nov). Salinan13.5 terpasangmemang menonaktifkanRenderDocument. Instalalat
resmi **LH13.6.0/chrome-launcher1.2.3** terpisah diluarrepo/global denganignore-scripts,
Node24yangsudahada;installerNode22.14 sempatEBADENGINE tetapi runtimeyangdipakai
Node24memenuhisyarat>=22.19. Tidakubahpackage/bun.lock/toolglobal. Metode13.6normal
--headless --no-first-run,JSnormal/tanpablokaset. Screen/throttling/method dibandingkan
JSONdanidentik13.5:412×823,DPR1,75,CPU4×,simulasi4Gyangsama. Release13.6 juga
memperbaikipemodelanHTTP3/connectionless, sehingga angka bedaalat bukan perbandingan
kausalpengaruhkode. Semua hasil13.5tetapdisimpan.

**Baseline13.6 untukkode73a:** LCP1,940/2,299/2,084median2,084detik,CLS0,000128,
TBT78/130,5/45ms,0warning,a11y/SEO100. Ketigadi bawah2,5;belum menutupQ07 sebelum
versiakhir/halamanpembanding. Bestpracticeslaporan100 tetapiConsoleMessagesalatini
masihthreshold-1;duaauditpromptgeolokasi/notifikasi tidakdipakaisebagaibuktikeamanan
karena isuupstream17486, bukanmenambal/memodifikasihasilnya. TidakmengklaimCrUX/UAT.

Sumberaktualjuga membuktikanReactQuery hanya dipakaiArsip. Provider/QueryClientglobal
dipindah kePenyediaCacheArsip, dimuat bersama komponenArsip. Kueribersesi/keysidversi/
gcTime0/staleTime0/SSRpublik tetap;cachepermount/request. Tambah1tesReactSSRnyata:
duarender tidakberbaginilaicache.169unit,tsc/build0;lintawalterhenti1lineendingCRpada
skriptes,diformatfileitusaja,lintsasaran0danfullulanganmenyusul. ClosureJS129.605byte
gzipvs136ribuan,sekitarturun7KB,bukantransferproduksi.133bundle/4nilaiprivat0temuan,
32HTTPWorker,5lebarArsipdev+Worker/searchfilter/reset/SPAkeluar-masuk/konsol0lulus.
BelumdeploykandidatcacheArsip;tesproduksiakhirmenyusul.

Rujukanalat: https://github.com/GoogleChrome/lighthouse/issues/17148 ;
https://github.com/GoogleChrome/chrome-launcher/pull/372 ;
https://github.com/GoogleChrome/lighthouse/releases/tag/v13.6.0 ;
https://github.com/GoogleChrome/lighthouse/pull/17486 .

### Foto URL setelah alat diperbarui — 2026-11-08 21:22 WIB

ca931e8 deploysukses21:07:22WIB,32HTTPperoriginlulus. LH13.6kodecacheArsip+inline:
LCP2,468/2,986/2,747median2,747;CLS0,TBT0/60/66ms,0warning,kategorilain100dengan
batasduaauditpromptyangsudahdicatat. TransferJS181–182KBvs73a188–189KB,rawpaint
0,736–0,927slebihawal,dibanding73a1,491–2,420s,namunsimulasibelumtarget. Tidak
menganggapukuranJSlebihkecilotomatisLCPlebihbaik.

Uji kandidatURLfoto sekarang memakai13.6normal:hapusinlinehelper/fieldDTO/4tesnya,
pertahankanrender-ringandanproviderArsip. HTMLWorkerlokal188.254bytevsinline±610KB;
React19menghasilkanpreloadfotoas=imagefetchpriority=highdiawalhead,URIgambarnormal
melaluigatewaydenganpemeriksaanaktif/no-store. FotoSHA256 tetapidentik.165unitlulus
(164lama+1isolasiSSR);tesawalgagal1karenaexpectedDTOmasihmenyebutfieldyangdihapus,
mock/expecteddibersihkanlaluulang165/165. Tsc/build0,lintfileubah0,133bundle/4nilaiprivat
0temuan,31HTTPWorker,5lebarWorker1h1/tanpaoverflow/konsol0. Pengamatangambar375px
segera setelahreloadmasihmemuat(naturalWidth0),bukanerror;geometri/sourcebenar,
ulangreadinessdiproduksiakhir. SatuperintahdiagnosisPowerShellgagalparsingkutip
sebelumdijalankan,digantihere-stringstdin. Semua hasil/disiplinizin tetap;target
Q07belumditutupversiakhir. Server/tabQA ditutupsebelumbenchmark.

### Analitik saat idle — 2026-11-08 21:34 WIB

967efe0 deploysukses21:22:17WIB,31HTTP peroriginlulus. LH13.6fotoURL2,287/3,002/2,755
median2,755detik;CLS0,TBT35,5/73,5/44,5ms,warning0. HTML188.324byte/preloadfotoHigh
ada. Tracebeaconmulai1806/1328/820ms,sementaraLCPnyata1585/1344/883ms: sebagian
beaconberdekatanpaintfoto. Bukanbuktimenuduhseluruhdelaykebeacon;ujiterarahberikut.

WebAnalytics menjadwalkanpemasanganbeaconsaatrequestIdleCallbackbrowsertersedia,
prioritasfetchlow;browserAPIabsenmemakaijalursebelumnya. Tidakmenambah timer/deteksi
alat/menonaktifkananalitik. Pengecekanhost/path/id diulangtepatsebelumpemasangan,
danjobidle dibatalkansaatrouteberubah/unmount. Muattambahaninibesteffortketikaidle,
bukanjanjikelengkapantelemetrisetiapkunjunganpendek. LoginreloadDocumenttetap.
3tesbaru:menungguidle/hanyasekali,routeprivatketikacallback/cancel,fallbacktanpaAPI
sertaLogin.168unitlulus;helperVMditambahcontextfixtureterisolasi,tanpajaringan.
Tsc/buildexit0,lintfileubah0,133bundle/4nilaiprivat0temuan. Layout/serverdata tidak
berubah;verifikasianalitikhostasli/network/31HTTPdanperforma sesudahdeploymenyusul.
Rujukan: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback ;
https://developer.chrome.com/docs/lighthouse/performance/third-party-summary .
Q07tetapbelumlulus;Hari32belumdimulai.

### Prioritas ulang dengan alat13.6 — 2026-11-08 21:42 WIB

b91fd9d suksesdeploy21:36:16WIB,31HTTP peroriginlulus. Analitikhostpublikbenar-benar
ada1script/fetchlow/foto1200/konsol0,namunLCP13.6 2,797/3,300/2,917median2,917,
CLS0–0,000128,TBT0–30ms,warning0:tidakmembantuQ07. Penjadwalanidle/3tes khusus
(dicerminkandenganVMcontext)dicabut,mengembalikanWebAnalytics asli/165tesdasar.

UjiprioritasJS18:49dengan13.5belumkonklusifuntukalat13.6normalyangmengoreksijalur
RenderDocument/modeljaringan. PasangkembaliaturPrioritasBerandadari7af16fc:
HTMLRewriterstreaminghanyaGETberanda200HTML,fetchprioritylowmodulepreload/module,
fotoHigh/CSSinline tetap. Tidakmenundaberdasarkanwaktu/memblokirURL/script atau
mengubahprofilLighthouse. Semuabody/headercache/nonce/statuslain tetap;devtanpaAPI
mengembalikanresponsasli. Tambahkembali2tesbatasbersama1SSRcacheArsip:167/167lulus.
Tsc/build0,lint0,133bundle/4nilaiprivat0temuan.31HTTPWorker/fotohash/no-store lulus;
DOM29hintlowdari32(3ditambahdinamissaatnavigasi/hidrasi),fotoHigh1200. Menubuka/tutup/
fokus/konsol0/375×740tanpaoverflow/tinggi5,635layar lulus. Readinessgambar375yang
sempatbelumsiappadapengamatansebelumnya kiniterbukti1200. Layouttidakdiubah.
Server/tabQAditutupsebelumukurproduksi. Q07belumlulus;tetapHari31.

### Pembanding dan sampul Galeri — 2026-11-08 21:55 WIB

bcb60d2 deploysukses21:43:04WIB,31HTTP peroriginlulus. Home13.6LCP2,360/2,226/2,552,
median2,360detik/rentang0,326s;CLS0,TBT0–49,warning0. Targetmedianberandaterpenuhi;
run3masih52msdiatas2,5,tidakdisembunyikan. Baseline967metodesama median2,755;
selisihdua batch14,3%lebih rendah,bukanjanjipenggunaatauatribusi100%kausal.
Pembanding:Pengurus1,173/1,924/4,967median1,924;Arsip1,866/1,341/4,114median1,866;
Galeri2,356/2,862/5,183median2,862gagal. DesktopHome1run0,560detik,warning0/kategori100
denganbatasduaauditprompttetap. Outlierrep tetapdisimpan;belumklaimstabilsemua.

TraceGalerimenunjuksampulpertamaloadinglazy/tanpahigh;run3menundamulaiunduh4,035s.
Kandidatbaru galeri.index.tsx:firstfilteredcovereager/high,selanjutnyalazy/low;
ReactSSRmempreloadURLthumbyangsama. Filter/albums/URLbyte/hakakses tidakberubah.
PageHerobersamajuga menggunakan glowradialtanpablur64px danbadge tanpa backdrop,
sepertiHeroHome;biru/batik/font/ukuran/tatakon ten tetap,translusensiglowdiringankan.
Tsc/build0,lintfileubah0,167unitlulus,133bundle/4nilaiprivat0temuan.31HTTPWorker,
Galeridev+Workermasing-masing5lebar1h1/tanpaoverflow/konsol0;filter4→1→4 dan
prioritasfirstcover/preloadsetelahfilterbenar. Server/tabQAditutupsebelumbenchmark.
PerluulangGalerisertaPengurus/Arsipkarenabannerbersamaberubah;HomekodeUI tetap.
Q07belumditutupsecara keseluruhan;Hari32belumdimulai.


### Uji pembanding dan gabungan cache/prioritas — 2026-11-08 22:29 WIB

1cdcbd4 deploy sukses 22:01:07 WIB;31 HTTP per origin lulus. Lighthouse13.6,
tiga run setiap halaman: Galeri1,950/1,623/1,855 (median1,855),Pengurus
1,384/1,441/1,263 (median1,384),Arsip1,137/1,192/1,125 (median1,137).
Tidak ada warning; a11y/SEO100. CLS maksimal0,017859. Beranda pada kode yang
sama3,274/3,400/3,355 (median3,355),gagal. RAMkosong2,33GiB dan permainan
berjalan; setelah Hanif menutupnya, RAM5,61GiB, kontrolkodeidentik2,911/3,076/
3,928 median3,076 tetapgagal. Beban laptop bukan penjelasan tunggal. Semua
run disimpan,tidak dipilih batch tercepat. Trace foto render-delay19–23ms;
waktu respons/unduh dan beban simulasi masih dominan. Lima lebar produksi
home,menu lazy buka/tutup/fokus0errorlulus sebelum kontrol. Catatan geometri:
clientWidth desktop15px lebih kecil dari innerWidth akibat scrollbar;
scrollWidth sama clientWidth,bukan overflow.

Kandidat gabungan: helperfotoUntukHtml dari iterasi sebelumnya dipakai lagi
bersama prioritasJSbcb,render-ringandanproviderArsip. Hanya GETberanda dan
sesudah pengaturan publik dibaca segar pada request yang sama; byte cache
≤128KiB,validasiMIME/panjang/headerWebP,kunci cache tunggal; cache dingin/error/
besar tetap URLgateway. Tidak fetchorigin tambahan di jalurHTML,tidak mengubah
foto/desain/izin/no-store. HTML inline lebih besar; bukan janji hasil sebelum
benchmark. 171/171 unit,tsc/build0,full lint0error7warningbawaan,133file/4nilai
privat0temuan.32HTTPWorker lokal: cachebaruMISS→inline danSHA256identik;
lima lebar tanpaoverflow,1h1,foto1200/29hintlow;menu/fokus/konsol0,tinggiHP
375×740=5,635layar. Scriptpemulihan fixture pertama berhenti karena penanda
lama tidak ada;2tesmockloadergagal,lalu fixture/injeksi dikoreksi dan suite
171/171 diulang. Tidak ada DBwrite/migrasi/reset akun dalam iterasi ini.
Server/tabQA ditutup sebelumukur. Q07tetapbelumlulus;Hari32belumdimulai.


### Prioritas font isi — 2026-11-08 22:35 WIB

ccf0dac deploy sukses22:29:57 WIB;32HTTP per origin lulus. Gabungan inline+prioritas
13.6 beranda:2,630/2,221/2,874 median2,630detik;CLS0,TBT8–99,5ms,warning0.
Q07belumtercapai. Trace run1:HTML140.827byte danfontInter48.671byte/Jakarta27.712byte;
foto tetapidentik,render observasi1,342s (bukan nilaiLCPsimulasi).
Prioritas preload font isi Inter diturunkan menjadi low; font judul Jakarta tetap,
font-display swap/berkas/font/ukuran/desain tidak berubah. Efektifitas hint belum
diasumsikan; akan diperiksa pada network produksi.171unit,tsc/build0,lintfile0,
133file/4nilaiprivat0temuan;32HTTPWorker lokal/no-store/hashidentik danatributfont
lowbenar. Banner/layout/interaksi telah diverifikasi pada kandidatgabungan sebelumnya;
perubahan ini satu atribut standar preload. Server QA mati sebelum benchmark.
