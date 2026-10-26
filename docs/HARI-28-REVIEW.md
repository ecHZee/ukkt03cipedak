# Hari 28 — Cadangan berkas, performa, dan audit penyimpanan

26 Oktober 2026. Status: **berjalan**. Hanif menyetujui implementasi Hari28 dan audit
Cloudflare/B2, lalu menyediakan sesi Supabase. Audit awal tidak mengubah layanan/biaya.

## Hasil audit penyimpanan

| Tempat | Hasil yang dibuktikan |
| --- | --- |
| Cloudflare Worker katar-rw03 | Tidak ada connected bindings penyimpanan; production branch revisi; runtime secret terenkripsi; build hanya variabel publik |
| Pages ukkt03cipedak | Direct Upload, binding KATAR_APP ke katar-rw03, revisi, fail closed, tanpa secret aplikasi |
| R2 | Masih halaman penambahan subscription; tidak diaktifkan |
| B2 katar-rw03-media | Privat, enkripsi aktif,22 versi upload/2.713.394byte;0 unfinished files; tidak ada hidden versions pada inventaris |
| Supabase media | Publik,8 objek/792.282byte; batas per berkas50MiB |
| Supabase dokumen-publik | Publik,0 objek; batas20MiB/PDF. Bucket lama tetap ada; CMS kini menggunakan bucket privat |
| Supabase dokumen-internal | Privat,0 objek; batas20MiB/PDF |

Total berkas aktif30 objek/3.505.676byte. Dashboard Supabase menampilkan DB30/500MB,
egress0,04/5GB dan file storage0,00/1GB karena pembulatan. Angka MAU420 mencakup QA,
bukan bukti420 warga. Hanya satu proyek Supabase tersedia, sehingga belum ada target
restore Supabase terisolasi. PostgreSQL sumber17.11; inventaris16policy/7triggerAuth-Storage,
3bucket/20migrasi/5extension dibaca dengan transaksi read-only.

B2 cap akun masih$0:10GB simpan,1GB unduh/hari,2.500 transaksiClassB/C per hari;
notifikasi75/100% aktif. Batas nyata akun diutamakan, bukan asumsi harga umum.
Lifecycle: berkas disembunyikan dihapus setelah1hari, tanpa aturan menyembunyikan upload aktif;
versi yang disembunyikan masih memakai ruang sampai terhapus. CORS hanya dua origin produksi
dan localhost5173; operasiS3GET/HEAD/PUT,headercontent-type/range,umur300detik.
Tidak ada wildcardorigin. CacheAPIWorker bersifat sementara, bukan tempat cadangan permanen.

**Temuan akses:** key aplikasi web dibatasi bucket tetapi masih mengizinkan pengaturan
bucket/enkripsi/lifecycle/logging/notifikasi/replikasi. Rekomendasi rotasi bertahap ke izin
objek yang diperlukan, sesudah key pengganti diuji; tidak mencabut key lama saat web aktif.
Cadangan membutuhkan key lain khusus ReadOnly. Tidak menaikkan cap, memasang R2, atau
menghapus objek yang belum dikenali. EventNotifications belum diperiksa; cap$0 bukan
jaminan semua jenis layanan/operasi tidak dapat ditagih.

## Implementasi cadangan privat

Kode berada di repo **privat** katar-rw03-backup, bukan repo web ini:

- tools/backup_berkas.py: listing berhalaman/rekursif, ZIPmanifestSHA256, unduh ulang,
  verifikasi semua objek, baru retensi empat snapshot berhasil aktif.
- tools/siapkan_akses.py: helper OAuthDesktopPKCE/state, scopeDrive.file, secret GitHub
  terenkripsi publickey, validasi akun/folder privat dan keyB2ReadOnly.
- tools/metadata.sql dan backup.yml: katalog tambahan Auth/Storage dan riwayat migrasi.
- backup-berkas.yml: dipicu setelah workflowbackup-database berhasil; concurrency tunggal.
- Panduan akses/pemulihan dan27tesunit, termasuk korupsi,Drivepenuh,pathtraversal,pagination,
  keyterlalu luas, perubahan sumber dan kegagalan sebelum retensi.

Anggaran per run256MiB/10.000objek/1.000request. Retensi memindahkan snapshot lama ke
SampahDrive, tidak menghapus permanen; Sampah tetap perlu diperhitungkan dalam kuota.
Folder/berkas asing, snapshotpending dan sumber produksi tidak dihapus. ZIP tidak memuat
URLbertanda tangan, headerAuth atau secret. Cadangan objek bukan transaksi atomik dengan SQL.

Uji sumber nyata:30objek/3.505.676byte dibaca tanpa sourcewrite,ZIP3.524.083byte diperiksa
ulang seluruh hash,40request. Ini menguji kolektor/arsip lokal, **belum menguji runDriveotomatis**.
GoogleCloud meminta persetujuan Terms dari pemilik; aksesOAuth dan keyB2cadangan perlu
disiapkan pemilik. Tidak menganggap login dashboard sama dengan akses otomasi.

## Performa dan batas bukti

Baseline baru, tiga runLighthouse13.5/Chrome155, mobile412×823,DPR1,75,slow4Gsimulasi,
RTT150ms/1.638,4Kbps/CPU4×,coldbrowser:
LCP8,544/7,153/6,687detik,median7,153detik. Skor61/65/63.
ElemenLCP fotohero; sudahinitialHTML/eager/fetchpriorityhigh, sehingga tidak menambahpreload.

Kartu album kecil beranda dan indeks galeri sekarang memakai thumbnail yang sudah tersedia,
dengan fallbackfotoasli lalu placeholder. Fotohero/detail/lightbox tetap memakai berkas sesuai
peruntukannya. URLSupabase/video/external/staging/query tidak diubah menjadi thumbnail.
Tambahan pengecekan gambar gagal sebelum hidrasi agar eventerrorSSR tidak terlewat.
Tidak mengubah DTO/schema/RLS/dependensi atau cacheprivasi.

Empat sampul pada baseline berjumlah846.428byte; thumbnail-nya95.990byte: turun750.438byte
(88,7%). Ini penghematan berkas kartu, bukan klaim penurunan LCP dengan persentase yang sama.

136tesunit,tsc0,lint0error/7warning. Build awal lulus; build ulang sempatEBUSY karena preview
masih mengunci.output/public: preview dihentikan sebelum build ulang. QAakhir/produksi dan
pengukuran sesudah deploy dicatat pada penutupan di bawah. Runtime lokal sesudah build ulang
sempat503 karena berkas.dev.vars sementara terhapus oleh build; dipasang ulang sebelum uji final.
Enam lebar360/375/768/1024/1235/1440 pada beranda dan galeri tidak overflow. Empat thumbnail
galeri termuat. Pemblokiran thumbnail menghasilkan empat foto asli termuat; pemblokiran kedua
sumber menghasilkan empat placeholder. Lightbox fotoasli termuat,Next1→2/3,Escape memulihkan
fokus tombol pembuka. Gangguan simulasi hanya pada tabQA dan dibersihkan.
Q07 **belum dinyatakan lulus**.

## Yang tetap terbuka

Pemicu otomatis nyata/jadwal mingguan dan retensi diDrive belum terbukti sebelum penyiapan
pemilik selesai. Pemulihan Auth/Storage/Vault lengkap masih perlu lingkungan Supabaseuji;
drillPostgreSQL14dan30hashobjek sebelumnya bukan bukti pemulihan Supabase penuh.
Ujianggota,HPfisik/WhatsAppdancheckpointmain menunggu; tidak diganti klaimQAteknis.

Bukti rinci privat: katar_profile/_qa-hari28/2026-10-26/,tanpa menyalin IDfolder/pathfoto/secret
ke Gitpublik. Rujukan [scopeDrive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth),
[OAuth](https://developers.google.com/identity/protocols/oauth2),
[capB2](https://www.backblaze.com/docs/cloud-storage-data-caps-and-alerts).
