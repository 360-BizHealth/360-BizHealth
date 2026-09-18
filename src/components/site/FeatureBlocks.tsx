import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Feature = {
  title: string;
  description: string;
  bullets: string[];
  image: string;
};

export function FeatureBlocks({
  eyebrow,
  heading,
  subheading,
  features,
  ctaLabel,
  tone = "light",
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  features: Feature[];
  ctaLabel: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const [active, setActive] = useState(0);
  const current = features[active] ?? features[0]!;

  return (
    <section className={dark ? "bg-ink-gradient py-20 lg:py-24" : "py-20 lg:py-24"}>
      <div className="section-x">
        {eyebrow && (
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand">
            {eyebrow}
          </p>
        )}
        <h2
          className={
            "mx-auto mt-3 max-w-4xl text-center text-3xl font-semibold leading-[1.2] sm:text-[42px] " +
            (dark ? "text-ink-foreground" : "text-foreground")
          }
        >
          {heading}
        </h2>
        {subheading && (
          <p
            className={
              "mx-auto mt-4 max-w-3xl text-center text-3xl font-semibold leading-[1.2] sm:text-[42px] " +
              (dark ? "text-ink-foreground" : "text-foreground")
            }
          >
            {subheading}
          </p>
        )}

        <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full lg:w-1/2">
            {features.map((feature, i) => {
              const open = i === active;
              return (
                <div
                  key={feature.title}
                  className={
                    "border-t py-8 " + (dark ? "border-ink-foreground/15" : "border-border")
                  }
                >
                  <button
                    onClick={() => setActive(i)}
                    className="flex w-full cursor-pointer items-start justify-between gap-6 text-left"
                  >
                    <h3
                      className={
                        "text-2xl font-medium " + (dark ? "text-ink-foreground" : "text-ink")
                      }
                    >
                      {feature.title}
                    </h3>
                    <ChevronDown
                      className={
                        "mt-1 size-5 shrink-0 text-brand transition-transform " +
                        (open ? "rotate-180" : "")
                      }
                    />
                  </button>
                  <p
                    className={
                      "mt-3 text-[17px] " + (dark ? "text-ink-foreground/75" : "text-ink-soft")
                    }
                  >
                    {feature.description}
                  </p>
                  {open && feature.bullets.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {feature.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className={
                            "flex items-center gap-3 text-[15px] " +
                            (dark ? "text-ink-foreground/90" : "text-ink-soft")
                          }
                        >
                          <span className="flex size-5 items-center justify-center rounded-full bg-[oklch(0.55_0.14_155)] text-white">
                            <Check className="size-3" />
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className={"border-t " + (dark ? "border-ink-foreground/15" : "border-border")} />
            <div className="mt-10">
              <Button variant={dark ? "onDark" : "brand"} size="pill" asChild>
                <a href="#quote">{ctaLabel}</a>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <img
              src={current.image}
              alt={current.title}
              className={`h-auto object-contain rounded-2xl transition-all duration-200 ${
                dark
                  ? active === 0
                    ? "w-[80%] max-w-[460px] lg:-mt-16"
                    : "w-[90%] max-w-[530px]"
                  : "w-full"
              }`}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
