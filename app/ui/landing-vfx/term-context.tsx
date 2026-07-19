"use client";

import { createContext, useContext } from "react";

export type ProgramTerm = "Diplomado" | "Curso";

const TermContext = createContext<ProgramTerm>("Diplomado");

export function TermProvider({
  term,
  children,
}: {
  term: ProgramTerm;
  children: React.ReactNode;
}) {
  return <TermContext.Provider value={term}>{children}</TermContext.Provider>;
}

export function useTerm(): ProgramTerm {
  return useContext(TermContext);
}