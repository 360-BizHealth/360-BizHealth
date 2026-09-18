import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "./site-data";

export function Faq() {
  return (
    <section className="bg-surface-soft py-20">
      <div className="section-x max-w-4xl">
        <h2 className="text-3xl font-semibold text-foreground sm:text-[40px]">
          FAQ: People also ask
        </h2>
        <Accordion type="single" collapsible className="mt-10 space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-ink hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
