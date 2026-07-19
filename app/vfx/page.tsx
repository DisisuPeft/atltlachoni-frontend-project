import { headers } from "next/headers";
import { TermProvider, ProgramTerm } from "@/app/ui/landing-vfx/term-context";
import VfxHeader from "../ui/landing-vfx/header";
import VfxFloatingCTA from "../ui/landing-vfx/vfx-floating-cta";
import VfxHero from "../ui/landing-vfx/hero";
import { VfxPorQue } from "../ui/landing-vfx/por-que";
import { VfxAudiencia } from "../ui/landing-vfx/audiencia";
import { VfxAprende } from "../ui/landing-vfx/aprende";
import { VfxPlanEstudios } from "../ui/landing-vfx/plan-estudios";
import { VfxDocente } from "../ui/landing-vfx/docente";
import { VfxModalidad } from "../ui/landing-vfx/modalidad";
import { VfxFaq } from "../ui/landing-vfx/faq";
import VfxLeadForm from "../ui/landing-vfx/vfx-lead-form";
import { VfxCtaFinal } from "../ui/landing-vfx/cta-final";
import { VfxFooter } from "../ui/landing-vfx/footer";

async function getProgramTerm(): Promise<ProgramTerm> {
  const h = await headers();
  const lang = h.get("accept-language") ?? "";
  // Spain locale codes: es-ES, ca-ES, gl-ES, eu-ES
  if (/\bes-ES\b|ca-ES|gl-ES|eu-ES/i.test(lang)) return "Curso";
  return "Diplomado";
}

export default async function Page() {
  const term = await getProgramTerm();
  return (
    <TermProvider term={term}>
      <main className="min-h-screen" style={{ backgroundColor: "#050505" }}>
        <VfxHeader />
        <VfxFloatingCTA />
        <VfxHero />
        <VfxPorQue />
        <VfxAudiencia />
        <VfxAprende />
        <VfxPlanEstudios />
        <VfxDocente />
        <VfxModalidad />
        <VfxFaq />
        <VfxLeadForm />
        <VfxCtaFinal />
        <VfxFooter />
      </main>
    </TermProvider>
  );
}