import Header from "./ui/landing-cinfa/header";
import FloatingCTA from "./ui/landing-cinfa/floating-cta";
import HeroSection from "./ui/landing-cinfa/hero";
import WhyCINFA from "./ui/landing-cinfa/why-cinfa";
import InstitutesPreview from "./ui/landing-cinfa/institutos";
import DiplomadosSection from "./ui/landing-cinfa/diplomados-section";
import AboutCINFA from "./ui/landing-cinfa/about-cinfa";
import TestimonialSection from "./ui/landing-cinfa/testimonial-section";
import CallToAction from "./ui/landing-cinfa/call-to-action";
import Footer from "./ui/landing-cinfa/footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <FloatingCTA />
      <HeroSection />
      <WhyCINFA />
      <InstitutesPreview />
      <DiplomadosSection />
      <AboutCINFA />
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </main>
  );
}