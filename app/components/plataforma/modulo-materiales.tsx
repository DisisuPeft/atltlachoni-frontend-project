"use client";

import { useGetMaterialesModuloQuery } from "@/redux/features/control-escolar/alumnosApiSlice";
import { FileText, File, Camera, Loader2 } from "lucide-react";

interface Props {
  moduloId: number;
}

function iconoMaterial(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <Camera className="w-5 h-5 text-[#0056D2]" />;
  if (mimeType === "application/pdf")
    return <FileText className="w-5 h-5 text-[#0056D2]" />;
  return <File className="w-5 h-5 text-[#0056D2]" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

export default function ModuloMateriales({ moduloId }: Props) {
  const { data: materiales, isLoading } = useGetMaterialesModuloQuery(moduloId);
  // console.log(materiales);
  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );

  if (!materiales?.count) return null;

  return (
    <div className="px-6 pb-6 mt-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Materiales
      </p>
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {materiales?.results.map((material) => (
          <a
            key={material.id}
            href={`${UPLOAD_HOST}/api/control-escolar/materiales/${material.id}/preview/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
              {iconoMaterial(material.mime_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {material.original_name}
              </p>
              {material.description && (
                <p className="text-xs text-gray-400 truncate">
                  {material.description}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formatBytes(material.size)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
