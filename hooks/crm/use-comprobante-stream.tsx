import { useState, useEffect } from "react";

export default function useComprobanteStream(validacionId: number | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!validacionId) return;

    let objectUrl: string | null = null;

    const fetchStream = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_UPLOAD_HOST}/api/crm/validaciones/${validacionId}/comprobante/`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("No se pudo cargar el comprobante");
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar imagen");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [validacionId]);

  return { url, isLoading, error };
}