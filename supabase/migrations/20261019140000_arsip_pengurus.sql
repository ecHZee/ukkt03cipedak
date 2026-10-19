-- Hari 20: arsip baru disimpan privat; akses publik melalui gateway yang memeriksa baris.
-- Arsip lama tetap terbaca; saat mengubah aksesnya, salinan bucket publik wajib dibersihkan.
alter table public.pengurus add column aktif boolean not null default true;
drop policy "pengurus: semua boleh baca" on public.pengurus;
create policy "pengurus: semua boleh baca" on public.pengurus for select
using (aktif or (select public.is_bph()) or id = (select pengurus_id from public.profiles where id = (select auth.uid())));

create or replace function public.peran_dari_pengurus(p_pengurus uuid)
returns table(role public.app_role, bidang_id uuid) language sql stable set search_path = '' as $$
 select case when p.aktif and t.aktif and (p.grup='bph' or (p.grup='bidang' and p.jabatan='Kepala Bidang'))
   then 'admin'::public.app_role else 'anggota'::public.app_role end,
   case when p.grup='bidang' then p.bidang_id else null end
 from public.pengurus p join public.periode t on t.id=p.periode_id where p.id=p_pengurus;
$$;
create or replace function public.pengurus_sinkron_akun() returns trigger language plpgsql
security definer set search_path = '' as $$
begin
 if new.jabatan is distinct from old.jabatan or new.grup is distinct from old.grup
 or new.bidang_id is distinct from old.bidang_id or new.periode_id is distinct from old.periode_id
 or new.aktif is distinct from old.aktif then
  update public.profiles set pengurus_id=pengurus_id,
   aktif=case when not new.aktif or not exists(select 1 from public.periode where id=new.periode_id and aktif)
     then false else aktif end,
   izin_kontribusi=false
  where pengurus_id=new.id and role<>'super_admin';
 end if;
 return new;
end; $$;
create function public.jaga_pengurus_admin() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is not null and exists(select 1 from public.profiles where pengurus_id=old.id and role='super_admin')
 and public.peran_saya()<>'super_admin' then raise exception 'Data Super Admin hanya dapat diubah Super Admin.' using errcode='42501'; end if;
 return new;
end; $$;
create trigger a_jaga_pengurus_admin before update on public.pengurus for each row execute function public.jaga_pengurus_admin();
create function public.jaga_hapus_pengurus() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is not null and exists(select 1 from public.profiles where pengurus_id=old.id) then
  raise exception 'Pengurus yang terhubung akun harus dinonaktifkan, bukan dihapus.' using errcode='23514';
 end if;
 return old;
end; $$;
create trigger jaga_hapus_pengurus before delete on public.pengurus for each row execute function public.jaga_hapus_pengurus();
create function public.periode_sinkron_akun() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.aktif is distinct from old.aktif then
  update public.profiles set pengurus_id=pengurus_id,aktif=case when not new.aktif then false else aktif end,izin_kontribusi=false
   where pengurus_id in (select id from public.pengurus where periode_id=new.id) and role<>'super_admin';
 end if;
 return new;
end; $$;
create trigger sinkron_akun_periode after update of aktif on public.periode for each row execute function public.periode_sinkron_akun();
create policy "storage: hapus foto pengurus sendiri" on storage.objects for delete to authenticated using (
 bucket_id='media' and split_part(name,'/',1)='pengurus' and public.is_pengurus()
 and split_part(name,'/',2)=(select pengurus_id::text from public.profiles where id=auth.uid()));

create table public.arsip_sampah (
 id uuid primary key default gen_random_uuid(), bucket text not null check(bucket in ('dokumen-publik','dokumen-internal')),
 path text not null, created_by uuid references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.arsip_sampah enable row level security;
create policy "arsip sampah: pemilik/bph baca" on public.arsip_sampah for select to authenticated
 using ((select public.is_pengurus()) and (created_by=(select auth.uid()) or (select public.is_bph())));
create trigger audit after insert or update or delete on public.arsip_sampah for each row execute function public.catat_audit();
create function public.catat_berkas_arsip_lama() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if old.storage_path is not null and (tg_op='DELETE' or old.storage_path is distinct from new.storage_path) then
  insert into public.arsip_sampah(bucket,path,created_by) values
   (case when old.storage_path like 'privat:%' or old.akses<>'publik' then 'dokumen-internal' else 'dokumen-publik' end,
    regexp_replace(old.storage_path,'^privat:',''),auth.uid());
 end if;
 return old;
end; $$;
create trigger catat_berkas_lama after update or delete on public.dokumen for each row execute function public.catat_berkas_arsip_lama();

create function public.jaga_berkas_arsip() returns trigger language plpgsql security definer set search_path='' as $$
declare p text; m jsonb;
begin
 if new.storage_path like 'privat:%' then
  p:=substr(new.storage_path,8);
  if p !~ '^arsip/[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$' then raise exception 'Lokasi PDF tidak valid.' using errcode='23514'; end if;
  if auth.uid() is not null and (tg_op='INSERT' or new.storage_path is distinct from old.storage_path)
   and split_part(p,'/',2)<>auth.uid()::text then raise exception 'PDF harus dari unggahan sendiri.' using errcode='42501'; end if;
  select metadata into m from storage.objects where bucket_id='dokumen-internal' and name=p;
  if m is null or m->>'mimetype'<>'application/pdf' or (m->>'size')::bigint<>new.ukuran_bytes
    or new.ukuran_bytes not between 1 and 20971520 then raise exception 'Berkas PDF belum lengkap.' using errcode='23514'; end if;
 elsif tg_op='UPDATE' and old.storage_path is not null and old.akses='publik' and new.akses<>'publik'
 and exists(select 1 from storage.objects where bucket_id='dokumen-publik' and name=old.storage_path) then
  raise exception 'Salinan PDF publik lama harus dihapus terlebih dahulu.' using errcode='23514';
 end if;
 if tg_op='UPDATE' and old.storage_path is not null and old.storage_path not like 'privat:%'
 and old.akses='publik' and new.akses<>'publik'
 and exists(select 1 from storage.objects where bucket_id='dokumen-publik' and name=old.storage_path) then
  raise exception 'Salinan PDF publik lama harus dihapus terlebih dahulu.' using errcode='23514';
 end if;
 return new;
end; $$;
create trigger jaga_berkas_arsip before insert or update on public.dokumen for each row execute function public.jaga_berkas_arsip();
create unique index dokumen_satu_berkas_privat on public.dokumen(storage_path) where storage_path like 'privat:%';

-- Namespace arsip/<akun>/<uuid>.pdf: tidak boleh diganti di tempat atau dihapus saat masih dirujuk.
create function public.arsip_terpakai(p_path text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.dokumen where storage_path='privat:'||p_path);
$$;
create function public.boleh_baca_berkas_arsip(p_path text) returns boolean language plpgsql stable security definer set search_path='' as $$
declare d public.dokumen;
begin
 if not public.is_pengurus() then return false; end if;
 select * into d from public.dokumen where storage_path='privat:'||p_path;
 if not found then return split_part(p_path,'/',2)=auth.uid()::text; end if;
 return public.is_bph() or (d.akses<>'bph' and
  ((d.status='terbit' and d.akses in ('publik','anggota')) or public.boleh_kelola(d.bidang_id,d.created_by)));
end; $$;
revoke all on function public.arsip_terpakai(text), public.boleh_baca_berkas_arsip(text) from public,anon;
grant execute on function public.arsip_terpakai(text), public.boleh_baca_berkas_arsip(text) to authenticated;
alter policy "storage: admin unggah" on storage.objects with check (
 bucket_id in ('media','dokumen-publik','dokumen-internal') and public.boleh_tulis_folder(bucket_id,name)
 and not(bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip'));
alter policy "storage: admin ubah" on storage.objects using (
 bucket_id in ('media','dokumen-publik','dokumen-internal') and public.boleh_tulis_folder(bucket_id,name)
 and not(bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip')) with check (
 bucket_id in ('media','dokumen-publik','dokumen-internal') and public.boleh_tulis_folder(bucket_id,name)
 and not(bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip'));
alter policy "storage: admin hapus" on storage.objects using (
 bucket_id in ('media','dokumen-publik','dokumen-internal') and public.boleh_tulis_folder(bucket_id,name)
 and not(bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip'));
alter policy "storage: pengurus baca dokumen internal" on storage.objects using (
 bucket_id='dokumen-internal' and split_part(name,'/',1)<>'arsip' and
 (public.is_bph() or (split_part(name,'/',1)<>'bph' and public.is_pengurus())));
create policy "storage: unggah arsip sendiri" on storage.objects for insert to authenticated with check (
 bucket_id='dokumen-internal' and name ~ '^arsip/[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$'
 and split_part(name,'/',2)=(select auth.uid())::text and
 ((select public.peran_saya()) in ('admin','super_admin') or (select public.kontributor_saya())));
create policy "storage: baca arsip sesuai metadata" on storage.objects for select to authenticated using (
 bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip' and public.boleh_baca_berkas_arsip(name));
create policy "storage: hapus unggahan arsip lepas" on storage.objects for delete to authenticated using (
 bucket_id='dokumen-internal' and split_part(name,'/',1)='arsip' and split_part(name,'/',2)=(select auth.uid())::text
 and (select public.is_pengurus()) and not public.arsip_terpakai(name));

create function public.simpan_dokumen_admin(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.dokumen; r public.dokumen; uid uuid:=auth.uid(); target uuid:=coalesce((p_data->>'id')::uuid,gen_random_uuid()); b uuid:=(p_data->>'bidang_id')::uuid;
begin
 if not public.is_pengurus() then raise exception 'Akun tidak aktif.' using errcode='42501'; end if;
 select * into d from public.dokumen where id=target for update;
 if found then
  if not public.boleh_kelola(d.bidang_id,d.created_by) or (d.akses='bph' and not public.is_bph())
  or (d.status='terbit' and not public.boleh_terbit(d.bidang_id,d.created_by)) then raise exception 'Akses dokumen ditolak.' using errcode='42501'; end if;
  if d.updated_at is distinct from (p_data->>'versi')::timestamptz then raise exception 'Dokumen sudah berubah.' using errcode='40001'; end if;
 end if;
 if not public.boleh_kelola(b,coalesce(d.created_by,uid)) or (p_data->>'akses'='bph' and not public.is_bph())
 or (p_data->>'status'='terbit' and not public.boleh_terbit(b,coalesce(d.created_by,uid))) then raise exception 'Akses dokumen ditolak.' using errcode='42501'; end if;
 if p_data->>'status'='terbit' and coalesce(p_data->>'storage_path','')='' then raise exception 'Pilih PDF sebelum menerbitkan.' using errcode='23514'; end if;
 if d.id is null then
  insert into public.dokumen(id,judul,kategori,tahun,tanggal,bidang_id,akses,status,storage_path,ukuran_bytes,created_by)
   values(target,p_data->>'judul',p_data->>'kategori',(p_data->>'tahun')::smallint,(p_data->>'tanggal')::date,b,
    (p_data->>'akses')::public.akses_dokumen,(p_data->>'status')::public.status_konten,p_data->>'storage_path',(p_data->>'ukuran_bytes')::bigint,uid) returning * into r;
 else
  update public.dokumen set judul=p_data->>'judul',kategori=p_data->>'kategori',tahun=(p_data->>'tahun')::smallint,
   tanggal=(p_data->>'tanggal')::date,bidang_id=b,akses=(p_data->>'akses')::public.akses_dokumen,status=(p_data->>'status')::public.status_konten,
   storage_path=p_data->>'storage_path',ukuran_bytes=(p_data->>'ukuran_bytes')::bigint where id=target returning * into r;
 end if;
 return to_jsonb(r);
end; $$;
revoke all on function public.simpan_dokumen_admin(jsonb) from public,anon;
grant execute on function public.simpan_dokumen_admin(jsonb) to authenticated;

create function public.simpan_pengurus_admin(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.pengurus; r public.pengurus; target uuid:=coalesce((p_data->>'id')::uuid,gen_random_uuid());
begin
 if not public.is_bph() then raise exception 'Hanya BPH atau Super Admin yang dapat mengelola pengurus.' using errcode='42501'; end if;
 select * into d from public.pengurus where id=target for update;
 if found and d.updated_at is distinct from (p_data->>'versi')::timestamptz then raise exception 'Pengurus sudah berubah.' using errcode='40001'; end if;
 if d.id is null then
  insert into public.pengurus(id,periode_id,nama,gelar,jabatan,grup,bidang_id,urutan,rt,aktif,instagram,izin_instagram,foto_path,izin_foto)
  values(target,(p_data->>'periode_id')::uuid,p_data->>'nama',p_data->>'gelar',p_data->>'jabatan',
   (p_data->>'grup')::public.struktur_grup,(p_data->>'bidang_id')::uuid,(p_data->>'urutan')::smallint,p_data->>'rt',
   (p_data->>'aktif')::boolean,p_data->>'instagram',(p_data->>'izin_instagram')::boolean,p_data->>'foto_path',(p_data->>'izin_foto')::boolean) returning * into r;
 else
  update public.pengurus set periode_id=(p_data->>'periode_id')::uuid,nama=p_data->>'nama',gelar=p_data->>'gelar',jabatan=p_data->>'jabatan',
   grup=(p_data->>'grup')::public.struktur_grup,bidang_id=(p_data->>'bidang_id')::uuid,urutan=(p_data->>'urutan')::smallint,rt=p_data->>'rt',
   aktif=(p_data->>'aktif')::boolean,instagram=p_data->>'instagram',izin_instagram=(p_data->>'izin_instagram')::boolean,
   foto_path=p_data->>'foto_path',izin_foto=(p_data->>'izin_foto')::boolean where id=target returning * into r;
 end if;
 return to_jsonb(r);
end; $$;
revoke all on function public.simpan_pengurus_admin(jsonb) from public,anon;
grant execute on function public.simpan_pengurus_admin(jsonb) to authenticated;
