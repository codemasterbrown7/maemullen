import type { Metadata } from "next";
import { InProgress } from "@/components/InProgress";
import { siteName } from "@/content/site";
import { soonLine, soonMark, soonPages } from "@/content/soon";

/**
 * /about — not built yet. Spec and verbatim deck copy are in docs/SITEMAP.md
 * §4.2; the copy is ready, the photograph of Laura and Poppy and the doodles
 * are not. When it is built, this file is replaced outright.
 */
const page = soonPages.about;

export const metadata: Metadata = {
  title: `${page.metaTitle} — ${siteName}`,
  description: page.description,
};

export default function AboutPage() {
  return (
    <InProgress
      current={page.href}
      mark={soonMark}
      title={page.title}
      line={soonLine}
    />
  );
}
