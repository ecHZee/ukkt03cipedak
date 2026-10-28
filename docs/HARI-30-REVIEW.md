# Hari 30 baru — Kapasitas dan batas operasional

28 Oktober 2026 — Codex (GPT 6.1 Sol). Audit dashboard terautentikasi dan API read-only
akun organisasi, sumber kode dan helper backup. Tidak mengunggah atau menghapus media,
menulis data aplikasi, mengubah paket/cap/sharing/key atau memulai launching.

## Kesimpulan

Ruang simpan saat ini longgar. **Kapasitas bucket B2 10 GB bukan kapasitas end-to-end
yang telah diuji:** helper backup sekarang membatasi total sumber **256 MiB**, ZIP
**272 MiB**, dan **1.000 percobaan request per run**. Batas tersebut dapat tercapai
jauh sebelum kuota penyedia. Batas file/jumlah dalam satu album adalah batas lain lagi.
Audit Hari30 selesai untuk inventaris, proyeksi dan rancangan uji; bukan uji beban sampai penuh.

## Pemakaian aktual dan batas akun

Angka byte berasal dari listing metadata/API; angka dashboard dapat dibulatkan atau tertunda.
MB pada hitungan desimal = 1.000.000 byte; MiB = 1.048.576 byte. Label MB/GB pada dashboard
dipertahankan apa adanya. Penyebut kuota desimal digunakan secara konservatif dalam contoh,
bukan klaim unit internal billing penyedia.

| Bagian | Pemakaian teramati | Batas/paket dan catatan |
| --- | --- | --- |
| B2 `katar-rw03-media` | 22 versi upload / **2.713.394 byte**; 0 unfinished; 11 foto + 11 thumbnail | Bucket private, encryption enabled, lifecycle UI keep last version. Cap aktual akun: storage **10 GB**, download **1 GB/hari**, Class B/C masing-masing **2.500/hari**, biaya cap $0. |
| Supabase Storage | `media`: **8 objek / 792.282 byte**; kedua bucket PDF 0 objek | Organisasi Free, satu proyek; allowance Storage **1 GB**. Bucket `media` max50MiB, PDF publik/internal masing-masing max20MiB. Ini bukan limit efektif semua form aplikasi. |
| Database Supabase | Cluster databases **29.740.917 byte = 28,36 MiB**; dashboard28,36MB | Dashboard allowance **0,5 GB/proyek**. Database `postgres` sendiri14.464.691byte; template0+template1 menjelaskan selisih. Relasi publik+index1.744.896byte. Bukan ukuran file Storage. |
| Egress Supabase | Dashboard siklus30Sep–30Okt: uncached **0,042 GB**, cached **0,05 GB** | Free mencantumkan **5 GB uncached +5 GB cached**, dua allowance terpisah. View proyek; organisasi saat ini hanya satu proyek. |
| Cloudflare | Workers **Free**; account periode1–28Okt16,25k request; build60/3.000menit. Worker24jam60invocation,0error | Paket100.000request/hari dan10msCPU/request; observability200.000event/hari. Hanya binding ASSETS terlihat di Worker; tidak ada binding storage media persisten. Pages meneruskan ke Worker. Angka request bukan jumlah pengunjung unik. |
| Drive | API limit **5.497.558.138.880 byte**, usage49.459.639.047byte, sisa5.448.098.499.833byte | UI **46,06GB/5TB**, sisa4,96TB; kuota berbagi termasuk penggunaan selain website. Paket/masa langganan tidak diubah atau dijamin permanen. |
| Snapshot Drive website | **4 snapshot** berstatus verified, masing-masing3.525.181byte; total14.100.724byte | Folder owner organisasi saja. Hari30 membaca metadata, **tidak** mengunduh ulang/hash atau menjalankan backup baru. Bukti readback/restore nyata sebelumnya pada Hari28. |

Total objek website B2+Supabase: **30 objek / 3.505.676 byte**, identik dengan total audit
Hari29. PDF asli belum terisi; jangan menafsirkan angka kecil ini sebagai bukti produksi
bervolume besar sudah diuji. Angka Storage0GB pada dashboard adalah pembulatan, bukan bucket kosong.

B2 dashboard menampilkan cap/alert akun dengan alert75%/100%. Harga publik B2 saat ini
menyebut egress3×average storage dan transaksi gratis tertentu; **tidak meniadakan cap akun
yang benar-benar terlihat**. Tidak mengubah cap untuk menyamakan harga umum.

Supabase menampilkan log ingestion13,413GB sebagai metrik terpisah/upcoming, dengan catatan
UI billing mulai2027. Itu bukan13GB media atau database. MAU458 dapat mencakup akun QA yang
pernah login; bukan bukti458 pengurus/warga aktif. Review log/MAU/egress sebagai biaya/operasi
tersendiri pada tahap pengelolaan; audit ini tidak mengaktifkan billing.

## Batas form dan jalur data

| Alur | Batas yang dibaca dari sumber terkini |
| --- | --- |
| Galeri | Foto sumber≤20MiB, diproses WebP sisi terpanjang1920 dan thumbnail480; reservasi server foto≤20MiB, thumbnail≤2MiB. Video MP4/WebM/MOV≤200MiB. Antrean40file, album200media. |
| Foto situs/logo | Sumber≤10MiB; hasil utama≤2MiB; aturan dimensi/logo tetap berlaku. |
| PDF arsip | ≤20MiB, MIME application/pdf, dengan pembatasan akses sesuai peran. |
| Bucket `media` | Provider limit50MiB per objek, tidak menggantikan validasi form yang lebih kecil. Konstanta video50MiB helper lama bukan limit galeri B2 yang sekarang200MiB. |

`unggahMediaAlbum` mengirim metadata melalui server function, kemudian PUT langsung ke URL
B2 bertanda tangan; isi video200MiB tidak diproksikan sebagai body Worker. Batas umum body
Cloudflare Free100MB tidak boleh dipakai untuk menyimpulkan alur video tersebut pasti gagal.
Gateway baca tetap memeriksa izin/status konten sebelum cache, mendukung HEAD/Range.

Rujukan kode: `src/lib/galeri-admin.ts`, `src/services/storage.ts`,
`src/services/b2.server.ts`, `src/services/media-gateway.server.ts`,
`src/lib/hari20-admin.ts`, metadata bucket aktual. Tidak mengklaim foto galeri selalu punya
hard limit2MiB: angka itu berlaku pada thumb/hasil foto situs di jalur berbeda.

## Batas backup yang menjadi pekerjaan lanjutan

Sumber: repo backup PRIVATE, `tools/backup_berkas.py` dan workflow `backup-berkas.yml`:

- Total sumber maksimum **268.435.456byte (256MiB)** per snapshot, ZIP maksimum272MiB.
- Maksimum10.000objek saat validasi inventory, tetapi **1.000 request seluruh run**, termasuk
  auth, listing dua kali, download tiap objek, Drive, retensi dan retry. Jadi10.000objek
  bukan kapasitas operasional yang dapat dijanjikan dengan budget request sekarang.
- Minimal satu GET diperlukan untuk tiap objek; **lebih dari1.000objek pasti** melampaui
  budget bahkan sebelum metadata/retensi. Jumlah aman sebenarnya lebih kecil dan bergantung
  struktur folder/retry, sehingga tidak dijanjikan sebagai angka foto tetap.
- Koleksi dan ZIP/readback memakai buffer memori; timeout job25menit. Limit source bukan
  sekadar kuota Drive. Total byte sekarang sekitar1,31% dari limit256MiB.
- Sebelum koleksi, helper memeriksa ruang Drive setidaknya source+8MiB. Itu preflight ruang
  saat run, bukan proyeksi pertumbuhan jangka panjang. Sumber dibandingkan ulang sebelum upload.
- Retensi4snapshot aktif dijalankan hanya setelah readback/hash lulus. Snapshot lebih lama
  masuk Sampah; **Sampah Drive tetap memakai storage sampai dihapus**, normalnya30hari.
  Perencanaan konservatif gunakan4aktif+1kandidat+hingga5snapshot mingguan di Sampah
  (**10× ukuran snapshot**) ditambah margin ZIP/manifest, kandidat gagal dan berkas lain.

**Tindak lanjut:** sebelum volume tumbuh, desain backup bersegmen/streaming atau snapshot
incremental beserta manifest, verifikasi dan pemulihan; tinjau request/time/memory/egress.
Ini usulan implementasi berikutnya, belum dipasang. Tidak menaikkan konstanta secara buta
atau mengubah key pada Hari30. Bila backup gagal, snapshot baik lama tetap penting tetapi
konten terbaru belum otomatis terlindungi; perlu PIC memeriksa failed run.

## Proyeksi 3/6/12 bulan

Sampel nyata **11foto+thumb**, total2.713.394byte, rata-rata **246.672byte/pasangan**.
Sampel kecil ini bukan jaminan ukuran semua foto. Asumsi: tidak ada penghapusan, tiap PDF1MiB,
video per skenario, foto diproses seperti sampel. Tabel mencakup total sumber B2+Supabase;
metadata SQL, ZIP overhead dan trafik tidak dimasukkan ke angka sumber berikut.

| Skenario tambahan per bulan | 3 bulan | 6 bulan | 12 bulan | Dampak pada helper sekarang |
| --- | --- | --- | --- | --- |
| Hemat:40foto +2PDF, tanpa video | 37,57MiB /276objek | 71,80MiB /522objek | 140,26MiB /1.014objek | Ukuran masih<256MiB, tetapi request pasti tidak cukup pada12bulan; dapat lebih awal karena overhead/retry. |
| Aktif:100foto +4PDF +1video20MiB | 145,92MiB /645objek | 288,49MiB /1.260objek | 573,64MiB /2.490objek | Pada6bulan melewati ukuran dan request; request dapat menjadi pembatas lebih dulu. |
| Video besar:40foto +2PDF +1video200MiB | 637,57MiB /279objek | 1.271,80MiB /528objek | 2.540,26MiB /1.026objek | Limit source256MiB sudah terlewati sekitar bulan2; bukan kekurangan ruang Drive/B2. |

Pada12bulan, skenario hemat B2≈121,12MB/Supabase≈25,96MB; aktif B2≈550,38MB/
Supabase≈51,12MB; video besar B2≈2,64GB/Supabase≈25,96MB. Semua masih jauh di bawah
kapasitas penyedia, sementara **helper backup sudah tidak mencukupi** pada proyeksi tersebut.
Envelope10snapshot sekitar1,37/5,60/24,81GiB pada12bulan adalah kebutuhan hipotetis bila
backup sudah didesain ulang, belum snapshot yang dapat dibuat helper saat ini.

Untuk DB, belum ada seri waktu produksi yang cukup untuk mengukur pertumbuhan. Ilustrasi
tambahan2MiB/bulan dari28,36MiB menghasilkan34,36/40,36/52,36MiB pada3/6/12bulan.
Ini asumsi perencanaan, bukan tren terukur. Ukur ulang ukuran cluster/audit log dan pertumbuhan
konten setelah dipakai tim; jangan memakai `reltuples` sebagai hitungan akun/record aktual.

## Trafik dapat membatasi lebih dahulu

Skenario dingin tanpa cache:50pasangan foto mengikuti sampel≈12,33MB. Cap download B2
1GB desimal/hari menampung sekitar **81 pembacaan album penuh** seperti itu, atau **4 unduhan
video200MiB penuh**, sebelum memperhitungkan backup/bacaan lain. Ini ilustrasi transfer origin,
bukan jatah81pengunjung atau kapasitas yang telah diuji. Lazy loading, thumbnail, Range dan
cache mengubah pola nyata; cache dapat dingin/terbuang dan tidak dijanjikan selalu HIT.

Di sisi request, satu halaman dapat memicu beberapa request media/SSR. Limit100krequest/hari
bukan100kpengunjung; CPU10ms dan subrequest juga perlu diperiksa pada QA performa. Tidak
menentukan kapasitas pengguna bersamaan dari ukuran GB atau statistik invocations kecil.

## Pemeriksaan yang benar-benar dijalankan

| Pemeriksaan | Hasil dan batas bukti |
| --- | --- |
| Listing read-only Supabase/B2 | 3bucket,30objek/3.505.676byte,22versiB2 upload,0unfinished; tidak download/upload sumber untuk uji kapasitas. |
| SQL management `read_only:true` | Ukuran current/all databases dan relasi; selisih dashboard dijelaskan oleh template databases. Tidak menulis tabel/migrasi. |
| Drive existing OAuth `drive.file` | 4request metadata termasuk refresh token yang sudah ada, owner/kuota/4snapshot; tidak scope baru, upload atau retensi. |
| Regresi fixture aplikasi | **38/38**: validasi ukuran/format, reservasi, akses/cache/gateway, PDF/pengurus/pengaturan. Tidak login atau menulis akun produksi. |
| Unit helper backup yang sudah ada | **30/30**, fixture offline. |
| Boundary kapasitas tambahan | **5/5**: exact256MiB diterima, +1byte ditolak;10kobjek/+1; request1001 berhenti sebelum network; Drive sisa tepat/belum cukup. Byte besar disimulasikan metadata, tidak dialokasikan/diunggah. |

Lulus fixture tidak membuktikan B2/Supabase benar-benar penuh, throughput/konkurensi atau
pemulihan layanan penuh. Tidak menjalankan ulang build/DB write suite/browser layout untuk
perubahan dokumentasi/audit ini. Tidak membuat akun, file latihan cloud, migrasi atau fitur baru.

## Rancangan uji nyata terbatas — belum dijalankan

1. Tetapkan lingkungan terisolasi atau fixture produksi yang disetujui, PIC, run ID, data
   sintetik tanpa data pribadi dan pembanding objek asli. Tidak memakai akun milik peserta.
2. Plafon awal: total fixture≤20MiB,≤15objek,≤100request layanan eksternal untuk seluruh
   run termasuk cleanup, durasi≤15menit, biayaRp0, satu rangkaian tulis pada satu waktu.
   Sisihkan budget cleanup; berhenti lebih awal bila margin tidak cukup.
3. Mulai1file→batch kecil, cek simpan/preview, jeda/retry dan permission. Uji batas20/200MiB
   serta kuota mendekati penuh memakai metadata/mock/lokal dahulu; plafon20MiB ini berarti
   tidak mengunggah video200MiB sungguhan pada run awal.
4. Stop pada429/kuota/biaya/errorberulang, source berubah, file latihan tak sengaja terbit,
   atau batas byte/request/waktu hampir habis. Jangan retry tak terbatas.
5. Hapus hanya fixture sendiri dalam scope yang diizinkan, baca ulang0residu, bandingkan data
   asli dan catat delta pemakaian. Cadangan lama/versi asli tidak dipakai sebagai fixture.

Untuk uji stress/volume lebih besar perlu rencana terpisah sesuai aturan penyedia. Tidak
ada kewajiban mengisi beberapa GB hanya untuk membuktikan paket mempunyai kuota tertentu.

## SOP awal dan tindak lanjut

- Usulan ambang70/85/95% adalah **SOP manual, belum fitur otomatis**. Terapkan pada masing-
  masing batas, termasuk budget backup256MiB:179,2/217,6/243,2MiB; jangan hanya B2 10GB.
- Pada70% evaluasi laju pertumbuhan dan desain backup;85% tetapkan tindakan/PIC sebelum
  unggahan besar;95% tunda unggahan besar secara operasional sampai cadangan aman. Ini belum
  menambahkan penolakan upload otomatis ke aplikasi.
- Tinjau egress/ClassB/C per hari dan quota bulanan sesuai siklus; traffic/backup/retry
  berbagi cap. Cek status run mingguan serta ruang kandidat/Sampah Drive.
- Hari31 tetap fokus Q07 sesuai rencana; temuan backup menjadi prioritas pada paket
  keamanan/backup sebelum volume media diperluas. Tidak memulai Hari31/32 otomatis.

Rincian privat, query, hasil listing, model proyeksi dan log tes berada di
`katar_profile/_audit-kapasitas/2026-10-28/`, di luar repo publik. Helper backup/repo privat
tidak diubah (audit hanya membaca sumber dan metadata). File lokal tambahan audit berada
di folder bukti; tidak menyimpan token baru atau membuat helper latar.

## Sumber resmi

- [Supabase billing/quota](https://supabase.com/docs/guides/platform/billing-on-supabase),
  [egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress),
  [database vs disk](https://supabase.com/docs/guides/platform/database-size).
- [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/).
- [Backblaze pricing](https://www.backblaze.com/cloud-storage/pricing),
  [caps and alerts](https://www.backblaze.com/docs/en/cloud-storage-data-caps-and-alerts).
- [Google Drive: Sampah memakai storage dan30hari](https://support.google.com/drive/answer/14933051?hl=en).

Sumber dan dashboard diperiksa28Okt2026. Batas/kuota dapat berubah; verifikasi ulang sebelum
pengujian volume atau keputusan biaya. Launching, UAT peserta dan checkpoint tetap belum diluluskan.


## Penutupan deployment dan cleanup

Commit dokumentasi3527d94 memicu build Cloudflare yang gagal pada inisialisasi environment
sebelum clone dengan pesan internal error. Retry **commit yang sama**, tanpa perubahan kode,
berhasil build/deploy pada28Okt09:37:34WIB. TigaHTTP saat insiden dan22/22HTTP setelah retry
kedua origin200/HTML/no-store/gateway lulus. Tidak menafsirkan kegagalan infrastruktur sebagai
bug aplikasi. Bukti retry/screenshot privat pada folder audit; commit penutup hanya dokumentasi.
Tab dashboard pengguna dipulihkan ke URL semula, tabGmail/sesi pemilik tidak disentuh.
Tidak ada helper latar/devserver/fixture cloud baru. Repo backup privat bersih/tidak diubah.
Status Hari30: **selesai untuk audit, proyeksi dan protokol uji**; perbaikan batas backup,
Q07, UAT dan launching tetap pekerjaan berikutnya, bukan klaim kapasitas produksi sudah lulus.
