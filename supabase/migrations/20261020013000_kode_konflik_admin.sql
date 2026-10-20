-- Konflik versi adalah kesalahan aplikasi, bukan serialization_failure yang layak dicoba ulang.
-- Hanya ganti SQLSTATE lima fungsi CAS lama; isi validasi, akses, dan signature dipertahankan.
do $$
declare f record; jumlah int:=0;
begin
 for f in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname='public' and p.proname in ('simpan_berita_admin','simpan_album_admin','atur_media_album','simpan_dokumen_admin','simpan_pengurus_admin') loop
  execute replace(pg_get_functiondef(f.oid), '''40001''', '''P0021''');
  jumlah:=jumlah+1;
 end loop;
 if jumlah<>5 then raise exception 'Lima fungsi CAS admin harus tersedia'; end if;
end; $$;
