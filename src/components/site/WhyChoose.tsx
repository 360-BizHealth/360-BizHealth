import { whySlides } from "./site-data";

import { Clock3, Gift, Headset, ListChecks } from "lucide-react";

const tints = [
  "bg-[oklch(0.93_0.05_150)]",
  "bg-[oklch(0.91_0.04_300)]",
  "bg-[oklch(0.91_0.03_255)]",
  "bg-[oklch(0.94_0.06_85)]",
];

const visualIcons = [ListChecks, Gift, Clock3, Headset];

export function WhyChoose() {
  return (
    <section className="bg-surface-soft py-20 lg:py-24">
      <div className="section-x">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h2 className="text-4xl font-semibold text-foreground sm:text-[44px]">
              Why choose 360 Biz Health ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
              You&rsquo;re choosing flexibility, transparency, and personalization in your employee
              benefits when choosing 360 Biz Health
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whySlides.map((slide, i) => {
            const VisualIcon = visualIcons[i % visualIcons.length];
            return (
              <article
                key={slide.title}
                className={
                  "flex flex-col rounded-3xl p-7 pb-0 text-center " + (tints[i % tints.length] ?? "")
                }
              >
                <h3 className="text-xl font-semibold leading-snug text-ink">{slide.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{slide.description}</p>
                <div className="mt-6 flex h-36 items-center justify-center">
                  <VisualIcon aria-hidden="true" className="size-24 stroke-[1.2] text-ink/80" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
