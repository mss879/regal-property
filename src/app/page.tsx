import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { FeatureTriptych } from "@/components/home/FeatureTriptych";
import { Showcase } from "@/components/home/Showcase";
import { MasterPlan } from "@/components/home/MasterPlan";
import { VillaCollection } from "@/components/home/VillaCollection";
import { Amenities } from "@/components/home/Amenities";
import { Location } from "@/components/home/Location";
import { CtaBand } from "@/components/home/CtaBand";
import { brochureSlides } from "@/lib/assets";

export default function Home() {
  const brochure = brochureSlides().map((s, i) => ({ ...s, alt: `Regal Victoria Lakeside brochure, page ${i + 1}` }));
  return (
    <main>
      <Hero />
      <Statement />
      <FeatureTriptych />
      <Showcase brochure={brochure} />
      <MasterPlan />
      <VillaCollection />
      <Amenities />
      <Location />
      <CtaBand />
    </main>
  );
}
