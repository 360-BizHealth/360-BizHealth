import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";
import { heroRotatingWords, heroStats } from "./site-data";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroRotatingWords.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="section-x flex flex-col items-center gap-10 lg:flex-row">
        <div className="w-full lg:w-[58%]">
          <h1 className="text-[28px] font-semibold leading-[1.2] text-foreground md:text-[34px] lg:text-[40px]">
            All-in-One Platform to
            <br className="hidden lg:block" /> Manage Your Business, HR & Compliance
          </h1>
          <div className="mt-6 space-y-1 text-base text-foreground/85 sm:text-[18px]">
            <p>Looking for smarter business, HR &amp; compliance solutions?</p>
            <p>
              We&rsquo;ve got the whole kit -{" "}
              <span key={index} className="font-semibold text-brand">
                {heroRotatingWords[index]}
              </span>
            </p>
          </div>
          <Button variant="brand" size="pill" className="mt-8" asChild>
            <a href="#quote">Schedule Free Consultation</a>
          </Button>

          <dl className="mt-11 flex flex-wrap gap-x-8 gap-y-6">
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-l-[3px] border-brand pl-4">
                <dt className="text-2xl font-bold text-ink sm:text-[30px]">{stat.value}</dt>
                <dd className="text-[15px] text-ink-soft">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative w-full lg:w-[42%] lg:pl-6 flex justify-center items-center">
          <img
            src={heroIllustration}
            alt="360 Biz Health employee benefits illustration"
            className="relative w-full h-auto object-contain max-h-[500px] mix-blend-multiply"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
