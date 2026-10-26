export type BagianInformasiCadangan = "aplikasi" | "privasi" | "ketentuan";

type Informasi = {
  judul: string;
  deskripsi: string;
  bagian: { judul: string; paragraf: string[] }[];
};

/** Isi khusus aplikasi cadangan pengelola, terpisah dari kebijakan seluruh website. */
export const informasiCadangan: Record<BagianInformasiCadangan, Informasi> = {
  aplikasi: {
    judul: "Cadangan Website Katar",
    deskripsi:
      "Alat pengelola untuk menyimpan dan memeriksa salinan foto serta dokumen website Karang Taruna RW 03 Cipedak.",
    bagian: [
      {
        judul: "Untuk pengelola cadangan organisasi",
        paragraf: [
          "Aplikasi ini dikelola Karang Taruna RW 03 Cipedak untuk akun Google organisasi. Pengunjung website dapat membaca halaman informasi ini; izin Google diperlukan oleh pengelola yang menyiapkan penyimpanan cadangan.",
          "Foto dan dokumen website disalin dari penyimpanan organisasi ke folder Google Drive privat. Daftar berkas, ukuran, waktu, dan hash digunakan untuk memeriksa kelengkapan salinan. Arsip diunduh ulang dan diperiksa sebelum dinyatakan berhasil.",
        ],
      },
      {
        judul: "Mengapa meminta izin Google Drive?",
        paragraf: [
          "Izin drive.file dipakai untuk membuat folder dan arsip cadangan, membaca kembali arsip, memeriksa pemilik serta izin folder, dan mengelola salinan lama yang dibuat aplikasi. Akses juga digunakan untuk memeriksa akun dan kapasitas penyimpanan sebelum pencadangan.",
          "Proses cadangan memeriksa bahwa akun dan folder tujuan sesuai dengan milik organisasi serta akses folder hanya untuk pemilik. Pengelola dapat mencabut izin aplikasi melalui pengaturan Akun Google.",
        ],
      },
      {
        judul: "Salinan yang diperiksa sebelum dirapikan",
        paragraf: [
          "Alur otomatis dijalankan melalui GitHub Actions pada repositori privat organisasi, sesudah cadangan database berhasil. Empat arsip cadangan berkas yang telah terverifikasi dipertahankan aktif. Arsip terverifikasi yang lebih lama dipindahkan ke Sampah Drive setelah salinan baru lolos pemeriksaan.",
          "Sampah tetap memakai ruang penyimpanan sesuai kebijakan Google Drive. Berkas sumber dan arsip kegiatan asli memiliki pengelolaan tersendiri. Keberhasilan pemulihan database dan layanan perlu diuji terpisah dari pemeriksaan arsip berkas.",
        ],
      },
    ],
  },
  privasi: {
    judul: "Kebijakan Privasi Cadangan Website Katar",
    deskripsi:
      "Penjelasan akses, penggunaan, penyimpanan, dan pengelolaan data oleh aplikasi cadangan pengelola.",
    bagian: [
      {
        judul: "Cakupan kebijakan",
        paragraf: [
          "Kebijakan ini berlaku untuk aplikasi Cadangan Website Katar yang dikelola Karang Taruna RW 03 Cipedak. Cakupannya adalah proses cadangan pengelola, termasuk akses Google Drive yang diberikan kepada aplikasi ini.",
        ],
      },
      {
        judul: "Data yang diakses dan tujuannya",
        paragraf: [
          "Aplikasi menggunakan alamat email akun Google untuk memastikan bahwa akun yang memberi izin adalah akun organisasi. Informasi kuota penyimpanan diperiksa untuk memastikan tersedia ruang sebelum mengunduh dan membuat cadangan baru.",
          "Pada Google Drive, aplikasi memakai scope drive.file. Data yang diproses meliputi folder dan arsip cadangan yang dapat diakses aplikasi, nama serta pengenal berkas, waktu, ukuran, hash, penanda aplikasi, pemilik, status Sampah, dan izin berbagi. Isinya digunakan untuk menyimpan, membaca ulang, memeriksa keutuhan, serta mengatur salinan cadangan.",
          "Foto dan dokumen website dibaca dari penyimpanan Supabase dan Backblaze B2 organisasi. Salinan dapat memuat dokumentasi kegiatan atau dokumen internal, sehingga folder cadangan harus tetap privat.",
        ],
      },
      {
        judul: "Penyimpanan dan akses pihak lain",
        paragraf: [
          "Arsip disimpan pada folder Drive privat milik akun organisasi. Proses otomatis berjalan pada GitHub Actions di repositori privat; isi berkas diproses pada lingkungan kerja sementara untuk membentuk dan memeriksa arsip. Google, GitHub, Supabase, dan Backblaze memproses data sesuai fungsi layanan masing-masing.",
          "Kredensial untuk menjalankan cadangan disimpan pada GitHub Secrets. Berkas akses saat penyiapan berada pada folder lokal privat di luar repositori web publik. Catatan proses dibatasi pada status, jumlah, ukuran, dan hasil pemeriksaan; isi berkas dan nilai kredensial tidak dimaksudkan untuk dicetak ke log.",
          "Alur otomatis aplikasi ini tidak menjual data, menggunakan data untuk iklan, memublikasikan isi cadangan, atau mengirim isi cadangan untuk pelatihan model AI. Penggunaan data Google dibatasi pada fungsi cadangan yang dijelaskan di halaman ini.",
        ],
      },
      {
        judul: "Keutuhan dan masa simpan",
        paragraf: [
          "Koneksi layanan memakai HTTPS. Aplikasi memeriksa akun, pemilik dan izin folder, lalu mengunduh ulang arsip dari Drive untuk memeriksa hash sebelum menjalankan retensi. Pemeriksaan ini membantu mendeteksi kegagalan unggah atau perubahan isi.",
          "Empat arsip berkas yang berhasil diverifikasi dipertahankan aktif. Arsip terverifikasi yang lebih lama dipindahkan ke Sampah. Isi Sampah mengikuti kebijakan dan pengaturan Google Drive. Arsip gagal atau berkas yang tidak dikenali memerlukan pemeriksaan pengelola dan tidak otomatis dianggap sebagai cadangan berhasil.",
        ],
      },
      {
        judul: "Mencabut akses dan menghapus salinan",
        paragraf: [
          "Pengelola dapat mencabut akses aplikasi melalui pengaturan koneksi aplikasi pada Akun Google, menghentikan workflow, dan menghapus kredensial cadangan yang tersimpan. Pencabutan izin menghentikan penggunaan akses tersebut untuk pencadangan berikutnya; arsip yang sudah tersimpan tetap perlu dikelola atau dihapus melalui Google Drive.",
          "Permintaan penjelasan, koreksi, pencabutan akses, atau penghapusan salinan dapat disampaikan ke pengelola melalui email organisasi di bawah. Jika prosedur atau penggunaan data berubah, halaman ini perlu diperbarui.",
        ],
      },
    ],
  },
  ketentuan: {
    judul: "Ketentuan Penggunaan Cadangan Website Katar",
    deskripsi:
      "Batas pemakaian dan tanggung jawab operasional pengelola saat menjalankan aplikasi cadangan.",
    bagian: [
      {
        judul: "Tujuan pemakaian",
        paragraf: [
          "Aplikasi ini digunakan pengelola yang berwenang untuk mencadangkan foto dan dokumen website Karang Taruna RW 03 Cipedak. Akun Google tujuan, folder, dan sumber berkas ditetapkan untuk kebutuhan organisasi. Pengelola bertanggung jawab memastikan izin penggunaan berkas sumber dan menjaga akses cadangan tetap sesuai peruntukannya.",
        ],
      },
      {
        judul: "Persetujuan dan pengamanan akun",
        paragraf: [
          "Akses Google diberikan melalui persetujuan OAuth oleh pemilik akun. Persetujuan dapat dicabut melalui Akun Google. Pengelola menjaga kredensial dan folder cadangan tetap privat, serta mengikuti ketentuan layanan penyedia yang digunakan.",
          "Pengelola perlu memeriksa tujuan dan ruang penyimpanan sebelum mengaktifkan proses otomatis. Perubahan biaya, cakupan izin, penerima data, atau pemakaian untuk akun lain memerlukan penilaian dan persetujuan tersendiri dari pengelola yang berwenang.",
        ],
      },
      {
        judul: "Pemeriksaan dan pemulihan",
        paragraf: [
          "Proses dapat gagal karena jaringan, kapasitas, perubahan izin, atau perubahan layanan penyedia. Pengelola perlu memeriksa status run, keberadaan salinan, dan hasil pemeriksaan hash. Jadwal otomatis dapat mengalami keterlambatan.",
          "Arsip berkas dan dump database memiliki fungsi serta waktu pengambilan berbeda. Pemulihan perlu diuji pada tempat terpisah sebelum diterapkan ke layanan aktif. Cadangan ini melengkapi pengelolaan arsip asli organisasi dan pengujian pemulihan layanan secara menyeluruh.",
        ],
      },
    ],
  },
};
