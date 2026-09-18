import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section id="quote" className="py-20">
      <div className="section-x">
        <div className="bg-brand-gradient flex flex-col items-center gap-8 rounded-[2.5rem] px-8 py-16 text-center">
          <h2 className="max-w-3xl text-3xl font-semibold text-brand-foreground sm:text-[40px]">
            Ready to streamline your HR, Payroll, Compliance &amp; Business Operations?
          </h2>
          <Button variant="onDark" size="pill" asChild>
            <a href="#quote">Schedule a call</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
