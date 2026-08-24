import type { Metadata } from "next";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { EnquireSection } from "@/components/EnquireSection";
import { enquirySubjects } from "@/content/enquiry-subjects";
import { siteName } from "@/content/site";
import "./enquire.css";

/**
 * /enquire — the site's single conversion goal (SITEMAP §2). Every CTA on every
 * page already points here.
 *
 * THE RED PAGE. The rest of the site accents in blue; this page accents in the
 * brand red/burgundy, asked for directly (2026-08-09). The switch is one line of
 * CSS: `.enq` repoints the chrome's `--mmc-blue` and its own accent to
 * `--brand-red`, so the header, footer, links and the submit button all pick it
 * up without touching the shared chrome components.
 *
 * THE FORM IS A PANEL. The fields sit on their own surface, a shade off the
 * cream page, so the page reads as a form rather than as more prose (asked for
 * 2026-08-09). The MM monogram is the panel's small mark — it is NOT a masthead
 * logo, and there is no "Enquire" eyebrow, because the page you are on says that
 * already. On success the same sheet becomes the confirmation slip, monogram
 * centred: see components/EnquireSection.tsx.
 *
 * HEADINGS ARE HEROS, not Playfair. The site sets every display line in
 * `--font-swiss` (services, the in-progress pages, home); the first draft of
 * this page used the serif `--font-display`, which appears as a heading nowhere
 * else and read as a different site. See enquire.css.
 *
 * NO MARQUEE, like /services: a band listing the seven services above a contact
 * form is the page's own contents repeated above itself.
 *
 * Everything between the header and the footer is the one client island
 * (components/EnquireSection.tsx) — it owns the h1, because the h1 changes when
 * the enquiry lands. This page stays a server component so it can own the
 * metadata and the chrome. Fields and where submissions go: content/enquire.ts.
 *
 * WHAT THE ENQUIRY IS ABOUT. A CTA on /packages names the package it sat next
 * to — `/enquire?package=signature` — and the form shows that back above the
 * fields. Every other enquire CTA on the site is page-level and stays bare. The list of what can be named is derived here, on the
 * server, and passed down: importing content/enquiry-subjects.ts inside the
 * client island would drag all of content/packages.ts into the browser bundle
 * for the sake of ten short labels.
 */
export const metadata: Metadata = {
  title: `Enquire — ${siteName}`,
  description: "Start a project with MaeMüllen. Tell us about you and your brand.",
};

export default function EnquirePage() {
  return (
    <div className="enq mmc">
      <ChromeHeader current="/enquire" />

      <main className="enq__main">
        <EnquireSection subjects={enquirySubjects} />
      </main>

      <ChromeFooter />
    </div>
  );
}
