import { useEffect, useState } from "react";
import { useAkun } from "@/hooks/use-akun";
import { supabase } from "@/integrations/supabase/client";
import { ubahFotoSaya } from "@/services/auth";
import { unggahFotoProfil, hapusFile, urlPublik } from "@/services/storage";
import { CropFoto } from "./CropFoto";
import { Button } from "@/components/ui/button";
import { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import { PeringatanIsian } from "./PeringatanIsian";
export function FotoProfilSaya() {
  const akun = useAkun();
  const [foto, setFoto] = useState<string | null>(null),
    [izin, setIzin] = useState(false),
    [awalIzin, setAwalIzin] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<string | null>(null),
    [sibuk, setSibuk] = useState(false),
    [pesan, setPesan] = useState(""),
    [galat, setGalat] = useState(""),
    [siap, setSiap] = useState(false);
  const { penjagaan } = useIsianBelumDisimpan(!!file || izin !== awalIzin);
  useEffect(() => {
    let aktif = true;
    if (akun.pengurusId)
      supabase
        .from("pengurus")
        .select("foto_path,izin_foto")
        .eq("id", akun.pengurusId)
        .single()
        .then((r) => {
          if (!aktif) return;
          if (r.error) {
            setGalat("Foto belum dapat dimuat. Muat ulang sebelum menyimpan.");
            return;
          }
          setFoto(r.data.foto_path);
          setIzin(r.data.izin_foto);
          setAwalIzin(r.data.izin_foto);
          setSiap(true);
        });
    return () => {
      aktif = false;
    };
  }, [akun.pengurusId]);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  async function simpan() {
    setGalat("");
    setPesan("");
    if (file && !izin) {
      setGalat(
        "Centang persetujuan tampil sebelum menyimpan foto baru, atau batalkan pilihan foto.",
      );
      return;
    }
    setSibuk(true);
    let path: string | null = null;
    try {
      if (file) path = await unggahFotoProfil(file, akun.id);
      const r = await ubahFotoSaya(path ?? foto, izin);
      setFoto(r.foto);
      setIzin(r.izin);
      setAwalIzin(r.izin);
      setFile(null);
      setPesan(
        izin
          ? "Foto dan persetujuan tersimpan."
          : "Foto lama dihapus dan izin tampil dicabut. Salinan yang sudah diunduh orang tidak dapat ditarik kembali.",
      );
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Foto belum tersimpan.");
      if (path) {
        const cek = await supabase
          .from("pengurus")
          .select("foto_path")
          .eq("id", akun.pengurusId!)
          .single();
        if (!cek.error && cek.data.foto_path !== path)
          try {
            await hapusFile("media", [path]);
          } catch {
            setGalat((g) => g + " Foto sementara belum dibersihkan; hubungi BPH.");
          }
      }
    } finally {
      setSibuk(false);
    }
  }
  return (
    <section className="min-w-0 rounded-xl border bg-surface p-5">
      <h2 className="font-heading font-semibold">Foto profil</h2>
      <PeringatanIsian penjagaan={penjagaan} />
      {!akun.pengurusId ? (
        <p className="mt-4 text-sm">Akun ini belum terhubung ke data pengurus.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="mx-auto aspect-[3/4] w-40 overflow-hidden rounded-xl bg-muted-surface">
            {preview || foto ? (
              <img
                alt="Pratinjau foto profil"
                src={preview ?? urlPublik("media", foto)!}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full place-items-center text-sm text-ink-muted">
                Belum ada foto
              </span>
            )}
          </div>
          <CropFoto
            disabled={sibuk || !siap}
            onPilih={(f) => {
              setFile(f);
              setIzin(false);
            }}
          />
          <p className="text-sm text-ink-muted">
            Pilih foto, rapikan potongannya, lalu simpan. Saran foto tegak 900 × 1200 piksel atau
            lebih.
          </p>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={izin}
              disabled={sibuk || !siap}
              onChange={(e) => setIzin(e.target.checked)}
              className="mt-1"
            />
            Saya mengizinkan foto ini tampil di website untuk umum.
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={sibuk || !siap || (!file && izin === awalIzin)}
              onClick={() => void simpan()}
            >
              Simpan foto dan izin
            </Button>
            <Button
              variant="outline"
              disabled={sibuk}
              onClick={() => {
                setFile(null);
                setIzin(awalIzin);
              }}
            >
              Batal
            </Button>
          </div>
          {pesan && (
            <p role="status" className="text-sm">
              {pesan}
            </p>
          )}
          {galat && (
            <p role="alert" className="text-sm text-destructive">
              {galat}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
