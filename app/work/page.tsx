import type { Metadata } from "next";
import { InProgress } from "@/components/InProgress";
import { siteName } from "@/content/site";
import { soonLine, soonMark, soonPages } from "@/content/soon";

/**
 * /work — not built yet. docs/SITEMAP.md §4.5: three full-screen projects, of
 * which only Bendito has cleared assets and a confirmed name. Both the
 * "Portfolio" and "Work" nav items point here — only the first is marked
 * current; the split between them is deliberately deferred (SITEMAP §2).
 */
const page = soonPages.work;

export const metadata: Metadata = {
  title: `${page.metaTitle} — ${siteName}`,
  description: page.description,
};

export default function WorkPage() {
  return (
    <InProgress
      current={page.href}
      mark={soonMark}
      title={page.title}
      line={soonLine}
    />
  );
}
