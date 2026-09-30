-- =============================================================================
-- Hari 4 — Tabel konten
-- kegiatan · berita · album · media · dokumen
-- + alur draft → review → terbit, akses per bidang, trigger pembuat & tanggal terbit
-- Rujukan: docs/PLANNING.md §6 (model data) & §7 (role & hak akses)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipe
-- -----------------------------------------------------------------------------
create type public.status_konten as enum ('draft', 'review', 'terbit');
create type public.tahap_kegiatan as enum ('rencana', 'berjalan', 'selesai', 'batal');
create type public.jenis_media as enum ('foto', 'video', 'embed');
create type public.akses_dokumen as enum ('publik', 'anggota', 'bph');

-- -----------------------------------------------------------------------------
-- Helper: bolehkah pengguna ini mengelola baris dengan bidang & pembuat tertentu?
--   BPH / Super Admin → selalu boleh
--   Editor Bidang     → baris bidangnya, atau baris umum (tanpa bidang) buatannya sendiri
--   Anggota           → hanya baris buatannya sendiri
-- -----------------------------------------------------------------------------
create function public.boleh_kelola(p_bidang uuid, p_pembuat uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case public.peran_saya()
    when 'super_admin' then true
    when 'bph' then true
    when 'editor_bidang' then
      (p_bidang is not null and p_bidang = public.bidang_saya())
      or (p_bidang is null and p_pembuat = (select auth.uid()))
    when 'anggota' then p_pembuat = (select auth.uid())
    else false
  end
$$;
revoke execute on function public.boleh_kelola(uuid, uuid) from public;
grant execute on function public.boleh_kelola(uuid, uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Trigger: kunci pembuat & isi tanggal terbit otomatis
-- -----------------------------------------------------------------------------
create function public.konten_set_meta()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    -- pembuat selalu pengguna yang sedang login (tidak bisa dipalsukan)
    if (select auth.uid()) is not null then
      new.created_by := (select auth.uid());
    end if;
  else
    new.created_by := old.created_by;
  end if;

  -- tabel dengan status terbit: isi/bersihkan terbit_at
  if to_jsonb(new) ? 'terbit_at' then
    if new.status = 'terbit' and (tg_op = 'INSERT' or old.status is distinct from 'terbit') then
      new.terbit_at := coalesce(new.terbit_at, now());
    elsif new.status <> 'terbit' then
      new.terbit_at := null;
    end if;
  end if;
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- kegiatan — agenda & kegiatan per bidang
-- -----------------------------------------------------------------------------
create table public.kegiatan (
  id              uuid primary key default gen_random_uuid(),
  periode_id      uuid references public.periode (id) on delete restrict,
  bidang_id       uuid references public.bidang (id) on delete restrict,
  judul           text not null check (length(trim(judul)) > 0),
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  ringkasan       text,
  isi             text,
  mulai           timestamptz,                       -- null = belum dijadwalkan
  selesai         timestamptz,
  rutin           text,                              -- mis. "Setiap Jumat malam"
  lokasi          text,
  tahap           public.tahap_kegiatan not null default 'rencana',
  status          public.status_konten not null default 'draft',
  terbit_at       timestamptz,
  is_dummy        boolean not null default false,
  created_by      uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint kegiatan_urutan_waktu check (selesai is null or mulai is null or selesai >= mulai)
);
create index kegiatan_publik_idx on public.kegiatan (status, mulai);
create index kegiatan_bidang_idx on public.kegiatan (bidang_id);

-- -----------------------------------------------------------------------------
-- album — galeri per kegiatan
-- -----------------------------------------------------------------------------
create table public.album (
  id          uuid primary key default gen_random_uuid(),
  bidang_id   uuid references public.bidang (id) on delete restrict,
  kegiatan_id uuid references public.kegiatan (id) on delete set null,
  judul       text not null check (length(trim(judul)) > 0),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  deskripsi   text,
  tanggal     date,
  status      public.status_konten not null default 'draft',
  terbit_at   timestamptz,
  is_dummy    boolean not null default false,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index album_publik_idx on public.album (status, tanggal desc);

-- -----------------------------------------------------------------------------
-- media — foto / video pendek (file) atau embed (link YouTube/IG/TikTok)
-- album_id null = media lepas (mis. cover berita)
-- -----------------------------------------------------------------------------
create table public.media (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid references public.album (id) on delete cascade,
  bidang_id    uuid references public.bidang (id) on delete restrict,
  jenis        public.jenis_media not null,
  storage_path text,
  embed_url    text check (embed_url is null or embed_url ~ '^https://'),
  caption      text,
  lebar        integer check (lebar is null or lebar > 0),
  tinggi       integer check (tinggi is null or tinggi > 0),
  ukuran_bytes bigint check (ukuran_bytes is null or ukuran_bytes >= 0),
  mime         text,
  urutan       integer not null default 0,
  is_dummy     boolean not null default false,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- file wajib punya path; embed wajib punya link
  constraint media_sumber_sesuai_jenis check (
    (jenis = 'embed' and embed_url is not null and storage_path is null)
    or (jenis <> 'embed' and storage_path is not null and embed_url is null)
  )
);
create index media_album_idx on public.media (album_id, urutan);

-- Cover album (dibuat setelah tabel media ada)
alter table public.album
  add column cover_id uuid references public.media (id) on delete set null;

-- -----------------------------------------------------------------------------
-- berita
-- bidang_id null = kategori umum
-- -----------------------------------------------------------------------------
create table public.berita (
  id          uuid primary key default gen_random_uuid(),
  bidang_id   uuid references public.bidang (id) on delete restrict,
  kegiatan_id uuid references public.kegiatan (id) on delete set null,
  judul       text not null check (length(trim(judul)) > 0),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  ringkasan   text,
  isi         text,
  cover_id    uuid references public.media (id) on delete set null,
  pinned      boolean not null default false,
  status      public.status_konten not null default 'draft',
  terbit_at   timestamptz,
  is_dummy    boolean not null default false,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index berita_publik_idx on public.berita (status, pinned desc, terbit_at desc);

alter table public.kegiatan
  add column cover_id uuid references public.media (id) on delete set null;

-- -----------------------------------------------------------------------------
-- dokumen — arsip berjenjang
-- -----------------------------------------------------------------------------
create table public.dokumen (
  id           uuid primary key default gen_random_uuid(),
  bidang_id    uuid references public.bidang (id) on delete restrict,
  kegiatan_id  uuid references public.kegiatan (id) on delete set null,
  judul        text not null check (length(trim(judul)) > 0),
  kategori     text not null check (kategori in (
                 'lpj-kegiatan', 'proposal', 'surat-masuk', 'surat-keluar',
                 'sk-organisasi', 'template-surat', 'lainnya')),
  tahun        smallint not null check (tahun between 2000 and 2100),
  tanggal      date,
  akses        public.akses_dokumen not null default 'bph',   -- default paling aman
  storage_path text,
  ukuran_bytes bigint check (ukuran_bytes is null or ukuran_bytes >= 0),
  status       public.status_konten not null default 'draft',
  terbit_at    timestamptz,
  is_dummy     boolean not null default false,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index dokumen_publik_idx on public.dokumen (status, akses, tahun desc);

-- -----------------------------------------------------------------------------
-- Pasang trigger
-- -----------------------------------------------------------------------------
create trigger set_meta before insert or update on public.kegiatan
  for each row execute function public.konten_set_meta();
create trigger set_meta before insert or update on public.album
  for each row execute function public.konten_set_meta();
create trigger set_meta before insert or update on public.media
  for each row execute function public.konten_set_meta();
create trigger set_meta before insert or update on public.berita
  for each row execute function public.konten_set_meta();
create trigger set_meta before insert or update on public.dokumen
  for each row execute function public.konten_set_meta();

create trigger set_updated_at before update on public.kegiatan
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.album
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.media
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.berita
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.dokumen
  for each row execute function public.set_updated_at();

create trigger audit after insert or update or delete on public.kegiatan
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.album
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.media
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.berita
  for each row execute function public.catat_audit();
create trigger audit after insert or update or delete on public.dokumen
  for each row execute function public.catat_audit();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- Pola untuk kegiatan, album, berita:
--   SELECT : publik → status terbit; pengurus → yang boleh ia kelola
--   INSERT : boleh_kelola + non-BPH tidak boleh langsung 'terbit'
--   UPDATE : boleh_kelola (lama & baru) + non-BPH tidak boleh menyimpan 'terbit'
--   DELETE : BPH semua; lainnya hanya yang belum terbit
-- -----------------------------------------------------------------------------
alter table public.kegiatan enable row level security;
alter table public.album    enable row level security;
alter table public.media    enable row level security;
alter table public.berita   enable row level security;
alter table public.dokumen  enable row level security;

-- ---------- kegiatan ----------
create policy "kegiatan: baca" on public.kegiatan
  for select to anon, authenticated
  using (status = 'terbit' or (select public.boleh_kelola(bidang_id, created_by)));
create policy "kegiatan: tambah" on public.kegiatan
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "kegiatan: ubah" on public.kegiatan
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "kegiatan: hapus" on public.kegiatan
  for delete to authenticated
  using ((select public.is_bph())
         or (status <> 'terbit' and (select public.boleh_kelola(bidang_id, created_by))));

-- ---------- album ----------
create policy "album: baca" on public.album
  for select to anon, authenticated
  using (status = 'terbit' or (select public.boleh_kelola(bidang_id, created_by)));
create policy "album: tambah" on public.album
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "album: ubah" on public.album
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "album: hapus" on public.album
  for delete to authenticated
  using ((select public.is_bph())
         or (status <> 'terbit' and (select public.boleh_kelola(bidang_id, created_by))));

-- ---------- berita ----------
create policy "berita: baca" on public.berita
  for select to anon, authenticated
  using (status = 'terbit' or (select public.boleh_kelola(bidang_id, created_by)));
create policy "berita: tambah" on public.berita
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "berita: ubah" on public.berita
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "berita: hapus" on public.berita
  for delete to authenticated
  using ((select public.is_bph())
         or (status <> 'terbit' and (select public.boleh_kelola(bidang_id, created_by))));

-- ---------- media ----------
-- Publik: media lepas (cover) atau media di album yang sudah terbit.
create policy "media: baca" on public.media
  for select to anon, authenticated
  using (
    (select public.boleh_kelola(bidang_id, created_by))
    or album_id is null
    or exists (select 1 from public.album a where a.id = album_id and a.status = 'terbit')
  );
create policy "media: tambah" on public.media
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by)));
create policy "media: ubah" on public.media
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)))
  with check ((select public.boleh_kelola(bidang_id, created_by)));
create policy "media: hapus" on public.media
  for delete to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)));

-- ---------- dokumen ----------
-- Terbit + publik → siapa saja; terbit + anggota → semua pengurus; bph → BPH (lewat boleh_kelola).
create policy "dokumen: baca" on public.dokumen
  for select to anon, authenticated
  using (
    (status = 'terbit' and akses = 'publik')
    or (status = 'terbit' and akses = 'anggota' and (select public.is_pengurus()))
    or (akses <> 'bph' and (select public.boleh_kelola(bidang_id, created_by)))
    or (select public.is_bph())
  );
create policy "dokumen: tambah" on public.dokumen
  for insert to authenticated
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph()))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "dokumen: ubah" on public.dokumen
  for update to authenticated
  using ((select public.boleh_kelola(bidang_id, created_by)) and (akses <> 'bph' or (select public.is_bph())))
  with check ((select public.boleh_kelola(bidang_id, created_by))
              and (akses <> 'bph' or (select public.is_bph()))
              and (status <> 'terbit' or (select public.is_bph())));
create policy "dokumen: hapus" on public.dokumen
  for delete to authenticated
  using ((select public.is_bph())
         or (status <> 'terbit' and akses <> 'bph'
             and (select public.boleh_kelola(bidang_id, created_by))));
