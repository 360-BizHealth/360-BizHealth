import { satisfactionStats } from "./site-data";

export function StatsBand() {
  return (
    <section className="bg-surface-soft py-20 lg:py-24">
      <div className="section-x">
        <div className="grid items-center gap-10 rounded-[2rem] bg-[linear-gradient(100deg,oklch(0.42_0.12_310),oklch(0.55_0.13_75))] p-8 lg:grid-cols-[0.9fr_1.6fr] lg:p-12">
          <h2 className="text-3xl font-medium leading-tight text-ink-foreground sm:text-[38px]">
            We take
            <br />
            <span className="font-light">customer satisfaction</span>
            <br />
            <span className="text-ink-foreground/80">Very seriously</span>
          </h2>
          <dl className="grid gap-5 sm:grid-cols-3">
            {satisfactionStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-6 text-center">
                <dt className="text-4xl font-bold text-ink">{stat.value}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink-soft">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
