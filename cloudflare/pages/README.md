# Alamat Pages untuk Worker Katar

Pages hanya meneruskan request ke Worker melalui Service Binding `KATAR_APP`.
Tidak ada secret aplikasi di proyek ini. Deploy aplikasi utama tetap mengikuti push `revisi`.
Proxy tidak perlu dideploy ulang setiap kali konten/kode aplikasi utama berubah.

Deploy awal menggunakan **Direct Upload** dashboard Cloudflare akun Katar. Unggah ZIP berisi isi
folder `public/` saja (file `_worker.js` dan `_routes.json` berada di root ZIP). File `_worker.js`
didukung upload dashboard; folder `functions/` mentah tidak didukung.

Di proyek Pages → Settings → Bindings, tambah Service Binding bernama `KATAR_APP` ke Worker
`katar-rw03` untuk Production. Deploy ulang setelah binding diatur. Gunakan konfigurasi yang sama
untuk Preview bila preview dipakai. Nama target `ukkt03cipedak` harus diperiksa di dashboard.

Alternatif deploy berikutnya memakai Wrangler dari folder ini:
`npx wrangler pages deploy public --project-name ukkt03cipedak --branch revisi`.
Gunakan sesi Cloudflare organisasi yang benar; jangan mengambil token dari browser atau menulisnya ke repo.
Direct Upload tidak dapat diubah menjadi Git integration pada proyek yang sama; ini dipilih karena
proxy kecil jarang berubah, sedangkan aplikasi utama tetap otomatis dibangun oleh Workers Builds.

HTML/API/admin serta semua respons bersesi diberi `no-store`. Hanya aset anonim yang mempertahankan
header cache asal. Body GET/POST, authorization dan cookie diteruskan lewat Request asli tanpa dibaca
atau dicatat. Redirect absolut dari hostname Worker diubah ke origin Pages, path/query tetap utuh.

Setelah deploy, verifikasi header `X-Katar-Gateway: pages-v1`, aset, hidrasi, login/server functions,
unduhan dan tidak bocornya cache. Sesuaikan `VITE_SITE_URL` pada build Worker serta konfigurasi Auth yang
relevan. Jangan menghapus Worker lama. Pemulihan: gunakan URL Worker langsung sambil memperbaiki proxy.

Rujukan: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/#functions),
[Service Binding](https://developers.cloudflare.com/pages/functions/bindings/#service-bindings).
