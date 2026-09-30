import Link from "next/link";
import type { Route } from "next";
import { FOOTER_EXPLORE, SITE, TEAM } from "@/lib/site";
import { villasInOrder } from "@/lib/lots";
import { Logo } from "@/components/ui/Logo";
import { FooterReveal } from "./FooterReveal";

export function Footer() {
  const year = 2026;
  return (
    <footer className="grain relative overflow-hidden bg-forest text-paper">
      <FooterReveal>
        <div className="container-x pt-24 pb-10 md:pt-32">
          <div className="grid gap-14 border-b border-paper/10 pb-16 md:grid-cols-12">
            <div className="md:col-span-5" data-reveal>
              <p className="font-serif text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] font-light italic text-lime">
                {SITE.tagline}
              </p>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-sage-2">
                Bespoke contemporary villas above the Victoria Reservoir, Digana, Kandy.
              </p>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3" data-reveal>
              <div>
                <p className="eyebrow text-sage">Explore</p>
                <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                  {FOOTER_EXPLORE.map((n) => (
                    <li key={n.href}>
                      <Link href={n.href as Route} className="transition-colors hover:text-lime">{n.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-sage">Villas</p>
                <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                  {villasInOrder().map((v) => (
                    <li key={v.slug}>
                      <Link href={`/villas/${v.slug}`} className="transition-colors hover:text-lime">{v.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="eyebrow text-sage">Visit</p>
                <address className="mt-5 space-y-2.5 text-[0.95rem] not-italic">
                  <p>{SITE.address}</p>
                  <p><a href={SITE.phoneHref} className="transition-colors hover:text-lime">{SITE.phone}</a></p>
                  <p><a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-lime">{SITE.email}</a></p>
                </address>
              </div>
            </nav>
          </div>

          <div className="py-12 md:py-16" data-footer-logo>
            <Logo className="w-full max-w-[1100px] text-paper" />
          </div>

          <div className="flex flex-col gap-4 border-t border-paper/10 pt-8 text-xs text-sage md:flex-row md:items-center md:justify-between">
            <p>© {year} {TEAM.developer.name}. Architecture by {TEAM.architect.name}.</p>
            <p className="max-w-xl md:text-right">* {SITE.disclaimer}</p>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
