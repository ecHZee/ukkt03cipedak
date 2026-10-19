-- Hari 18: akun nonaktif tidak boleh menulis foto profil. Sebelum foto dilepas
-- dari pengurus, objek lamanya harus dihapus melalui API Storage (bukan DELETE SQL).
alter policy "storage: kelola foto profil sendiri (unggah)" on storage.objects
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and (select public.is_pengurus()));
alter policy "storage: kelola foto profil sendiri (ubah)" on storage.objects
  using (bucket_id = 'media' and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and (select public.is_pengurus()))
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and (select public.is_pengurus()));
alter policy "storage: kelola foto profil sendiri (hapus)" on storage.objects
  using (bucket_id = 'media' and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and (select public.is_pengurus()));

create function public.pastikan_foto_lama_dihapus()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.foto_path is not null
     and (not new.izin_foto or new.foto_path is distinct from old.foto_path)
     and exists (select 1 from storage.objects where bucket_id = 'media' and name = old.foto_path) then
    raise exception 'Hapus berkas foto lama sebelum mengganti atau mencabut izin foto.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger a_pastikan_foto_lama_dihapus before update of foto_path, izin_foto
  on public.pengurus for each row execute function public.pastikan_foto_lama_dihapus();

-- Sampul berita milik kontributor berizin. Namespace terpisah dari foto profil.
create policy "storage: kontributor unggah sampul berita" on storage.objects
  for insert to authenticated with check (bucket_id = 'media'
    and (storage.foldername(name))[1] = 'berita'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and ((select public.kontributor_saya()) or (select public.peran_saya()) in ('admin','super_admin')));
create policy "storage: kontributor hapus sampul sendiri" on storage.objects
  for delete to authenticated using (bucket_id = 'media'
    and (storage.foldername(name))[1] = 'berita'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and ((select public.kontributor_saya()) or (select public.peran_saya()) in ('admin','super_admin')));
