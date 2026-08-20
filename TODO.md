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

- **Pick a /packages direction, then delete the losers.** Three routes exist to
  be compared (2026-08-20): `/packages` (the live one), `/packages-v2` (receipt)
  and `/packages-v3` (paper). v2 and v3 are `noindex` and are linked from
  nowhere. Whichever wins gets folded back into `/packages` and the other two
  routes come out — they duplicate layout, and left alone they will drift.

- `/packages` — comparison rows: banding and type treatment (2026-08-20).
- Corner radius on the package cards is `--radius-panel` (16px), which matches
  `/enquire` but contradicts the design system's "radius 0 everywhere".
  Undecided.
- `--brand-black` is `#000000`. Both design skills flag pure black in favour of
  a near-black tinted toward the brand hue. Site-wide change, not yet made.

---

## Done

- `/packages` built and shipped (PR #17, 2026-08-20).
- `/packages` — each tier on its own white card, centred (PR #18).
