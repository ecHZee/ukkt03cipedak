-- Jalur lama hanya untuk membaca/mempertahankan arsip yang sudah ada.
-- Pemanggil langsung RPC tidak boleh menautkan berkas publik/berkas orang lain.
create function public.jaga_jalur_arsip_baru() returns trigger language plpgsql
security definer set search_path='' as $$
begin
 if auth.uid() is not null and new.storage_path is not null
 and (tg_op='INSERT' or new.storage_path is distinct from old.storage_path)
 and new.storage_path not like 'privat:arsip/%' then
  raise exception 'Unggah PDF baru melalui penyimpanan arsip privat.' using errcode='23514';
 end if;
 return new;
end; $$;
create trigger jaga_jalur_arsip_baru before insert or update on public.dokumen
for each row execute function public.jaga_jalur_arsip_baru();

-- Penonaktifan melalui RPC/tabel langsung juga wajib melepas foto.
alter table public.pengurus add constraint pengurus_nonaktif_tanpa_izin_foto
check (aktif or not izin_foto);
