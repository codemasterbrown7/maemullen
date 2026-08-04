import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { FluidCursor } from "@/components/ui/fluid-cursor";
import { siteDescription, siteName } from "@/content/site";

/**
 * Switzer — the client's chosen face for website copy, supplied 2026-08-02 and
 * self-hosted from design/fonts/. Free for commercial web use under Fontshare's
 * EULA (design/fonts/Switzer-LICENSE.txt); ITF ships the woff2 for exactly this.
 *
 * The variable cut covers 100–900 in a single 43 KB file, so every weight the
 * site uses — 400 body, 500 nav, 600 marquee, 700 headings — costs one request.
 * Roman only: italic is banned from this design, so the italic cut is not
 * shipped. Nothing renders <em>, and no rule asks for oblique.
 */
const switzer = localFont({
  src: "../design/fonts/Switzer-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-switzer",
  display: "swap",
});

/**
 * TeX Gyre Heros — the display face, and the reason is specific: it is a free,
 * metric-compatible Helvetica clone (GUST's extension of URW Nimbus Sans), and
 * it is literally the face nudesocial.co.uk sets its headings in. Matching the
 * reference's typography meant matching its actual font, not approximating it.
 *
 * Two static cuts rather than a variable font — Heros ships none — subset to
 * Latin, 12 KB each. Roman only: italic is banned from this design.
 *
 * GUST Font License (a LaTeX Project Public License variant): free to use,
 * modify and redistribute, commercially included.
 */
const heros = localFont({
  src: [
    { path: "../design/fonts/TeXGyreHeros-Regular.woff2", weight: "400", style: "normal" },
    { path: "../design/fonts/TeXGyreHeros-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-heros",
  display: "swap",
});

/**
 * Playfair Display 700, roman and italic — the two cuts the design file loads
 * from Google Fonts (`family=Playfair+Display:ital,wght@0,700;1,700`). The
 * italic is not optional: the headline, the about heading and the CTA each set
 * <em style="font-style: italic"> on the display face. next/font self-hosts the
 * same faces; globals.css points --font-display at the generated family.
 * Body text uses the system stack straight from tokens.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

/**
 * IBM Plex Mono 400/500 — the annotation register. This is the one face the
 * generated design system chose that we kept rather than replaced: the studio
 * has no mono of its own, and every `[ 001 ]` index mark, edge caption and
 * bracket link in the Claude Design landing page is set in it. Roman only —
 * italic is banned from this design.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteName} — creative studio`,
  description: siteDescription,
  icons: { icon: "/brand/monogram-trimmed.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${playfair.variable} ${switzer.variable} ${heros.variable} ${plexMono.variable}`}
    >
      <body>
        {children}
        {/* Last in the body, so the letter split runs over a page that is
            already committed. Mouse-and-keyboard only: it declines to start on
            touch or under prefers-reduced-motion, and splits no text when it
            does, so those visitors get the site exactly as it was. */}
        <FluidCursor />
      </body>
    </html>
  );
}
