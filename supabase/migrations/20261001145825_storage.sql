-- =============================================================================
-- Hari 8 — Penyimpanan file (Supabase Storage)
-- Bucket:
--   media            publik  · foto & video pendek (≤ 50 MB)
--   dokumen-publik   publik  · PDF yang boleh diunduh siapa saja (≤ 20 MB)
--   dokumen-internal privat  · PDF khusus pengurus, diakses lewat signed URL (≤ 20 MB)
-- Struktur path: <folder>/<nama-file>, folder = slug bidang, "umum", atau "bph" (khusus internal BPH).
-- Aturan: BPH & Super Admin bebas; admin bidang hanya di folder bidangnya (+ "umum" untuk media/dokumen publik).
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 52428800,
   array['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('dokumen-publik', 'dokumen-publik', true, 20971520, array['application/pdf']),
  ('dokumen-internal', 'dokumen-internal', false, 20971520, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Slug bidang milik admin bidang yang login (null untuk BPH / Super Admin / tamu)
create function public.bidang_slug_saya()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select b.slug from public.bidang b where b.id = public.bidang_saya()
$$;
revoke execute on function public.bidang_slug_saya() from public;
grant execute on function public.bidang_slug_saya() to authenticated;

-- Boleh menulis ke folder ini?
create function public.boleh_tulis_folder(p_bucket text, p_nama text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_bph() then true
    when public.bidang_slug_saya() is null then false
    else (storage.foldername(p_nama))[1] = public.bidang_slug_saya()
         or ((storage.foldername(p_nama))[1] = 'umum' and p_bucket <> 'dokumen-internal')
  end
$$;
revoke execute on function public.boleh_tulis_folder(text, text) from public;
grant execute on function public.boleh_tulis_folder(text, text) to authenticated;

-- ---------- Tulis (unggah / ganti / hapus) ----------
create policy "storage: admin unggah" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('media', 'dokumen-publik', 'dokumen-internal')
    and (select public.boleh_tulis_folder(bucket_id, name))
  );
create policy "storage: admin ubah" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('media', 'dokumen-publik', 'dokumen-internal')
    and (select public.boleh_tulis_folder(bucket_id, name))
  )
  with check (
    bucket_id in ('media', 'dokumen-publik', 'dokumen-internal')
    and (select public.boleh_tulis_folder(bucket_id, name))
  );
create policy "storage: admin hapus" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('media', 'dokumen-publik', 'dokumen-internal')
    and (select public.boleh_tulis_folder(bucket_id, name))
  );

-- ---------- Baca ----------
-- Bucket publik dibaca lewat URL publik (tanpa RLS). Kebijakan ini untuk daftar file & signed URL.
create policy "storage: baca media & dokumen publik" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media', 'dokumen-publik'));
create policy "storage: pengurus baca dokumen internal" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'dokumen-internal'
    and (
      (select public.is_bph())
      or ((storage.foldername(name))[1] <> 'bph' and (select public.is_pengurus()))
    )
  );
