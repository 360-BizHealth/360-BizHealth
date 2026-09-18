import { certifications } from "./site-data";

export function Compliance() {
  return (
    <section className="py-20 lg:py-24">
      <div className="section-x">
        <div className="grid items-center gap-12 rounded-[2rem] bg-ink-gradient p-10 lg:grid-cols-[0.9fr_1.4fr] lg:p-14">
          <h2 className="text-3xl text-ink-foreground sm:text-[34px]">
            <span className="text-xl font-medium sm:text-2xl">Trust in our</span>
            <br />
            <span className="text-4xl font-semibold sm:text-[42px]">Compliance</span>
            <br />
            <span className="text-4xl font-semibold sm:text-[42px]">&amp; Certification</span>
            <br />
            <span className="text-xl font-normal text-ink-foreground/85 sm:text-2xl">
              when it comes to managing your employee benefits.
            </span>
          </h2>
          <div className="grid grid-cols-2 items-start gap-10 sm:grid-cols-3">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex flex-col items-center gap-4 text-center">
                <img
                  src={cert.src}
                  alt={`${cert.name} certified`}
                  className="h-24 w-auto"
                  loading="lazy"
                />
                <p className="text-[17px] leading-snug text-ink-foreground/90">
                  {cert.name} certified
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
