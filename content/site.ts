/**
 * Global site content. Copy lives here, never inline in JSX.
 *
 * Uppercase treatments are applied with CSS `text-transform`, so every
 * string here is stored in its real case (DESIGN.md §3.4).
 */

export type NavItem = { label: string; href: string };

export const siteName = "MaeMüllen";

export const siteDescription =
  "A creative studio where social, content and design come together.";

/**
 * Balanced 3+3 nav around the centred logotype (DESIGN.md §0, S2).
 * Portfolio points at /work for now — the Portfolio-vs-Work split is
 * deliberately deferred (docs/SITEMAP.md §2).
 */
export const nav: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
  ],
  right: [
    { label: "Portfolio", href: "/work" },
    { label: "Work", href: "/work" },
    { label: "Enquire", href: "/enquire" },
  ],
};

export const footer = {
  /** OPEN (SITEMAP.md §6, Q6): Instagram handle and contact email are not
   *  yet confirmed — rendered as clearly-marked placeholders until then. */
  instagram: null as string | null,
  email: null as string | null,
  instagramPlaceholder: "Instagram — handle TBC",
  emailPlaceholder: "Email — address TBC",
  copyright: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
};
