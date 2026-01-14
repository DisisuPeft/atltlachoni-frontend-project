"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import User
// import { Settings } from "lucide-react";
import Logout from "@/app/utils/auth/logout";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Badge from "../plataforma/badge";

export default function Navbar() {
  const { data: user } = useRetrieveUserQuery();
  const pathname = usePathname();

  return (
    <nav className="h-16 bg-white shadow px-6 flex items-center justify-between fixed z-10 w-full">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          <Image
            src="/assets/logos/Logo CINFA-01.webp"
            alt="Logo CINFA"
            width={40}
            height={40}
            loading="eager"
          />
        </div>
        <span className="text-foreground font-semibold text-lg tracking-tight">
          CINFA
        </span>
      </Link>
      <div className="flex flex-row items-center p-2 gap-10">
        {pathname.startsWith("/plataforma/") ||
          (pathname === "/plataforma" ? (
            <Badge />
          ) : (
            <div className="text-sm text-gray-800 hidden md:block">
              Bienvenido {user?.email}
            </div>
          ))}
        <Logout></Logout>
      </div>
    </nav>
  );
}
