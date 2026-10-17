---
name: "katar-verifikasi"
description: "Protokol verifikasi wajib sebelum menyatakan pekerjaan selesai di proyek Katar RW 03: tsc, eslint, build, test:db, uji browser HP & laptop, uji keamanan, cek produksi. Gunakan setelah setiap perubahan kode, sebelum commit, dan sebelum melapor selesai."
---

# Verifikasi berlapis

Jangan pernah bilang "sudah jadi" tanpa bukti dari langkah-langkah ini. Laporkan angkanya ke Hanif.

## 1. Statis

```bash
npx tsc --noEmit          # bersih
npx eslint .              # 0 error (7 warning bawaan shadcn/fast-refresh itu wajar)
npm run build             # exit 0
npm run test:db           # bila menyentuh DB/RLS/akun: 83/83 (+ tes baru untuk aturan baru)
```

## 2. Browser (dev server http://localhost:5173 — konfigurasi `cipedak-dev` di `katar_profile/.claude/launch.json`)

- Ukuran: HP 360–375 px dan laptop 1440 px (768/1024 di Hari 16).
- Tidak ada geser samping: `document.documentElement.scrollWidth === innerWidth`.
- Uji interaksi nyata (klik, buka menu, submit) lalu cek DOM/URL sesudahnya.
- Console 0 error. Error lama bisa tersisa di tab yang sama → buka tab/server baru bila ragu.
  "Invalid hook call" setelah dependensi baru = Vite re-optimize (dev saja) → restart server.
- Ukur dengan JavaScript; screenshot hanya bukti visual (emulasi lebar bisa tampil mengecil).
- Akun uji: dibuat skrip service role, login hanya di localhost, dihapus setelahnya beserta baris audit_log-nya.

## 3. Keamanan (fitur berhak akses)

- Peran tak berhak memanggil fungsi server langsung dari console → harus ditolak; tanpa login → ditolak.
- Dokumen berakses BPH tidak terkirim saat logout.
- Kunci/kode server tidak ada di bundle browser: `grep -rl "SERVICE_ROLE\|<nama fungsi server>" .output/public`
  (kecocokan `listUsers` dari library supabase-js itu wajar).

## 4. Produksi (setelah push ke revisi)

```bash
U=https://katar-rw03.ukktrw03cipedak.workers.dev
for i in $(seq 1 50); do curl -s $U/ | grep -aq "<teks unik yang BARU ditambahkan>" && break; sleep 5; done
for p in / /tentang /berita /kegiatan /galeri /program /kontak /lpj /login /admin; do
  printf "%s %s  " "$p" "$(curl -s -o /dev/null -w '%{http_code}' $U$p)"; done
```

Penanda harus teks/fitur yang baru (bukan aset lama). 500 → Cloudflare → katar-rw03 → Observability → Events.

## 5. Bersih-bersih

Hapus skrip/akun/data uji; kembalikan data produksi yang diubah untuk uji dan buktikan sudah kembali;
matikan dev server & proses `workerd`; `git status` bersih.
