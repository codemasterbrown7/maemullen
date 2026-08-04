import { HeroPair } from "@/components/HeroPair";
import { ServicesMarquee } from "@/components/ServicesMarquee";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StudioIntro } from "@/components/StudioIntro";

/**
 * Landing page — 2026-08-02 direction. Two full-bleed images side by side
 * filling the first screen, then one studio-intro block. Everything else lives
 * behind the nav. (The first screen was briefly a click-through gallery; the
 * pair replaced it, following the Nude Social arrangement.)
 *
 * The first screen is a flex column pinned to 100svh so the gallery takes
 * exactly the space the header and marquee leave, rather than being sized with
 * a magic number that drifts the moment the marquee's padding changes. `svh`
 * rather than `vh` so mobile browsers don't hide the bottom of it behind the
 * collapsing URL bar.
 *
 * The previous, much longer home page is parked in
 * components/parked/PortedHomeSections.tsx as raw material for /services,
 * /work and /about.
 */
export default function Home() {
  return (
    <div style={{ background: "var(--bg)", minWidth: "320px" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100svh" }}>
        <SiteHeader />
        <ServicesMarquee />
        <HeroPair />
      </div>
      <main>
        <StudioIntro />
      </main>
      <SiteFooter />
    </div>
  );
}
