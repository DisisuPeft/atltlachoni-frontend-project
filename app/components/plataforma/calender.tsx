import { IconChevronRight, IconChevronLeft, IconPencil } from "./iconst";
import { useMyCalender } from "@/hooks";

export default function CalenderStudent() {
  // Calendar data
  const { mesAnterior, mesSiguiente, esDiaActual, nombreMes, diasMes, dia } =
    useMyCalender();
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <h3 className="font-bold text-gray-900 mb-3">Calendario</h3>

      <div className="flex items-center gap-2 mb-4">
        {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
          <div
            key={d + i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              i + 1 === dia ? "bg-[#0056D2] text-white" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
        <button className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
          <IconPencil className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 capitalize">
          {nombreMes}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={mesAnterior}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={mesSiguiente}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-500 font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {diasMes.map((semana, si) => (
        <div key={si} className="grid grid-cols-7 gap-0">
          {semana.map((dia, di) => (
            <div
              key={di}
              className={`text-center py-1.5 text-sm ${
                dia === 0
                  ? ""
                  : esDiaActual(dia)
                    ? "font-bold"
                    : dia === 17
                      ? "text-[#6B21A8]"
                      : "text-gray-700"
              }`}
            >
              {esDiaActual(dia) ? (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#0056D2] text-[#0056D2] font-bold">
                  {dia}
                </span>
              ) : dia > 0 ? (
                dia
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#0056D2] rounded-full"></span>
          metas diarias
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-[#0056D2] rounded"></span>
          Todas las metas
        </div>
      </div>
    </div>
  );
}
