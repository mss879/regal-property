import type { Metadata } from "next";
import { brochureSlides } from "@/lib/assets";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid, LightboxButton } from "@/components/villas/Gallery";
import { Arrow, buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Brochure",
  description: `The ${SITE.name} brochure — the setting, master plan, amenities and every villa now released.`,
};

export default function BrochurePage() {
  const slides = brochureSlides().map((s, i) => ({ ...s, alt: `Brochure page ${i + 1}` }));
  return (
    <main>
      <PageHero
        eyebrow="Brochure · September 2026"
        title={
          <>
            The <em>brochure</em>
          </>
        }
        body={<p>Every page of the {SITE.name} brochure — the setting, the master plan, the amenities and the villas now released.</p>}
        image="/images/brochure/cover.jpg"
        imageAlt="Cover of the Regal Victoria Lakeside brochure"
        imagePosition="50% 30%"
      >
        <LightboxButton slides={slides} autoplay label="Play the brochure as a slideshow" className={buttonClass("light")}>
          Play as slideshow <Arrow />
        </LightboxButton>
      </PageHero>

      <section className="container-x py-24 md:py-32" aria-label="Brochure pages">
        <GalleryGrid slides={slides} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" sizes="(min-width: 1024px) 25vw, 50vw" />
      </section>
    </main>
  );
}
