import type { Metadata } from "next";
import { Intro } from "@/components/intro/Intro";
import { siteDescription, siteName } from "@/content/site";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

/**
 * /intro — the landing intro, on its own address while it is being tested.
 *
 * Deliberately NOT yet what a first visit sees: nothing links here and the home
 * page is unchanged. Open the URL to watch it, reload to watch it again. When
 * it is signed off, the same <Intro /> goes over the home page on a visitor's
 * first load and this route can go.
 */
export default function IntroPage() {
  return <Intro />;
}
