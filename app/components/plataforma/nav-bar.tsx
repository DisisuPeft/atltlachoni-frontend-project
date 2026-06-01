"use client";

// import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import User
// import { Settings } from "lucide-react";
// import Logout from "@/app/utils/auth/logout";
import Link from "next/link";
import Image from "next/image";
import Badge from "../plataforma/badge";
import { IconSearch } from "../plataforma/iconst";
import { UserMenu } from "../plataforma/drop-down-menu";


export default function Navbar() {
  // const { data: user } = useRetrieveUserQuery();

  return (
    // <nav className="h-16 bg-white shadow px-6 flex items-center justify-between fixed z-10 w-full">
    //   <Link href="/dashboard" className="flex items-center gap-3">
    //     <div className="w-10 h-10 rounded-lg flex items-center justify-center">
    //       <Image
    //         src="/assets/logos/Logo CINFA-01.webp"
    //         alt="Logo CINFA"
    //         width={40}
    //         height={40}
    //         loading="eager"
    //       />
    //     </div>
    //     <span className="text-foreground font-semibold text-lg tracking-tight">
    //       CINFA
    //     </span>
    //   </Link>
    //   <div className="flex flex-row items-center p-2 gap-10">
    //     {pathname.startsWith("/plataforma/") ||
    //       (pathname === "/plataforma" ? (
    //         <Badge />
    //       ) : (
    //         <div className="text-sm text-gray-800 hidden md:block">
    //           Bienvenido {user?.email}
    //         </div>
    //       ))}
    //     <Logout></Logout>
    //   </div>
    // </nav>
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center h-16 px-6 gap-6">
        {/* Logo */}
        <Link href={"/plataforma"}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/logos/Logo CINFA-01.webp"
                alt="Logo CINFA"
                width={40}
                height={40}
                loading="eager"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">CINFA</span>
          </div>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Que quieres aprender?"
              className="w-full h-10 pl-4 pr-12 rounded-full border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] bg-white"
            />
            <button className="absolute right-1 w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center hover:bg-[#004BB5] transition-colors">
              <IconSearch className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <Badge />
          {/* <Link
            href={"#"}
            // onClick={() => onCambiarSeccion("perfil")}
            className="w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center text-white text-sm font-bold hover:bg-[#004BB5] transition-colors"
          >
            {user?.nombre_completo[0]}
          </Link> */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
