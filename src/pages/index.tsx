import { Compliance } from "@/components/site/Compliance";
import { Faq } from "@/components/site/Faq";
import { FeatureBlocks } from "@/components/site/FeatureBlocks";
import { FinalCta } from "@/components/site/FinalCta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/site/Hero";
import { Offerings } from "@/components/site/Offerings";
import { StatsBand } from "@/components/site/StatsBand";
import { Testimonials } from "@/components/site/Testimonials";
import { TrustedBy } from "@/components/site/TrustedBy";
import { WhoFor } from "@/components/site/WhoFor";
import { WhyChoose } from "@/components/site/WhyChoose";
import { employeeFeatures, hrFeatures } from "@/components/site/site-data";

export default function Index({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="paz-page min-h-screen bg-background">
      <Header onNavigate={onNavigate} />
      <main>
        <Hero />
        <TrustedBy />
        <Offerings />
        <WhyChoose />
        <WhoFor />
        <FeatureBlocks
          eyebrow="For your business"
          heading="Run your HR, payroll & compliance operations with clarity."
          features={employeeFeatures}
          ctaLabel="Explore our business platform"
          tone="dark"
        />
        <StatsBand />
        <FeatureBlocks
          eyebrow="For HR teams &amp; Founders"
          heading="End-to-end Employee Insurance, Compliance &amp; Benefits made simple."
          features={hrFeatures}
          ctaLabel="Get Customized Benefits Proposal"
        />
        <Compliance />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
