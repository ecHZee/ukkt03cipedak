-- =============================================================================
-- Hari 5 — Data awal resmi
-- Sumber: SK Karang Taruna Kelurahan Cipedak No. 003/SK/KT-Cipedak/VI/2025
-- (ditetapkan 05 Juni 2025). Urutan pengurus mengikuti lampiran SK;
-- nama urutan pertama di setiap bidang adalah Kepala Bidang.
-- Konten contoh (dummy) TIDAK di sini — lihat scripts/seed-dummy.mjs.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Periode
-- -----------------------------------------------------------------------------
insert into public.periode (label, nomor_sk, tanggal_sk, tanggal_pelantikan, aktif)
values ('2025–2028', '003/SK/KT-Cipedak/VI/2025', '2025-06-05', null, true);

-- -----------------------------------------------------------------------------
-- Bidang
-- -----------------------------------------------------------------------------
insert into public.bidang (slug, nama_resmi, nama_singkat, tagline, deskripsi, fokus, ikon, urutan)
values
  ('okk',
   'Organisasi Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM', 'OKK & SDM',
   'Kaderisasi, keanggotaan, & pengembangan pengurus.',
   'Mengelola keanggotaan dan kaderisasi pemuda, serta meningkatkan kapasitas pengurus lewat pelatihan.',
   array['Rekrutmen & data anggota', 'Kaderisasi', 'Pelatihan pengurus'], 'users', 1),
  ('kerohanian',
   'Kerohanian & Pembinaan Mental', 'Kerohanian',
   'Penguatan nilai keagamaan dan karakter.',
   'Mengelola kegiatan keagamaan, pembinaan akhlak, dan momentum hari besar keagamaan di lingkungan RW 03.',
   array['Peringatan hari besar', 'Pengajian rutin', 'Pembinaan mental remaja'], 'heart-handshake', 2),
  ('lingkungan',
   'Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi', 'Lingkungan & Kemitraan',
   'Kerja bakti, kemitraan warga, & tata kelola.',
   'Menjaga lingkungan RW 03, membangun kemitraan dengan warga dan lembaga, serta merapikan tata kelola organisasi.',
   array['Kerja bakti rutin', 'Kemitraan RT/RW & mitra', 'Tata kelola organisasi'], 'sprout', 3),
  ('ekonomi',
   'Ekonomi Mandiri & Kesejahteraan Sosial', 'Ekonomi & Kesos',
   'Usaha mandiri & kepedulian sosial.',
   'Mengembangkan usaha mandiri Karang Taruna, mendukung UMKM warga, dan menyalurkan program kesejahteraan sosial.',
   array['Usaha mandiri', 'UMKM warga', 'Santunan & bantuan sosial'], 'briefcase', 4),
  ('pendidikan',
   'Pendidikan, Keolahragaan & Kebudayaan', 'Pendidikan & Olahraga',
   'Belajar, olahraga, & budaya.',
   'Menyelenggarakan kegiatan pendidikan, olahraga rutin dan turnamen, serta pelestarian budaya di lingkungan RW 03.',
   array['Kegiatan belajar', 'Olahraga & turnamen', 'Kegiatan kebudayaan'], 'dumbbell', 5),
  ('media',
   'Media Publikasi, Dokumentasi & Desain Grafis', 'Media',
   'Dokumentasi & publikasi resmi organisasi.',
   'Mengelola kanal media sosial dan website, dokumentasi setiap kegiatan, serta desain grafis resmi Karang Taruna.',
   array['Dokumentasi kegiatan', 'Media sosial & website', 'Desain grafis resmi'], 'camera', 6),
  ('inventaris',
   'Inventaris & Arsip', 'Inventaris & Arsip',
   'Aset organisasi & arsip dokumen.',
   'Mendata seluruh aset dan inventaris, serta mengarsipkan dokumen resmi organisasi lintas periode.',
   array['Inventaris aset', 'Arsip SK & LPJ', 'Peminjaman perlengkapan'], 'archive', 7);

-- -----------------------------------------------------------------------------
-- Pengurus
-- -----------------------------------------------------------------------------
with p as (
  select id from public.periode where label = '2025–2028'
),
data (urutan, grup, bidang_slug, jabatan, nama, gelar) as (
  values
  -- Penasihat
  (1,  'penasihat', null, 'Penasihat', 'Barmansyah', null),
  (2,  'penasihat', null, 'Penasihat', 'Fadhilah Sakti Nugroho', null),
  -- Badan Pengurus Harian
  (1,  'bph', null, 'Ketua', 'Dimas Pratama Fitriandi', null),
  (2,  'bph', null, 'Wakil Ketua', 'Hafizh Muhammad Dzikra Sutisna', 'S.Pd.'),
  (3,  'bph', null, 'Wakil Ketua', 'Abdullah Azzam Umair', 'S.Sos.'),
  (4,  'bph', null, 'Wakil Ketua', 'Rizki Hasyim Sakban Nasution', null),
  (5,  'bph', null, 'Sekretaris', 'Lulu Khaulia', 'A.Md.I.Kom.'),
  (6,  'bph', null, 'Wakil Sekretaris', 'Ainurisma Sobrina', null),
  (7,  'bph', null, 'Bendahara', 'Indah Rachmadania', null),
  (8,  'bph', null, 'Wakil Bendahara', 'Tri Dewi Setyawati', null),
  -- OKK & Pemberdayaan SDM
  (1,  'bidang', 'okk', 'Kepala Bidang', 'Muhammad Akram Kautsar Umron', null),
  (2,  'bidang', 'okk', 'Anggota Bidang', 'Nur Latifah Zahra', null),
  (3,  'bidang', 'okk', 'Anggota Bidang', 'Muhammad Maulida Afrizal', null),
  (4,  'bidang', 'okk', 'Anggota Bidang', 'Ridho Ramadhani', null),
  (5,  'bidang', 'okk', 'Anggota Bidang', 'Mikail Hanif Pradana', null),
  (6,  'bidang', 'okk', 'Anggota Bidang', 'Muhamad Fadly Adzikri', null),
  (7,  'bidang', 'okk', 'Anggota Bidang', 'Muhammad Raihan', null),
  -- Kerohanian & Pembinaan Mental
  (1,  'bidang', 'kerohanian', 'Kepala Bidang', 'Razzan Adriansyah', null),
  (2,  'bidang', 'kerohanian', 'Anggota Bidang', 'Fahrizal Zachry', 'A.Md.I.Kom.'),
  (3,  'bidang', 'kerohanian', 'Anggota Bidang', 'Fajar Andhika Putra Santoso', null),
  (4,  'bidang', 'kerohanian', 'Anggota Bidang', 'Muhammad Habibi Muqtahidin', null),
  -- Lingkungan Kemasyarakatan, Kemitraan & Tata Kelola Organisasi
  (1,  'bidang', 'lingkungan', 'Kepala Bidang', 'Firman Valerian', null),
  (2,  'bidang', 'lingkungan', 'Anggota Bidang', 'Dafaldi Aditya', null),
  (3,  'bidang', 'lingkungan', 'Anggota Bidang', 'Ferdi Adrian', null),
  (4,  'bidang', 'lingkungan', 'Anggota Bidang', 'Agus Rinaldi', null),
  (5,  'bidang', 'lingkungan', 'Anggota Bidang', 'Muhammad Azki Hibatulloh', null),
  (6,  'bidang', 'lingkungan', 'Anggota Bidang', 'Muhammad Ikhsan', null),
  (7,  'bidang', 'lingkungan', 'Anggota Bidang', 'Muhammad Aliksan', null),
  (8,  'bidang', 'lingkungan', 'Anggota Bidang', 'Deandyka Mahendra', null),
  -- Ekonomi Mandiri & Kesejahteraan Sosial
  (1,  'bidang', 'ekonomi', 'Kepala Bidang', 'Syazkiya Alifah Annur', null),
  (2,  'bidang', 'ekonomi', 'Anggota Bidang', 'Rizkia Salma Ramadhani', null),
  (3,  'bidang', 'ekonomi', 'Anggota Bidang', 'Adinda Aulia Zahra', null),
  (4,  'bidang', 'ekonomi', 'Anggota Bidang', 'Nurvani Ishaqtijani', null),
  (5,  'bidang', 'ekonomi', 'Anggota Bidang', 'Siti Fathonnah', null),
  (6,  'bidang', 'ekonomi', 'Anggota Bidang', 'Nada Nurina Fajriani', null),
  (7,  'bidang', 'ekonomi', 'Anggota Bidang', 'Sabila Putri Zanah', null),
  (8,  'bidang', 'ekonomi', 'Anggota Bidang', 'Raya Adia Heza Muslimah', null),
  -- Pendidikan, Keolahragaan & Kebudayaan
  (1,  'bidang', 'pendidikan', 'Kepala Bidang', 'Omar Sultan', null),
  (2,  'bidang', 'pendidikan', 'Anggota Bidang', 'Kobar Jayamadya', null),
  (3,  'bidang', 'pendidikan', 'Anggota Bidang', 'Muhammad Rizky Ramdhani', null),
  (4,  'bidang', 'pendidikan', 'Anggota Bidang', 'Muhammad Faiz Fachrezy', null),
  (5,  'bidang', 'pendidikan', 'Anggota Bidang', 'Muhammad Rafid Ramadhan', null),
  (6,  'bidang', 'pendidikan', 'Anggota Bidang', 'Azka Zuhdi', null),
  (7,  'bidang', 'pendidikan', 'Anggota Bidang', 'Cakra Aditia', null),
  (8,  'bidang', 'pendidikan', 'Anggota Bidang', 'Muhammad Arif Setiawan', null),
  (9,  'bidang', 'pendidikan', 'Anggota Bidang', 'Gibran Latif', null),
  (10, 'bidang', 'pendidikan', 'Anggota Bidang', 'Hadil Alwan', null),
  (11, 'bidang', 'pendidikan', 'Anggota Bidang', 'Harza Fairuz', null),
  (12, 'bidang', 'pendidikan', 'Anggota Bidang', 'Alvis Fauzi Juniar', null),
  (13, 'bidang', 'pendidikan', 'Anggota Bidang', 'Muhammad Arfan Arrasyiq', null),
  -- Media Publikasi, Dokumentasi & Desain Grafis
  (1,  'bidang', 'media', 'Kepala Bidang', 'Deva Ramadhani', null),
  (2,  'bidang', 'media', 'Anggota Bidang', 'Rizky Fauzi Ramadhan', 'S.Kom.'),
  (3,  'bidang', 'media', 'Anggota Bidang', 'Aditya Firmansya', null),
  (4,  'bidang', 'media', 'Anggota Bidang', 'Hanif Muhammad Zhafran Sutisna', 'S.Kom.'),
  (5,  'bidang', 'media', 'Anggota Bidang', 'Kaisar Muhammad Dekariansyah', null),
  (6,  'bidang', 'media', 'Anggota Bidang', 'Keysha Noormeydhiana', null),
  (7,  'bidang', 'media', 'Anggota Bidang', 'Fazli Nugraha', null),
  -- Inventaris & Arsip
  (1,  'bidang', 'inventaris', 'Kepala Bidang', 'Azalea Agza Putri Susanto', null),
  (2,  'bidang', 'inventaris', 'Anggota Bidang', 'Rahma Amelia', null),
  (3,  'bidang', 'inventaris', 'Anggota Bidang', 'Alifia Putri Ramadhani', null),
  (4,  'bidang', 'inventaris', 'Anggota Bidang', 'Thalita Salwa Athaya Rayyan', null)
)
insert into public.pengurus (periode_id, nama, gelar, jabatan, grup, bidang_id, urutan)
select p.id, d.nama, d.gelar, d.jabatan, d.grup::public.struktur_grup, b.id, d.urutan
from data d
cross join p
left join public.bidang b on b.slug = d.bidang_slug;

-- Pengaman: jumlah harus sesuai SK (2 penasihat, 8 BPH, 51 anggota bidang).
do $$
declare
  n_penasihat int; n_bph int; n_bidang int;
begin
  select count(*) filter (where grup = 'penasihat'),
         count(*) filter (where grup = 'bph'),
         count(*) filter (where grup = 'bidang')
    into n_penasihat, n_bph, n_bidang
    from public.pengurus;
  if (n_penasihat, n_bph, n_bidang) <> (2, 8, 51) then
    raise exception 'Jumlah pengurus tidak sesuai SK: penasihat %, bph %, bidang %',
      n_penasihat, n_bph, n_bidang;
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Pengaturan awal (null = belum diisi; bagian terkait disembunyikan di web publik)
-- -----------------------------------------------------------------------------
insert into public.pengaturan (key, value, publik, keterangan)
values
  ('organisasi.nama', '"Karang Taruna RW 03 Cipedak"', true, 'Nama organisasi'),
  ('organisasi.wilayah', '"RW 03, Kelurahan Cipedak, Kecamatan Jagakarsa, Jakarta Selatan"', true, 'Wilayah kerja'),
  ('organisasi.jumlah_rt', '7', true, 'Jumlah RT di RW 03'),
  ('kontak.whatsapp', 'null', true, 'Nomor WhatsApp sekretariat, format 62xxxxxxxxxx'),
  ('kontak.email', 'null', true, 'Email resmi organisasi'),
  ('kontak.alamat', 'null', true, 'Alamat lengkap sekretariat'),
  ('kontak.maps_url', 'null', true, 'Link Google Maps sekretariat'),
  ('sosmed.instagram', 'null', true, 'URL akun Instagram resmi'),
  ('sosmed.tiktok', 'null', true, 'URL akun TikTok resmi'),
  ('sosmed.youtube', 'null', true, 'URL kanal YouTube resmi');
