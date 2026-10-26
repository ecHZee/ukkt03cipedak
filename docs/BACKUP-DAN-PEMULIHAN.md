# Cadangan dan pemulihan website Katar

Cadangan baru berguna bila isinya dapat dibaca kembali. Tiga bagian di bawah harus dipikirkan
bersama; memiliki dump database tidak berarti semua foto/PDF sudah ikut.

| Bagian                                     | Saat ini                                                      | Batasnya                                                           |
| ------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Kode aplikasi dan migrasi                  | Git repo aplikasi                                             | Repo publik, tidak boleh berisi rahasia atau foto orang            |
| Struktur/data database, termasuk data Auth | Workflow mingguan di repo backup privat                       | Jadwal mingguan dapat kehilangan perubahan setelah backup terakhir |
| Isi berkas Supabase Storage dan B2         | Otomatis sesudah SQL, Drive privat, empat snapshot aktif terverifikasi | Cron pertama setelah aktivasi belum diamati; bukan seluruh versi historis |

Arsip asli di Drive tetap dipertahankan. Foto asli tidak selalu identik dengan WebP/thumbnail
yang dipakai website; menyimpan sumber di Drive tidak menggantikan pemetaan path berkas web.

## Bukti 24 Oktober 2026

- Ping terjadwal terbaru yang diperiksa: 23 Oktober, berhasil.
- Workflow backup manual pada Hari26 berhasil; dump terbaru 24 Oktober 00:23 WIB,
  commit backup privat `2306a88`.
- 30 objek aktif yang terlihat melalui listing berhalaman disalin: 8 Supabase Storage dan
  22 B2; total 3.970.078 byte. Hash SHA256 salinan dan hasil pemulihan ke folder terpisah cocok.
  Tidak mengklaim menyimpan seluruh versi historis B2 atau cadangan untuk unggahan masa depan.
- Skema aplikasi dan data 14 tabel `public` dipulihkan di PostgreSQL17 lokal tanpa jaringan
  atau port publik. Seluruh isi COPY tabel cocok, 30 foreign key diperiksa, RLS 14 tabel aktif.
  Sebagai anonim: berita2, album4, kegiatan0 sesuai status terbit/draf.

Uji tersebut **bukan pemulihan layanan Supabase lengkap**. Tabel/fungsi pendukung Auth dan
Storage memakai penyangga lokal; ekstensi Vault tidak diuji. Login Auth, API Storage,
pengiriman email, secrets runtime dan konfigurasi hosting belum dipulihkan ke proyek baru.
Tidak ada restore ke database online atau perubahan akun asli.

## Saat benar-benar perlu memulihkan

1. Pastikan tujuan adalah lingkungan baru/terisolasi. Cocokkan versi PostgreSQL, ekstensi,
   waktu backup, commit aplikasi dan migrasi. Jangan mencoba langkah ini ke produksi aktif.
2. Siapkan struktur bawaan Supabase dan konfigurasi layanan secara terpisah. Ikuti
   [panduan resmi backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore).
   Role, skema dan data dipulihkan dengan kegagalan SQL menghentikan proses.
3. Sertakan riwayat migrasi serta perubahan khusus pada skema Auth/Storage. Dump standar
   saja bukan bukti bahwa kebijakan Storage dan trigger pada tabel Auth telah ikut.
   Bandingkan dengan 20 migrasi aplikasi dan katalog database sumber; jangan menonaktifkan
   RLS untuk membuat tes tampak berhasil.
4. Pulihkan objek ke path/bucket yang sesuai, dengan akses privat/publik yang sama.
   Cocokkan jumlah, ukuran dan hash dengan manifest. URL lama tidak otomatis menjadi URL baru.
5. Uji login akun sementara, izin tiap peran, draf tersembunyi, dokumen BPH, foto berizin,
   album dan konfigurasi Worker/Pages. Alamat/secret tujuan diisi pemilik akun, tanpa dicetak.
6. Baru rencanakan peralihan produksi setelah pemilik menyetujui hasilnya. Simpan jalur
   kembali dan jangan hapus sumber/cadangan sebelum pembacaan ulang berhasil.

Dump, manifest, objek dan log rinci Hari26 disimpan privat di folder saudara repo
`_qa-hari26/2026-10-24/`; jangan menyalinnya ke repo web publik.

## Pekerjaan yang masih perlu keputusan

Tujuan Drive privat, jadwal mingguan, empat snapshot berhasil dan batas biayaRp0 sudah
disetujui dan otomasi aktif sejak Hari28. Run manual dan pemicu otomatis SQL→objek berhasil;
empat snapshot privat, kegagalan terkendali dan restore30berkas lulus. Cron mingguan pertama
setelah aktivasi belum diamati. Jangan menaruh kredensial di repo. Restore Supabase lengkap
tetap perlu diuji di lingkungan yang memang menyediakan layanan tersebut.

## Tindak lanjut Hari27 — 26 Oktober 2026

Tujuan objek offsite disetujui Hanif: Drive Katar privat, mingguan, empat snapshot berhasil,
batas biayaRp0. [Rencana pemasangan dan kriteria lulus](RENCANA-BACKUP-BERKAS.md) tersedia;
folder dan cadangan manual sudah dibuat pada tindak lanjut di bawah; akses otomasi dan
workflow objek belum dipasang.

Metadata sumber tambahan disimpan privat:16policy Auth/Storage,7trigger non-internal
pada skema tersebut dan20riwayat migrasi. Ini inventaris pendukung restore, belum uji
login/API Storage/Vault pada Supabase baru. Manifest30objek Hari26 bersifat historis;
empat foto turunan beranda diganti Hari27, manifest dan hash baru tersimpan privat.

## Cadangan berkas di luar laptop — lanjutan26Oktober

Sesuai pilihan Drive privat dan arahan Hanif untuk melanjutkan pekerjaan tersisa, folder
khusus dibuat di Drive akun Katar. Metadata folder dan ZIP membuktikan akses hanya pemilik,
tanpa pembagian tautan. Kapasitas diperiksa cukup; tidak membeli/menaikkan paket atau cap.

Snapshot manual baru mencakup30objek aktif:8Supabase Storage dan22B2,3.505.676byte.
Listing Storage berhalaman/rekursif dan B2 berhalaman seluruh bucket, tidak hanya satu prefix.
ZIP3.523.419byte berisi objek,manifest SHA256 dan petunjuk; tidak menyertakan database/Auth,
.env atau runtime secret. Bukan seluruh versi historis objek atau seluruh arsip sumber di Drive.

ZIP diunduh ulang dari Drive, hash seluruh ZIP cocok, lalu dipulihkan ke folder lokal
terpisah:30/30ukuran dan SHA256 objek cocok. Empat foto hero terkini sudah tercakup;
manifestHari26 tetap historis. Bukti rinci/ID folder dan berkas disimpan privat di
`_qa-hero-tuning/2026-10-26/`, tidak di repo web publik.

Ini mengatasi ketiadaan salinan objek di luar laptop untuk snapshot ini, **belum backup
otomatis mingguan/retensi empat snapshot**. Akses workflow Drive dan proses terjadwal
belum dikonfigurasi. Restore Auth/API Storage/Vault Supabase lengkap tetap belum diuji.

## Hari28 — kode cadangan otomatis dan metadata tambahan

Kode sudah tersimpan di repo backup privat, dengan29tes keselamatan, kolektor30objek
nyata yang hash-nya lulus, scopeDrive.file dan B2keyReadOnly khusus. Backup SQL baru
berhasil menyimpan metadata tambahan Auth/Storage/migrasi. Pemicu otomatis objek masih
nonaktif sampai pemilik menyiapkan akses dan runDrive nyata lolos. Tidak menganggap
eventworkflow_run yang skipped sebagai keberhasilan backup. SampahDrive tetap memakai
kuota; retensi empat snapshot aktif memakai Sampah, bukan penghapusan permanen.

[Status/bukti Hari28](HARI-28-REVIEW.md) membedakan kode siap, uji lokal, backup SQL berhasil,
dan backup objek otomatis yang masih menunggu. Restore Supabase lengkap tetap perlu
proyek uji terisolasi; sumber saat ini PostgreSQL17.11, berbeda dari drillPostgreSQL14lama.


## Aktivasi akhir Hari28

Status terbaru mengesampingkan catatan tahap persiapan di atas: OAuth In production,
8secret tersimpan terenkripsi pada repo privat dan pemicu objek aktif. Run manual dan
SQL→objek otomatis sukses. Empat snapshot privat diverifikasi langsung dari Drive;
yang tertua masuk Sampah setelah snapshot kelima berhasil. Simulasi readback rusak
mempertahankan keempat snapshot baik; restore30berkas sesuai ukuran/SHA256.
Cron pertama sesudah aktivasi belum diamati; nominal berikutnya1November2026 01.00WIB.
Tidak ada sourcewrite/penghapusan permanen. Berkas lokal uji restore sudah dibersihkan.
Bukti dan batas lengkap di [review Hari28](HARI-28-REVIEW.md#aktivasi-nyata-dan-penutupan-hari28--26-oktober-2026).
