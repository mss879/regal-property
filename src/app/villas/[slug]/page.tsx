import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVilla, villasInOrder, VILLAS, STATUS_LABEL, formatSqft, render } from "@/lib/lots";
import { bookletFor, plansFor, rendersFor } from "@/lib/assets";
import { PageHero } from "@/components/layout/PageHero";
import { SpecTable } from "@/components/villas/SpecTable";
import { GalleryGrid } from "@/components/villas/Gallery";
import { VillaCard } from "@/components/villas/VillaCard";
import { Ribbon } from "@/components/ui/Ribbon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/home/CtaBand";

export const dynamicParams = false;

export function generateStaticParams() {
  return VILLAS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/villas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const villa = getVilla(slug);
  if (!villa) return {};
  return {
    title: `${villa.label} — ${villa.bedrooms} bedroom villa`,
    description: villa.description,
    openGraph: { images: [{ url: villa.hero! }] },
  };
}

export default async function VillaPage({ params }: PageProps<"/villas/[slug]">) {
  const { slug } = await params;
  const villa = getVilla(slug);
  if (!villa || !villa.areas) notFound();

  const booklet = bookletFor(villa.slug).map((s, i) => ({ ...s, alt: `${villa.label} catalogue, page ${i + 1}` }));
  const renders = rendersFor(villa);
  const plans = plansFor(villa);
  const others = villasInOrder().filter((v) => v.slug !== villa.slug);
  const lotParam = villa.id;

  const facts = [
    { label: "Land", value: `${villa.perches} perches` },
    { label: "Bedrooms", value: String(villa.bedrooms) },
    { label: "Total area", value: `${formatSqft(villa.areas.total)} ft²` },
    { label: "Phase", value: `0${villa.phase}` },
  ];

  return (
    <main>
      <PageHero
        eyebrow={
          <span className="flex items-center gap-2">
            <Link href="/villas" className="hover:text-paper">Villas</Link>
            <span aria-hidden>/</span>
            <span>{villa.label}</span>
          </span>
        }
        title={
          <>
            {villa.label}
            <br />
            <em>{villa.bedrooms} bedroom villa</em>
          </>
        }
        body={<p>{villa.description}</p>}
        image={villa.hero!}
        imageAlt={`${villa.label} exterior — artist's impression`}
        imageOverlay={<Ribbon status={villa.status} className="absolute top-6 right-0" />}
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/15 pt-6 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[0.66rem] tracking-[0.18em] text-sage uppercase">{f.label}</dt>
              <dd className="mt-1 font-display text-2xl font-light">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/contact?lot=${lotParam}`} variant="light">
            {villa.status === "nearing-completion" ? "Enquire about this villa" : "Pre-book this villa"}
          </ButtonLink>
          <ButtonLink href="#catalogue" variant="outline-light" arrow={false}>
            View all {booklet.length} catalogue pages
          </ButtonLink>
        </div>
      </PageHero>

      {/* Specification */}
      <section className="container-x py-24 md:py-32" aria-labelledby="spec-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="01">Specification</SectionLabel>
            <SplitHeading
              id="spec-title"
              by="words"
              className="mt-6 font-display text-title font-normal tracking-[-0.02em] text-forest uppercase [&_em]:text-leaf [&_em]:not-italic"
            >
              {villa.tagline}
            </SplitHeading>
            <Reveal as="ul" mode="children" className="mt-10 space-y-3 text-[0.95rem] text-ink-2">
              {[
                "Fully furnished interiors",
                "Luxuriously landscaped garden",
                "Positioned to maximise lake views and privacy",
                `Status: ${STATUS_LABEL[villa.status]}`,
              ].map((t) => (
                <li key={t} data-reveal className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-leaf" />
                  {t}
                </li>
              ))}
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6">
            <SpecTable areas={villa.areas} />
          </Reveal>
        </div>
      </section>

      {/* Plans */}
      {plans.length > 0 && (
        <section className="container-x pb-24 md:pb-32" aria-labelledby="plans-title">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <SectionLabel index="02">Plans</SectionLabel>
              <h2 id="plans-title" className="mt-6 font-display text-title font-normal tracking-[-0.02em] text-forest uppercase">
                Layout plans
              </h2>
            </div>
          </div>
          <GalleryGrid slides={plans} captions className="grid gap-6 md:grid-cols-2" sizes="(min-width: 768px) 50vw, 100vw" />
        </section>
      )}

      {/* Renders — every artist's impression from the booklet, cropped from its page */}
      {renders.length > 0 && (
        <section className="bg-cream py-24 md:py-32" aria-labelledby="renders-title">
          <div className="container-x">
            <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <SectionLabel index="03">Artists&apos; impressions</SectionLabel>
                <h2 id="renders-title" className="mt-6 font-display text-title font-normal tracking-[-0.02em] text-forest uppercase">
                  Inside and around <span className="text-leaf">{villa.label}</span>
                </h2>
              </div>
              <p className="text-[0.9rem] leading-relaxed text-ink-2 md:col-span-4 md:text-right">
                {renders.length} renders of the villa, its gardens and interiors.
              </p>
            </div>
            <GalleryGrid slides={renders} captions ratio="4 / 3" className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3" />
          </div>
        </section>
      )}

      {/* Full catalogue */}
      <section id="catalogue" className="container-x scroll-mt-24 py-24 md:py-32" aria-labelledby="catalogue-title">
        <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="04">The full catalogue</SectionLabel>
            <h2 id="catalogue-title" className="mt-6 font-display text-title font-normal tracking-[-0.02em] text-forest uppercase">
              Every page of the {villa.label} booklet
            </h2>
          </div>
          <p className="text-[0.9rem] leading-relaxed text-ink-2 md:col-span-4 md:text-right">
            {booklet.length} pages of plans, elevations and renders. Tap any page to open it full-screen and zoom in.
          </p>
        </div>
        <GalleryGrid slides={booklet} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />
      </section>

      {/* Other villas */}
      <section className="border-t border-forest/10 py-24 md:py-32" aria-labelledby="others-title">
        <div className="container-x">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 id="others-title" className="font-display text-title font-normal tracking-[-0.02em] text-forest uppercase">
              Other villas
            </h2>
            <ButtonLink href="/#master-plan" variant="outline">Master plan</ButtonLink>
          </div>
          <Reveal mode="children" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((v) => (
              <div key={v.slug} data-reveal>
                <VillaCard villa={v} sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Reserve <em>{villa.label}</em>
          </>
        }
        body={`${villa.label} is ${STATUS_LABEL[villa.status].toLowerCase()}. Send us an enquiry and our team will be in touch.`}
        href={`/contact?lot=${lotParam}`}
        image={villa.feature ? render(villa.slug, villa.feature) : villa.hero!}
        imageAlt={`${villa.label} — artist's impression`}
      />
    </main>
  );
}
