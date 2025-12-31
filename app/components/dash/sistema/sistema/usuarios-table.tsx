"use client";
import { useGetUsersQuery } from "@/redux/features/auth/userApiSlice";
import { DataTable } from "@/app/utils/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { User } from "@/redux/features/auth/userApiSlice";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronLeftCircle,
  ChevronRightCircle,
  Edit2Icon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UsuariosTable() {
  const searchParam = useSearchParams();
  const [searchByName, setSearchByName] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { data: users } = useGetUsersQuery({ q: searchByName, page: page });

  const headers: ColumnDef<User>[] = [
    {
      header: "Nombre completo",
      cell: ({ row }) => {
        return (
          <div className="text-black">
            {row.original.nombre} {row.original.apellido_paterno}{" "}
            {row.original.apellido_materno}
          </div>
        );
      },
    },
    {
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-black">{row.original.email}</div>;
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-4 p-2">
            <Link
              href={`/dashboard/sistema/usuarios/${
                row.original.uuid
              }/usuario?ref=${searchParam.get("ref")}`}
            >
              <Edit2Icon className="text-black cursor-pointer" />
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestión de usuarios</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchByName || ""}
              onChange={(e) => setSearchByName(e.target.value)}
              // onKeyDown={(e) => handleSearch(e)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-black"
            />
          </div>
          {/* Botón crear usuario */}
          <Link
            href={`/dashboard/sistema/usuarios/add?ref=${searchParam.get(
              "ref"
            )}`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Usuario</span>
          </Link>
        </div>
      </div>

      {/* Tabla */}
      {/* <DataTable */}
      {users?.results ? (
        <div>
          <DataTable data={users?.results} columns={headers} />
          <div className="flex justify-end gap-4 mt-4 p-4">
            <button
              className="rounded-full"
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={users.previous === null}
            >
              <ChevronLeftCircle className="text-black" />
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={users.next === null}
            >
              <ChevronRightCircle className="text-black" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-black">No data found</div>
      )}
    </div>
  );
}
