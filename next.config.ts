import type { NextConfig } from "next";

/**
 * Built as a static site and hosted on GitHub Pages.
 *
 * `output: "export"` writes plain HTML/CSS/JS to `out/` — there is no Node
 * server on Pages, so anything needing one is off the table: no route handlers,
 * no server actions, no on-demand revalidation, no next/image optimiser. The
 * site does not use any of them. The one live thing it has, the Instagram strip,
 * is fetched at BUILD time and frozen into the HTML, which is why the deploy
 * workflow also runs on a daily schedule — see .github/workflows/deploy.yml.
 */

/**
 * `/maemullen` on GitHub Pages, empty everywhere else. Set by the workflow.
 *
 * A project repo is served from `<user>.github.io/<repo>/`, so every URL the
 * site emits needs that prefix. Next handles <Link>, /_next/* and next/font on
 * its own; raw `src` strings we wrote go through lib/asset.ts instead, because
 * Next cannot see inside a string. Both read this same variable.
 *
 * Moving to a custom domain later: drop the env line from the workflow and add
 * a CNAME file. Nothing else changes.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,

  /**
   * Emit `about/index.html` rather than `about.html`. Pages will serve either,
   * but directory-style URLs make relative asset resolution behave the same
   * locally and on Pages, and they survive being served by anything else later.
   */
  trailingSlash: true,

  /**
   * The optimiser is a server. Without this, next/image throws at export.
   * Nothing currently uses next/image — the photography is plain <img>, sized
   * and compressed ahead of time — but this keeps that door open.
   */
  images: { unoptimized: true },
};

export default nextConfig;
