"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { LightboxButton, type GallerySlide } from "@/components/villas/Gallery";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { COPY } from "@/lib/site";
import { IMAGES } from "@/lib/images";

// Full-bleed aerial that opens out from an inset card as it scrolls into view.
// The play button runs the brochure as an auto-playing slideshow.
export function Showcase({ brochure }: { brochure: GallerySlide[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      if (window.matchMedia(REDUCED).matches) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q("[data-show-frame]")[0], start: "top 95%", end: "center 55%", scrub: 1 },
      });
      // The image never drops below 1.1× so the ±4% drift below can't expose an edge.
      tl.fromTo(
        q("[data-show-frame]"),
        { clipPath: "inset(0% 9% 0% 9% round 36px)" },
        { clipPath: "inset(0% 0% 0% 0% round 36px)", ease: "none" },
      ).fromTo(q("[data-show-img]"), { scale: 1.25 }, { scale: 1.1, ease: "none" }, 0);
      gsap.fromTo(
        q("[data-show-img]"),
        { yPercent: -4 },
        { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(q("[data-show-play]"), {
        scale: 0.4,
        autoAlpha: 0,
        duration: 1.2,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: q("[data-show-frame]")[0], start: "top 60%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pb-28 md:pb-40" aria-labelledby="showcase-title">
      <div className="px-3 md:px-4">
        <div data-show-frame className="relative mx-auto aspect-[4/5] max-w-[1600px] overflow-hidden rounded-[36px] sm:aspect-[16/10] lg:aspect-[16/8.2]">
          <div data-show-img className="absolute inset-0" style={{ scale: 1.1 }}>
            <Image
              src={IMAGES.showcase}
              alt="The rock pool's infinity edge, looking across the Victoria Reservoir to the hills"
              fill
              sizes="(min-width: 1600px) 1600px, 100vw"
              quality={90}
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-forest/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div data-show-play>
              <LightboxButton
                slides={brochure}
                autoplay
                label="Play the brochure slideshow"
                className="relative flex size-24 items-center justify-center rounded-full bg-paper text-forest shadow-2xl transition-transform duration-500 hover:scale-110 md:size-28"
              >
                <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-paper/40 [animation-duration:2.4s]" />
                <svg viewBox="0 0 24 24" className="relative ml-1 size-7"><path d="M7 4.5v15l12-7.5-12-7.5Z" fill="currentColor" /></svg>
              </LightboxButton>
            </div>
          </div>
          <p className="absolute bottom-5 left-5 rounded-full bg-forest/60 px-4 py-2 text-[0.72rem] font-medium tracking-[0.14em] text-paper uppercase backdrop-blur md:bottom-8 md:left-8">
            The brochure · {brochure.length} pages
          </p>
        </div>
      </div>

      <div className="container-x mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
        <SplitHeading
          id="showcase-title"
          by="lines"
          className="font-display text-title font-normal tracking-[-0.02em] text-forest uppercase md:col-span-5 [&_em]:text-leaf [&_em]:not-italic"
        >
          <em>A rare</em> collection <br />
          <em>by the</em> lake
        </SplitHeading>
        <Reveal className="text-[0.92rem] leading-relaxed text-ink-2 md:col-span-4">
          <p>{COPY.collection}</p>
        </Reveal>
        <Reveal className="text-[0.8rem] leading-relaxed text-ink-2 md:col-span-3 md:text-right">
          <p className="font-semibold text-forest">Victoria Reservoir</p>
          <p>Digana, Kandy · Sri Lanka</p>
        </Reveal>
      </div>
    </section>
  );
}
