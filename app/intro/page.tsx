import type { Metadata } from "next";
import { Intro } from "@/components/intro/Intro";
import { siteDescription, siteName } from "@/content/site";
import Home from "../page";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

/**
 * /intro — the home page with the intro playing over it, on its own address
 * while the intro is being tested.
 *
 * Deliberately NOT yet what a first visit sees: nothing links here and / is
 * unchanged. Open the URL to watch it, reload to watch it again. The home page
 * is the real one, rendered in full underneath, because the intro ends by
 * uncovering it — see Intro.tsx. When it is signed off, the same <Intro /> goes
 * into / itself on a visitor's first load and this route can go.
 */
export default function IntroPage() {
  return (
    <>
      <Home />
      <Intro />
    </>
  );
}
