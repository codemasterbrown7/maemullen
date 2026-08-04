import type { Metadata } from "next";
import { InProgress } from "@/components/InProgress";
import { siteName } from "@/content/site";
import { soonMark, soonPages } from "@/content/soon";

/**
 * /packages — not built yet, and blocked rather than merely unstarted:
 * docs/SITEMAP.md §4.4 carries two unresolved contradictions (whether prices
 * appear on the site at all, and Gold/Silver/Bronze against
 * Essential/Signature/Elevated, where "Elevated" is currently attached to the
 * cheapest tier). This page therefore names no tier — see content/soon.ts.
 */
const page = soonPages.packages;

export const metadata: Metadata = {
  title: `${page.metaTitle} — ${siteName}`,
  description: page.description,
};

export default function PackagesPage() {
  return (
    <InProgress
      current={page.href}
      mark={soonMark}
      title={page.title}
      standfirst={page.standfirst}
      contents={page.contents}
    />
  );
}
