-- =============================================================================
-- Revisi nama bidang (pengumuman pengurus, 1 Okt 2026)
-- Yang berubah: Media (… & Desain Grafis → … & Digitalisasi) dan
-- Inventaris & Arsip → Inventarisasi & Kearsipan. OKK hanya penyeragaman tanda koma.
-- Slug tidak diubah supaya tautan & relasi tetap aman.
-- Catatan: lampiran SK 003/SK/KT-Cipedak/VI/2025 masih memakai nama lama.
-- =============================================================================

update public.bidang
set nama_resmi = 'Organisasi, Kaderisasi, Keanggotaan (OKK) & Pemberdayaan SDM'
where slug = 'okk';

update public.bidang
set nama_resmi = 'Media Publikasi, Dokumentasi & Digitalisasi',
    deskripsi  = 'Mengelola kanal media sosial dan website, dokumentasi setiap kegiatan, serta digitalisasi organisasi.',
    fokus      = array['Dokumentasi kegiatan', 'Media sosial & website', 'Digitalisasi organisasi']
where slug = 'media';

update public.bidang
set nama_resmi   = 'Inventarisasi & Kearsipan',
    nama_singkat = 'Inventaris & Arsip',
    deskripsi    = 'Menginventarisasi seluruh aset organisasi, serta mengarsipkan dokumen resmi lintas periode.'
where slug = 'inventaris';

-- Pengaman: batal bila salah satu revisi tidak teraplikasi.
do $$
begin
  if (select count(*) from public.bidang
      where (slug = 'okk' and nama_resmi like 'Organisasi, Kaderisasi,%')
         or (slug = 'media' and nama_resmi = 'Media Publikasi, Dokumentasi & Digitalisasi')
         or (slug = 'inventaris' and nama_resmi = 'Inventarisasi & Kearsipan')) <> 3 then
    raise exception 'Revisi nama bidang tidak teraplikasi lengkap';
  end if;
end;
$$;
