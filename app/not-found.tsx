import type { Metadata } from "next";
import { InProgress } from "@/components/InProgress";
import { siteName } from "@/content/site";
import { notFoundPage } from "@/content/soon";

/**
 * 404 — docs/SITEMAP.md §4.7: "Wordmark, a short line in the brand voice, and a
 * link home. Low effort, but it should not look like a default."
 *
 * It wears the in-progress layout without the contents block, because a 404 is
 * not a page-to-be and listing what is coming would be a lie about an address
 * that may simply be a typo. What it keeps is the way onward.
 *
 * On GitHub Pages this is what the host serves for any unmatched path: the
 * static export writes it to out/404.html, which Pages uses as the site's 404
 * document. Everything on it is prerendered, so it needs no server.
 */
export const metadata: Metadata = {
  title: `${notFoundPage.metaTitle} — ${siteName}`,
  description: notFoundPage.description,
};

export default function NotFound() {
  return (
    <InProgress
      mark={notFoundPage.mark}
      title={notFoundPage.title}
      standfirst={notFoundPage.standfirst}
    />
  );
}
