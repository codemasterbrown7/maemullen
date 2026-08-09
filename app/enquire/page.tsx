import type { Metadata } from "next";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { EnquireForm } from "@/components/EnquireForm";
import { enquiryMonogram, enquiryPage } from "@/content/enquire";
import { siteName } from "@/content/site";
import { asset } from "@/lib/asset";
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
 * already.
 *
 * HEADINGS ARE HEROS, not Playfair. The site sets every display line in
 * `--font-swiss` (services, the in-progress pages, home); the first draft of
 * this page used the serif `--font-display`, which appears as a heading nowhere
 * else and read as a different site. See enquire.css.
 *
 * NO MARQUEE, like /services: a band listing the seven services above a contact
 * form is the page's own contents repeated above itself.
 *
 * The form itself is the one client island (components/EnquireForm.tsx); this
 * page stays a server component so it can own the metadata and the chrome.
 * Fields and where submissions go: content/enquire.ts.
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
        <header className="enq__masthead">
          <h1 className="enq__title">{enquiryPage.title}</h1>
          <p className="enq__standfirst">{enquiryPage.standfirst}</p>
        </header>

        <div className="enq__panel">
          <img
            className="enq__mark"
            src={asset(enquiryMonogram.src)}
            alt={enquiryMonogram.alt}
            width={48}
            height={48}
          />
          <EnquireForm />
        </div>
      </main>

      <ChromeFooter />
    </div>
  );
}
