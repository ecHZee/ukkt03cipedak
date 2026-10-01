-- =============================================================================
-- Foto profil: setiap akun (termasuk anggota tanpa izin kontribusi) boleh mengelola
-- foto di folder pribadinya media/profil/<id-akun>/… . Foto ini juga foto di halaman Tentang,
-- dan hanya tampil publik bila pemiliknya mengizinkan (trigger privasi pengurus).
-- =============================================================================

create policy "storage: kelola foto profil sendiri (unggah)" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
create policy "storage: kelola foto profil sendiri (ubah)" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
create policy "storage: kelola foto profil sendiri (hapus)" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'profil'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

-- Foto profil hanya boleh menunjuk ke folder milik sendiri (atau dikosongkan)
create or replace function public.ubah_foto_saya(p_foto_path text, p_izin boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  pid uuid;
begin
  select pengurus_id into pid from public.profiles where id = (select auth.uid()) and aktif;
  if pid is null then
    raise exception 'Akun tidak terhubung ke data pengurus' using errcode = '42501';
  end if;
  if p_foto_path is not null
     and p_foto_path not like 'profil/' || (select auth.uid())::text || '/%' then
    raise exception 'Foto harus berada di folder profil milik sendiri' using errcode = '42501';
  end if;
  update public.pengurus set foto_path = p_foto_path, izin_foto = p_izin where id = pid;
end;
$$;
