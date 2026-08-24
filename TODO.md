# To do

Running list. Add anything here and it gets picked up later.

**Sequencing:** the visual work comes first, then functionality. Nothing in the
Functionality section below should be started until the design is settled —
noted 2026-08-20.

---

## Functionality — after the visuals are done

### Shop: quantities

- No way to add more than one of something. There should be a quantity control.
- Removing from the basket removes the whole line. With 2 of an item, taking one
  away should leave 1, not 0.

### Shop: the basket gives no feedback

- The basket icon sits in the header, so once the page is scrolled it is off
  screen. Adding something produces no visible response and you have to scroll
  back up to find out whether it worked.
- Needs confirmation that reaches the visitor where they already are, rather
  than only updating a counter they cannot see.

---

## Visual — in progress

- **Optional: photograph a crumpled receipt for `/packages`.** The crumple is
  generated (lit facets in SVG) and now reads as paper, but a real photographed
  sheet would beat it. The surface is already its own layer
  (`.rcpt__strip::after`), so a texture drops in as a `background-image` swap
  with nothing else on the page changing. The TEXT stays HTML either way —
  never baked into the image, or the screen-reader support, find-in-page,
  indexing and reflow all go with it. Watch tiling: strips vary in height, so
  the texture wants to be vertically seamless, `cover` on a tall source, or a
  9-slice `border-image`. Licensing matters if the image is not shot in-house.

- `--brand-black` is `#000000`. Both design skills flag pure black in favour of
  a near-black tinted toward the brand hue. Site-wide change, not yet made.

---

## Done

- **Enquire form prefills from context** (2026-08-24, PRs #37 and #38). The
  eleven `[ ENQUIRE ]` brackets on `/packages` — one per receipt plus Bespoke —
  now link to `/enquire?package=<slug>`, and the form shows that back as an
  ENQUIRING ABOUT line above the fields, ticks the service the package draws
  on, and sends it as the email's first row. Both open questions were answered
  visible: the line has a Change control that opens a select of all eleven, and
  the tick is a real checkbox. A hidden field would have submitted a claim about
  the visitor they could neither see nor correct.
  - **The other enquire CTAs stay bare, deliberately** — home, `/about`,
    `/work`, the two on `/services`, both in the chrome. They sit at the bottom
    of a page about everything, so there is nothing specific for them to carry.
    A `?service=` half was built and cut the same day: nothing linked with it,
    and it put "TikTok management" and "UGC & brand content" in the Change
    picker twice over with no way to tell which was which. If `/services` ever
    grows a bracket per section, `content/enquiry-subjects.ts` says where the
    second kind goes back.
  - The subject list is DERIVED from `content/packages.ts`, so a package rename
    moves the enquiry line with it, and a build-time assertion catches a subject
    naming a service the form has no box for.

- `/work` is the portfolio (2026-08-24). Four projects — Bendito, Harmony Hub,
  The Loft, Websites — each a full-width plate whose name straddles the plate's
  bottom edge, opening in place on a native `<details>`. No JavaScript. The two
  projects with no photography yet show a brand-pink field saying so; swapping
  in the real pictures is `kind: "pending"` → `kind: "photo"` in
  `content/work.ts` and nothing else on the page moves.
  - Second pass the same day: the Websites plate is now the two sites **live in
    iframes** rather than screenshots, which were cropped by the plate's aspect
    ratio; Bendito leads, because opening on two placeholders argued against the
    page; and the rule moved under the `[ Open ]` bracket so it closes each
    entry instead of floating between two of them.
  - Third pass: the pictures were too big. The plate is now 13:5 instead of 2:1
    and inset to 78% of the band on desktop, so each one sits in a field of
    cream rather than filling one — the page went from ~4300px to ~3200px. Both
    are single variables at the top of `app/work/work.css`
    (`--pf-plate-ratio`, `--pf-plate-width`) if they want dialling again; note
    that `--pf-live-k` and the Bendito crop are derived from them and have to
    move too.
  - **Still needed from the client:** photography for Harmony Hub and The Loft,
    dates for all four (the label renders a Year row only when one is set), and
    a read of the two written descriptions — neither is deck copy.
- `/packages` built and shipped (PR #17, 2026-08-20).
- `/packages` — each tier on its own white card, centred (PR #18).
- `/packages` is the receipt now (2026-08-21). Chosen out of three directions
  built side by side; the card and paper versions are deleted along with
  `components/ui/tab-line.tsx`, which only those two used. Git history has all
  of it if the decision needs revisiting.
