-- =============================================================================
-- Hari 8.5 — Akun berbasis jabatan, username, izin kontribusi, alur persetujuan
-- Keputusan Hanif (1 Okt 2026):
--   • Login dengan username (kata pertama + terakhir nama); email internal <username>@akun.katar-rw03.internal
--   • Role mengikuti jabatan di tabel pengurus:
--       BPH → admin lintas bidang · Kepala Bidang → admin bidang · Anggota Bidang & Penasihat → anggota
--     Super Admin (programmer) diatur manual & tidak ditimpa.
--   • Anggota default hanya baca + ubah profil sendiri. Izin kontribusi (buat/ubah draft di bidangnya)
--     diberikan Kabid bidangnya, BPH, atau Super Admin. Konten anggota wajib disetujui sebelum terbit.
--   • Password awal acak per orang, wajib diganti saat login pertama.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Kolom akun
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column username text unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,40}$'),
  add column harus_ganti_password boolean not null default true,
  add column izin_kontribusi boolean not null default false,
  add column email_kontak text check (email_kontak is null or email_kontak ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'),
  add column no_hp text check (no_hp is null or no_hp ~ '^[0-9+ ()-]{8,20}$');

-- Akun yang sudah ada (Super Admin Hanif) tidak dipaksa ganti password lagi.
update public.profiles set harus_ganti_password = false;

comment on column public.profiles.izin_kontribusi is
  'Untuk role anggota: boleh membuat/mengubah draft di bidangnya. Diberikan Kabid bidangnya, BPH, atau Super Admin.';
comment on column public.profiles.email_kontak is 'Kontak pribadi - tidak pernah tampil di web publik.';
comment on column public.profiles.no_hp is 'Kontak pribadi - tidak pernah tampil di web publik.';

-- Satu pengurus paling banyak satu akun
create unique index profiles_satu_akun_per_pengurus on public.profiles (pengurus_id)
  where pengurus_id is not null;

-- -----------------------------------------------------------------------------
-- 2. Role otomatis dari jabatan
-- -----------------------------------------------------------------------------
create function public.peran_dari_pengurus(p_pengurus uuid)
returns table (role public.app_role, bidang_id uuid)
language sql
stable
set search_path = ''
as $$
  select
    case
      when p.grup = 'bph' then 'admin'::public.app_role
      when p.grup = 'bidang' and p.jabatan = 'Kepala Bidang' then 'admin'::public.app_role
      else 'anggota'::public.app_role
    end,
    case when p.grup = 'bidang' then p.bidang_id else null end
  from public.pengurus p
  where p.id = p_pengurus
$$;

-- Saat profil dibuat/diubah: role & bidang ikut jabatan (kecuali Super Admin)
create function public.profil_ikut_jabatan()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  r record;
begin
  if new.role = 'super_admin' or new.pengurus_id is null then
    return new;
  end if;
  select * into r from public.peran_dari_pengurus(new.pengurus_id);
  if found then
    new.role := r.role;
    new.bidang_id := r.bidang_id;
    if r.role <> 'anggota' then
      new.izin_kontribusi := false; -- admin tidak butuh izin terpisah
    end if;
  end if;
  return new;
end;
$$;

create trigger ikut_jabatan before insert or update on public.profiles
  for each row execute function public.profil_ikut_jabatan();

-- Saat jabatan/bidang pengurus diubah: akun terkait ikut berubah
create function public.pengurus_sinkron_akun()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.jabatan is distinct from old.jabatan
     or new.grup is distinct from old.grup
     or new.bidang_id is distinct from old.bidang_id then
    -- update kosong memicu trigger ikut_jabatan
    update public.profiles set pengurus_id = pengurus_id
    where pengurus_id = new.id and role <> 'super_admin';
  end if;
  return new;
end;
$$;
revoke execute on function public.pengurus_sinkron_akun() from public, anon, authenticated;

create trigger sinkron_akun after update on public.pengurus
  for each row execute function public.pengurus_sinkron_akun();

-- -----------------------------------------------------------------------------
-- 3. Helper role
-- -----------------------------------------------------------------------------
-- Bidang akun yang login (admin bidang maupun anggota)
create function public.bidang_akun_saya()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.bidang_id from public.profiles p where p.id = (select auth.uid()) and p.aktif
$$;

-- Anggota yang sudah diberi izin kontribusi
create function public.kontributor_saya()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.aktif and p.role = 'anggota' and p.izin_kontribusi
  )
$$;

-- Boleh MENERBITKAN konten di bidang ini? (BPH/Super Admin semua; admin bidang hanya bidangnya)
create function public.boleh_terbit(p_bidang uuid, p_pembuat uuid)
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

-- Boleh MENGELOLA (buat/ubah/hapus) baris ini?
--   admin → seperti boleh_terbit; anggota berizin → hanya baris buatannya di bidangnya
--   (larangan menyentuh konten terbit dicek di kebijakan lewat boleh_terbit)
create or replace function public.boleh_kelola(p_bidang uuid, p_pembuat uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.boleh_terbit(p_bidang, p_pembuat) then true
    when public.kontributor_saya() then
      p_pembuat = (select auth.uid())
      and p_bidang is not distinct from public.bidang_akun_saya()
    else false
  end
$$;

revoke execute on function public.bidang_akun_saya(), public.kontributor_saya(),
  public.boleh_terbit(uuid, uuid) from public;
grant execute on function public.bidang_akun_saya(), public.kontributor_saya(),
  public.boleh_terbit(uuid, uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. "Disetujui oleh" & kunci status terbit
-- -----------------------------------------------------------------------------
alter table public.kegiatan add column disetujui_oleh uuid references auth.users (id) on delete set null;
alter table public.berita   add column disetujui_oleh uuid references auth.users (id) on delete set null;
alter table public.album    add column disetujui_oleh uuid references auth.users (id) on delete set null;
alter table public.dokumen  add column disetujui_oleh uuid references auth.users (id) on delete set null;

create or replace function public.konten_set_meta()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if (select auth.uid()) is not null then
      new.created_by := (select auth.uid());
    end if;
  else
    new.created_by := old.created_by;
  end if;

  if to_jsonb(new) ? 'terbit_at' then
    if new.status = 'terbit' and (tg_op = 'INSERT' or old.status is distinct from 'terbit') then
      new.terbit_at := coalesce(new.terbit_at, now());
      new.disetujui_oleh := coalesce((select auth.uid()), new.disetujui_oleh);
    elsif new.status <> 'terbit' then
      new.terbit_at := null;
      new.disetujui_oleh := null;
    elsif tg_op = 'UPDATE' then
      new.disetujui_oleh := old.disetujui_oleh; -- tidak bisa dipalsukan
    end if;
  end if;
  return new;
end;
$$;

-- Kebijakan konten: kelola via boleh_kelola, status terbit (dan konten yang sudah terbit) hanya via boleh_terbit
do $do$
declare
  t text;
begin
  foreach t in array array['kegiatan', 'album', 'berita'] loop
    execute format('drop policy "%1$s: tambah" on public.%1$I', t);
    execute format('drop policy "%1$s: ubah" on public.%1$I', t);
    execute format('drop policy "%1$s: hapus" on public.%1$I', t);
    execute format(
      'create policy "%1$s: tambah" on public.%1$I for insert to authenticated '
      'with check ((select public.boleh_kelola(bidang_id, created_by)) '
      'and (status <> ''terbit'' or (select public.boleh_terbit(bidang_id, created_by))))', t);
    execute format(
      'create policy "%1$s: ubah" on public.%1$I for update to authenticated '
      'using ((select public.boleh_kelola(bidang_id, created_by)) '
      'and (status <> ''terbit'' or (select public.boleh_terbit(bidang_id, created_by)))) '
      'with check ((select public.boleh_kelola(bidang_id, created_by)) '
      'and (status <> ''terbit'' or (select public.boleh_terbit(bidang_id, created_by))))', t);
    execute format(
      'create policy "%1$s: hapus" on public.%1$I for delete to authenticated '
      'using ((select public.boleh_kelola(bidang_id, created_by)) '
      'and (status <> ''terbit'' or (select public.boleh_terbit(bidang_id, created_by))))', t);
  end loop;
end;
$do$;

drop policy "dokumen: tambah" on public.dokumen;
drop policy "dokumen: ubah" on public.dokumen;
drop policy "dokumen: hapus" on public.dokumen;
create policy "dokumen: tambah" on public.dokumen for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph()))
              and (status <> 'terbit' or (select public.boleh_terbit(bidang_id, created_by))));
create policy "dokumen: ubah" on public.dokumen for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by))
         and (akses <> 'bph' or (select public.is_bph()))
         and (status <> 'terbit' or (select public.boleh_terbit(bidang_id, created_by))))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph()))
              and (status <> 'terbit' or (select public.boleh_terbit(bidang_id, created_by))));
create policy "dokumen: hapus" on public.dokumen for delete to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by))
         and (akses <> 'bph' or (select public.is_bph()))
         and (status <> 'terbit' or (select public.boleh_terbit(bidang_id, created_by))));

-- Storage: anggota berizin boleh mengunggah ke folder bidangnya (bukan folder "umum")
create or replace function public.boleh_tulis_folder(p_bucket text, p_nama text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when public.is_bph() then true
    when public.bidang_saya() is not null or public.kontributor_saya() then
      (storage.foldername(p_nama))[1] =
        (select b.slug from public.bidang b where b.id = public.bidang_akun_saya())
      or ((storage.foldername(p_nama))[1] = 'umum' and p_bucket <> 'dokumen-internal'
          and public.bidang_saya() is not null)
    else false
  end
$$;

-- -----------------------------------------------------------------------------
-- 5. Siapa boleh melihat akun lain: sendiri · BPH semua · admin bidang → akun di bidangnya
-- -----------------------------------------------------------------------------
drop policy "profiles: lihat sendiri atau bph" on public.profiles;
create policy "profiles: lihat sendiri, kabid, atau bph" on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_bph())
    or (bidang_id is not null and bidang_id = (select public.bidang_saya()))
  );

-- -----------------------------------------------------------------------------
-- 6. Fungsi aman (RPC) — tanpa membuka UPDATE langsung ke profiles
-- -----------------------------------------------------------------------------
-- Beri / cabut izin kontribusi anggota (Kabid bidangnya, BPH, Super Admin)
create function public.atur_izin_kontribusi(p_profil uuid, p_izin boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target record;
begin
  select role, bidang_id into target from public.profiles where id = p_profil;
  if not found then raise exception 'Akun tidak ditemukan'; end if;
  if target.role <> 'anggota' then raise exception 'Izin kontribusi hanya untuk anggota'; end if;
  if not (
    public.is_bph()
    or (public.bidang_saya() is not null and target.bidang_id = public.bidang_saya())
  ) then
    raise exception 'Tidak berhak mengatur izin akun ini' using errcode = '42501';
  end if;
  update public.profiles set izin_kontribusi = p_izin where id = p_profil;
end;
$$;

-- Ubah data diri sendiri (semua role)
create function public.ubah_profil_saya(p_nama text, p_email text, p_hp text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception 'Harus login' using errcode = '42501'; end if;
  if length(trim(coalesce(p_nama, ''))) = 0 then raise exception 'Nama wajib diisi'; end if;
  update public.profiles
     set nama_tampilan = trim(p_nama),
         email_kontak = nullif(trim(p_email), ''),
         no_hp = nullif(trim(p_hp), '')
   where id = (select auth.uid());
end;
$$;

-- Foto profil sendiri = foto di halaman Tentang (tampil publik hanya bila diizinkan)
create function public.ubah_foto_saya(p_foto_path text, p_izin boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  pid uuid;
begin
  select pengurus_id into pid from public.profiles where id = (select auth.uid()) and aktif;
  if pid is null then raise exception 'Akun tidak terhubung ke data pengurus' using errcode = '42501'; end if;
  update public.pengurus set foto_path = p_foto_path, izin_foto = p_izin where id = pid;
end;
$$;

-- Tandai password sudah diganti (dipanggil setelah supabase.auth.updateUser)
create function public.selesai_ganti_password()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles set harus_ganti_password = false where id = (select auth.uid());
$$;

revoke execute on function public.atur_izin_kontribusi(uuid, boolean),
  public.ubah_profil_saya(text, text, text), public.ubah_foto_saya(text, boolean),
  public.selesai_ganti_password() from public, anon;
grant execute on function public.atur_izin_kontribusi(uuid, boolean),
  public.ubah_profil_saya(text, text, text), public.ubah_foto_saya(text, boolean),
  public.selesai_ganti_password() to authenticated;
