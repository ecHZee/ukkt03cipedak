import type { useIsianBelumDisimpan } from "@/hooks/use-isian-belum-disimpan";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function PeringatanIsian({
  penjagaan,
}: {
  penjagaan: ReturnType<typeof useIsianBelumDisimpan>["penjagaan"];
}) {
  return (
    <AlertDialog
      open={penjagaan.status === "blocked"}
      onOpenChange={(open) => {
        if (!open) penjagaan.reset?.();
      }}
    >
      <AlertDialogContent data-admin-dialog className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Tinggalkan perubahan?</AlertDialogTitle>
          <AlertDialogDescription>
            Isian yang belum disimpan akan hilang. Pilih lanjut menyunting untuk menjaga isianmu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => penjagaan.reset?.()}>
            Lanjut menyunting
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => penjagaan.proceed?.()}>
            Tinggalkan perubahan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
