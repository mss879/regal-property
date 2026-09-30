import { SplitHeading } from "@/components/motion/SplitHeading";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { COPY } from "@/lib/site";

const STATS = [
  { value: 15, pad: 2, label: "Bespoke villas" },
  { value: 2, pad: 2, label: "Release phases" },
  { value: 400, suffix: "m", label: "Lakeside jogging track" },
];

export function Statement() {
  return (
    <section className="container-x py-28 md:py-40" aria-labelledby="statement-title">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-12 md:col-span-4">
          <SectionLabel index="01">About us</SectionLabel>
          <Reveal mode="children" className="grid grid-cols-3 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} data-reveal>
                <p className="font-display text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none font-light text-forest">
                  <Counter value={s.value} pad={s.pad} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[0.78rem] leading-snug text-ink-2">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <SplitHeading
            id="statement-title"
            accent
            by="words"
            className="font-display text-title font-normal tracking-[-0.02em] text-forest uppercase text-balance md:text-right [&_em]:text-leaf [&_em]:not-italic"
          >
            Every villa is a dialogue between <em>contemporary architecture</em>, <em>the lake</em>, and the family who
            calls it home.
          </SplitHeading>
          <Reveal className="mt-12 flex flex-col gap-8 md:ml-auto md:max-w-2xl md:flex-row md:items-start md:justify-end">
            <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-2">{COPY.harmony}</p>
            <ButtonLink href="/about" variant="outline" className="shrink-0">Our story</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
