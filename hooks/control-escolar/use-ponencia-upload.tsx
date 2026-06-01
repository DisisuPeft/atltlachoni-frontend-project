import { useState, useCallback } from "react";

interface UploadOptions {
  titulo: string;
  tipo: string;
}

interface UploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export default function usePonenciaUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    isSuccess: false,
  });

  const upload = useCallback(
    (file: File, options: UploadOptions): Promise<void> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("titulo", options.titulo.trim());
        formData.append("tipo", options.tipo.trim().toLowerCase());

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setState((prev) => ({ ...prev, progress: Math.round((e.loaded / e.total) * 100) }));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setState({ progress: 100, isUploading: false, error: null, isSuccess: true });
            resolve();
          } else {
            const msg = JSON.parse(xhr.responseText)?.detail ?? "Error al subir la ponencia";
            setState((prev) => ({ ...prev, isUploading: false, error: msg }));
            reject(new Error(msg));
          }
        });

        xhr.addEventListener("error", () => {
          const msg = "Error de red al subir la ponencia";
          setState((prev) => ({ ...prev, isUploading: false, error: msg }));
          reject(new Error(msg));
        });

        const api = `${process.env.NEXT_PUBLIC_UPLOAD_HOST}/api`;
        xhr.withCredentials = true;
        xhr.open("POST", `${api}/control-escolar/ponencias/`);
        xhr.send(formData);

        setState({ progress: 0, isUploading: true, error: null, isSuccess: false });
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ progress: 0, isUploading: false, error: null, isSuccess: false });
  }, []);

  return { ...state, upload, reset };
}