-- =============================================================================
-- Model role baru (keputusan Hanif, 30 Sep 2026)
--   super_admin → programmer saja; satu-satunya yang mengelola akun
--   admin       → BPH (bidang_id null = lintas bidang)
--                 Kabid & anggota pilihan Kabid (bidang_id diisi = bidangnya saja)
--   Anggota lain tidak punya akun.
-- Admin boleh langsung menerbitkan konten dalam jangkauannya (tanpa review BPH).
-- Menggantikan role lama: super_admin · bph · editor_bidang · anggota.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Ganti enum role (tabel profiles masih kosong, jadi aman)
-- -----------------------------------------------------------------------------
alter table public.profiles drop constraint profiles_editor_punya_bidang;
alter table public.profiles alter column role drop default;

drop function public.peran_saya();                 -- terikat ke tipe lama
alter type public.app_role rename to app_role_lama;
create type public.app_role as enum ('super_admin', 'admin');

alter table public.profiles
  alter column role type public.app_role
  using (case when role::text = 'super_admin' then 'super_admin' else 'admin' end)::public.app_role;
alter table public.profiles alter column role set default 'admin';
drop type public.app_role_lama;

comment on column public.profiles.bidang_id is
  'Hanya untuk role admin: null = admin lintas bidang (BPH); diisi = admin bidang tersebut (Kabid / anggota pilihan Kabid).';

-- -----------------------------------------------------------------------------
-- 2. Helper role
-- -----------------------------------------------------------------------------
create function public.peran_saya()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid()) and p.aktif
$$;

-- Admin lintas bidang (BPH) atau Super Admin.
-- Nama tetap is_bph() karena sudah dipakai kebijakan RLS.
create or replace function public.is_bph()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.aktif
      and (p.role = 'super_admin' or (p.role = 'admin' and p.bidang_id is null))
  )
$$;

-- Bidang milik admin bidang yang sedang login (null untuk BPH & Super Admin)
create or replace function public.bidang_saya()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.bidang_id
  from public.profiles p
  where p.id = (select auth.uid()) and p.aktif and p.role = 'admin'
$$;

-- Boleh mengelola baris?
--   Super Admin & BPH → semua
--   Admin bidang      → baris bidangnya, atau baris umum buatannya sendiri
create or replace function public.boleh_kelola(p_bidang uuid, p_pembuat uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_bph() then true
    when public.bidang_saya() is not null then
      p_bidang = public.bidang_saya()
      or (p_bidang is null and p_pembuat = (select auth.uid()))
    else false
  end
$$;

revoke execute on function public.peran_saya() from public;
grant execute on function public.peran_saya() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. Kebijakan konten: admin boleh menerbitkan & menghapus dalam jangkauannya
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['kegiatan', 'album', 'berita'] loop
    execute format('drop policy "%1$s: tambah" on public.%1$I', t);
    execute format('drop policy "%1$s: ubah" on public.%1$I', t);
    execute format('drop policy "%1$s: hapus" on public.%1$I', t);

    execute format($p$
      create policy "%1$s: tambah" on public.%1$I
        for insert to authenticated
        with check ((select public.boleh_kelola(bidang_id, created_by)))
    $p$, t);
    execute format($p$
      create policy "%1$s: ubah" on public.%1$I
        for update to authenticated
        using ((select public.boleh_kelola(bidang_id, created_by)))
        with check ((select public.boleh_kelola(bidang_id, created_by)))
    $p$, t);
    execute format($p$
      create policy "%1$s: hapus" on public.%1$I
        for delete to authenticated
        using ((select public.boleh_kelola(bidang_id, created_by)))
    $p$, t);
  end loop;
end;
$$;

-- Dokumen: akses 'bph' tetap khusus BPH & Super Admin.
drop policy "dokumen: tambah" on public.dokumen;
drop policy "dokumen: ubah" on public.dokumen;
drop policy "dokumen: hapus" on public.dokumen;

create policy "dokumen: tambah" on public.dokumen
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph())));
create policy "dokumen: ubah" on public.dokumen
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by))
         and (akses <> 'bph' or (select public.is_bph())))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph())));
create policy "dokumen: hapus" on public.dokumen
  for delete to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by))
         and (akses <> 'bph' or (select public.is_bph())));

comment on type public.akses_dokumen is
  'publik = semua orang · anggota = semua admin yang login · bph = BPH & Super Admin';
