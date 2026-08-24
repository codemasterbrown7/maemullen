/**
 * /enquire content and configuration — docs/SITEMAP.md §4.6, styled per
 * DESIGN.md §7 (underline inputs, `(required)` in words, no placeholder-as-label).
 *
 * WHERE SUBMISSIONS GO. The site is a static export on GitHub Pages with no
 * server behind it (next.config.ts), so the form cannot POST to anything we
 * host. Enquiries are handed to FormSubmit — a free relay that forwards a form
 * POST straight to an inbox — and land in `enquiryEmail` below. Nothing here is
 * a secret: the address is a public contact address, so it lives in content
 * with the rest of the copy rather than in an env var.
 *
 * FIRST-RUN ACTIVATION. FormSubmit emails `enquiryEmail` a one-time confirmation
 * link the very first time the form is submitted; until someone clicks it, later
 * submissions are held, not forwarded. So the first real (or test) enquiry after
 * this goes live needs a human to open that inbox once.
 *
 * HIDING THE ADDRESS LATER. Putting the address straight in the endpoint exposes
 * it to scrapers. Once activated, FormSubmit issues a random alias for the same
 * inbox — swap `enquiryEndpointBase` for `https://formsubmit.co/ajax/<alias>`
 * and the raw address leaves the client bundle. One line, no other change.
 */

import { services } from "@/content/home";

/** The inbox enquiries are forwarded to. Confirmed by the client 2026-08-09. */
export const enquiryEmail = "maemullenagency@gmail.com";

/**
 * FormSubmit's AJAX endpoint. AJAX (rather than a plain form POST that
 * redirects) is what lets the confirmation replace the form in place with focus
 * moved to it, which §4.6 requires — "never a silent success".
 */
export const enquiryEndpoint = `https://formsubmit.co/ajax/${enquiryEmail}`;

/** A working mailto fallback, shown if the relay is ever unreachable. */
export const enquiryMailto = `mailto:${enquiryEmail}?subject=${encodeURIComponent(
  "Project enquiry",
)}`;

export const enquiryPage = {
  title: "Start a project",
  standfirst:
    "Tell us a little about you and your brand. We read every enquiry and will be in touch by email soon.",
  submitLabel: "Send enquiry",
  sendingLabel: "Sending…",
  /**
   * MOST FIELDS ARE REQUIRED, so the optional ones carry the mark and this line
   * covers the rest. Seven of ten labels ending in "(required)" is noise that
   * says the same thing seven times; marking the exception is the long-standing
   * recommendation when the majority are compulsory (Nielsen).
   */
  requiredNote: "All fields are required unless marked optional.",
  optionalLabel: "(optional)",
  /**
   * Shown in place of the masthead AND the form on success; focus moves to the
   * heading. It is the whole page at that point, not a panel tucked under a
   * masthead still asking you to start a project — so it carries its own mark,
   * its own eyebrow and its own onward link.
   *
   * `replyLabel` sits in front of the address the visitor typed. Nothing is
   * sent TO that address (FormSubmit has no autoresponder here), so the line
   * promises only what is true: that is where the reply will go.
   */
  confirmation: {
    eyebrow: "Enquiry received",
    heading: "Thank you — your enquiry is on its way.",
    body: "We've got your details and we'll be in touch shortly. In the meantime, come and find us on Instagram.",
    replyLabel: "Reply to",
    instagramLabel: "Follow on Instagram",
    note: "Need to add anything? Email us at",
  },
  /** Shown above the form if the send fails; the form stays so it can be retried. */
  error: {
    heading: "That didn't send.",
    body: "Something went wrong on the way. Please try again in a moment — or email us directly and we'll pick it up.",
    retryLabel: "Email us instead",
  },
};

/**
 * What a field says when it is wrong, keyed by input id.
 *
 * WHY NOT THE BROWSER'S OWN STRINGS. "Please fill out this field" is the same
 * sentence for ten different questions and names none of them; these say what
 * the field wants. `missing` covers an empty required field, `invalid` a value
 * of the wrong shape (a malformed email, a URL with no scheme). A field with no
 * `invalid` entry falls back to `missing`.
 *
 * WHEN THEY APPEAR — components/EnquireSection.tsx. A format error shows the
 * moment you leave the field, because you typed something and it cannot work;
 * an empty required field says nothing until you press Send, because tabbing
 * past a field you have not reached yet is not a mistake. Once a message is up
 * it clears as soon as the field is fixed, on the keystroke.
 */
export const enquiryFieldErrors: Record<string, { missing: string; invalid?: string }> = {
  firstName: { missing: "Enter your first name." },
  lastName: { missing: "Enter your last name." },
  brand: { missing: "Enter your brand or company name." },
  email: {
    missing: "Enter your email address.",
    invalid: "That address doesn't look right — check for a typo.",
  },
  social: { missing: "Enter at least one handle, like @yourbrand." },
  location: { missing: "Enter where you're based." },
  website: {
    missing: "Enter your website address.",
    invalid: "Enter the full address, starting with https://",
  },
  brief: { missing: "Tell us a little about your brand." },
};

/**
 * The MM monogram — the red/burgundy logo, used small as the form panel's mark
 * (not a masthead logo). Served out of public/ through asset() so it survives
 * the GitHub Pages sub-path.
 */
export const enquiryMonogram = {
  src: "/assets/brand/monogram.png",
  alt: "MaeMüllen monogram",
};

/**
 * "Service(s) of interest" is a multi-select (SITEMAP §4.6, marked OPEN). It
 * reuses the canonical services list so the enquiry form and the services page
 * can never list a different set. Optional — a visitor may not know yet.
 */
export const enquiryServices = services.map((s) => s.name);

/** "Where did you hear about us?" — optional select. */
export const enquiryHearAbout = [
  "Instagram",
  "TikTok",
  "Google search",
  "Referral or word of mouth",
  "An event",
  "Other",
];
