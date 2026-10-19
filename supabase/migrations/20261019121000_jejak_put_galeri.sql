-- PUT presigned belum batal saat objek dihapus. Simpan jejak sampai semua URL-nya kedaluwarsa,
-- agar unggahan terlambat masih dapat ditemukan/dibersihkan dan tidak menjadi objek yatim.
alter table public.galeri_unggahan add column put_berlaku_sampai timestamptz not null default now()+interval '301 seconds';
