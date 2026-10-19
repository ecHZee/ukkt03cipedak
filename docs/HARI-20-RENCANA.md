# Rencana Hari 20 — Arsip dokumen dan pengurus

Disusun 19 Oktober 2026 dari baseline `cd2738f`, branch `revisi`.
Ini rencana untuk direview; implementasi Hari 20 belum dimulai.
Sumber utama: `SCHEDULE.md` Hari 20 dan `handoff/01-RENCANA-LENGKAP.md` Hari 20,
ditambah keputusan Hanif tentang crop foto saat tahap CMS pengurus.

| Urutan | Pekerjaan                                                                   | Hasil yang dituju                                                                                                                                     |
| ------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Audit jalur dokumen, Storage, CRUD pengurus dan trigger role yang sudah ada | Memakai aturan nyata, menjaga 61 data pengurus/akun asli dan batas akses                                                                              |
| 2      | Aktifkan CMS dokumen                                                        | Upload PDF, judul/kategori/tahun/bidang, level `publik`/`anggota`/`bph`, status publikasi, pratinjau dan pengelolaan berkas                           |
| 3      | Aktifkan pengelolaan pengurus untuk Super Admin/BPH (Admin Level 1)         | Tambah, sunting nama/gelar/jabatan/bidang/periode serta status aktif sesuai model saat ini; perubahan jabatan menyinkronkan role akun melalui trigger |
| 4      | Foto pengurus dan izin publik                                               | Crop potret 3:4, pratinjau potret besar + avatar persegi, langkah Simpan, cek izin foto dan cleanup objek lama sesuai keputusan Hari 18               |
| 5      | Verifikasi lintas peran dan produksi                                        | Membuktikan dokumen internal/foto tanpa izin tidak bocor, bukan hanya tombolnya disembunyikan                                                         |

## Titik kode yang akan diperiksa/diubah

- `src/routes/admin.dokumen.tsx`: daftar saat ini hanya membaca dokumen publik dan tombol upload/pratinjau
  belum mengelola dokumen; ganti dengan daftar privat sesuai hak akses dan form nyata.
- `src/routes/admin.anggota.tsx`: pertahankan daftar/izin kontribusi yang sudah ada, tambah alur kelola
  pengurus untuk Level 1. Rute admin pengurus sekarang bernama **anggota**, bukan `admin.pengurus.tsx`.
- `src/routes/admin.profil.tsx` dan alur foto yang dipakai bersama: integrasi crop dan izin sesuai pemilik
  foto; batas kewenangan orang lain diperiksa di server.
- `src/services/storage.ts`, layanan dokumen/organisasi/akun, tipe domain serta fungsi server terkait:
  upload satu pintu, validasi, JWT/RLS dan penanganan gagal/cleanup.
- Komponen form dokumen/pengurus/crop dan layanan `*.functions.ts` + `*.server.ts` baru bila diperlukan;
  nama akhir diputuskan setelah audit langkah 1, bukan mengarang jalur yang sudah ada.
- Migrasi baru dan tipe Supabase hanya jika guard/RPC yang tersedia belum cukup; jangan mengedit
  migrasi lama. Tambah tes untuk perilaku akses dan kegagalan yang baru.
- `docs/HARI-20-REVIEW.md`, DEVLOG dan konteks saat penutupan implementasi nanti.

## Batas dan jebakan yang harus diuji

- PDF tetap di Supabase Storage; B2 dipakai untuk album Hari 19. Dokumen internal harus berada di bucket
  privat dan mendapat signed URL setelah pemeriksaan hak akses. Tidak cukup menyembunyikan kartu dokumen.
- Pengunjung logout tidak menerima baris/URL unduhan dokumen anggota atau BPH. Anggota aktif hanya
  memperoleh dokumen sesuai levelnya; Kabid tidak otomatis menjadi BPH.
- Mengubah dokumen publik menjadi internal harus menangani **salinan lama yang telanjur ada di bucket
  publik**. Uji akses URL lama dan cleanup, bukan hanya mengganti enum database. Salinan yang sudah
  diunduh orang dan signed URL yang masih berlaku mempunyai batas pencabutan yang perlu dicatat jujur.
- Perubahan jabatan/periode dapat mengubah role. Uji dengan akun pengurus sintetis, bukan promosi/demosi
  akun asli sebagai fixture. Uji pula sesi yang masih membawa JWT lama setelah role/izin berubah.
- Tidak menghapus permanen pengurus/periode asli untuk QA. Pilih nonaktif/arsip sesuai kebutuhan;
  tindakan destruktif pada data asli dibahas terpisah.
- Crop tidak menggantikan izin publikasi. Jangan menerbitkan foto orang karena file berhasil diunggah;
  tetap hormati `izin_foto`, penghapusan objek lama, dan pembatasan akun nonaktif Hari 18.
- Kelola akun/reset password dan fitur pengaturan/audit mengikuti scope yang sudah ada/Hari 21;
  tidak sekaligus membagikan akun atau mengganti data organisasi asli.

## Definisi selesai yang bisa dibuktikan

1. BPH/Super Admin menjalankan upload/sunting/pratinjau dokumen dan kelola pengurus sementara lewat UI;
   level akses dan perubahan role tersimpan benar. Peran tak berhak ditolak melalui RPC langsung juga.
2. Saat logout, dokumen BPH tidak muncul dan tidak dapat diperoleh lewat API/URL tanpa izin.
   Peralihan publik→internal, role lama dan URL lama diuji dengan batas signed URL yang dinyatakan.
3. Crop 3:4 + pratinjau 1:1, Simpan/Batal, izin tampil dan cleanup foto diuji tanpa foto orang asli.
4. TypeScript, lint, build, regresi dan tes DB/RLS terkait lulus; angka aktual dilaporkan setelah dijalankan.
5. Browser pada 360/768/1024/1440/1920 px, interaksi/fokus/guard isian, console dan aksesibilitas;
   ulangi jalur publik/privat pada Pages dan Worker setelah deploy `revisi`.
6. Seluruh akun/data/berkas/audit uji dibersihkan dan sisa diverifikasi; satu section DEVLOG,
   review/konteks diperbarui, working tree bersih. Tidak otomatis merge `main`.

## Persiapan Hanif dan tim

- Kurasi foto memakai `CHECKLIST-FOTO-LAUNCH.md`; dipilih dahulu, input manual menyusul.
- Untuk penerimaan dokumen nanti, pilih contoh PDF yang boleh publik dan contoh internal;
  QA awal memakai dokumen sintetis, tidak meminta dokumen sensitif dimasukkan ke chat/Git.
- Izin foto dan jabatan/periode dikonfirmasi oleh pengurus yang berwenang sebelum input asli.

Penerimaan Hari 19 (30 foto dari HP fisik + grafik Class B terisolasi), Q06–Q08 audit, preview WhatsApp,
restore drill dan Checkpoint 3 tetap dicatat terbuka. Menyelesaikan rencana ini tidak berarti web
sudah memenuhi seluruh syarat launching. Foto asli/penghapusan dummy masuk pengisian konten Hari 24;
request ini belum memulai implementasi Hari 20 atau mengunggah media.
