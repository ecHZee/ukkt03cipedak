import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAkun } from "@/hooks/use-akun";

export const Route = createFileRoute("/admin/bantuan")({
  head: () => ({ meta: [{ title: "Bantuan Pengurus — Karang Taruna RW 03 Cipedak" }] }),
  component: Page,
});

const tautan =
  "inline-flex min-h-11 items-center rounded-md px-2 text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

function Page() {
  const akun = useAkun();
  // Bantuan mengikuti menu yang sudah ada; izin tindakan tetap diperiksa server dan RLS.
  const topik = [
    { id: "mulai", judul: "Masuk, profil dan password", tampil: true },
    { id: "berita", judul: "Menulis berita pertama", tampil: akun.bolehKontribusi },
    { id: "kegiatan", judul: "Mencatat kegiatan", tampil: akun.bolehKontribusi },
    { id: "album", judul: "Foto dan video kegiatan", tampil: akun.bolehKontribusi },
    { id: "dokumen", judul: "Menyimpan PDF", tampil: akun.bolehKontribusi },
    { id: "persetujuan", judul: "Memeriksa pengajuan dan izin", tampil: akun.admin },
    { id: "website", judul: "Pengurus dan pengaturan website", tampil: akun.lintasBidang },
    { id: "akun", judul: "Mengelola akun", tampil: akun.role === "super_admin" },
    { id: "kendala", judul: "Kalau menemui kendala", tampil: true },
  ].filter((t) => t.tampil);
  return (
    <AdminShell
      title="Bantuan pengurus"
      description="Petunjuk singkat untuk mengelola website Karang Taruna RW 03. Pilih pekerjaan yang ingin kamu lakukan."
    >
      <div className="max-w-4xl space-y-8 text-sm leading-relaxed text-ink">
        <section
          aria-labelledby="peran-bantuan"
          className="rounded-xl border border-border bg-surface p-5"
        >
          <h2 id="peran-bantuan" className="font-heading text-lg font-semibold">
            Aksesmu: {akun.label}
          </h2>
          <p className="mt-2">
            {akun.admin
              ? "Kamu dapat memeriksa dan menerbitkan konten dalam jangkauanmu. Kabid mengelola bidangnya; BPH dan Super Admin menjangkau semua bidang."
              : akun.bolehKontribusi
                ? "Kamu dapat membuat draf dan mengajukan konten bidangmu. Kabid atau BPH yang memeriksa dan menerbitkannya."
                : "Kamu dapat membaca informasi dan mengubah profil sendiri. Untuk membuat konten, minta izin kontribusi kepada Kabid atau BPH."}
          </p>
          <p className="mt-3">
            Draf = masih dikerjakan. Menunggu persetujuan = sudah diajukan. Terbit = dapat dilihat
            sesuai akses kontennya; berita, kegiatan dan album yang terbit bisa dilihat warga.
          </p>
          <a
            className={tautan}
            href="https://github.com/ecHZee/ukkt03cipedak/blob/revisi/docs/PANDUAN-PENGURUS.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka panduan lengkap bergambar (tab baru)
          </a>
        </section>
        <nav aria-label="Topik bantuan" className="border-b border-border pb-5">
          <ul className="grid gap-1 sm:grid-cols-2">
            {topik.map((t) => (
              <li key={t.id}>
                <a className={tautan} href={`#${t.id}`}>
                  {t.judul}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Bagian id="mulai" judul="Masuk, profil dan password">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Gunakan username dan password dari Super Admin. Saat pertama masuk, selesaikan
              permintaan ganti password. Minimal 10 karakter, gabungan huruf dan angka.
            </li>
            <li>
              Buka Profil Saya untuk mengubah data diri atau password. Email dan nomor HP pribadi
              tidak tampil di website umum.
            </li>
            <li>
              Untuk foto, pilih foto tegak, rapikan potongannya, lalu periksa pratinjau. Saran 900 ×
              1200 piksel. Centang izin tampil hanya jika setuju, lalu tekan Simpan foto dan izin.
              Batal membuang perubahan yang belum disimpan.
            </li>
          </ol>
          <p>
            Kalau lupa password, hubungi Super Admin melalui jalur pribadi. Reset lewat email belum
            tersedia. Jangan membagikan password atau tangkapan layar yang memuatnya.
          </p>
          <Link className={tautan} to="/admin/profil">
            Buka Profil Saya
          </Link>
        </Bagian>
        {akun.bolehKontribusi && (
          <>
            <Bagian id="berita" judul="Menulis berita pertama">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Buka Berita → Tulis berita. Isi Judul berita, Ringkasan dan Isi berita. Alamat
                  berita terisi dari judul; cukup biarkan jika sudah sesuai.
                </li>
                <li>
                  Pilih bidang yang benar. Bila memakai sampul, pilih JPG, PNG atau WebP maksimal 20
                  MB dan tulis keterangannya. Saran gambar mendatar 1200 × 630 piksel.
                </li>
                <li>
                  Tekan Pratinjau berita. Periksa nama, tanggal, isi dan izin foto; tutup pratinjau
                  untuk kembali.
                </li>
                <li>
                  Tekan Simpan draf untuk melanjutkan nanti. Jika sudah siap, buka lagi lewat
                  Sunting dan tekan Ajukan review. Pastikan statusnya Menunggu persetujuan, lalu
                  kabari Kabid/BPH.
                </li>
              </ol>
              <p>
                {akun.admin
                  ? "Untuk pengajuan yang sudah benar, gunakan Setujui dan konfirmasi Setujui dan terbitkan. Tolak mengembalikan pengajuan ke draf. Terbitkan berita pada formulir juga langsung memublikasikan konten."
                  : "Tombol penerbitan memang hanya tersedia untuk pemeriksa yang berhak. Mengajukan review belum menampilkan berita kepada warga."}
              </p>
              <Link className={tautan} to="/admin/berita">
                Buka Berita
              </Link>
            </Bagian>
            <Bagian id="kegiatan" judul="Mencatat kegiatan">
              <p>
                Buka Kegiatan → Tambah kegiatan. Isi judul, bidang, keterangan, lokasi dan
                tanggal/jam sesuai kenyataan. Jadwal rutin memakai keterangan perulangan; tanggal SK
                bukan otomatis tanggal acara.
              </p>
              <p>
                Simpan draf untuk dilanjutkan atau tekan Ajukan persetujuan. Kabid/BPH memeriksa
                sebelum Terbitkan kegiatan. Tahap Rencana/Berjalan/Selesai menjelaskan pelaksanaan;
                status Draf/Terbit mengatur penayangannya.
              </p>
              <Link className={tautan} to="/admin/kegiatan">
                Buka Kegiatan
              </Link>
            </Bagian>
            <Bagian id="album" judul="Foto dan video kegiatan">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Buka Galeri → Album baru. Isi informasi album, lalu Simpan draf dahulu.</li>
                <li>
                  Pilih foto/video dari perangkat, lalu Mulai / lanjutkan unggahan. Maksimal 40 file
                  sekali pilih dan 200 media per album. Foto maksimal 20 MB; video maksimal 200 MB.
                  MP4/WebM paling mudah diputar.
                </li>
                <li>
                  Tunggu sampai file tersimpan. Jika koneksi putus, biarkan tab terbuka; unggahan
                  lanjut saat koneksi pulih. Sesudah menekan Jeda, tekan Mulai / lanjutkan unggahan
                  untuk meneruskan. Jika tab terlanjur ditutup, pilih ulang file yang sama.
                </li>
                <li>
                  Lengkapi Keterangan, atur Naik/Turun dan Jadikan sampul. Pilih status Menunggu
                  persetujuan lalu simpan. Kabid/BPH memeriksa sebelum memilih Terbit.
                </li>
              </ol>
              <p>
                Foto yang masih di Drive: unduh pilihan yang sudah disepakati ke perangkat, lalu
                unggah di sini. Menempel tautan Drive tidak memindahkan foto. Tautan folder asli
                opsional dan akan terlihat publik saat album terbit; pastikan folder itu memang aman
                dibagikan.
              </p>
              <p>
                Album yang terbit harus ditarik ke Draf dan disimpan sebelum media disunting.
                Bersihkan unggahan tertunda membatalkan unggahan yang belum selesai; jangan jalankan
                saat tab lain masih mengunggah.
              </p>
              <Link className={tautan} to="/admin/galeri">
                Buka Galeri
              </Link>
            </Bagian>
            <Bagian id="dokumen" judul="Menyimpan PDF">
              <p>
                Buka Dokumen, isi informasi dokumen, lalu pilih PDF maksimal 20 MB. Periksa
                pratinjau dan akses: Publik untuk warga, Anggota untuk pengurus yang masuk, atau BPH
                untuk pengurus yang berhak. Pilihan mengikuti akses akunmu.
              </p>
              <p>
                Pilih status sesuai tahapnya, lalu Simpan dokumen. Draf belum tersedia di arsip
                publik. Salah menentukan akses bisa membagikan dokumen internal; jika ragu, simpan
                draf dan tanyakan BPH. Jangan unggah daftar password, data identitas pribadi atau
                dokumen yang belum disetujui.
              </p>
              <Link className={tautan} to="/admin/dokumen">
                Buka Dokumen
              </Link>
            </Bagian>
          </>
        )}
        {akun.admin && (
          <Bagian id="persetujuan" judul="Memeriksa pengajuan dan izin">
            <p>
              Buka daftar Berita/Kegiatan/Galeri dan cari status Menunggu persetujuan. Periksa isi,
              tanggal, bidang, izin foto dan tautan. Setujui hanya konten yang siap ditampilkan.
              Untuk berita, Tolak mengembalikan pengajuan ke draf; sampaikan koreksinya kepada
              penulis melalui jalur tim.
            </p>
            <p>
              Di Pengurus, cari anggota dan atur izin kontribusinya. Kabid hanya mengatur anggota
              bidang sendiri; BPH/Super Admin dapat lintas bidang. Izin ini membolehkan membuat
              draf, bukan menerbitkan.
            </p>
            <Link className={tautan} to="/admin/anggota">
              Buka Pengurus
            </Link>
          </Bagian>
        )}
        {akun.lintasBidang && (
          <Bagian id="website" judul="Pengurus dan pengaturan website">
            <p>
              Kelola data pengurus untuk jabatan, bidang, periode, status aktif dan izin foto.
              Mengubah jabatan dapat mengubah hak akun terkait. Menonaktifkan pengurus ikut
              menonaktifkan akunnya; mengaktifkan data lagi tidak otomatis membuka akun. Menambah
              pengurus juga belum membuat akun masuk.
            </p>
            <p>
              Pengaturan mengubah kontak resmi, pengumuman, logo dan foto latar beranda. Foto album
              tidak otomatis mengisi beranda. Pilih gambar, periksa pratinjau, lalu Simpan
              pengaturan dan konfirmasi. Batalkan perubahan membuang perubahan yang belum disimpan.
              Logo minimal 512 × 512; foto minimal 800 × 600, disarankan 1600 × 1200 piksel.
              JPG/PNG/WebP maksimal 10 MB. Foto pertama dipakai di hero dan bagian Tentang; tiga
              foto lainnya tersimpan sebagai cadangan.
            </p>
            <p>
              Log aktivitas mencatat siapa melakukan perubahan dan kapan. Gunakan filter, lalu
              Terapkan filter. Isinya tidak menampilkan password atau nilai kontak pribadi.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link className={tautan} to="/admin/pengurus-kelola">
                Kelola data pengurus
              </Link>
              <Link className={tautan} to="/admin/settings">
                Buka Pengaturan
              </Link>
              <Link className={tautan} to="/admin/audit-log">
                Buka Log aktivitas
              </Link>
            </div>
          </Bagian>
        )}
        {akun.role === "super_admin" && (
          <Bagian id="akun" judul="Mengelola akun">
            <p>
              Menu Akun khusus Super Admin. Pastikan orang yang dipilih benar sebelum mengganti
              username, mereset password atau mengubah status akun. Password sementara tampil
              sekali: sampaikan pribadi, jangan screenshot atau kirim ke grup.
            </p>
            <p>
              Peran mengikuti jabatan pada data pengurus. Untuk akun pengurus baru, hubungi
              penanggung jawab teknis; menambah pengurus belum menyediakan tombol pembuatan akun
              baru.
            </p>
            <Link className={tautan} to="/admin/users">
              Buka Akun
            </Link>
          </Bagian>
        )}
        <Bagian id="kendala" judul="Kalau menemui kendala">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Menu tidak ada: pastikan akun dan izin kontribusinya benar. Hubungi Kabid/BPH, jangan
              memakai akun teman.
            </li>
            <li>
              Isian ditandai: perbaiki bagian tersebut, lalu simpan lagi. Belum ada penyimpanan
              otomatis; tunggu pesan berhasil.
            </li>
            <li>
              Data berubah oleh orang lain: salin teks yang belum disimpan ke catatan pribadi, muat
              ulang, lalu cocokkan versi terbaru sebelum menyunting lagi.
            </li>
            <li>
              Gagal unggah: periksa koneksi, jenis dan ukuran file. Jangan hapus foto asli dari
              Drive hanya karena sudah memilih file di formulir.
            </li>
            <li>
              Foto dicabut izinnya: penggantian/pencabutan menghapus berkas lama. Salinan yang sudah
              diunduh atau tersimpan di perangkat orang lain tidak bisa ditarik kembali.
            </li>
          </ul>
          <p>
            Saat melapor, tulis menu, langkah, waktu dan pesan kesalahan. Jika perlu tangkapan
            layar, tutup password, kontak pribadi dan dokumen internal dahulu. Kirim ke Kabid/BPH
            atau penanggung jawab website melalui jalur pribadi.
          </p>
        </Bagian>
      </div>
    </AdminShell>
  );
}

function Bagian({ id, judul, children }: { id: string; judul: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-judul`}
      tabIndex={-1}
      className="scroll-mt-24 space-y-3 border-b border-border pb-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
    >
      <h2 id={`${id}-judul`} className="font-heading text-xl font-semibold">
        {judul}
      </h2>
      {children}
    </section>
  );
}
