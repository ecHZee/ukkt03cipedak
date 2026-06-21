# services/

Domain-level data access — satu file per resource (mis. `anggota.service.ts`,
`berita.service.ts`). Wrapper di atas Supabase client agar komponen
hanya berurusan dengan fungsi business-level (`listBerita`, `createKegiatan`),
bukan query mentah.
