"use client";

import {
  useGetComentariosQuery,
  useCreateComentarioMutation,
  useResponderComentarioMutation,
  useUpdateComentarioMutation,
  useDeleteComentarioMutation,
} from "@/redux/features/control-escolar/comunidadApiSlice";
import { useVerifyUserQuery } from "@/redux/features/auth/authApiSlice";
import { useState } from "react";
import { Send, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface Props {
  diplomadoId: string;
}

function getInitials(nombre?: string | null) {
  const partes = nombre?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function Avatar({ nombre, small }: { nombre?: string | null; small?: boolean }) {
  return (
    <span
      className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#0056D2] text-white font-semibold ${
        small ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
      }`}
    >
      {getInitials(nombre)}
    </span>
  );
}

export default function ComentariosView({ diplomadoId }: Props) {
  const { data: verify } = useVerifyUserQuery();
  const isAdmin =
    verify?.superuser || verify?.roles?.some((r) => r.nombre === "Administrador");

  const { data: comentarios, refetch } = useGetComentariosQuery({ diplomado: diplomadoId });
  const [createComentario] = useCreateComentarioMutation();
  const [responderComentario] = useResponderComentarioMutation();
  const [updateComentario] = useUpdateComentarioMutation();
  const [deleteComentario] = useDeleteComentarioMutation();

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [respuestaTexto, setRespuestaTexto] = useState<Record<number, string>>({});
  const [expandido, setExpandido] = useState<Record<number, boolean>>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editTexto, setEditTexto] = useState("");

  const handleEnviar = async () => {
    const texto = nuevoComentario.trim();
    if (!texto) return;
    await createComentario({ comentario: texto, diplomado: diplomadoId });
    setNuevoComentario("");
    refetch();
  };

  const handleResponder = async (id: number) => {
    const texto = respuestaTexto[id]?.trim();
    if (!texto) return;
    await responderComentario({ id, comentario: texto });
    setRespuestaTexto((prev) => ({ ...prev, [id]: "" }));
    refetch();
  };

  const toggleExpandido = (id: number) =>
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleEditStart = (id: number, textoActual: string) => {
    setEditandoId(id);
    setEditTexto(textoActual);
  };

  const handleEditCancel = () => {
    setEditandoId(null);
    setEditTexto("");
  };

  const handleEditSave = async (id: number) => {
    const texto = editTexto.trim();
    if (!texto) return;
    await updateComentario({ id, comentario: texto });
    setEditandoId(null);
    setEditTexto("");
    refetch();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Eliminar comentario",
      text: "¿Eliminar este comentario? Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await deleteComentario(id);
    refetch();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Comentarios</h1>

      {/* Nuevo comentario */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          rows={3}
          placeholder="Escribe un comentario..."
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800 placeholder:text-gray-400"
        />
        <div className="flex justify-end">
          <button
            onClick={handleEnviar}
            disabled={!nuevoComentario.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0056D2] text-white text-sm font-medium rounded-lg hover:bg-[#004BB5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            Comentar
          </button>
        </div>
      </div>

      {/* Lista */}
      {!comentarios?.results?.length && (
        <p className="text-sm text-gray-500 text-center py-8">
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      )}

      <div className="space-y-4">
        {comentarios?.results?.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex gap-3">
              <Avatar nombre={c.usuario_nombre} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[#0056D2]">{c.usuario_nombre}</p>
                  {isAdmin && editandoId !== c.id && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditStart(c.id, c.comentario)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Editar comentario"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Eliminar comentario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {editandoId === c.id ? (
                  <div className="mt-1 space-y-2">
                    <textarea
                      value={editTexto}
                      onChange={(e) => setEditTexto(e.target.value)}
                      rows={2}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleEditCancel}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleEditSave(c.id)}
                        disabled={!editTexto.trim()}
                        className="text-xs text-white bg-[#0056D2] hover:bg-[#004BB5] disabled:opacity-40 rounded-lg px-3 py-1"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 mt-1">{c.comentario}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.created_at).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {c.editado ? " · editado" : ""}
                </p>
              </div>
            </div>

            {c.respuestas.length > 0 && (
              <div>
                <button
                  onClick={() => toggleExpandido(c.id!)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {expandido[c.id!] ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  {c.respuestas.length} respuesta{c.respuestas.length > 1 ? "s" : ""}
                </button>

                {expandido[c.id!] && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-100">
                    {c.respuestas.map((r) => (
                      <div key={r.id} className="flex gap-2">
                        <Avatar nombre={r.usuario_nombre} small />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[#0056D2]">{r.usuario_nombre}</p>
                            {isAdmin && editandoId !== r.id && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleEditStart(r.id, r.comentario)}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                  aria-label="Editar respuesta"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDelete(r.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                  aria-label="Eliminar respuesta"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          {editandoId === r.id ? (
                            <div className="mt-1 space-y-2">
                              <textarea
                                value={editTexto}
                                onChange={(e) => setEditTexto(e.target.value)}
                                rows={2}
                                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={handleEditCancel}
                                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleEditSave(r.id)}
                                  disabled={!editTexto.trim()}
                                  className="text-xs text-white bg-[#0056D2] hover:bg-[#004BB5] disabled:opacity-40 rounded-lg px-3 py-1"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700">{r.comentario}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 items-end pt-1 border-t border-gray-100">
              <textarea
                value={respuestaTexto[c.id!] ?? ""}
                onChange={(e) =>
                  setRespuestaTexto((prev) => ({ ...prev, [c.id!]: e.target.value }))
                }
                rows={1}
                placeholder="Responder..."
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:border-[#0056D2] text-gray-800 placeholder:text-gray-400"
              />
              <button
                onClick={() => handleResponder(c.id!)}
                disabled={!respuestaTexto[c.id!]?.trim()}
                className="p-1.5 bg-[#0056D2] text-white rounded-lg hover:bg-[#004BB5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
