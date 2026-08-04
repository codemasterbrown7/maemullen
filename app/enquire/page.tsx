import type { Metadata } from "next";
import { InProgress } from "@/components/InProgress";
import { siteName } from "@/content/site";
import { soonLine, soonMark, soonPages } from "@/content/soon";

/**
 * /enquire — not built yet, and the one stub that costs the studio something,
 * because every CTA on the site points here. The Instagram link every one of
 * these pages carries is the way through in the meantime.
 *
 * docs/SITEMAP.md §4.6 has the field list. The open question is not the form,
 * it is where a submission goes: the site is a static export on GitHub Pages
 * with no server behind it, so it will need a third-party endpoint (Formspree,
 * Resend, a Google Form) or a host that runs code.
 */
const page = soonPages.enquire;

export const metadata: Metadata = {
  title: `${page.metaTitle} — ${siteName}`,
  description: page.description,
};

export default function EnquirePage() {
  return (
    <InProgress
      current={page.href}
      mark={soonMark}
      title={page.title}
      line={soonLine}
    />
  );
}
