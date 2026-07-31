"use client";

import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

type CrmPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
  backHref?: string;
};

/** Shared page framing keeps CRM tasks recognisable across every module. */
export default function CrmPageHeader({
  eyebrow = "CRM",
  title,
  description,
  action,
  backHref,
}: CrmPageHeaderProps) {
  const ref = useSearchParams().get("ref");
  const actionHref = action ? `${action.href}${ref ? `?ref=${ref}` : ""}` : "";
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 text-sm font-medium text-slate-600 outline-none transition-colors hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Volver a leads
          </Link>
        )}
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>
      {action && (
        <Link
          href={actionHref}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {action.label}
        </Link>
      )}
    </header>
  );
}
