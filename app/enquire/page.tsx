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
 * brand red/burgundy — the colour of the MM monogram, which opens the page —
 * asked for directly (2026-08-09). The switch is one line of CSS: `.enq`
 * repoints the chrome's `--mmc-blue` and its own accent to `--brand-red`, so the
 * header, footer, inputs, links and the submit button all pick it up without
 * touching the shared chrome components.
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
          <img
            className="enq__monogram"
            src={asset(enquiryMonogram.src)}
            alt={enquiryMonogram.alt}
            width={96}
            height={96}
          />
          <p className="enq__eyebrow">{enquiryPage.eyebrow}</p>
          <h1 className="enq__title">{enquiryPage.title}</h1>
          <p className="enq__standfirst">{enquiryPage.standfirst}</p>
        </header>

        <EnquireForm />
      </main>

      <ChromeFooter />
    </div>
  );
}
