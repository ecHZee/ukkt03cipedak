import { useEffect, useRef } from "react";
import { useBlocker } from "@tanstack/react-router";

// Logout mengubah sesi SEBELUM navigasi, jadi perlu menanyakan penjaga form lebih dulu.
const penjaga = new Set<{ berubah: () => boolean; lewati: () => void }>();
export function izinkanKeluarDariForm() {
  if (
    [...penjaga].some((p) => p.berubah()) &&
    !window.confirm("Ada isian yang belum disimpan. Keluar dari akun dan buang isian?")
  )
    return false;
  for (const p of penjaga) p.lewati();
  return true;
}

/** Penjagaan route, Back/Forward dan keluar tab; dapat dilewati hanya sesudah simpan berhasil. */
export function useIsianBelumDisimpan(berubah: boolean) {
  const tersimpan = useRef(false);
  useEffect(() => {
    const p = {
      berubah: () => berubah && !tersimpan.current,
      lewati: () => {
        tersimpan.current = true;
      },
    };
    penjaga.add(p);
    return () => {
      penjaga.delete(p);
    };
  }, [berubah]);
  const penjagaan = useBlocker({
    shouldBlockFn: () => berubah && !tersimpan.current,
    withResolver: true,
    enableBeforeUnload: () => berubah && !tersimpan.current,
  });
  return {
    penjagaan,
    tandaiTersimpan: () => {
      tersimpan.current = true;
    },
  };
}
