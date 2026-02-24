"use client";
import {
  // useRetrieveUserQuery,
  useGetPestaniaQuery,
} from "@/redux/features/auth/authApiSlice";
import { Menu, X } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useChangeUnidad } from "@/hooks";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("ref");
  const { data: pestanias, isLoading } = useGetPestaniaQuery(q);
  const [open, setOpen] = useState(false);
  const { unidades, onChange, unidadId } = useChangeUnidad();
  // console.log(unidad_id);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-800"
        onClick={toggleSidebar}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed inset-0 z-40 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex flex-col w-64 h-full bg-white border-r border-gray-200 shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Edu CRM</h2>
            <button onClick={toggleSidebar}>
              <X size={24} className="text-gray-800" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {pestanias?.map((item) => {
              const isActive = pathname === item.href;
              // console.log(isActive)
              return (
                <Link
                  key={item.id}
                  href={`${item.href}?ref=${q}`}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-sky-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {/* <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} /> */}
                  {item.nombre}
                </Link>
              );
            })}
          </nav>
        </div>
        <div
          className="absolute inset-0 bg-gray-600 opacity-50"
          onClick={toggleSidebar}
        ></div>
      </div>
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r border-gray-200 bg-white mt-16">
        <div className="flex items-center justify-center p-4">
          <div className="w-64">
            <label
              htmlFor="negocio"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Negocio
            </label>
            <select
              id="negocio"
              name="negocio"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
              onChange={onChange}
              value={String(unidadId)}
            >
              {unidades &&
                unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {pestanias?.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={`${item.href}?ref=${q}`}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-sky-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {/* <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} /> */}
                {item.nombre}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
