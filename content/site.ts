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
 * deliberately deferred (docs/SITEMAP.md §2). The old second "Work" link is now
 * "Shop" → /shop, where the studio sells its digital products (2026-08-09); the
 * cart lives beside the nav (components/chrome/CartButton.tsx), not in it.
 */
export const nav: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
  ],
  right: [
    { label: "Portfolio", href: "/work" },
    { label: "Shop", href: "/shop" },
    { label: "Enquire", href: "/enquire" },
  ],
};

/**
 * The Instagram account the footer post strip pulls from.
 *
 * OPEN (SITEMAP.md §6, Q6): `beholdFeedId` is still unset, so the post strip
 * renders nothing yet — the footer handle below works regardless. Each value
 * fails to a visible placeholder rather than to a wrong guess.
 *
 * `beholdFeedId` is the id out of the feed URL behold.so returns once the
 * account is connected there — `https://feeds.behold.so/<id>`. Either the bare
 * id or the whole URL works; the strip trims it. Note the `services.behold.so/
 * link/…` address is NOT this — that one is the one-time Facebook OAuth link
 * that connects the account in the first place. Behold holds the
 * Meta credentials and refreshes the access token, which is the whole reason we
 * went that way: Instagram's own Basic Display API was shut down in December
 * 2024, and the Graph API that replaced it needs a token rotated every 60 days
 * or the footer silently empties. The id is a public read-only endpoint, not a
 * secret, so it belongs here with the rest of the site's content rather than in
 * an env var.
 */
export const instagram = {
  /** Confirmed by the client 2026-08-04. */
  handle: "@maemullenagency" as string | null,
  /**
   * Supplied by the client 2026-08-04, and verified against the live endpoint:
   * it serves `maemullenagency` and every post carries the `sizes.medium` copy
   * InstagramStrip asks for. Stored as the bare id — the component also accepts
   * the whole `https://feeds.behold.so/…` URL the dashboard hands out.
   */
  beholdFeedId: "wIRxEfAZzc2fMy8676K0" as string | null,
};

/** Profile URL, tolerant of the handle being stored with or without its @. */
export const instagramUrl = instagram.handle
  ? `https://www.instagram.com/${instagram.handle.replace(/^@/, "")}/`
  : null;

export const footer = {
  /** Contact email, confirmed by the client 2026-08-09. Rendered as a mailto
   *  link in the footer (components/chrome/SiteChrome.tsx). The handle is read
   *  off `instagram` above so the footer line and the post strip can never
   *  disagree. */
  instagram: instagram.handle,
  email: "maemullenagency@gmail.com" as string | null,
  instagramPlaceholder: "Instagram — handle TBC",
  emailPlaceholder: "Email — address TBC",
  copyright: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
};
