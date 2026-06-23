"use client";

import Link from "next/link";
import { Monitor } from "lucide-react";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";

export default function PlataformaLink() {
  const { data } = useVerifyUserQuery();

  if (!data?.superuser) return null;

  return (
    <Link
      href="/plataforma"
      className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 bg-white"
    >
      <span className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-50 text-emerald-600">
        <Monitor className="w-3.5 h-3.5" />
      </span>
      Ver plataforma
    </Link>
  );
}