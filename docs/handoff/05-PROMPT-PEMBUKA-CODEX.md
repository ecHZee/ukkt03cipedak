# 05 · Prompt pembuka untuk Codex (GPT 6.1 Sol) + cara menilai jawabannya

Kirim prompt di bawah ini sebagai pesan pertama setelah chat Claude Code di-import ke Codex
(buka folder `ukkt03cipedak` di Codex terlebih dahulu).

---

## Prompt (salin persis)

```
Halo! Kamu melanjutkan proyek web Karang Taruna RW 03 Cipedak yang sebelumnya dikerjakan Claude Code (Opus 5.5).
Repo: folder ukkt03cipedak (branch revisi). Riwayat chat sudah ku-import, tapi sumber kebenaran adalah FILE di repo.

Sebelum melakukan apa pun:
1. Baca: AGENTS.md, backupcontext.md, 5 section terbawah DEVLOG.md, lalu SEMUA file di docs/handoff/ (01–05).
2. Muat dan ikuti skill di .agents/skills/katar-* (mulai dari katar-mulai-sesi). Jalankan ritualnya
   (cek git branch/status/log + origin/revisi).
3. JANGAN mengubah file, menjalankan migrasi, push, atau menyentuh dashboard apa pun dulu.

Lalu jawab dalam Bahasa Indonesia santai (boleh panggil aku "beb"), dengan format:
A. Posisi proyek sekarang: hari terakhir yang selesai, commit HEAD, status web online, apa yang masih maket.
B. Rencana Hari 12 yang KONKRET: file yang akan dibuat/diubah (path), urutan langkah, cara uji (termasuk ukuran
   layar & cek produksi), dan definisi selesai yang bisa dibuktikan.
C. 5 aturan/jebakan terpenting yang akan kamu patuhi di proyek ini dan kenapa (ambil dari dokumen, sebutkan sumbernya).
D. Hal yang belum jelas atau keputusan yang perlu dariku (kalau ada), dalam format opsi + rekomendasi.
E. Bukti kamu benar-benar membaca: sebutkan nama worker Cloudflare, nama bucket B2, jumlah tes database,
   dan kenapa harus pakai .inputValidator bukan .validator.

Setelah aku bilang "gas", baru mulai Hari 12 mengikuti skill katar-implementasi → katar-verifikasi →
katar-penutup-sesi.
```

---

## Rubrik untuk Hanif — jawaban yang "sejalan" harus memenuhi ini

| Bagian | Jawaban benar memuat                                                                                                                                                                                                                                                                   | Tanda bahaya                                                                 |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| A      | Hari 11 selesai; HEAD sekitar commit `1364876` _atau lebih baru bila ada commit dokumen serah terima_; web online di `katar-rw03.ukktrw03cipedak.workers.dev`; form admin Berita/Kegiatan/Galeri/Dokumen/Pengaturan masih maket; foto asli menunggu Hari 19                            | Mengaku sudah ada halaman detail/galeri asli; tidak menyebut branch `revisi` |
| B      | Route `src/routes/kegiatan.$slug.tsx` & `berita.$slug.tsx`; service `ambil…Slug`; tautan dari kartu; tombol Share WA & Google Calendar (zona Asia/Jakarta); meta og per halaman di `head()` (URL absolut dari `VITE_SITE_URL`); commit `routeTree.gen.ts`; uji 360 & 1440 px + `curl … | grep og:` di produksi                                                        | Mengusulkan library berat, desain ulang total, atau langsung mengubah DB tanpa alasan |
| C      | Misal: kerja di `revisi` & tanpa force-push; `npm run db` bukan `npx supabase`; data loader plain object; `.inputValidator`; JSON null untuk `pengaturan`; rahasia/foto tidak di-commit; verifikasi + DEVLOG tiap perubahan; desain E dipoles bukan diganti                            | Aturan generik yang tidak spesifik proyek                                    |
| D      | Pertanyaan relevan (mis. apakah OG image memakai logo dulu, Calendar untuk kegiatan rutin) dengan opsi + rekomendasi — atau "tidak ada, siap gas"                                                                                                                                      | Bertanya hal yang bisa dicek sendiri di repo                                 |
| E      | `katar-rw03`; `katar-rw03-media`; 83 tes; Cloudflare memasang TanStack Start dari `bun.lock` (1.167) yang belum punya `.validator`                                                                                                                                                     | Salah/ngarang                                                                |

**Penilaian:** bila A–E benar dan rencana B spesifik (path + cara uji), agen ini sejalan — beri "gas".
Bila ada tanda bahaya, minta ia membaca ulang file yang relevan sebelum mulai.

## Perkiraan Claude tentang kelanjutan

Dokumen & skill ini menutup celah terbesar saat pindah agen: konteks keputusan, jebakan yang pernah terjadi,
dan standar verifikasi. Risiko utama yang perlu Hanif awasi di agen mana pun:

1. **Klaim tanpa bukti** — minta angka/output tes setiap kali agen bilang "selesai".
2. **Melebar dari desain E** — tolak perubahan gaya besar yang tidak diminta.
3. **Perbedaan versi lokal vs Cloudflare** — selalu cek web online setelah push.
4. **Rahasia & foto** — pastikan tidak ada `.env`, `rahasia/`, atau foto yang ikut commit (`git status` sebelum push).
