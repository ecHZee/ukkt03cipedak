-- Berita dan metadata sampul disimpan satu transaksi, tetap sebagai pengguna/JWT (RLS).
-- Metadata pembuat/penerbit tetap ditetapkan trigger, bukan masukan browser.
create function public.simpan_berita_admin(p_data jsonb, p_sampul jsonb default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  lama public.berita;
  hasil public.berita;
  sampul uuid;
begin
  if p_data->>'id' is not null then
    select * into lama from public.berita where id = (p_data->>'id')::uuid for update;
    if not found or lama.updated_at is distinct from (p_data->>'versi')::timestamptz then
      raise exception 'Berita sudah berubah atau tidak tersedia. Muat ulang sebelum menyimpan.' using errcode = '40001';
    end if;
    if not public.boleh_kelola(lama.bidang_id, lama.created_by)
       or (lama.status = 'terbit' and not public.boleh_terbit(lama.bidang_id, lama.created_by)) then
      raise exception 'Tidak berhak mengubah berita ini.' using errcode = '42501';
    end if;
  end if;
  if not public.boleh_kelola((p_data->>'bidang_id')::uuid, coalesce(lama.created_by, auth.uid()))
     or (p_data->>'status' = 'terbit' and not public.boleh_terbit((p_data->>'bidang_id')::uuid, coalesce(lama.created_by, auth.uid()))) then
    raise exception 'Tidak berhak menyimpan bidang/status ini.' using errcode = '42501';
  end if;
  sampul := (p_data->>'cover_id')::uuid;
  if sampul is not null and sampul is distinct from lama.cover_id then
    raise exception 'Sampul baru harus melalui unggahan sendiri.' using errcode = '42501';
  end if;
  if p_sampul is not null and p_sampul <> 'null'::jsonb then
    if p_sampul->>'path' !~ ('^berita/' || auth.uid()::text || '/[a-zA-Z0-9-]+\.webp$')
       or not exists (select 1 from storage.objects where bucket_id = 'media' and name = p_sampul->>'path') then
      raise exception 'Berkas sampul tidak tersedia atau bukan milikmu.' using errcode = '42501';
    end if;
    insert into public.media (bidang_id, jenis, storage_path, caption, lebar, tinggi, ukuran_bytes, mime)
      values ((p_data->>'bidang_id')::uuid, 'foto', p_sampul->>'path', p_sampul->>'caption',
        (p_sampul->>'lebar')::int, (p_sampul->>'tinggi')::int, (p_sampul->>'ukuranByte')::bigint, 'image/webp')
      returning id into sampul;
  end if;
  if lama.id is null then
    insert into public.berita (judul, slug, ringkasan, isi, bidang_id, pinned, status, cover_id)
      values (p_data->>'judul', p_data->>'slug', nullif(p_data->>'ringkasan',''), nullif(p_data->>'isi',''),
        (p_data->>'bidang_id')::uuid, (p_data->>'pinned')::boolean, (p_data->>'status')::public.status_konten, sampul)
      returning * into hasil;
  else
    update public.berita set judul = p_data->>'judul', slug = p_data->>'slug',
      ringkasan = nullif(p_data->>'ringkasan',''), isi = nullif(p_data->>'isi',''),
      bidang_id = (p_data->>'bidang_id')::uuid, pinned = (p_data->>'pinned')::boolean,
      status = (p_data->>'status')::public.status_konten, cover_id = sampul
      where id = lama.id returning * into hasil;
    if not found then raise exception 'Akses berita berubah.' using errcode = '42501'; end if;
  end if;
  return jsonb_build_object('id', hasil.id, 'slug', hasil.slug, 'status', hasil.status);
end;
$$;
revoke execute on function public.simpan_berita_admin(jsonb,jsonb) from public;
grant execute on function public.simpan_berita_admin(jsonb,jsonb) to authenticated;
