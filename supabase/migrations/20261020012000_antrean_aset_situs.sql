-- Aset direservasi sebelum upload; draft kedaluwarsa tetap bisa dibersihkan setelah satu jam.
-- Saat simpan, aset aktif keluar antrean dan aset yang dilepas langsung siap dibersihkan.
create or replace function public.simpan_pengaturan_situs(p_data jsonb,p_versi jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 k text; v jsonb; s text; host text; t jsonb; f jsonb; versi jsonb; lama jsonb; p text; hasil jsonb;
 keys text[]:=array['organisasi.nama','organisasi.wilayah','organisasi.jumlah_rt','kontak.whatsapp','kontak.email','kontak.alamat','kontak.maps_url','sosmed.instagram','sosmed.tiktok','sosmed.youtube','pengumuman','situs.tampilan'];
begin
 if not public.is_bph() then raise exception 'Pengaturan khusus BPH' using errcode='42501'; end if;
 if p_data is null or p_versi is null or jsonb_typeof(p_data)<>'object' or jsonb_typeof(p_versi)<>'object' or (select count(*) from jsonb_object_keys(p_data))<>12
 or exists(select 1 from jsonb_object_keys(p_data) x where not(x=any(keys))) then raise exception 'Format pengaturan tidak sesuai'; end if;
 perform pg_advisory_xact_lock(21032026);
 select jsonb_object_agg(key,to_jsonb(updated_at)) into versi from public.pengaturan where key=any(keys);
 if (select count(*) from jsonb_object_keys(p_versi))<>12 or exists(select 1 from public.pengaturan where key=any(keys) and updated_at is distinct from (p_versi->>key)::timestamptz) then raise exception 'Pengaturan sudah berubah' using errcode='P0021'; end if;
 for k,v in select * from jsonb_each(p_data) loop
  s:=v#>>'{}';
  if k not in ('pengumuman','situs.tampilan','organisasi.jumlah_rt') then
   if jsonb_typeof(v)<>'string' or length(s)>500 or s<>btrim(s) then raise exception 'Teks tidak sesuai'; end if;
   if k='organisasi.nama' and length(s) not between 3 and 100 then raise exception 'Nama tidak sesuai'; end if;
   if k='organisasi.wilayah' and length(s)>200 then raise exception 'Wilayah terlalu panjang'; end if;
   if k='kontak.whatsapp' and s<>'' and s!~'^62[1-9][0-9]{7,12}$' then raise exception 'Nomor WA tidak sesuai'; end if;
   if k='kontak.email' and s<>'' and (length(s)>150 or s!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') then raise exception 'Email tidak sesuai'; end if;
   if (k like 'sosmed.%' or k='kontak.maps_url') and s<>'' then
    host:=substring(s from '^https://([a-zA-Z0-9.-]+)(?:/|\?|#|$)');
    if host is null or s ~ '[[:space:]\\]' or
     (k='sosmed.instagram' and lower(host) not in ('instagram.com','www.instagram.com')) or
     (k='sosmed.tiktok' and lower(host) not in ('tiktok.com','www.tiktok.com')) or
     (k='sosmed.youtube' and lower(host) not in ('youtube.com','www.youtube.com','youtu.be')) or
     (k='kontak.maps_url' and lower(host) not in ('maps.google.com','www.google.com','google.com','maps.app.goo.gl','goo.gl')) then raise exception 'Tautan tidak aman'; end if;
   end if;
  end if;
 end loop;
 s:=p_data->>'organisasi.jumlah_rt';
 if jsonb_typeof(p_data->'organisasi.jumlah_rt')<>'number' or s!~'^[0-9]{1,4}$' or s::int not between 1 and 1000 then raise exception 'Jumlah RT tidak sesuai'; end if;
 v:=p_data->'pengumuman';
 if jsonb_typeof(v)<>'object' or (select count(*) from jsonb_object_keys(v))<>3
 or not(v ?& array['teks','tautan','sampai']) then raise exception 'Pengumuman tidak sesuai'; end if;
 for k,s in select key,value#>>'{}' from jsonb_each(v) loop
  if jsonb_typeof(v->k)<>'string' then raise exception 'Pengumuman harus teks'; end if;
 end loop;
 if length(v->>'teks')>300 or length(v->>'tautan')>500 then raise exception 'Pengumuman terlalu panjang'; end if;
 s:=v->>'tautan';
 if s<>'' and (s ~ '[[:space:]\\]' or not(s ~ '^/[^/]' or s='/' or s ~ '^https://[a-zA-Z0-9.-]+(/|\?|#|$)')) then raise exception 'Tautan pengumuman tidak aman'; end if;
 s:=v->>'sampai';
 if s<>'' and (s!~'^\d{4}-\d{2}-\d{2}$' or to_char(s::date,'YYYY-MM-DD')<>s) then raise exception 'Tanggal tidak sesuai'; end if;
 t:=p_data->'situs.tampilan';
 if jsonb_typeof(t)<>'object' or not(t ?& array['tagline','logo','foto']) or (select count(*) from jsonb_object_keys(t))<>3
 or jsonb_typeof(t->'tagline')<>'string' or length(t->>'tagline')>180 or jsonb_typeof(t->'logo')<>'string'
 or jsonb_typeof(t->'foto')<>'array' or jsonb_array_length(t->'foto')<>4 then raise exception 'Tampilan tidak sesuai'; end if;
 for f in select * from jsonb_array_elements(t->'foto') loop
  if jsonb_typeof(f)<>'object' or not(f ?& array['path','caption']) or (select count(*) from jsonb_object_keys(f))<>2
  or jsonb_typeof(f->'path')<>'string' or jsonb_typeof(f->'caption')<>'string' or length(f->>'caption')>100
  or (f->>'path'<>'' and btrim(f->>'caption')='') then raise exception 'Foto perlu keterangan'; end if;
 end loop;
 select value into lama from public.pengaturan where key='situs.tampilan';
 for p in select * from public.path_aset_situs(t) loop
  if p!~'^pengaturan/[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$' or
   (split_part(p,'/',2)<>auth.uid()::text and not exists(select 1 from public.path_aset_situs(lama) x where x=p)) or
   not exists(select 1 from storage.objects o where o.bucket_id='media' and o.name=p and o.metadata->>'mimetype'='image/webp' and (o.metadata->>'size')::bigint between 1 and 2097152)
   then raise exception 'Aset tidak tersedia atau bukan unggahan sendiri'; end if;
 end loop;
 delete from public.aset_situs_sampah where path in (select * from public.path_aset_situs(t));
 insert into public.aset_situs_sampah(path,created_at) select x, '1970-01-01'::timestamptz from public.path_aset_situs(lama) x where not exists(select 1 from public.path_aset_situs(t) y where x=y) on conflict(path) do update set created_at='1970-01-01'::timestamptz;
 for k,v in select * from jsonb_each(p_data) loop
  update public.pengaturan set value=v where key=k and value is distinct from v;
 end loop;
 select jsonb_object_agg(key,to_jsonb(updated_at)) into hasil from public.pengaturan where key=any(keys);
 return hasil;
end; $$;
