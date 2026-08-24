# To do

Running list. Add anything here and it gets picked up later.

**Sequencing:** the visual work comes first, then functionality. Nothing in the
Functionality section below should be started until the design is settled —
noted 2026-08-20.

---

## Functionality — after the visuals are done

### Enquire form: prefill from context

Every `[ ENQUIRE ]` on the site points at the same blank form. It should carry
where it was pressed, so the form arrives already knowing what the enquiry is
about instead of asking the visitor to say it again.

- The bracket CTA appears on `/packages` (once per tier, plus once per
  single-package tab), on `/services`, and in the site chrome.
- Each one should prefill the relevant fields — at minimum which package or
  service it came from.
- Open questions for when this is picked up: does it prefill a visible field
  the visitor can change, or a hidden one? And does the form show what it
  thinks the enquiry is about, so the visitor can correct it?

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

- `/work` is the portfolio (2026-08-24). Four projects — Harmony Hub, The Loft,
  Bendito, Websites — each a full-width plate whose name straddles the plate's
  bottom edge, opening in place on a native `<details>`. No JavaScript. The two
  projects with no photography yet show a brand-pink field saying so; swapping
  in the real pictures is `kind: "pending"` → `kind: "photo"` in
  `content/work.ts` and nothing else on the page moves.
  - **Still needed from the client:** photography for Harmony Hub and The Loft,
    dates for all four (the label renders a Year row only when one is set), and
    a read of the two written descriptions — neither is deck copy.
- `/packages` built and shipped (PR #17, 2026-08-20).
- `/packages` — each tier on its own white card, centred (PR #18).
- `/packages` is the receipt now (2026-08-21). Chosen out of three directions
  built side by side; the card and paper versions are deleted along with
  `components/ui/tab-line.tsx`, which only those two used. Git history has all
  of it if the decision needs revisiting.
