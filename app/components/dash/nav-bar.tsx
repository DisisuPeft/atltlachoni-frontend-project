"use client";

import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "../plataforma/drop-down-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center h-14 sm:h-16 px-3 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0">
            <Image
              src="/assets/logos/Logo CINFA-01.webp"
              alt="Logo CINFA"
              width={36}
              height={36}
              loading="eager"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900">CINFA</span>
        </Link>

        {/* Right */}
        <UserMenu />
      </div>
    </header>
  );
}