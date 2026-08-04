# MaeMüllen — home page content brief

Updated 2026-08-03. Companion to the **MaeMüllen Design System**.

**The design system is the source of truth for how everything looks and behaves** — colour,
type, spacing, shape, motion, imagery, iconography, voice and casing. Where this file and the
design system ever disagree, the design system wins.

This file carries only what the system cannot know: the client's content, the facts already
agreed with them, and the things still unconfirmed. Nothing here prescribes a layout. Section
order, composition and art direction are entirely yours.

---

## The page

Design MaeMüllen's **home page**. One conversion goal: `/enquire`.

## Content that must appear somewhere on it

- **Who the studio is and what it believes.** Real client copy is in `copy-bank.md`.
- **The seven services, with their 001–007 numbering** (below). The numbering is fixed.
- **Selected work** — three case studies, only one of which has real assets (below).
- **A clear route to `/enquire`.**
- **A footer.**
- **The wordmark appears once, in the site's header — not a second time on the page.** Because
  it is supplied artwork rather than live text, the page's real `<h1>` must not be omitted on
  its account.

## Navigation — six items, fixed

| Label | Route |
|---|---|
| About | `/about` |
| Services | `/services` |
| Packages | `/packages` |
| Portfolio | `/work` |
| Work | `/work` |
| Enquire | `/enquire` |

Portfolio and Work both point at `/work` for now — the split is deliberately unresolved. These
were previously arranged three-and-three either side of a centred wordmark; that arrangement is
recorded, not required.

## Services — names and numbering fixed

| # | Service | Anchor |
|---|---|---|
| 001 | Social media management | `/services#social-media` |
| 002 | Content days | `/services#content-days` |
| 003 | TikTok management | `/services#tiktok` |
| 004 | UGC & brand content | `/services#ugc` |
| 005 | Design & illustration | `/services#design-illustration` |
| 006 | PR & events | `/services#pr-events` |
| 007 | Website design | `/services#websites` |

Per-service deck copy is in `copy-bank.md`.

## Selected work — three case studies

1. **Bendito** — menu design & illustration. The only one with real assets: the printed menu
   photographed in situ, and Poppy's artwork (both are in the design system's `assets/`).
   No written case study yet.
2. **Mia Massage** — no assets, no copy. Placeholder.
3. **Client name TBC** — a holiday-let project. Name unconfirmed, no assets. Placeholder.

## The services marquee — a client request

From the client's own deck: *"Top of the website maemullen below moving constantly stops with
cursor links to our services page."* A band of the seven service names in continuous motion,
each one a link into `/services`, pausing when the pointer is over it.

This is the one piece of sustained motion the client has asked for by name. How it is treated —
and whether it earns its place in this system at all — is your call; if you keep it, it needs a
keyboard-focus pause as well as a hover pause, and a static state under
`prefers-reduced-motion: reduce`.

## Placeholders

Only Bendito and the studio photography are real. Anything else — work imagery, service
imagery — must read as an obvious placeholder. Nothing may look finished when it isn't.

## Copy

`copy-bank.md` is every piece of real copy that exists. Draw on it freely and **write your
own supporting copy wherever the layout needs more** — final copy gets client sign-off later, so
a natural-looking layout beats strict fidelity.

Two fixed points: the seven service names with their numbering, and **no prices anywhere**
(whether pricing appears on the site at all is unresolved with the client).

One rule in the other direction: **a visual idea must never rewrite the client's copy.** Pad it,
extend it, add to it — but don't reword the deck's own sentences to suit a layout.

## Accessibility — non-negotiable

The design system is silent on this; these apply regardless.

- Keyboard-operable throughout, with a visible focus state that is never removed.
- Every animation has a `prefers-reduced-motion: reduce` path.
- One real `<h1>`; semantic `<nav>` / `<main>` / `<footer>`; alt text on every image.
- Touch targets at least 44×44px.
- If the marquee duplicates its track to loop, the duplicate is `aria-hidden` so screen readers
  hear the list once.
- Judge text contrast at the size and weight it is actually used, with APCA rather than
  WCAG 2.1 — WCAG misjudges this palette in both directions.

## Two standing client rulings the system doesn't cover

- **Never desaturate or filter the client's photography.** No greyscale, no partial filters, no
  release-on-hover. The photographs are their own work and are shown as shot.
- **No live italic type.** Italic exists only inside the supplied wordmark artwork, where
  "Müllen" is set in it. Setting a heading — or part of one — in italic has been rejected twice.

## Still unconfirmed

Placeholder these if you show them: Instagram handle, contact email, domain. Also open — brand
spelling in prose (`MaeMüllen` vs `Maemullen`), whether Packages is its own page or part of
Services, and whether Portfolio and Work are one page or two.

## Fonts — the binaries the design system asked for

The system's readme flags that no font files were supplied and substitutes Google Fonts. Here
they are. Both are self-hosted and free for commercial web use; licences are alongside them.

| System register | Was substituted with | Use instead |
|---|---|---|
| Display grotesque | Archivo | **TeX Gyre Heros** — Regular + Bold |
| Body grotesque | Archivo | **Switzer** — variable, 100–900 |
| Annotation mono | IBM Plex Mono | **Keep IBM Plex Mono.** We have no mono of our own. |
| Logotype serif | Playfair Display | **Keep Playfair.** Wordmark register only, as specified. |

Why these two and not the substitute: Switzer is the face the client supplied. TeX Gyre Heros is
a metric-compatible Helvetica clone, and it is the face used by nudesocial.co.uk — the site the
client named as their typography reference. Both sit in the same grotesque register the system
is already built on, so nothing else about the system needs to change.
