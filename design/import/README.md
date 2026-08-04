# Importing from Claude Design

> ## ⚠️ RETIRED — 2026-08-02
>
> **Do not run `dc2tsx.py` against `app/page.tsx`. It will overwrite the current
> landing page.**
>
> The landing page was redesigned that afternoon — a click-through gallery above
> the fold, then one studio-intro block, everything else behind the nav — and the
> decision was taken to make **the repo the source of truth** rather than Claude
> Design. `app/page.tsx` is now hand-maintained and composes components from
> `components/`.
>
> The full imported page is preserved at
> `components/parked/PortedHomeSections.tsx`, unrendered, as raw material for
> `/services`, `/work` and `/about`.
>
> Everything below documents how the import worked, and is kept because the
> traps in it are still live: the asset-path trap in particular still applies to
> `public/assets/`, and the tokens and `.mm-*` hover rules still come from here.
>
> Two changes were made locally and **never mirrored back to Claude Design**, so
> the export is stale on both counts:
> 1. Marquee: `001`–`007` prefixes removed, `✳` stars recoloured to
>    `var(--marquee-ink)`.
> 2. `--font-body`: `-apple-system` dropped from the front of the stack
>    (DESIGN.md §3.1).

---

## How the import worked (historical)

`app/page.tsx` **was** generated, not hand-written. Edit the design in Claude
Design, re-export, and regenerate — don't hand-edit the TSX, or the two drift
apart and the next regeneration silently throws your edits away.

## Files

| File | What it is |
|---|---|
| `home.dc.html` | The design project's source file, byte-for-byte. Do not edit. |
| `dc2tsx.py` | Converts that file to `app/page.tsx`. |
| `pseudo.css` | Generated hover/active rules — mirror of the block in `app/globals.css`. |

## Regenerating

```sh
# 1. Re-download `MaeMüllen Home.dc.html` from the design project and
#    overwrite design/import/home.dc.html with it.
# 2. Regenerate:
python3 design/import/dc2tsx.py
```

That rewrites `app/page.tsx` and `design/import/pseudo.css`. If `pseudo.css`
changed, paste it over the matching block at the bottom of `app/globals.css` —
that one step is manual so the handwritten part of `globals.css` is never
clobbered.

The script prints a warning if the design file grows a `style-hover` /
`style-active` combination it has no name for; add it to `CLASS_NAMES` rather
than shipping a `dc-N` class.

## Why a script rather than copy-paste

The `.dc.html` file is a template for Claude Design's own runtime
(`support.js`), not React. Translating it means:

- `style="..."` strings → `style={{ }}` objects with camelCased keys
- `style-hover=` / `style-active=` → real CSS rules. These are invented
  attributes; inline styles cannot express `:hover` at all. The runtime turns
  them into a generated class whose every declaration is `!important`
  (`createPseudoSheet` / `importantify` in `support.js`) — `dc2tsx.py`
  reproduces that exactly, which is why the `.mm-*` rules look the way they do.
- `{{ marqueeState }}` → resolved from the `DCLogic` script's `renderVals()`
- `<sc-if>` → unwrapped, `<x-dc>` / `<helmet>` → dropped
- `assets/…` → `/…`, and in-site `<a href="/…">` → `<Link>`

Doing that by hand across ~180 elements is where fidelity gets lost. The script
can't mistype a declaration.

## Three traps worth remembering

1. **No CSS reset.** The design file ships none and the runtime adds none, so
   the page renders on `content-box`. `app/globals.css` therefore does *not*
   import Tailwind — its preflight would set `box-sizing: border-box` globally
   and change the computed width of every padded container.
2. **Playfair needs both cuts.** The design loads
   `ital,wght@0,700;1,700`. `app/layout.tsx` must request
   `style: ["normal", "italic"]`, or the `<em>` in the headline renders as a
   synthesised slant instead of the real italic.
3. **`public/assets/` is the export's `assets/`, and nothing else.** The export
   renames files as it builds that folder: its `assets/brand/wordmark-cream.png`
   is the *trimmed* 1501×245 artwork (identical to
   `public/brand/wordmark-cream-trimmed.png`), and its `assets/brand/monogram.png`
   is `public/brand/monogram-trimmed.png`. The similarly-named files directly
   under `public/brand/` are different, square, transparent-padded 2000×2000
   images. Point the 250px-wide logo at one of those and it renders 250px *tall*,
   inflating the 56px header to ~275px. Re-import assets by copying the export's
   `assets/` folder wholesale — never by filename onto `public/brand/`.

## Verifying a regeneration

Serve the **export folder itself** — its own `support.js`, `tokens.css` and
`assets/`. Do not assemble a reference out of files from `public/`: substituting
the assets is how the wrong-logo bug above got a clean 0-pixel diff and shipped.

```sh
cp -R "~/Downloads/MaeMüllen home page design" /tmp/dcref
mv "/tmp/dcref/MaeMüllen Home.dc.html" /tmp/dcref/home.dc.html
(cd /tmp/dcref && python3 -m http.server 8099) &
npm run dev
```

Then screenshot both full-page at the same width and diff. Freeze the marquee
first (`#mm-marquee-track { animation: none !important }`), force
`html { overflow-y: scroll }` on both, and remove the `<nextjs-portal>` dev
badge, or the animation phase, a scrollbar and the badge show up as false
differences.

Worth asserting explicitly, since a pixel diff alone missed it: every `<img>`
should report the same `naturalWidth`/`naturalHeight` on both sides.

The 2026-08-02 import diffs to **0 differing pixels** across 1425×5842, except
the Bendito photo, where downscaling 4000×6000 leaves a ±1/255 rounding
difference.
