// type DashboardHeaderProps = {
//   userName: string
//   userRole: string
// }
"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";

export function DashboardHeader() {
  const { data: user } = useRetrieveUserQuery();
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm sm:text-xl text-gray-600 mt-1 font-bold">
              Panel de administración de leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-sans font-semibold text-gray-900">
                Empresa
              </p>
              {/* <p className="text-xs text-gray-600 capitalize">{userRole}</p> */}
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-sans font-semibold">
              {/* {userName.charAt(0)} */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
