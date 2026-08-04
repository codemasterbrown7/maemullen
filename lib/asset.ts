/**
 * Prefixing for files served out of `public/`.
 *
 * WHY THIS EXISTS. GitHub Pages serves a project repo from a sub-path —
 * `codemasterbrown7.github.io/maemullen/` — so the site is configured with
 * `basePath: "/maemullen"` (next.config.ts). Next applies that automatically to
 * every `<Link>`, to `/_next/*` and to next/font, but it CANNOT apply it to a
 * string: a plain `<img src="/studio/hero-02.jpg">` is markup we wrote, and it
 * would resolve against the domain root, where nothing lives. Every one of
 * those is 404 the moment the site is not at `/`.
 *
 * So every raw absolute path in the markup goes through `asset()`. Paths stay
 * clean and root-relative in `content/` — the prefix is a deployment fact, not
 * content — and get the prefix at the point they are rendered.
 *
 * The value comes from the environment rather than being hard-coded so a local
 * `npm run build` still produces a site that works from `/`, and so moving to a
 * custom domain later is one deleted line in the workflow rather than an edit
 * to every image tag. next.config.ts reads the same variable; the two are
 * deliberately not imported from each other, because next.config is loaded by
 * the Next CLI before any path aliases exist.
 *
 * NEXT_PUBLIC_ is required: this is inlined into the browser bundle at build
 * time, and a bare `process.env.FOO` would be `undefined` there.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `asset("/brand/monogram.png")` → `/maemullen/brand/monogram.png` on Pages. */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
