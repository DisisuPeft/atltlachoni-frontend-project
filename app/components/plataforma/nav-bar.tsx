"use client";

import Link from "next/link";
import Image from "next/image";
import Badge from "../plataforma/badge";
// import { IconSearch } from "../plataforma/iconst";
import { UserMenu } from "../plataforma/drop-down-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center h-14 md:h-16 px-4 md:px-6 gap-3 md:gap-6">
        {/* Logo */}
        <Link href="/plataforma" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
            <Image
              src="/assets/logos/Logo CINFA-01.webp"
              alt="Logo CINFA"
              width={40}
              height={40}
              loading="eager"
            />
          </div>
          <span className="text-base md:text-xl font-bold text-gray-900">
            CINFA
          </span>
        </Link>

        {/* Search bar — solo en desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto">
          {/* <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="¿Qué quieres aprender?"
              className="w-full h-10 pl-4 pr-12 rounded-full border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] bg-white"
            />
            <button className="absolute right-1 w-8 h-8 rounded-full bg-[#0056D2] flex items-center justify-center hover:bg-[#004BB5] transition-colors">
              <IconSearch className="w-4 h-4 text-white" />
            </button>
          </div> */}
        </div>

        {/* Espaciador en móvil */}
        <div className="flex-1 md:hidden" />

        {/* Right icons */}
        <div className="flex items-center gap-2 md:gap-3">
          <Badge />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
