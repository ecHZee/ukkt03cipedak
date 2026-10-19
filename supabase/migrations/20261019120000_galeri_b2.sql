-- Hari 19: album sungguhan, reservasi B2 privat, finalisasi idempoten dan izin mengikuti album.
-- URL PUT hanya untuk staging. Status siap hanya boleh ditulis server setelah verifikasi objek.
alter table public.album add column gdrive_url text
  check (gdrive_url is null or gdrive_url ~ '^https://drive\.google\.com/drive/(u/[0-9]+/)?folders/[A-Za-z0-9_-]+$');

create table public.galeri_unggahan (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.album(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  hash_sumber text not null check (hash_sumber ~ '^[a-f0-9]{64}$'),
  jenis public.jenis_media not null check (jenis in ('foto','video')),
  mime text not null check (mime in ('image/webp','video/mp4','video/webm','video/quicktime')),
  ukuran_bytes bigint not null check (ukuran_bytes between 1 and 209715200),
  thumb_bytes bigint check (thumb_bytes between 1 and 2097152),
  lebar integer check (lebar between 1 and 1920), tinggi integer check (tinggi between 1 and 1920),
  caption text not null default '' check (length(caption)<=300),
  staging_path text not null unique, final_path text not null unique,
  status text not null default 'pending' check (status in ('pending','memproses','siap','selesai','batal')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(album_id,hash_sumber),
  check ((jenis='foto' and mime='image/webp' and ukuran_bytes<=20971520 and thumb_bytes is not null and lebar is not null and tinggi is not null)
    or (jenis='video' and mime<>'image/webp' and thumb_bytes is null))
);
alter table public.galeri_unggahan enable row level security;
create policy "unggahan: baca milik sendiri" on public.galeri_unggahan for select to authenticated
  using (created_by=(select auth.uid()) and exists(select 1 from public.album a where a.id=album_id and public.boleh_kelola(a.bidang_id,a.created_by)));
revoke all on public.galeri_unggahan from anon, authenticated;
grant select on public.galeri_unggahan to authenticated;
create trigger set_updated_at before update on public.galeri_unggahan for each row execute function public.set_updated_at();
create trigger audit after insert or update or delete on public.galeri_unggahan for each row execute function public.catat_audit();

-- Menutup celah media berbidang sama tetapi disisipkan ke album milik orang lain.
create function public.boleh_media_album(p_album uuid,p_bidang uuid,p_pembuat uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select case when p_album is null then public.boleh_kelola(p_bidang,p_pembuat) else exists(
 select 1 from public.album a where a.id=p_album and a.bidang_id is not distinct from p_bidang
 and public.boleh_kelola(a.bidang_id,a.created_by)
 and (a.status<>'terbit' or public.boleh_terbit(a.bidang_id,a.created_by))) end
$$;
revoke execute on function public.boleh_media_album(uuid,uuid,uuid) from public;
grant execute on function public.boleh_media_album(uuid,uuid,uuid) to authenticated;
drop policy "media: tambah" on public.media;
drop policy "media: ubah" on public.media;
drop policy "media: hapus" on public.media;
create policy "media: tambah" on public.media for insert to authenticated with check (public.boleh_media_album(album_id,bidang_id,created_by));
create policy "media: ubah" on public.media for update to authenticated using(public.boleh_media_album(album_id,bidang_id,created_by)) with check(public.boleh_media_album(album_id,bidang_id,created_by));
create policy "media: hapus" on public.media for delete to authenticated using(public.boleh_media_album(album_id,bidang_id,created_by));

create function public.jaga_media_b2() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if tg_op='UPDATE' and (old.storage_path like 'b2:%' or new.storage_path like 'b2:%')
 and (new.storage_path is distinct from old.storage_path or new.album_id is distinct from old.album_id or new.jenis<>old.jenis
 or new.mime is distinct from old.mime or new.ukuran_bytes is distinct from old.ukuran_bytes) then
   raise exception 'Objek B2 tidak dapat dipindah/diganti' using errcode='42501'; end if;
 if new.storage_path like 'b2:%' and not exists(select 1 from public.galeri_unggahan u where u.id=new.id
 and u.album_id=new.album_id and 'b2:'||u.final_path=new.storage_path and u.status in ('siap','selesai')
 and u.jenis=new.jenis and u.mime=new.mime and u.ukuran_bytes=new.ukuran_bytes) then
   raise exception 'Unggahan belum diverifikasi' using errcode='42501'; end if;
 return new;
end $$;
revoke execute on function public.jaga_media_b2() from public,anon,authenticated;
create trigger jaga_b2 before insert or update on public.media for each row execute function public.jaga_media_b2();

create function public.jaga_relasi_album() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.cover_id is not null and not exists(select 1 from public.media where id=new.cover_id and album_id=new.id and jenis='foto') then
  raise exception 'Sampul harus foto dari album yang sama'; end if;
 if tg_op='UPDATE' and new.bidang_id is distinct from old.bidang_id
 and (exists(select 1 from public.media where album_id=new.id) or exists(select 1 from public.galeri_unggahan where album_id=new.id)) then
  raise exception 'Bidang album berisi media tidak dapat diubah'; end if;
 return new;
end $$;
revoke execute on function public.jaga_relasi_album() from public,anon,authenticated;
create trigger jaga_relasi before insert or update on public.album for each row execute function public.jaga_relasi_album();

create function public.simpan_album_admin(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.album; v_id uuid; v_bidang uuid := (p_data->>'bidang_id')::uuid; v_status public.status_konten := (p_data->>'status')::public.status_konten;
begin
 if auth.uid() is null then raise exception 'Harus login' using errcode='42501'; end if;
 v_id := (p_data->>'id')::uuid;
 if v_id is not null then
  select * into a from public.album where id=v_id for update;
  if not found or not public.boleh_kelola(a.bidang_id,a.created_by) or (a.status='terbit' and not public.boleh_terbit(a.bidang_id,a.created_by)) then raise exception 'Album tidak tersedia' using errcode='42501'; end if;
  if a.updated_at is distinct from (p_data->>'versi')::timestamptz then raise exception 'Album berubah. Muat ulang' using errcode='40001'; end if;
  if a.bidang_id is distinct from v_bidang and (exists(select 1 from public.media where album_id=v_id) or exists(select 1 from public.galeri_unggahan where album_id=v_id)) then raise exception 'Bidang album berisi media tidak dapat diubah'; end if;
 else a.created_by:=auth.uid(); end if;
 if not public.boleh_kelola(v_bidang,a.created_by) or (v_status='terbit' and not public.boleh_terbit(v_bidang,a.created_by)) then raise exception 'Tidak berhak' using errcode='42501'; end if;
 if length(trim(coalesce(p_data->>'judul','')))=0 or length(p_data->>'judul')>180 or length(p_data->>'deskripsi')>3000 or length(p_data->>'slug')>120 then raise exception 'Isian tidak valid'; end if;
 if v_status<>'draft' and (not exists(select 1 from public.media where album_id=v_id) or not exists(select 1 from public.media where id=a.cover_id and album_id=v_id and jenis='foto') or exists(select 1 from public.galeri_unggahan where album_id=v_id and status in ('pending','memproses','siap'))) then raise exception 'Selesaikan unggahan dan pilih sampul foto sebelum review/terbit'; end if;
 if v_id is null then
  insert into public.album(judul,slug,deskripsi,tanggal,bidang_id,status,gdrive_url) values(trim(p_data->>'judul'),p_data->>'slug',p_data->>'deskripsi',(p_data->>'tanggal')::date,v_bidang,v_status,nullif(p_data->>'gdrive_url','')) returning * into a;
 else
  update public.album set judul=trim(p_data->>'judul'),slug=p_data->>'slug',deskripsi=p_data->>'deskripsi',tanggal=(p_data->>'tanggal')::date,bidang_id=v_bidang,status=v_status,gdrive_url=nullif(p_data->>'gdrive_url','') where id=v_id returning * into a;
 end if;
 return to_jsonb(a);
end $$;

create function public.reservasi_galeri(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.album; u public.galeri_unggahan; v_id uuid:=gen_random_uuid(); ext text; folder text;
begin
 select * into a from public.album where id=(p_data->>'album_id')::uuid for update;
 if not found or not public.boleh_kelola(a.bidang_id,a.created_by) or a.status='terbit' then raise exception 'Sunting draf album yang menjadi hakmu' using errcode='42501'; end if;
 select * into u from public.galeri_unggahan where album_id=a.id and hash_sumber=p_data->>'hash_sumber';
 if found then
  if u.created_by<>auth.uid() then raise exception 'File sudah dicadangkan oleh pengelola lain'; end if;
  if u.status='batal' then raise exception 'Bersihkan unggahan batal sebelum mengunggah ulang'; end if;
  if u.mime<>p_data->>'mime' or u.ukuran_bytes<>(p_data->>'ukuran_bytes')::bigint then raise exception 'Data file berbeda dari percobaan sebelumnya'; end if;
  return to_jsonb(u);
 end if;
 if (select count(*) from public.media where album_id=a.id)+(select count(*) from public.galeri_unggahan where album_id=a.id and status in ('pending','memproses','siap'))>=200 then raise exception 'Maksimal 200 media per album'; end if;
 if (select count(*) from public.galeri_unggahan where created_by=auth.uid() and status in ('pending','memproses','siap'))>=40 then raise exception 'Selesaikan/bersihkan antrean lama dahulu (maksimal 40)'; end if;
 ext:=case p_data->>'mime' when 'image/webp' then 'webp' when 'video/mp4' then 'mp4' when 'video/webm' then 'webm' when 'video/quicktime' then 'mov' else null end;
 if ext is null then raise exception 'Format tidak didukung'; end if;
 select coalesce(b.slug,'umum') into folder from (select 1) x left join public.bidang b on b.id=a.bidang_id;
 insert into public.galeri_unggahan(id,album_id,created_by,hash_sumber,jenis,mime,ukuran_bytes,thumb_bytes,lebar,tinggi,caption,staging_path,final_path)
 values(v_id,a.id,auth.uid(),p_data->>'hash_sumber',(p_data->>'jenis')::public.jenis_media,p_data->>'mime',(p_data->>'ukuran_bytes')::bigint,(p_data->>'thumb_bytes')::bigint,(p_data->>'lebar')::integer,(p_data->>'tinggi')::integer,coalesce(p_data->>'caption',''),
 'galeri/staging/'||auth.uid()||'/'||a.id||'/'||v_id||'.'||ext,'galeri/'||folder||'/'||a.id||'/'||v_id||'.'||ext) returning * into u;
 return to_jsonb(u);
end $$;

create function public.selesaikan_galeri(p_id uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare a public.album; u public.galeri_unggahan;
begin
 select * into u from public.galeri_unggahan where id=p_id;
 select * into a from public.album where id=u.album_id for update;
 select * into u from public.galeri_unggahan where id=p_id for update;
 if u.id is null or u.created_by<>auth.uid() or not public.boleh_kelola(a.bidang_id,a.created_by) or a.status='terbit' then raise exception 'Tidak berhak' using errcode='42501'; end if;
 if u.status='selesai' then return u.id; end if;
 if u.status<>'siap' then raise exception 'Berkas belum diverifikasi' using errcode='42501'; end if;
 insert into public.media(id,album_id,bidang_id,jenis,storage_path,caption,lebar,tinggi,ukuran_bytes,mime,urutan)
 values(u.id,a.id,a.bidang_id,u.jenis,'b2:'||u.final_path,u.caption,u.lebar,u.tinggi,u.ukuran_bytes,u.mime,coalesce((select max(urutan)+1 from public.media where album_id=a.id),0));
 update public.galeri_unggahan set status='selesai' where id=u.id;
 update public.album set cover_id=case when cover_id is null and u.jenis='foto' then u.id else cover_id end,updated_at=now() where id=a.id;
 return u.id;
end $$;

-- Satu lock album menserialkan cover, urutan, caption, hapus dan tautan eksternal.
create function public.atur_media_album(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.album; m public.media; tetangga public.media; aksi text:=p_data->>'aksi'; v_id uuid:=(p_data->>'media_id')::uuid; jumlah integer;
begin
 select * into a from public.album where id=(p_data->>'album_id')::uuid for update;
 if not found or not public.boleh_kelola(a.bidang_id,a.created_by) or a.status='terbit' then raise exception 'Sunting draf album yang menjadi hakmu' using errcode='42501'; end if;
 if a.updated_at is distinct from (p_data->>'versi')::timestamptz then raise exception 'Album berubah. Muat ulang' using errcode='40001'; end if;
 if aksi='embed' then
  if length(p_data->>'caption')>300 or coalesce(p_data->>'url','') !~ '^https://(www\.)?(youtube(-nocookie)?\.com/(watch\?|shorts/|embed/|live/)|youtu\.be/|instagram\.com/(p|reel|tv)/|tiktok\.com/)' then raise exception 'Tautan video tidak valid'; end if;
  if (select count(*) from public.media where album_id=a.id)>=200 then raise exception 'Maksimal 200 media'; end if;
  insert into public.media(album_id,bidang_id,jenis,embed_url,caption,urutan) values(a.id,a.bidang_id,'embed',p_data->>'url',p_data->>'caption',coalesce((select max(urutan)+1 from public.media where album_id=a.id),0));
 elsif aksi='bersihkan' then
  -- Pembatalan reservasi sendiri, tidak menyentuh unggahan pengelola lain.
  update public.galeri_unggahan set status='batal' where album_id=a.id and created_by=auth.uid() and (status in ('pending','siap') or (status='memproses' and updated_at<now()-interval '10 minutes'));
 elsif aksi='hapus_album' then
  if exists(select 1 from public.media where album_id=a.id) or exists(select 1 from public.galeri_unggahan where album_id=a.id) then raise exception 'Hapus media dan bersihkan unggahan dahulu'; end if;
  delete from public.album where id=a.id; return '{}'::jsonb;
 else
  select * into m from public.media where id=v_id and album_id=a.id;
  if not found then raise exception 'Media bukan milik album'; end if;
  case aksi
   when 'cover' then
    if m.jenis<>'foto' then raise exception 'Sampul harus foto'; end if;
    update public.album set cover_id=m.id where id=a.id;
   when 'caption' then
    if length(coalesce(p_data->>'caption',''))>300 then raise exception 'Caption maksimal 300 karakter'; end if;
    update public.media set caption=p_data->>'caption' where id=m.id;
   when 'hapus' then
    -- Objek lama dibersihkan server; status batal tetap dapat dicoba ulang jika B2 gagal.
    update public.galeri_unggahan set status='batal' where id=m.id;
    delete from public.media where id=m.id;
   when 'naik','turun' then
    -- Normalisasi dahulu: seed lama dapat mempunyai angka urutan yang sama.
    with posisi as (select id,row_number() over(order by urutan,id)::integer as n from public.media where album_id=a.id)
    update public.media x set urutan=p.n from posisi p where x.id=p.id;
    select * into m from public.media where id=v_id;
    select * into tetangga from public.media where album_id=a.id and urutan=m.urutan+case aksi when 'naik' then -1 else 1 end;
    if found then update public.media set urutan=case when id=m.id then tetangga.urutan else m.urutan end where id in(m.id,tetangga.id); end if;
   else raise exception 'Aksi tidak dikenal';
  end case;
 end if;
 update public.album set updated_at=now() where id=a.id returning * into a;
 return to_jsonb(a);
end $$;

revoke execute on function public.simpan_album_admin(jsonb),public.reservasi_galeri(jsonb),public.selesaikan_galeri(uuid),public.atur_media_album(jsonb) from public,anon;
grant execute on function public.simpan_album_admin(jsonb),public.reservasi_galeri(jsonb),public.selesaikan_galeri(uuid),public.atur_media_album(jsonb) to authenticated;
