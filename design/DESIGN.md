# MaeMüllen — Design System

Version 0.1 · Source: `Source Material/Website inspo.pdf` (20 pages) + screenshots

This document is the single source of truth for how the MaeMüllen site looks and behaves.
Nothing in a component should be a hard-coded colour, size or duration — everything resolves
to a token defined here and implemented in `app/globals.css`.

**Status key** — 🔒 locked · 🎚 choose in `design/styleguide.html` · ❓ open, to resolve with Laura & Poppy

---

## 0. Locked structure

Agreed with Laura & Poppy. These are **settled — do not ask again during development.**
Colours are *not* settled; only the structure below is.

| # | Decision | Detail |
|---|---|---|
| S1 | **Header is its own surface** | Coloured independently of the page. Own background, ink and border tokens. §8.1 |
| S2 | **Logotype is centred in the header** | Nav links split three and three — About / Services / Packages, then Portfolio / Work / Enquire. §8.1 |
| S3 | **Marquee is its own surface** | Sits directly under the header, coloured independently of both header and page. §8.2 |
| S4 | **No second logotype on the page** | The logotype appears in the header only. The page body opens on the statement block, not a repeated wordmark. §4.1 of `docs/SITEMAP.md` |

Stated colour *intent* at the time of the decision — a starting point, still open:

| Element | Colour |
|---|---|
| Header bar | pink `#e19494` |
| Logotype | cream `#fffaed` |
| Nav links | cream `#fffaed` — deliberately matching the logotype |
| Marquee bar | cream `#fffaed` |
| Marquee text | royal blue `#0b48ff` |
| Page | cream `#fffaed` |

Loaded as the **"As briefed"** preset in the studio.

---

## 1. Brand

### 1.1 Wordmark 🔒 — supplied asset

The logotype is **MaeMüllen** set as one word, with a deliberate style break:

```
Mae      → upright (roman), heavy
Müllen   → italic
```

No space between the two halves. The umlaut on the **ü** is part of the mark and is never dropped.

**The logotype ships as a supplied image file, not as live text.** Laura & Poppy provided the
artwork, so we use it directly — perfect fidelity, and no licence needed for the original face.

- **Clear space:** minimum of one cap-height on all four sides.
- **Minimum size:** 120px wide on screen. Below that use the MM monogram instead.
- **Accessibility:** always carries `alt="MaeMüllen"`. Because it is an image, the page's real
  `<h1>` text must never be omitted on its account.
- **Never:** re-colour the two halves differently, add a drop shadow, outline it, condense or
  stretch it, or re-set it in a substitute typeface.

❓ *Spelling inconsistency in the deck:* the wordmark is `MaeMüllen`, but body copy uses
`Maemullen` and `maemullen`. One form must win for prose, meta titles and alt text.
Recommendation: `MaeMüllen` everywhere, with `maemullen` reserved for the domain/handle.

### 1.2 Monogram & wax stamp 🔒 — supplied asset

A circular **MM** monogram — cream letterforms knocked out of a red disc. Sampled from the
supplied file: disc `#a23b3b`, letterforms `#fffaed`. Both match the palette exactly.

This mark does double duty as the **custom cursor** on the entry experience: it is rendered as a
wax seal that presses into the envelope on click.

### 1.3 Asset manifest

| File | Contents | Use |
|---|---|---|
| `public/brand/wordmark-cream-trimmed.png` | Wordmark, transparent, cropped to ink (1501×245) | **Default.** Header, hero, footer. Tint with CSS `filter` per background. |
| `public/brand/wordmark-cream.png` | Wordmark, transparent, 2000×2000 with padding | Source master — prefer the trimmed version in layout. |
| `public/brand/wordmark-on-pink.png` | Cream wordmark on pink field | Reference/social. See the contrast caveat in §2.3. |
| `public/brand/monogram-trimmed.png` | MM disc, transparent, cropped (873×873) | Favicon, mobile header, small-space lockup. |
| `public/brand/monogram.png` | MM disc, transparent, 2000×2000 | Source master. |
| `public/brand/monogram-on-cream.png` | MM disc on cream field | Reference. |
| `public/brand/monogram-cursor@2x.png` | MM disc at 96×96 | The wax-seal custom cursor. |

❓ **PNG only.** No SVG was supplied. PNG is fine at these resolutions, but an SVG wordmark and
monogram would scale cleanly, recolour without `filter` hacks, and cut page weight. Worth asking
Poppy for the vector originals.

### 1.4 Client work — not brand colour

`public/work/bendito/` holds the Bendito menu project (artwork + in-situ photograph). Its print
red `#cf291f` and blue `#313bc6` belong to **that project**, not to MaeMüllen, and must never leak
into the system palette. The hand-drawn illustration style, however, *is* Poppy's, and is the
reference for the "Poppy's doodles" called for on the About page (deck p9).

### 1.5 Custom cursor 🔒

- 48px diameter, follows the pointer with a short lag (~80ms) for weight.
- Applied **only** where `(pointer: fine)` — never on touch.
- Under `prefers-reduced-motion: reduce` the cursor renders but does not lag or scale.
- The native cursor is hidden **only** while the custom one is active, and a visible focus ring
  is always available for keyboard users. See §11.

---

## 2. Colour

### 2.1 Brand palette 🔒

All five values were sampled from the deck's swatches and match the stated hex exactly.

| Token | Hex | Role |
|---|---|---|
| `--brand-red` | `#a23b3b` | Primary accent. Works as ink *and* as a background. |
| `--brand-pink` | `#e19494` | Backgrounds and large display type. Not a body-text background — see §2.3. |
| `--brand-cream` | `#fffaed` | Primary page background / knock-out ink on red. |
| `--brand-blue` | `#0b48ff` | Marquee text on cream. Focus rings. Rare pop elsewhere. |
| `--brand-black` | `#000000` | Ink. |
| `--brand-white` | `#ffffff` | Surface. |

### 2.2 Measured contrast

Two algorithms, because they disagree and the disagreement matters.

**WCAG 2.1** is the legal standard, but its formula is known to over-penalise light-on-light
pairs and it models size with a single crude threshold. **APCA** is the WCAG 3 candidate: it is
perceptually modelled and size-aware, returning a lightness contrast `Lc` from 0–106. Where the
two disagree on a light-on-light pair, APCA is the better guide.

APCA minimum `Lc` by use: **90** small body · **75** body (16–18px) · **60** 24px+ ·
**45** large headline 36px+ · **30** display type and non-text.

| Text | On | WCAG 2.1 | APCA Lc | Genuinely good for |
|---|---|---:|---:|---|
| black | cream | 20.15 | 103 | Anything, including small body text |
| black | white | 21.00 | 106 | Anything |
| cream | red | 6.25 | 83 | Body text and above |
| white | blue | 6.20 | 85 | Body text and above |
| blue | cream | 5.95 | 76 | Body text and above |
| red | cream | 6.25 | 71 | 24px and above |
| black | pink | 8.87 | 58 | 24px and above — **not small body text** |
| white | pink | 2.37 | 52 | Large headlines, 36px+ |
| cream | pink | 2.27 | 48 | Large headlines, 36px+ |
| red | pink | 2.75 | 33 | Display type and non-text only |
| blue | pink | 2.62 | 31 | Display type and non-text only |

### 2.3 Rules

1. **Judge a pairing at the size it is actually used.** There is no such thing as a colour pair
   that "passes" or "fails" in the abstract — only at a given size and weight.
2. **The cream logotype on pink is fine.** Lc 48 clears the 45 threshold for large display type.
   WCAG 2.1 scores it 2.27 and calls it a failure; that is the formula's known weakness with
   light-on-light, not a real legibility problem. This was previously documented as a violation —
   it is not.
3. **Black on pink is *not* good enough for body copy.** Lc 58 is below the 75 body threshold,
   despite WCAG rating it AAA. Long paragraphs should not sit directly on pink; put them on a
   cream or white surface.
4. **Red and blue on pink are genuinely weak** (Lc 33 / 31). Fine for a display flourish, wrong
   for service names, links or any text you expect to be read.
5. **Red is the workhorse** — strong as ink on cream/white, and as a background under cream/white.
6. Check any new pairing in the contrast lab in `design/styleguide.html` before it ships.

### 2.4 Semantic tokens

Components consume these, never the brand values directly. Two palette moods 🎚 — swapping the
mood re-skins the entire site from one block.

**Mood A — Cream-led editorial** (cream base, red accent, blue as a rare pop)

| Token | Value |
|---|---|
| `--bg` | `#fffaed` cream |
| `--surface` | `#ffffff` white |
| `--surface-inverse` | `#000000` black |
| `--ink` | `#000000` |
| `--ink-muted` | `rgb(0 0 0 / 0.62)` |
| `--ink-inverse` | `#fffaed` |
| `--accent` | `#a23b3b` red |
| `--accent-ink` | `#fffaed` cream |
| `--accent-alt` | `#0b48ff` blue |
| `--decor` | `#e19494` pink — large fills only |
| `--border` | `rgb(0 0 0 / 0.14)` |
| `--focus-ring` | `#0b48ff` blue |

**Mood B — Pink-led bold** (pink as a dominant full-bleed brand field)

| Token | Value |
|---|---|
| `--bg` | `#e19494` pink |
| `--surface` | `#fffaed` cream |
| `--surface-inverse` | `#a23b3b` red |
| `--ink` | `#000000` — **mandated**, the only compliant ink on pink |
| `--ink-muted` | `rgb(0 0 0 / 0.66)` |
| `--ink-inverse` | `#fffaed` |
| `--accent` | `#a23b3b` red — **background use only in this mood** (red-on-pink fails) |
| `--accent-ink` | `#fffaed` |
| `--accent-alt` | `#000000` — blue fails on pink, so black substitutes |
| `--decor` | `#fffaed` cream |
| `--border` | `rgb(0 0 0 / 0.18)` |
| `--focus-ring` | `#000000` |

> The consequence worth internalising: **in Mood B, red cannot be used as text.** Any red CTA
> becomes a red *block* with cream ink sitting on the pink field. Mood B is therefore a blockier,
> more graphic layout — that is a design consequence of the palette, not a styling preference.

---

## 3. Typography

### 3.1 Families

**Display / headings** 🎚 — a high-contrast Didone with a genuine (not slanted) italic.

> **The logotype is no longer part of this decision.** It ships as a supplied image (§1.1). The
> display face is only needed for *headings*, so the question is not "which font matches the
> wordmark" but "which font sits comfortably beside it".

| Candidate | Licence | Notes |
|---|---|---|
| **Instrument Serif** | Free (OFL) | High contrast, distinctive italic, least over-exposed. **Single light weight — noticeably lighter than the wordmark's heavy "Mae".** |
| **Playfair Display** | Free (OFL) | Variable weight to 900, so it can be set heavy enough to echo the wordmark's weight. Very widely used. |
| PP Editorial New / Canela / Ogg | Commercial | Closest to the wordmark's swashy italic. Paid upgrade path. |

**Observation worth testing:** the supplied "Mae" is set *heavy* with strong stem contrast.
Instrument Serif headings read markedly lighter beside it — which can be a deliberate hierarchy
(bold mark, delicate headings) or can read as a mismatch. Playfair at 700–900 echoes the mark far
more closely. Compare both against the real wordmark at the top of the one-pager before deciding.

**Body** 🎚 — the deck specifies **Helvetica World**. That is a **paid Monotype family**; web use
needs a commercial licence (pageview-based or subscription). **We are not using it, and it is not
loaded in the studio mockup** — the fonts actually loaded are Inter, DM Sans, Instrument Serif,
Playfair Display and Cormorant Garamond.

| Candidate | Licence | Notes |
|---|---|---|
| **Inter** | Free (OFL) | **Recommended.** Screen-optimised, huge language coverage, closest free Helvetica. Renders identically on every platform. |
| DM Sans | Free (OFL) | Slightly warmer and more geometric than Inter. |
| "System / Helvetica" | Free, but inconsistent | ⚠️ Resolves to `-apple-system, "Helvetica Neue", Arial`. Looks like Helvetica Neue on a Mac, but **Windows visitors get Arial** — so the site renders differently by platform. Fine for mockups, risky to ship. |
| Neue Haas Grotesk / Helvetica Now | Commercial | The authentic Helvetica revivals, if there is budget. |

Loaded via `next/font` behind `--font-display` and `--font-body` so a swap touches one file.

### 3.2 Type scale

Fluid via `clamp()`. Display sizes are set tight; body is set loose for readability.

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `--text-display-xl` | `clamp(3.5rem, 13vw, 12rem)` | 0.85 | −0.02em | Hero wordmark, entry animation |
| `--text-display-lg` | `clamp(2.75rem, 8vw, 6rem)` | 0.9 | −0.02em | Page titles |
| `--text-display-md` | `clamp(2rem, 5vw, 3.5rem)` | 1.0 | −0.01em | Section titles |
| `--text-heading-lg` | `clamp(1.75rem, 3.5vw, 2.5rem)` | 1.1 | −0.01em | h2 |
| `--text-heading-md` | `clamp(1.375rem, 2.2vw, 1.75rem)` | 1.2 | 0 | h3 |
| `--text-heading-sm` | `1.125rem` | 1.3 | 0 | h4, card titles |
| `--text-statement` | `clamp(1.25rem, 2.6vw, 2rem)` | 1.35 | 0.01em | The justified uppercase block, §3.3 |
| `--text-body-lg` | `1.125rem` | 1.6 | 0 | Intro paragraphs |
| `--text-body` | `1rem` | 1.65 | 0 | Default |
| `--text-body-sm` | `0.875rem` | 1.6 | 0 | Captions, meta |
| `--text-label` | `0.8125rem` | 1.4 | 0.08em | Form labels, buttons (uppercase) |
| `--text-eyebrow` | `0.6875rem` | 1.2 | 0.18em | Section eyebrows, nav (uppercase) |

Weights: display 400 only. Body 400 / 500 / 600 — never 700+, and never faux-bold.

Measure: prose caps at **68 characters**. The statement block caps at **44 characters** per line.

### 3.3 Statement paragraph 🔒

The deck's most distinctive text treatment (p7), lifted from the Nude Social reference:

```
A LIFESTYLE-LED CREATIVE AGENCY
BUILDING BRANDS PEOPLE WANT TO
FOLLOW.  SOCIAL-FIRST  CAMPAIGNS.
```

Uppercase · `text-align: justify` · body typeface · `--text-statement` · generous word-spacing
from the justification itself. Reserved for the About summary and one hero-adjacent block per
page — it loses all its force if used more than that.

Accessibility note: justified text can create rivers and is harder for dyslexic readers. Because
this is short, large and decorative-adjacent, it is acceptable here — but it is **never** used
for paragraphs longer than four lines.

### 3.4 Case

- Uppercase: eyebrows, nav, buttons, labels, the statement block.
- Sentence case: all headings and all prose.
- Uppercase is applied with `text-transform`, never typed into the content, so screen readers and
  the CMS keep the real string.

---

## 4. Spacing & layout

### 4.1 Scale

4px base. `--space-1` = 4px through to `--space-48` = 192px:

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160 · 192`

Nothing off-scale. If a value is needed that isn't here, the scale is wrong — extend it here first.

### 4.2 Containers

| Token | Width | Use |
|---|---|---|
| `--container-narrow` | 45rem / 720px | Prose, forms, case-study body |
| `--container-default` | 75rem / 1200px | Most sections |
| `--container-wide` | 90rem / 1440px | Collage, portfolio grids |
| — | full bleed | Hero, entry, portfolio stage |

Gutter: `clamp(1.25rem, 5vw, 4rem)`.

### 4.3 Section rhythm

Vertical padding `--space-section` = `clamp(4rem, 10vw, 10rem)`. Adjacent sections that share a
background collapse to a single unit of padding rather than doubling.

### 4.4 Grid

12 columns, `--space-6` (24px) gutter, from `md` up. Below `md` everything is single-column.

### 4.5 Breakpoints

`sm` 480 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Mobile-first; every rule is min-width.

---

## 5. Shape & elevation

- **Radius: 0 by default.** This is an editorial, print-derived layout — squared corners
  throughout. `--radius-control: 0` for buttons and inputs, with a documented pill alternative
  should the brand soften later. The only true circle is the MM monogram.
- **Borders:** `--border-hairline` 1px, `--border-medium` 2px. Colour is always `--border`.
- **Shadows: none.** A single `--shadow-lift` (`0 12px 32px rgb(0 0 0 / 0.10)`) exists solely for
  the portfolio hover state. Cards, headers and modals do not use shadow — they use borders and
  background changes.

---

## 6. CTAs

Three tiers. Every one is uppercase, `--text-label`, weight 500, `--radius-control`.

| Size | Height | Padding X |
|---|---|---|
| `sm` | 36px | 16px |
| `md` | 44px | 24px |
| `lg` | 52px | 32px |

### 6.1 Primary — solid

Background `--accent`, text `--accent-ink`.

| State | Treatment |
|---|---|
| default | red fill, cream text |
| hover | fill darkens to `#8a3232`; no movement |
| focus-visible | 2px `--focus-ring` outline, 3px offset — **in addition to** hover styling |
| active | `translateY(1px)` |
| disabled | `opacity: 0.4`, `cursor: not-allowed`, no hover |

### 6.2 Secondary — outline

1px `--ink` border, `--ink` text, transparent fill. Hover inverts to `--ink` fill / `--bg` text.

### 6.3 Tertiary — bracket 🔒

The signature CTA, taken from the deck (p7): `[ EXPLORE OUR WORLD ]`

Text only, uppercase, tracking `0.12em`. The brackets are `::before` / `::after` pseudo-elements
so they are not read aloud. On hover the brackets slide outwards by 4px — a small, specific
gesture that carries the brand better than a colour change.

### 6.4 Text link

`--ink` with a 1px underline at `0.25em` offset. Hover thickens to 2px. Never remove the
underline in prose.

---

## 7. Forms

The deck shows two input styles (p20): boxed with red labels, and underline-only. **The
underline style wins** — it matches the flat, editorial system and the boxed variant's red labels
would collide with red CTAs.

- **Label:** above the field, `--text-label`, uppercase, `--ink-muted`.
- **Required:** the word `(required)` in `--ink-muted` beside the label — not a red asterisk.
  Matches the deck and reads correctly aloud.
- **Input:** transparent background, `border-bottom: 1px solid var(--border)`, padding `12px 0`,
  `--text-body`. Height minimum 44px for touch.
- **Focus:** border-bottom becomes 2px `--accent`, plus the standard focus ring.
- **Error:** border-bottom `--accent`, message below in `--accent` at `--text-body-sm`, wired with
  `aria-describedby` and `aria-invalid`. *In Mood B the error message is black + weight 600
  instead of red, because red-on-pink fails.*
- **Success:** confirmation replaces the form in place; focus moves to the confirmation heading.
- **Checkbox:** 20px square, 2px `--ink` border, `--accent` fill when checked.
- **Select:** same underline treatment, native control, custom chevron.

Placeholders are never used as labels.

---

## 8. Navigation

### 8.1 Header 🔒 — structure decided

Settled with Laura & Poppy. **Do not re-open during development.**

- The header is **its own surface**, coloured independently of the page. It does not inherit
  `--bg`; it has `--nav-bg`, `--nav-ink` and `--nav-border` of its own.
- The **logotype is centred** in the bar.
- Nav links are **split three and three** either side of it — About / Services / Packages on the
  left, Portfolio / Work / Enquire on the right — so the bar is visually balanced.
- Sticky on scroll · hairline bottom border · active item underlined · `aria-current="page"`.

Default sizing (open to adjustment, not to restructuring): bar 66px, logotype 150px wide,
links 10.5px uppercase at 0.16em tracking.

> ⚠️ **Consequence of a pink header — unresolved.** Pink cannot carry nav-sized text, whatever
> colour the ink is. Measured smallest passing size on `#e19494`:
>
> | Ink | Lc | Weight 400–500 | Weight 600–700 |
> |---|---:|---|---|
> | cream `#fffaed` (current) | 48 | 36px | 24px |
> | black `#000000` | 58 | 36px | 24px |
>
> A conventional nav runs 10–13px, so neither option passes as briefed. Three ways out:
> **(a)** make nav links ~24px semibold — unusual but bold and possibly on-brand;
> **(b)** darken the header bar — cream on red `#a23b3b` is **Lc 83** and passes at any nav size
> (from 9px at weight 600), so a red bar solves it outright while keeping cream links;
> **(c)** accept it as a considered exception — the nav is six familiar words, not prose.
>
> This is a real decision, not a technicality. It is the one open item blocking the header.

### 8.2 Services marquee 🔒 — structure decided

The marquee is **its own surface**, coloured independently of both the header and the page
(`--marquee-bg`, `--marquee-ink`). It sits directly beneath the header.

Behaviour spec follows below and is unchanged.

### 8.2.1 Marquee behaviour 🔒

A horizontally scrolling band of service names separated by `•`, sitting under the header on the
home page. From the deck: *"maemullen below moving constantly stops with cursor links to our
services page."*

- One full loop in **40s**, `linear`, infinite.
- **Pauses on `:hover` and on `:focus-within`** — the focus half is what makes it keyboard-usable.
- Each item is a real link into `/services`.
- The track is duplicated for seamless looping; the duplicate is `aria-hidden="true"` so screen
  readers hear the list once.
- Fully stopped under `prefers-reduced-motion: reduce`, rendering as a static wrapped list.

### 8.3 Mobile menu

Full-screen overlay, `--bg`. Focus trapped while open, `Esc` closes, focus returns to the toggle,
background scroll locked.

### 8.4 Footer

Wordmark, nav repeat, Instagram, email, copyright. ❓ Legal links (privacy / terms) to confirm.

---

## 9. Motion

### 9.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 160ms | Hover, focus |
| `--duration-base` | 260ms | Most transitions |
| `--duration-slow` | 420ms | Overlays, menus |
| `--duration-deliberate` | 720ms | Section reveals |
| `--duration-cinematic` | 1200ms | Entry experience beats |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Things arriving |
| `--ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Things leaving |

The wax-stamp press uses a spring (`stiffness 420`, `damping 18`) rather than a bezier — it needs
the overshoot to read as an impact.

### 9.2 Scroll reveal

Opacity 0 → 1, `translateY(16px)` → 0, `--duration-deliberate`, `--ease-entrance`, staggered 60ms.
Fires once. Never moves more than 16px — larger travel makes long pages feel unstable.

### 9.3 Entry experience 🎚

Round 1 of the decision ladder. Full specs in `docs/SITEMAP.md`. Shared requirements regardless
of which variant wins:

1. Plays **once per session** (`sessionStorage`), not on every navigation.
2. A visible **Skip** control, reachable as the first tab stop.
3. Fully keyboard-operable — the envelope is a real `<button>`, not a click handler on a div.
4. Under `prefers-reduced-motion: reduce`, it resolves immediately to the home page.
5. Never blocks the site: if JS fails, home renders normally.

### 9.4 Reduced motion 🔒

`@media (prefers-reduced-motion: reduce)`: marquee stops, scroll reveals become instant, the
entry animation is skipped, the cursor stops lagging. Opacity-only fades may remain — they don't
trigger vestibular symptoms. This is a global rule, not per-component.

---

## 10. Imagery

| Ratio | Use |
|---|---|
| 3:4 | Collage tiles, portrait editorial |
| 1:1 | Service and team tiles |
| 16:9 | Case-study headers |
| full bleed, 100vh | Portfolio stage (deck p19: *"3 photos take up the whole screen"*) |

- Treatment is **unfiltered** — the photography is the colour. No duotones, no overlays except a
  `rgb(0 0 0 / 0.35)` scrim where text must sit over an image.
- All images through `next/image` with explicit dimensions. Above-the-fold hero images get
  `priority`.
- **Moving collage** (deck p5): a slow horizontal drift of overlapping tiles, ~60s loop, paused on
  hover and under reduced motion.
- Placeholders until real assets land: neutral blocks tinted `--decor` with the intended ratio and
  a visible `PLACEHOLDER` label, so nothing ships by accident.

---

## 11. Accessibility

Target: **WCAG 2.1 AA**, Lighthouse a11y ≥ 95.

- Contrast per §2.2/§2.3. No exceptions without being added to the table.
- **Focus is always visible.** 2px `--focus-ring`, 3px offset. `:focus-visible` so mouse users
  don't see it, but it is never globally removed.
- The custom cursor hides the native cursor only; it never removes focus indication.
- Full keyboard operability, including the entry gate, marquee and portfolio lightbox.
- Semantic landmarks: one `<h1>` per page, real `<nav>` / `<main>` / `<footer>`.
- Touch targets ≥ 44×44px.
- Every image has alt text; decorative images get `alt=""`.
- Motion respects `prefers-reduced-motion` globally.
- Forms: real `<label>`s, `aria-invalid` + `aria-describedby` on errors, no placeholder-as-label.
- Tested at 375 / 768 / 1440px, keyboard-only, and at 200% zoom.

---

## 12. Voice & content

From the deck's own copy: confident, warm, unfussy. Short declarative sentences. British English
(*organised*, *personalise*, £ sterling).

- Headings sentence case. Never shout in prose — uppercase is a *layout* device only (§3.4).
- The studio is **"we"**. Clients are **"you"**, never "the client".
- Avoid agency filler: *synergy, leverage, best-in-class, bespoke solutions*. The deck's own
  "we can deliver the full sha-bang" register is the tone to protect.

---

## 13. Token reference

Implemented in `app/globals.css` inside Tailwind v4's `@theme` block, so every token is
simultaneously a CSS custom property and a Tailwind utility:

```css
@theme {
  --color-bg: …;        /* → bg-bg, text-bg, border-bg */
  --color-ink: …;       /* → text-ink */
  --color-accent: …;    /* → bg-accent */
  --font-display: …;    /* → font-display */
  --spacing-section: …; /* → py-section */
}
```

Palette moods are applied as `data-mood="a" | "b"` on `<html>`, each redefining the semantic
tokens only. **Brand values are never referenced directly by a component** — that indirection is
what lets the typeface and palette decisions land later without touching page code.

---

## 14. Implementation rules

1. No hard-coded hex, px font sizes, or ms durations in components. Tokens only.
2. No colour pairing that isn't in §2.2.
3. Every interactive element has all five states from §6.1.
4. Every animation has a reduced-motion path.
5. Content lives in `content/`, not in JSX.
6. New component → add it to `design/styleguide.html` in the same commit.

---

## 15. Open questions ❓

Parked deliberately — resolved when we reach the relevant page.

| # | Question | Blocks |
|---|---|---|
| 1 | Deck p8 says *"website building dont include prices on website"* — does that suppress **all** pricing, or only the website-build price? Every other service has a price written out. | Packages |
| 2 | Package names are doubled: Gold/Silver/Bronze vs Essential/Signature/Elevated — and "Elevated" is attached to the **cheapest** tier, which reads backwards. | Packages |
| 3 | The `001–007` service list in the deck belongs to the *reference site*, not MaeMüllen. Their real list and order needs confirming. | Services |
| 4 | Is Packages its own route or a section of Services? | IA |
| 5 | Brand spelling in prose — `MaeMüllen` vs `Maemullen`. | Global |
| 6 | Domain, Instagram handle, contact email. | Global |
| 7 | Legal pages — privacy policy, terms, cookie notice. | Footer |
| 8 | ~~Hero contrast deviation~~ — **resolved.** APCA Lc 48 clears the display-type threshold; the cream logotype on pink is fine (§2.3). | — |
| 9 | Vector (SVG) originals of the wordmark and monogram — only PNGs supplied (§1.3). | Global |
| 10 | Bendito case study — is "Bendito" the client name to credit, and is the in-situ photo cleared for use? | Work |

## 16. Decision log

| # | Decision | Status |
|---|---|---|
| S1–S4 | Page structure — header surface, centred logotype, marquee surface, no second logotype | ✅ **Decided** — see §0 |
| C1 | Colour roles — header, marquee, page, logotype, primary, accent | 🎚 Open. Intent captured as the "As briefed" preset |
| C2 | Nav link legibility on a pink header (§8.1 warning) | ⚠️ Needs resolving if the header stays pink |
| T1 | Heading typeface — Instrument Serif / Playfair Display / commercial | 🎚 Open |
| T2 | Body typeface — Inter or a paid Helvetica | 🎚 Open |
| E1 | Entry experience — envelope / kinetic type / both | Not started |
