# MaeMüllen — Design System

Version 0.1 · Source: `Source Material/Website inspo.pdf` (20 pages) + screenshots

This document is the single source of truth for how the MaeMüllen site looks and behaves.
Nothing in a component should be a hard-coded colour, size or duration — everything resolves
to a token defined here and implemented in **`design/tokens.css`**.

**Status: colour, typography, shape and page structure are LOCKED (2026-08-02).** What remains
open is content-level, listed in §15.

**Status key** — 🔒 locked · 🎚 choose in `design/styleguide.html` · ❓ open, to resolve with Laura & Poppy

---

## 0. Locked decisions

Agreed with Laura & Poppy. **Settled — do not ask again during development.**

### Structure

| # | Decision | Detail |
|---|---|---|
| S1 | **Header is its own surface** | Coloured independently of the page. Own background, ink and border tokens. §8.1 |
| S2 | **Logotype is centred in the header** | Nav links split three and three — About / Services / Packages, then Portfolio / Work / Enquire. §8.1 |
| S3 | **Marquee is its own surface** | Sits directly under the header, coloured independently of both header and page. §8.2 |
| S4 | **No second logotype on the page** | The logotype appears in the header only. The page body opens on the statement block, not a repeated wordmark. §4.1 of `docs/SITEMAP.md` |

### Colour, type and shape — 🔒 LOCKED 2026-08-02

Agreed with Laura & Poppy from `design/styleguide.html`. **Implemented in
`design/tokens.css`, which is the source of truth for the build.**

| Role | Value | |
|---|---|---|
| Nav bar | `#E19494` | pink |
| Nav links | `#FFFAED` | cream — matches the logotype |
| Logotype | `#FFFAED` | cream |
| Nav border | `#C98080` | |
| Marquee bar | `#FFFAED` | cream |
| Marquee text | `#0B48FF` | royal blue |
| Page | `#FFFAED` | cream |
| Surface | `#FFFFFF` | white |
| Ink | `#000000` | |
| Primary | `#A23B3B` | red |
| Primary ink | `#FFFAED` | cream |
| Accent | `#0B48FF` | royal blue |
| Decorative | `#A23B3B` | red |
| Border | `#E2DED1` | |
| Focus ring | `#0B48FF` | royal blue |

**Header** — bar 56px · logotype 250px wide · links 11px, weight 500, tracking 0.3em, uppercase.
**Marquee** — text 13px.
**Type** — headings **Playfair Display 700**, tracking −0.005em · body System/Helvetica stack ·
base 15px on a **1.4** ratio (h2 = 58px).
**Buttons** — 42px tall · 20px padding · 13px label · tracking 0.09em · **radius 40px (pill)**.

### Accepted trade-offs

Both were visible in the studio readouts when the scheme was signed off. Recorded so they are
not re-argued during development:

| Item | Measured | Decision |
|---|---|---|
| Nav links, cream on pink at 11px | Lc 48, needs 90 | **Accepted.** Six familiar words, not prose. |
| Body face `"Helvetica Neue", Helvetica, Arial` | — | **Accepted.** Renders as Helvetica Neue on macOS/iOS and **Arial on Windows**, so the site will not look identical across platforms. Amended 2026-08-02: `-apple-system` removed from the front of the stack — it was giving San Francisco in Safari/iOS. See §3.1. |

One free improvement applied in `tokens.css`: the button label was **Borderline** at weight 500
(Lc 83, needs 90). At **weight 600** the same colours pass outright, so `--btn-weight: 600`.
Same for the marquee at `--marquee-weight: 600`. Neither changes the look meaningfully.

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

### 2.4 Semantic tokens 🔒

Components consume these, never the brand values directly. Defined in `design/tokens.css`.

| Token | Value | Used for |
|---|---|---|
| `--nav-bg` | `#e19494` | Header bar |
| `--nav-ink` | `#fffaed` | Nav links |
| `--nav-border` | `#c98080` | Rule under the header |
| `--marquee-bg` | `#fffaed` | Marquee band |
| `--marquee-ink` | `#0b48ff` | Service names in the band |
| `--bg` | `#fffaed` | Page background |
| `--surface` | `#ffffff` | Cards, panels, form fields |
| `--ink` | `#000000` | Body copy and headings |
| `--logotype` | `#fffaed` | Wordmark and monogram |
| `--accent` | `#a23b3b` | Buttons, links, active states |
| `--accent-hover` | `#85302f` | Button hover / pressed |
| `--accent-ink` | `#fffaed` | Text on `--accent` |
| `--accent-alt` | `#0b48ff` | Secondary accent, focus |
| `--decor` | `#a23b3b` | Large decorative fills, image mats |
| `--border` | `#e2ded1` | Hairlines and rules |
| `--focus-ring` | `#0b48ff` | Keyboard focus, never removed |

Note the shift from earlier drafts: **pink is now only the header**, and **red does the
decorative work** it used to share with pink. Blue has been promoted from "rare pop" to a
working colour — it carries the marquee.

## 3. Typography

### 3.1 Families 🔒 LOCKED

**Headings — Playfair Display, weight 700, tracking −0.005em.** Free (OFL), variable weight.
Chosen because the supplied logotype is set heavy: Playfair at 700 sits beside the wordmark
without looking thin next to it. Loaded from Google Fonts.

**Body — the Helvetica stack:** `"Helvetica Neue", Helvetica, Arial, sans-serif`.

> The deck specified **Helvetica World**. That is a paid Monotype family requiring a commercial
> web licence, and it is **not used anywhere** in this project. This stack was chosen instead as
> the closest free approximation.
>
> **Amended 2026-08-02.** The stack previously began with `-apple-system`, and this section
> claimed it rendered as Helvetica Neue on macOS/iOS. That was wrong. Measuring the rendered
> text showed `-apple-system` resolves to **San Francisco** in Safari and on iOS — not a
> Helvetica at all — while Chrome ignores the keyword entirely and falls through to Helvetica
> Neue. So the body face silently differed by *browser*, not just by platform, and half the time
> was not the approximation we had signed off. Dropping `-apple-system` was agreed with the user
> and costs nothing: no webfont, no licence, no page weight.
>
> ⚠️ Remaining known consequence: **Helvetica Neue on macOS/iOS** (now in every browser) and
> **Arial on Windows**. Arial is metrically identical to Helvetica, so layout is stable, but the
> letterforms differ (the R leg, the G, the angled terminals). The site will still not look
> identical on every machine. Accepted.
>
> If cross-platform consistency later matters, the options are a self-hosted free Helvetica
> clone such as **Nimbus Sans** (URW, open source — verify the licence first) for Helvetica-like
> letterforms everywhere, or a paid **Helvetica Now / Helvetica World** web licence for the real
> thing. Inter is *not* the right substitute here: it is a different genre of grotesque and reads
> nothing like Helvetica.

**The logotype is not a font decision.** It ships as a supplied image (§1.1).

### 3.2 Type scale 🔒 LOCKED

Base **15px** on a **1.4** ratio. Fluid via `clamp()`; the maxima below are the computed steps.

| Token | Desktop | Step | Use |
|---|---:|---|---|
| `--text-display-xl` | 113px | ×1.4⁶ | Hero, entry animation |
| `--text-display-lg` | 81px | ×1.4⁵ | Page titles |
| `--text-display-md` | 58px | ×1.4⁴ | Section titles — **h2** |
| `--text-heading-lg` | 41px | ×1.4³ | h3 |
| `--text-heading-md` | 29px | ×1.4² | h4 |
| `--text-heading-sm` | 21px | ×1.4 | Card titles |
| `--text-body-lg` | 18px | — | Intro paragraphs |
| `--text-body` | 15px | base | Default, max 68ch |
| `--text-body-sm` | 13px | — | Captions, meta |
| `--text-label` | 13px | — | Button labels, form labels |
| `--text-eyebrow` | 11px | — | Nav links, section eyebrows |

A 1.4 ratio is dramatic — headings are large and there is a real gap between 21px and 15px.
That is deliberate: it gives the editorial, magazine feel the deck asks for. Do not add
intermediate steps to soften it.

Headings are Playfair 700 throughout. Body weights 400/500/600 only.

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

## 5. Shape & elevation 🔒 LOCKED

- **Radius: 40px on controls** — buttons and inputs are fully rounded pills
  (`--radius-control: 40px`). This is a deliberate softening against the sharp Didone headings,
  and it is the one place the design is not print-flat. Cards, panels and sections stay square.
- The only true circle is the MM monogram.
- **Borders:** `--border-hairline` 1px, `--border-medium` 2px, always in `--border`.
- **Shadows: none.** A single `--shadow-lift` exists for the portfolio hover and nothing else.
  Depth comes from the header/marquee/page surfaces being different colours, not from shadow.

## 6. CTAs

Three tiers. Uppercase, `--text-label` (13px), **weight 600**, `--radius-control` (40px pill),
tracking 0.09em.

| Size | Height | Padding X |
|---|---|---|
| `sm` | 34px | 14px |
| **`md` (default)** | **42px** | **20px** |
| `lg` | 50px | 28px |

Weight 600 rather than 500 is deliberate: at 500 the cream-on-red label measured Lc 83 against a
90 requirement (**Borderline**); at 600 the threshold drops to 70 and it **passes** with the same
colours and the same size.

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
  `aria-describedby` and `aria-invalid`. Red on cream is legible, so the standard red error
  message is fine everywhere on the page. Forms never sit on the pink header.
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

**Locked sizing:** bar **56px** tall · logotype **250px** wide · links **11px**, weight **500**,
tracking **0.3em**, uppercase.

> **Accepted trade-off — nav link legibility.** Cream on pink at 11px measures **Lc 48 against a
> 90 requirement**. Laura & Poppy signed this off knowingly: the nav is six familiar words, not
> prose, and the wide 0.3em tracking helps word-shape recognition. **Do not silently "fix" this
> during development.**
>
> For reference if it is ever revisited: on this pink, no ink colour passes below 24px semibold.
> Switching the bar to red `#a23b3b` with cream links measures Lc 83 and passes from 9px.

### 8.2 Services marquee 🔒 — structure decided

The marquee is **its own surface**, coloured independently of both the header and the page
(`--marquee-bg`, `--marquee-ink`). It sits directly beneath the header.

**Locked:** background cream `#fffaed` · text royal blue `#0b48ff` · **13px at weight 600**.

Weight 600 is load-bearing — blue on cream is Lc 77, which needs 90 at weight 400 but only 70 at
weight 600. At 600 it passes at any size.

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

Still to decide — the next design question. Full specs in `docs/SITEMAP.md`. Shared requirements regardless
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

**`design/tokens.css` is the source of truth.** It holds every locked value and is imported
first, before any framework styles:

```css
@import "../design/tokens.css";
@import "tailwindcss";
```

Then bridged into Tailwind so each token is also a utility class:

```css
@theme inline {
  --color-bg: var(--bg);              /* → bg-bg */
  --color-ink: var(--ink);            /* → text-ink */
  --color-accent: var(--accent);      /* → bg-accent */
  --color-nav-bg: var(--nav-bg);      /* → bg-nav-bg */
  --color-marquee-bg: var(--marquee-bg);
  --font-display: var(--font-display);
}
```

**Brand values (`--brand-*`) are never referenced directly by a component** — always the
semantic token. That indirection is what makes a future palette change a one-file edit.

Three independent surfaces, each with its own background and ink, per §0:
`--nav-bg` / `--nav-ink` · `--marquee-bg` / `--marquee-ink` · `--bg` / `--ink`.

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
| S1–S4 | Page structure — header surface, centred logotype, marquee surface, no second logotype | ✅ **Locked** 2026-08-02 · §0 |
| C1 | Colour roles — all 15 assigned | ✅ **Locked** 2026-08-02 · §0, `tokens.css` |
| C2 | Nav link legibility on pink | ✅ **Accepted trade-off** · §8.1 |
| T1 | Heading typeface — Playfair Display 700, tracking −0.005em | ✅ **Locked** · §3.1 |
| T2 | Body typeface — system Helvetica stack | ✅ **Locked**, with the Windows/Arial caveat · §3.1 |
| T3 | Type scale — 15px base, 1.4 ratio | ✅ **Locked** · §3.2 |
| B1 | Buttons — 42px, 20px padding, 13px label, 40px pill radius | ✅ **Locked** · §5, §6 |
| E1 | Entry experience — envelope / kinetic type / both | ⬜ Not started |
| N1 | Portfolio vs Work — one page or two? | ⬜ Open · `SITEMAP.md §2` |

Content-level questions remain in §15 and `docs/SITEMAP.md §6`.
