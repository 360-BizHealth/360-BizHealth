const FR = "https://framerusercontent.com/images";
const previousTestimonials = [
  {
    q: "360 Biz Health transformed our HR operations. We reduced payroll processing time by 95% and finally have zero errors. The savings have been incredible.",
    n: "Rajesh Kumar",
  },
  {
    q: "Their tax advisory alone saved us ₹25 lakhs annually. What impressed me most is how proactive their team is—they catch issues before they become penalties.",
    n: "Priya Sharma",
  },
  {
    q: "Managing compliance across multiple regulations was a nightmare. Now it's automated and we sleep better knowing everything is audit-ready.",
    n: "Amit Patel",
  },
  {
    q: "The best investment our business made. All our HR, tax, and compliance needs in one place. The support team is responsive and genuinely cares about our success.",
    n: "Neha Singh",
  },
  {
    q: "From 80 hours of manual work per month to almost zero. That's the kind of impact 360 Biz Health delivers. Highly recommend.",
    n: "Vikram Kapoor",
  },
];
const previousTestimonialRow = [...previousTestimonials, ...previousTestimonials];
const quoteImage = `${FR}/UBNbepHJf0KbEt8th3mWIASU8.svg`;
const starsImage = `${FR}/7gBs4Qym6w5w5VToXqPFZUirIg.svg`;

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium text-primary">Success Stories</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl font-semibold text-foreground sm:text-[44px]">
            Trusted by Leading Businesses
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            See how 500+ companies transformed their operations, saved costs, and reduced compliance risk.
          </p>
        </div>
      </div>
      <div className="mt-14 overflow-hidden">
        <div className="marquee marquee-slow items-stretch">
          {previousTestimonialRow.map((item, index) => (
            <div
              key={`${item.n}-${index}`}
              className="flex w-[380px] shrink-0 flex-col justify-between rounded-3xl border border-border bg-card p-7"
            >
              <div>
                <img src={quoteImage} alt="" className="h-5 w-auto opacity-70" />
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">{item.q}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold">{item.n}</span>
                <img src={starsImage} alt="rating" className="h-4 w-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
