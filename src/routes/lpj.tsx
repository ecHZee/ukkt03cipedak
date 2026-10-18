import { createFileRoute, redirect } from "@tanstack/react-router";
import { bacaFilterArsip } from "@/lib/filter-publik";

/** Tautan lama tetap bekerja, termasuk filter yang sudah dibagikan. */
export const Route = createFileRoute("/lpj")({
  validateSearch: bacaFilterArsip,
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/arsip", search, statusCode: 301 });
  },
});
