"use client";

import { useCallback, useSyncExternalStore } from "react";

// Preferencia por navegador: si el alumno quiere ver los módulos contraídos.
// Por defecto (o si el storage no está disponible) se muestran contraídos;
// solo se expanden si el alumno lo eligió.
const KEY = "plataforma:modulos-contraidos";
const EVENTO = "plataforma:modulos-contraidos-cambio";

function leer(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

function suscribir(callback: () => void) {
  // `storage` sincroniza otras pestañas; el evento propio, esta misma pestaña.
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO, callback);
  };
}

export function usePreferenciaModulos() {
  // En el servidor siempre contraídos (el default), para no desajustar la hidratación.
  const contraidos = useSyncExternalStore(suscribir, leer, () => true);

  const setContraidos = useCallback((valor: boolean) => {
    try {
      window.localStorage.setItem(KEY, valor ? "1" : "0");
    } catch {
      // Sin storage: la preferencia no se guarda, pero la vista sigue funcionando.
    }
    window.dispatchEvent(new Event(EVENTO));
  }, []);

  return { contraidos, setContraidos };
}
