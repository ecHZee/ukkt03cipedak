# Setup B2 untuk Hari 19

Bucket yang telah diperiksa: `katar-rw03-media`, private, US West,
endpoint `https://s3.us-west-004.backblazeb2.com`, encryption aktif, lifecycle keep only last version.

## Bagian Hanif

Form Application Keys telah disiapkan dengan nama `katar-web-revisi`, bucket hanya
`katar-rw03-media`, Read and Write, prefix kosong, List All Bucket Names tidak dicentang.
Hanif sendiri menekan Create New Key, menyalin nilainya, dan menutup hasil secret sebelum
agen melanjutkan observasi halaman. Master Application Key tidak diganti/digunakan.

Tambahkan ke `.env.local` secara lokal, tanpa mengirim nilai di chat:

```dotenv
B2_KEY_ID=<keyID dari key baru>
B2_APPLICATION_KEY=<applicationKey dari key baru>
B2_BUCKET=katar-rw03-media
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
```

Tambahkan nama yang sama ke Cloudflare akun Katar → Worker `katar-rw03` → Settings →
Variables and Secrets. Dua nilai key bertipe Secret; bucket/endpoint boleh Secret atau variabel
runtime. Tidak perlu build variable dan tidak pernah diawali `VITE_`. Deploy konfigurasi runtime
setelah disimpan. Agen memeriksa nama/kesiapan dan koneksi tanpa mencetak nilai.

## Bagian implementasi

CORS bucket telah diterapkan dan dibaca ulang, dibatasi ke origin Pages/Worker dan origin localhost QA yang benar-benar dipakai,
dengan operasi PUT/GET/HEAD yang diperlukan. Tidak memberi akses anonim ke bucket. File final
disajikan Worker hanya jika media/album terbit; preview privat menggunakan URL sementara.

Caps $0 tetap dijaga; tidak menambahkan kartu atau paket berbayar. Key ini khusus objek media,
bukan key untuk mengelola akun/bucket. CORS diterapkan lewat S3 API dengan key bucket yang sama; baca ulang cocok tanpa wildcard.

## Harga dan perilaku cache (cek dokumentasi resmi 19 Oktober 2026)

- [Harga penyimpanan](https://www.backblaze.com/cloud-storage/pricing): 10 GB pertama gratis; egress gratis
  hingga 3× rata-rata jumlah tersimpan bulanan. Bedakan harga umum ini dari cap akun aktual yang dicatat di bawah.
- [Harga transaksi](https://www.backblaze.com/cloud-storage/transaction-pricing): Class A/B/C gratis;
  Class D punya batas berbeda. Implementasi ini memakai operasi objek S3 biasa.
- [Cache API Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/cache/): cache terpisah
  per data center dan dapat terbuang. Header HIT membuktikan baca cache pada permintaan itu, bukan
  menjamin B2 tidak akan pernah dibaca lagi. Grafik provider/HP fisik tetap bukti penerimaan terpisah.
- Cache internal objek immutable satu tahun; respons browser `/media/*` tetap `no-store` agar tiap
  permintaan memeriksa apakah album masih terbit sebelum cache. HTML/API/admin tetap privat/no-store.
- Reservasi unggahan dibatasi 40 tertunda per akun dan 200 media per album. Foto maksimal 20 MiB input,
  video 200 MiB. PUT bertanda tangan ke staging, berlaku 300 detik dengan MIME dan ukuran ditandatangani.
  Path final hanya ditulis server setelah pemeriksaan HEAD, magic bytes dan CopyObject bersyarat ETag.
- Jeda/retry mempertahankan antrean selama tab terbuka; sesudah reload pilih ulang file yang sama.
  Hash sumber mencegah duplikat per album. Koneksi pulih melanjutkan otomatis kecuali dijeda manual.
- Tombol Bersihkan membatalkan reservasi sendiri dan menghapus staging/final yang batal. Reservasi media
  selesai tetap ada sebagai bukti verifikasi, staging-nya dapat dibersihkan ulang. URL PUT yang sudah
  diterbitkan berlaku sampai kedaluwarsa; jangan menganggap penghapusan staging membatalkan URL itu.
  Jika PUT lama selesai belakangan, lakukan pembersihan lagi sesudah lima menit. Cleanup menghapus
  versi objek dan delete marker untuk Key persis path terkait; DELETE biasa tanpa versionId hanya
  menyembunyikan objek dan masih menyimpan versi lama. Tidak menghapus seluruh prefix/bucket.
- Pratinjau admin bertanda tangan 5 menit. Hak akun diperiksa saat penerbitan URL; tautan yang sudah
  diberikan tetap berlaku sampai kedaluwarsa. Bucket tetap private, tidak ada token publik semua bucket.
- Berkas asli dari Drive diunduh manual ke folder lokal privat untuk kurasi, lalu dipilih pada form album.
  Browser mengirim turunan terkompres ke B2. Tautan Drive sendiri hanya menunjuk folder, tidak menyalin
  atau mengubah izin folder secara otomatis. Jangan mengunggah master 36 GB seluruhnya sekaligus.

**Pembanding dashboard akun Katar, 19 Okt:** cap tetap $0: Storage 10 GB, Download 1 GB/hari,
Class B dan C masing-masing 2.500/hari, alert organisasi aktif. Tampilan akun tanpa kartu masih
memakai angka tersebut meskipun halaman harga umum menyebut skema berbeda. Batas akun yang tampil
ini tetap dihormati; tidak menaikkan cap/menambah pembayaran. Bukti QA privat `caps-awal.txt`.

Dev server kini dijalankan dengan `npm run dev` yang memuat `.env.local` lewat Node `--env-file`.
Sesudah mengganti key, hentikan dan jalankan ulang dev server agar nilai proses ikut berubah.
Variabel B2 tanpa `VITE_` tidak dikirim ke browser; jangan menambahkannya ke build variables.
