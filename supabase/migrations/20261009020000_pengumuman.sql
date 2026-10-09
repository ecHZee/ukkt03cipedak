-- Hari 11 — Banner pengumuman di beranda.
-- value: null (tidak ada pengumuman) atau
--   {"teks": "...", "tautan": "/kegiatan" | "https://..." | null, "sampai": "YYYY-MM-DD" | null}
-- Banner otomatis hilang setelah tanggal "sampai" (WIB); pengunjung juga bisa menutupnya.
-- Diubah BPH lewat halaman Pengaturan (Hari 21); sementara lewat Table Editor Supabase.
insert into public.pengaturan (key, value, publik, keterangan)
values (
  'pengumuman',
  'null'::jsonb,
  true,
  'Banner pengumuman beranda: {"teks","tautan","sampai"} atau null'
)
on conflict (key) do nothing;
