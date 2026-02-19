"use client";
import { useModuloProgramaQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { IconChevronUp } from "./iconst";

interface Props {
  moduloId: number;
  uuid: string;
}

export default function ModuloView({ moduloId, uuid }: Props) {
  const { data: modulo } = useModuloProgramaQuery({
    id: uuid,
    moduloId: moduloId,
  });
  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-gray-900 text-lg">
              {modulo?.nombre}
            </h2>
            <IconChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>

          <div className="flex items-center gap-5 mt-3">
            {/* {minVideos > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconPlay className="w-4 h-4 text-gray-400" />
                <span>
                  <span className="font-semibold text-gray-900">
                    {minVideos} min
                  </span>{" "}
                  de videos restantes
                </span>
              </div>
            )} */}
            {/* {minLecturas > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconDocument className="w-4 h-4 text-gray-400" />
                <span>
                  <span className="font-semibold text-gray-900">
                    {minLecturas} min
                  </span>{" "}
                  de lecturas restantes
                </span>
              </div>
            )} */}
            {/* {minVideos === 0 && minLecturas === 0 && (
              <p className="text-sm text-green-600 font-medium">
                Modulo completado
              </p>
            )} */}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {modulo?.submodulos.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors group"
            >
              {/* <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.completada
                    ? "bg-green-50"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                {getItemIcon(
                  item.tipo,
                  `w-4 h-4 ${item.completada ? "text-green-600" : "text-gray-500"}`,
                )}
              </div> */}
              {/* <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-gray-900`}>
                  {item.titulo}
                </p> */}
              {/* <p className="text-xs text-gray-400">
                  {getItemLabel(item.tipo)}
                  {item.duracion ? ` · ${item.duracion}` : ""}
                </p> */}
              {/* </div> */}
              <div className="px-5 py-4 border-b border-gray-100 border-l-4 border-l-[#0056D2] bg-[#FAFBFF]">
                <p className="text-sm text-gray-700">{item.titulo}.</p>
              </div>
              {/* {item.completada && (
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )} */}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
