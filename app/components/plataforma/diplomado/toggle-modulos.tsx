"use client";

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

/** Contrae/expande todos los módulos; la elección se recuerda en este navegador. */
export function ToggleModulos({
  contraidos,
  onChange,
}: {
  contraidos: boolean;
  onChange: (contraidos: boolean) => void;
}) {
  const Icon = contraidos ? ChevronsUpDown : ChevronsDownUp;
  return (
    <button
      type="button"
      onClick={() => onChange(!contraidos)}
      title="Tu preferencia se guarda en este navegador"
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-100 transition-colors hover:bg-indigo-50"
    >
      <Icon className="h-3.5 w-3.5" />
      {contraidos ? "Expandir todo" : "Contraer todo"}
    </button>
  );
}
