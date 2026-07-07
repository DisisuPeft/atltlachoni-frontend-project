import Header from "../ui/landing-iesda/header";
import IesdaFloatingCTA from "../ui/landing-iesda/iesda-floating-cta";
import Hero from "../ui/landing-iesda/hero";
import { WhyIesda } from "../ui/landing-iesda/why-iesda";
import { Programs } from "../ui/landing-iesda/programas";
import { About } from "../ui/landing-iesda/about";
import IesdaIdentidad from "../ui/landing-iesda/iesda-identidad";
import IesdaLeadFormSection from "../ui/landing-iesda/iesda-lead-form-section";
import { CTA } from "../ui/landing-iesda/cta";
import { Footer } from "../ui/landing-iesda/footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <IesdaFloatingCTA />
      <Hero />
      <WhyIesda />
      <Programs />
      <About />
      <IesdaIdentidad />
      <IesdaLeadFormSection />
      <CTA />
      <Footer />
    </main>
  );
}