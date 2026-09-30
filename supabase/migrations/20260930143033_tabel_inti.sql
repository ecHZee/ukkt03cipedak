-- =============================================================================
-- Hari 3 — Tabel inti organisasi
-- periode · bidang · pengurus · profiles · pengaturan · audit_log
-- + helper role, RLS, trigger updated_at, trigger privasi, trigger audit log
-- Rujukan: docs/PLANNING.md §6 (model data) & §7 (role & hak akses)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipe
-- -----------------------------------------------------------------------------
create type public.app_role as enum ('super_admin', 'bph', 'editor_bidang', 'anggota');
create type public.struktur_grup as enum ('penasihat', 'bph', 'bidang');

-- -----------------------------------------------------------------------------
-- Trigger umum: updated_at
-- -----------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- periode — masa bakti kepengurusan
-- -----------------------------------------------------------------------------
create table public.periode (
  id                 uuid primary key default gen_random_uuid(),
  label              text not null unique,           -- "2025–2028"
  nomor_sk           text,
  tanggal_sk         date,
  tanggal_pelantikan date,                           -- null = belum dikonfirmasi
  aktif              boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
-- Hanya boleh ada satu periode aktif.
create unique index periode_satu_aktif on public.periode (aktif) where aktif;

-- -----------------------------------------------------------------------------
-- bidang — 7 bidang sesuai SK
-- -----------------------------------------------------------------------------
create table public.bidang (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  nama_resmi   text not null,
  nama_singkat text not null,
  tagline      text,
  deskripsi    text,
  fokus        text[] not null default '{}',
  ikon         text,                                 -- nama ikon lucide
  urutan       smallint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- pengurus — susunan per periode (jumlah per bidang bebas)
-- -----------------------------------------------------------------------------
create table public.pengurus (
  id             uuid primary key default gen_random_uuid(),
  periode_id     uuid not null references public.periode (id) on delete restrict,
  nama           text not null check (length(trim(nama)) > 0),
  gelar          text,
  jabatan        text not null,                      -- "Ketua", "Kepala Bidang", ...
  grup           public.struktur_grup not null,
  bidang_id      uuid references public.bidang (id) on delete restrict,
  urutan         smallint not null default 0,
  rt             text check (rt is null or rt ~ '^RT 0[1-7]$'),
  foto_path      text,
  instagram      text,
  izin_foto      boolean not null default false,
  izin_instagram boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- anggota bidang wajib punya bidang; penasihat & BPH tidak
  constraint pengurus_bidang_sesuai_grup check ((grup = 'bidang') = (bidang_id is not null))
);
create index pengurus_periode_idx on public.pengurus (periode_id, grup, urutan);
create index pengurus_bidang_idx on public.pengurus (bidang_id);

-- Privasi: foto & Instagram hanya tersimpan bila yang bersangkutan mengizinkan.
create function public.pengurus_jaga_privasi()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not new.izin_foto then
    new.foto_path := null;
  end if;
  if not new.izin_instagram then
    new.instagram := null;
  end if;
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles — akun login pengurus (1:1 dengan auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  pengurus_id   uuid references public.pengurus (id) on delete set null,
  nama_tampilan text not null,
  role          public.app_role not null default 'anggota',
  bidang_id     uuid references public.bidang (id) on delete set null,
  aktif         boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- editor bidang harus terikat ke satu bidang
  constraint profiles_editor_punya_bidang check (role <> 'editor_bidang' or bidang_id is not null)
);

-- -----------------------------------------------------------------------------
-- pengaturan — key/value yang diubah dari admin (WA, sosmed, alamat, ...)
-- -----------------------------------------------------------------------------
create table public.pengaturan (
  key        text primary key check (key ~ '^[a-z0-9_.]+$'),
  value      jsonb not null,
  publik     boolean not null default true,         -- false = hanya untuk pengurus
  keterangan text,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- audit_log — diisi otomatis oleh trigger, tidak bisa diubah siapa pun
-- -----------------------------------------------------------------------------
create table public.audit_log (
  id        bigint generated always as identity primary key,
  tabel     text not null,
  aksi      text not null check (aksi in ('INSERT', 'UPDATE', 'DELETE')),
  record_id text,
  user_id   uuid,                                    -- null = sistem / migrasi
  sebelum   jsonb,
  sesudah   jsonb,
  waktu     timestamptz not null default now()
);
create index audit_log_waktu_idx on public.audit_log (waktu desc);
create index audit_log_tabel_idx on public.audit_log (tabel, record_id);

-- -----------------------------------------------------------------------------
-- Helper role (SECURITY DEFINER agar bisa membaca profiles tanpa memicu RLS)
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

create function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.peran_saya() = 'super_admin', false)
$$;

-- BPH atau Super Admin
create function public.is_bph()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.peran_saya() in ('super_admin', 'bph'), false)
$$;

-- Semua akun pengurus yang aktif
create function public.is_pengurus()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.peran_saya() is not null
$$;

-- Bidang milik editor yang sedang login (null untuk role lain)
create function public.bidang_saya()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.bidang_id
  from public.profiles p
  where p.id = (select auth.uid()) and p.aktif and p.role = 'editor_bidang'
$$;

revoke execute on function public.peran_saya(), public.is_super_admin(), public.is_bph(),
  public.is_pengurus(), public.bidang_saya() from public;
grant execute on function public.peran_saya(), public.is_super_admin(), public.is_bph(),
  public.is_pengurus(), public.bidang_saya() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Trigger audit log
-- -----------------------------------------------------------------------------
create function public.catat_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  rid text;
begin
  rid := coalesce(to_jsonb(new) ->> 'id', to_jsonb(new) ->> 'key',
                  to_jsonb(old) ->> 'id', to_jsonb(old) ->> 'key');
  insert into public.audit_log (tabel, aksi, record_id, user_id, sebelum, sesudah)
  values (
    tg_table_name,
    tg_op,
    rid,
    (select auth.uid()),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;
revoke execute on function public.catat_audit() from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Pasang trigger
-- -----------------------------------------------------------------------------
create trigger set_updated_at before update on public.periode
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.bidang
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.pengurus
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.pengaturan
  for each row execute function public.set_updated_at();

create trigger jaga_privasi before insert or update on public.pengurus
  for each row execute function public.pengurus_jaga_privasi();

create trigger audit after insert or update or delete on public.periode
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.bidang
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.pengurus
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.profiles
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.pengaturan
  for each row execute function public.catat_audit();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.periode    enable row level security;
alter table public.bidang     enable row level security;
alter table public.pengurus   enable row level security;
alter table public.profiles   enable row level security;
alter table public.pengaturan enable row level security;
alter table public.audit_log  enable row level security;

-- periode: publik baca, Super Admin kelola
create policy "periode: semua boleh baca" on public.periode
  for select to anon, authenticated using (true);
create policy "periode: super admin tambah" on public.periode
  for insert to authenticated with check ((select public.is_super_admin()));
create policy "periode: super admin ubah" on public.periode
  for update to authenticated using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
create policy "periode: super admin hapus" on public.periode
  for delete to authenticated using ((select public.is_super_admin()));

-- bidang: publik baca, Super Admin kelola
create policy "bidang: semua boleh baca" on public.bidang
  for select to anon, authenticated using (true);
create policy "bidang: super admin tambah" on public.bidang
  for insert to authenticated with check ((select public.is_super_admin()));
create policy "bidang: super admin ubah" on public.bidang
  for update to authenticated using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
create policy "bidang: super admin hapus" on public.bidang
  for delete to authenticated using ((select public.is_super_admin()));

-- pengurus: publik baca (foto/IG sudah disaring trigger privasi), BPH kelola
create policy "pengurus: semua boleh baca" on public.pengurus
  for select to anon, authenticated using (true);
create policy "pengurus: bph tambah" on public.pengurus
  for insert to authenticated with check ((select public.is_bph()));
create policy "pengurus: bph ubah" on public.pengurus
  for update to authenticated using ((select public.is_bph()))
  with check ((select public.is_bph()));
create policy "pengurus: bph hapus" on public.pengurus
  for delete to authenticated using ((select public.is_bph()));

-- profiles: lihat milik sendiri atau (BPH) semua; hanya Super Admin yang mengubah
-- (mencegah siapa pun menaikkan role-nya sendiri)
create policy "profiles: lihat sendiri atau bph" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_bph()));
create policy "profiles: super admin tambah" on public.profiles
  for insert to authenticated with check ((select public.is_super_admin()));
create policy "profiles: super admin ubah" on public.profiles
  for update to authenticated using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
create policy "profiles: super admin hapus" on public.profiles
  for delete to authenticated using ((select public.is_super_admin()));

-- pengaturan: publik baca yang publik, pengurus baca semua, BPH kelola
create policy "pengaturan: baca yang publik" on public.pengaturan
  for select to anon, authenticated
  using (publik or (select public.is_pengurus()));
create policy "pengaturan: bph tambah" on public.pengaturan
  for insert to authenticated with check ((select public.is_bph()));
create policy "pengaturan: bph ubah" on public.pengaturan
  for update to authenticated using ((select public.is_bph()))
  with check ((select public.is_bph()));
create policy "pengaturan: bph hapus" on public.pengaturan
  for delete to authenticated using ((select public.is_bph()));

-- audit_log: hanya BPH yang boleh membaca; tidak ada yang boleh menulis langsung
create policy "audit_log: bph baca" on public.audit_log
  for select to authenticated using ((select public.is_bph()));
revoke insert, update, delete, truncate on public.audit_log from anon, authenticated;
