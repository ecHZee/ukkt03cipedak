-- Role ketiga: anggota (Anggota Bidang & Penasihat). Dipisah dari migrasi berikutnya karena
-- nilai enum baru belum boleh dipakai di transaksi yang sama.
alter type public.app_role add value if not exists 'anggota';
