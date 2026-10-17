import { createFileRoute, Outlet } from "@tanstack/react-router";

// Daftar ada di index; detail memakai shell sendiri agar tidak bertumpuk dengan daftar.
export const Route = createFileRoute("/kegiatan")({ component: Outlet });
