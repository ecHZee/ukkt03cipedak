---
name: "katar-penutup-sesi"
description: "Ritual menutup pekerjaan/sesi di proyek Katar RW 03: DEVLOG, backupcontext, commit, push, cek web online, bersih-bersih, laporan ke Hanif. Gunakan setiap kali satu tugas/hari selesai atau sebelum sesi berakhir."
---

# Penutup sesi

1. Verifikasi lengkap (skill `katar-verifikasi`).
2. Tambah section di **paling bawah** `DEVLOG.md` (jangan ubah section lama). Waktu WIB:
   `TZ=Asia/Jakarta date "+%Y-%m-%d %H:%M"`. Format:
   ```
   ## [YYYY-MM-DD HH:mm WIB] — <Nama agen (model)>
   **Fase:** Hari N — <judul>
   **Ringkasan:** apa & kenapa
   **File berubah:**
   - path
   **Catatan / dampak:** hasil uji (angka), jebakan, yang ditunda
   **Status:** Selesai | Berjalan
   ```
3. Perbarui `backupcontext.md`: tanggal "Terakhir diperbarui", §10 Status, §11 Rencana, keputusan baru. Tanpa rahasia.
4. `git add -A` (pastikan tidak ikut: `.env*`, `rahasia/`, foto, skrip `scripts/_*.tmp.*`), commit Bahasa Indonesia
   gaya conventional (`feat(x): …`, `fix(x): …`, `docs: …`) + baris atribusi agen, `git push origin revisi`.
   Tidak pernah force-push.
5. Cek web online (penanda teks baru + semua route 200) — skill `katar-verifikasi` bagian 4.
6. Matikan dev server/preview, `workerd`, proses latar; hapus file sementara; `git status` bersih.
7. Laporan ke Hanif: hasil + status online → tabel pekerjaan → bukti uji (angka) → catatan jujur (yang ditunda,
   kesalahan yang terjadi) → "Berikutnya" + satu pertanyaan penutup.
