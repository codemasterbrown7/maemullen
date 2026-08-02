# What we're doing next

Agreed 2026-08-02. Read this first after a context compact.

---

## Where we are

**Design phase is complete and locked.** The repo currently holds design work only — no
application code (a Next.js scaffold was built, then deliberately deleted; see `DESIGN.md` §0
for why the structure was settled before any build).

| File | What it is |
|---|---|
| `design/tokens.css` | **Source of truth.** Every locked colour, type, spacing and shape value. |
| `design/DESIGN.md` | The design system. §0 holds the locked decisions and accepted trade-offs. |
| `design/styleguide.html` | Interactive studio — live preview, APCA contrast lab, decision export. |
| `docs/SITEMAP.md` | Every page, verbatim deck copy, and the open content questions. |
| `public/brand/`, `public/work/` | Supplied logo files and the Bendito case-study assets. |

---

## Step 1 — Home page

1. Re-scaffold Next.js (App Router, TypeScript) + Tailwind v4 + Motion.
   Note: the folder name "Laura Website" is not a valid npm package name — scaffold into a temp
   directory and move the files in, or the CLI refuses.
2. Import `design/tokens.css` **before** Tailwind, then bridge the tokens into `@theme inline`
   so each is also a utility class. Nothing hard-coded in components.
3. Build `/` in full, to the locked structure (`SITEMAP.md` §4.1):

   header → marquee → statement hero → moving collage → services teaser →
   selected work → CTA band → footer

**Three independent surfaces** (`DESIGN.md` §0, S1–S3) — the header, the marquee and the page
each carry their own background and ink. Do not let them inherit from one another.

**No second logotype on the page** (S4). The logotype appears in the header only; the page opens
on the statement block. The `<h1>` must be real text, because the logotype is an image.

**Do not "fix" the nav link contrast.** Cream on pink at 11px measures Lc 48 against a 90
requirement. It was signed off knowingly (`DESIGN.md` §8.1).

### Placeholders needed
- Moving-collage photography — not supplied. Use clearly-marked placeholder tiles.
- Portfolio nav item points at `/work` for now (see below).

---

## Step 2 — Entry experience

Build **all three** variants on branches, compare, merge the winner:

| Branch | Behaviour |
|---|---|
| `entry/envelope` | Wax-seal cursor, click stamps the flap, envelope opens, home revealed |
| `entry/kinetic-type` | "MaeMüllen" drops in repeatedly, staggered, each line a palette colour |
| `entry/both` | Envelope → kinetic type → home |

They share one shell — session handling, skip control, focus management, reduced-motion path — so
the second and third are cheap once the first exists. Non-negotiables in `SITEMAP.md` §3.1.

Judged against the real home page, which is why it comes second.

**Blocker:** the envelope artwork was never supplied (deck says "made by ai"). Use the
placeholder line-art envelope drawn in Poppy's style — single-weight red strokes on cream — and
swap it when the real artwork lands.

---

## Step 3 — Remaining pages

`/about` · `/services` · `/packages` · `/work` + `/work/[slug]` · `/enquire` · `404`,
in `SITEMAP.md` order. Resolve each page's `OPEN:` items as we start it, not before.

---

## Decisions made in this planning round

- **Home page before the entry experience** — a gate is judged by what it reveals.
- **All three entry variants**, on branches, compared side by side.
- **Portfolio vs Work deferred.** Build `/work` only; the Portfolio nav item points there for
  now. Settle the split when we build that page. (`SITEMAP.md` §2)

---

## Still open

Content-level only — full list in `SITEMAP.md` §6. The ones that will bite soonest:

| # | Question | Needed for |
|---|---|---|
| 1 | Do prices appear on the site at all? Deck p8 says no, every service page states one. | Packages |
| 2 | Gold/Silver/Bronze or Essential/Signature/Elevated — and "Elevated" is on the cheapest tier | Packages |
| 3 | Confirm the real service list and order | Services |
| 5 | `MaeMüllen` vs `Maemullen` in prose | Global |
| 6 | Domain, Instagram handle, contact email | Global |
| 11 | Envelope artwork | Entry |
| 12 | Photo of Laura & Poppy; which doodles | About |
| 14 | Where enquiry submissions are delivered | Enquire |
