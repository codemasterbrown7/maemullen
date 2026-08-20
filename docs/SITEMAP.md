# MaeMüllen — Sitemap & page specs

Version 0.1 · Source: `Source Material/Website inspo.pdf` (20 pages)

Companion to `design/DESIGN.md`. That document defines *how things look*; this one defines
*what exists and what goes on it*.

**Convention:** copy shown in blockquotes is **verbatim from the deck** and ships as-is unless
Laura & Poppy change it. Anything marked `OPEN:` is deliberately blank — the deck does not answer
it, and we resolve it together when we start that page rather than guessing now.

---

## 1. Information architecture

The deck's own list (p8) is: About Us · Services · Packages · Enquiries · Case Studies/Portfolio.

```
/                        Home            (entry experience gates first visit)
├── /about               About
├── /services            Services         ─┬─ #social-media
│                                          ├─ #content-days
│                                          ├─ #tiktok
│                                          ├─ #ugc
│                                          ├─ #design-illustration
│                                          ├─ #pr-events
│                                          └─ #websites
├── /packages            Packages
├── /work                Selected work
│   └── /work/[slug]     Case study        ─┬─ /work/bendito      (menu)
│                                           ├─ /work/airbnb       OPEN: real name
│                                           └─ /work/mia-massage
├── /enquire             Enquire
└── 404                  Not found
```

Seven real pages plus case-study details. Deliberately shallow — every page is one click from the
header.

`OPEN:` **Packages as its own route, or a section of `/services`?** Arguments both ways: the deck
lists them as separate top-level items, but the packages *are* the social-media service, so
splitting them can read as duplication. Recommendation: keep `/packages` as its own route and have
the `#social-media` service block link into it.

---

## 2. Navigation model

**Primary nav** 🔒 — balanced three either side of the centred logotype:

| Left | | Right |
|---|---|---|
| About · Services · Packages | **MaeMüllen** | Portfolio · Work · Enquire |

`OPEN:` **Are "Portfolio" and "Work" two different pages?** — **deferred by decision.** Deck p8
lists them as one item, *"CASE STUDIES / PORTFOLIO"*. For now: build `/work` only, and point the
Portfolio nav item at it so the 3+3 balance holds. Settle the split when we build that page —
either Portfolio becomes a visual gallery separate from the written case studies, or one gets
renamed.

- The wordmark sits **centred in the header** (locked, `DESIGN.md` §0) and always links to `/`.
- The services marquee is a *secondary* route into `/services` — deck p4:
  > Top of the website maemullen below moving constantly stops with cursor links to our services page
- Every page ends with a CTA band into `/enquire`. That is the site's single conversion goal.
- Footer repeats the nav, plus Instagram, email and copyright.

`OPEN:` Instagram handle · contact email · domain · whether a cart/shop is ever needed (one
reference screenshot had a cart icon; nothing in MaeMüllen's own brief suggests e-commerce).

---

## 3. Global elements

### 3.1 Entry experience — ⬜ still to decide

Deck p1:
> Hand drawn / envelope made by ai like this one first thing you see pops up?
> Cursor is our logo but as a wax stamp click on envelope to enter and stamp envelope

Deck p3, describing the alternative:
> Another idea this font coming down the page fast one after the other drop down different colours
> - after the entering page or instead of

"**after the entering page or instead of**" is the deck explicitly leaving this open. Three
variants get built and compared:

| Branch | Behaviour |
|---|---|
| `entry/envelope` | Full-screen cream stage. Envelope centred. Cursor is the MM wax seal (`monogram-cursor@2x.png`). Click → seal presses into the flap (spring, overshoot) → envelope opens → home revealed. |
| `entry/kinetic-type` | No envelope. "MaeMüllen" drops in repeatedly from the top, fast, staggered, each line in a different palette colour, settling into the header wordmark. |
| `entry/both` | Envelope → kinetic type → home. |

**Non-negotiables for all three** (from `DESIGN.md` §9.3):
1. Plays once per session (`sessionStorage`), not on every navigation.
2. Visible **Skip** control as the first tab stop.
3. The envelope is a real `<button>`, keyboard-operable — not a click handler on a div.
4. `prefers-reduced-motion: reduce` → resolves straight to home.
5. If JS fails, home renders normally. The gate never traps anyone.

`OPEN:` The envelope artwork itself. The deck says "made by ai". Not yet supplied — placeholder
until we have it, or we draw it to match Poppy's line style (see the Bendito artwork).

### 3.2 Header 🔒 — decided

Its own surface, independent of the page. **Logotype centred**, nav links split either side:
About / Services / Packages · logotype · Work / Enquire. Full spec in `DESIGN.md` §8.1.

Note the legibility warning there if the header stays pink — pink cannot carry small text.

### 3.3 Services marquee 🔒 — decided

**Its own surface**, coloured independently of both header and page, sitting directly beneath the
header. Deck p4. Full spec in `DESIGN.md` §8.2 — 40s loop, pauses on hover **and** focus-within,
duplicate track `aria-hidden`, stops under reduced motion.

Items (drawn from MaeMüllen's actual services, not the reference site's):
Social media management · Content days · TikTok management · PR & events ·
Design & illustration · UGC & brand content · Website design

### 3.4 Footer

Wordmark · nav repeat · Instagram · email · copyright.
`OPEN:` privacy policy, terms, cookie notice — needed before launch if the enquiry form stores data.

---

## 4. Page specs

### 4.1 `/` — Home

Deck p3–p7.

| # | Section | Content | Status |
|---|---|---|---|
| 1 | Header | Centred logotype, nav split either side. **Own surface.** | 🔒 structure decided |
| 2 | Marquee | Services, scrolling → `/services`. **Own surface.** | 🔒 structure decided |
| 3 | Hero | Statement block + CTAs — **no logotype here** | 🔒 structure decided |
| 4 | Moving collage | Drifting overlapping photo tiles | ⚠ needs photography |
| 5 | About summary | Verbatim below | 🔒 |
| 6 | Services teaser | Numbered `001…` list → `/services` | 🔒 structure |
| 7 | Selected work | 3 case studies → `/work` | ⚠ 1 of 3 has assets |
| 8 | CTA band | → `/enquire` | 🔒 |
| 9 | Footer | | 🔒 |

**Hero — no second logotype.** Settled with Laura & Poppy (`DESIGN.md` §0, S4): the logotype
appears in the header only. The page opens directly on the statement block. The `<h1>` is real
text, since the header logotype is an image.

**About summary** — deck p6, verbatim. Set the first paragraph as the statement block
(`DESIGN.md` §3.3):

> MAEMULLEN IS A CREATIVE STUDIO WHERE SOCIAL, CONTENT AND DESIGN COME TOGETHER. WE CREATE
> THOUGHTFUL, DISTINCTIVE WORK THAT HELPS BRANDS SHOW UP WITH PERSONALITY AND PURPOSE.

> We believe the strongest brands are built through creativity, consistency and genuine
> connection. From social media and content creation to design, illustration, PR and events, we
> create work that feels authentic, considered and designed to leave a lasting impression.

**Moving collage** — deck p5: *"Moving photo collage front page"*. Reference imagery in the deck
is editorial fashion/jewellery/lifestyle.
`OPEN:` which photographs. Placeholder tiles until supplied.

**Build notes (2026-08-02)** — implementation calls made while building the page; flag if any
should change:

- **Footer brand mark is the MM monogram, not the wordmark.** §8.4 of `DESIGN.md` lists a footer
  wordmark, but S4 says the logotype appears in the header only — S4 wins, and the monogram is
  the sanctioned small-space lockup (§1.3).
- **Hero CTAs:** primary pill **Enquire** → `/enquire`, plus the bracket CTA
  **[ Explore our world ]** (verbatim, deck p7) → `/work`.
- **CTA band copy:** "Let's work together" + Enquire button. Not deck copy — replace at will.
- Statement stored sentence-case ("Maemullen is…") and uppercased with CSS per §3.4, so the
  rendered text matches the deck exactly while Q5 (spelling in prose) stays open.
- Footer Instagram/email render as visible "TBC" placeholders until Q6 is answered.

---

### 4.2 `/about` — About

Deck p9. Required elements, verbatim from the deck:
> • info about us · • picture of us · • poppys doodles

**Body copy** — verbatim:

> Maemullen was founded by two creatives brought together by a shared passion for design, content
> and creativity.

> Laura is an Advertising graduate with a background in luxury PR, social media management and
> UGC, bringing experience in brand storytelling, content creation and digital marketing. Poppy is
> a Fine Art graduate from Central Saint Martins whose background in illustration, design and
> visual arts brings a distinctive creative perspective to every project.

> As a female-founded studio, we created Maemullen to combine our different creative disciplines
> under one roof. What began through our shared love of creating has grown into a studio where
> social media, design and content work together to help brands connect with their audience in a
> thoughtful and authentic way.

> Today, we partner with businesses to create work that feels considered, creative and true to
> their identity, combining strategy with originality to build brands people remember.

**Poppy's doodles** — the Bendito menu artwork (`public/work/bendito/menu-artwork.png`) shows the
house illustration style: single-weight red line drawings, loose and confident. Use that as the
reference for hand-drawn accents here.

`OPEN:` photograph of Laura & Poppy · which doodles to use and where · whether individual
headshots and bios are wanted alongside the joint story.

---

### 4.3 `/services` — Services

Deck p8 and p14–p18. Presented as a numbered list, each row expanding to reveal its detail —
the pattern the deck references.

> ⚠️ **Do not copy the deck's `001–007` list.** That screenshot (Social Media Management, Strategy
> & Consultancy, Content Creation, Influencer Campaigns, Paid Social, Events, AI Content Creation)
> is the **reference site's** services, not MaeMüllen's. The list below is reconstructed from
> MaeMüllen's own service pages in the deck.

| # | Service | Deck page | Detail copy |
|---|---|---|---|
| 001 | Social media management | p8, p10–12 | Delivered as packages → `/packages` |
| 002 | Content days | p15 | ✓ verbatim |
| 003 | TikTok management | p13 | ✓ verbatim (add-on) |
| 004 | UGC & brand content | p17 | ✓ verbatim |
| 005 | Design & illustration | p14 | ✓ verbatim |
| 006 | PR & events | p16 | ✓ verbatim |
| 007 | Website design | p18 | ✓ verbatim |

`OPEN:` **the real list and its order.** The above is my reconstruction — it needs confirming.

**002 · Content days** — deck p15:
> Need a month's worth of content in one session? We create premium, social-first content tailored
> to your brand.

Available as: Half-day shoot £350–450 · Full-day shoot £650–900
Includes: Reels · TikToks · Photography · Product content · Lifestyle content ·
Behind the scenes · Staff & team content

**003 · TikTok** — deck p13. *"Available alongside any package."*
TikTok strategy · Caption writing · Posting & scheduling · Trend research · Monthly management
· +£250–400/month

**004 · UGC & brand content** — deck p17:
> Creating premium, social-first content that captures your brand at its best. From luxury stays
> and wellness experiences to product launches and behind-the-scenes moments, we create authentic
> content designed to elevate your online presence.

UGC · Behind-the-scenes (BTS) content · Luxury travel & hospitality content ·
Hotel & destination content · Lifestyle content · Brand campaigns ·
Product & lifestyle photography · Reels & TikToks · Short-form video production ·
Event coverage · Social-first campaign content — *"Quote depends on hours needed starting from £250"*

**005 · Design & illustration** — deck p14:
> From bespoke illustrations to beautifully designed print and digital assets, we create visuals
> that feel unique to your brand.

Restaurant & café menus · Illustrated menus · Brand illustrations · Flyers & posters ·
Event stationery · Signage · Social media graphics · Packaging concepts

**006 · PR & events** — deck p16:
> Helping brands build meaningful relationships. £600 per month pr and influencer marketing

Includes: Influencer outreach · Product gifting · Brand collaborations · Press outreach ·
Campaign coordination · Event invitations

> EVENTS - quote depends on scale and budget. From concept to execution. Whether you're launching
> a new business, hosting a wellness event or planning a brand activation, we'll help bring your
> vision to life.

Event planning · Brand launches · Wellness events · Community events · Pop-ups ·
Influencer events · Supplier coordination · Guest list management · On-the-day coordination

**007 · Website design** — deck p18:
> Websites, built with your brand in mind.

Landing pages · Portfolio websites · Small business websites · Website refreshes — £900

> Deck note *"after x amount of clients we get 15%"* is an **internal commercial note**, not
> website copy. Excluded.

---

### 4.4 `/packages` — Packages

Deck p8 and p10–p13. ✅ **Built 2026-08-06.** Both blocking contradictions are resolved — see
`RESOLVED` below. Full reasoning lives at the top of `content/packages.ts`.

**Scope is p8, not p10–13.** This section used to read "three tiers plus the TikTok add-on", which
is what p10–13 shows. Deck p8 — the IA page — is broader and it is the one that governs:

> PACKAGES (bronze, silver, gold, **content days, tiktok management, pr & events, website
> building** dont include prices on website)

So Packages is the whole commercial menu, not just the retainers. That resolves §1's `OPEN:` in
favour of keeping the route, and creates the real problem: five of the seven services appear on
both pages. **The axis that separates them is discipline vs commitment** — `/services` is what we
do, `/packages` is the shapes you can book it in. The mapping is deliberately not one-to-one
(social media management is one service and three packages; PR & events is one service split
across a monthly add-on and a one-off quote). Three rules enforce it, and breaking any of them
collapses the page back into a copy of `/services`:

1. Name the shape, not the field — *"Design project"*, not *"Design & illustration"*.
2. No prose and no photography. `/packages` is type and rules only, and carries no scroll-drawn
   thread — the knot belongs to `/services`.
3. Every row links back to the service it draws on.

**As built — ONE TAB PER THING YOU CAN BUY.** Eight tabs, `001–010`:

| Tab | | Panel |
|---|---|---|
| Social media | 001–003 | Essential · Signature · **Elevated** (emphasised) — the only three-column panel |
| Content days | 004 | Content day |
| UGC | 005 | UGC & brand content |
| TikTok | 006 | TikTok management |
| PR | 007 | PR & influencer |
| Events | 008 | Event |
| Design | 009 | Design project |
| Websites | 010 | Website build |

Then one band that is the bespoke offer **and** the page's closing CTA — *"Bespoke / Don't see a
package that fits?"* → Enquire. One band rather than two, because every package already ends in
Enquire and a generic "let's work together" underneath would be the third ask on a screen.

> **The page has now failed twice in the same direction, and it is worth not doing a third time.**
> The first build was one eleven-row accordion — *"way way too confusing"*. The second grouped
> nine packages into four areas ("Content" holding both the content day and UGC) — *"each thing
> should be its own separate clickable thing"*. Both made the reader work out for themselves which
> items compete with each other.
>
> **Social media is the only multi-card panel, and that is the rule rather than an exception to
> it.** Essential/Signature/Elevated are three prices for one thing, so they are alternatives and
> belong side by side. Nothing else on the page is an alternative to anything, so nothing else
> shares a panel. TikTok was a line under the social tiers until the client asked that it not be
> *"hidden down at the bottom"*; it is 006 now, and its `commitment` still reads "alongside any
> package", which is the one thing worth keeping from treating it as an add-on.

**Tabs run on CSS, not JavaScript** — one visually-hidden radio group with the tab bar and the
panels as siblings (`#id:checked ~ …`). The page stays a server component with no client bundle
of its own; a radio group already *is* "one of a set", so native arrow-key behaviour comes free;
every panel stays in the HTML, so all ten packages are indexable and findable with find-in-page;
and it works with JS off. The inputs are clipped with `.mm-visually-hidden`, **not**
`display: none`, which would make them unfocusable.

**⚠️ HORIZONTAL RULES IN THIS AREA — what stays and what went. Three were cut; one is wanted.**

| | Verdict |
|---|---|
| Full-width `border-bottom` under the whole tab bar | **Cut** — read as two stacked lines against the column rules below it |
| The **moving rule under the active tab** | **KEEP.** Asked for, then deleted by mistake, then asked back |
| Black rule over each comparison column, above `[ 00x ]` | **Cut** — furniture; the spec list already rules every entry |
| Blue 2px rule over the **feature** column only | **KEEP** — emphasis, not structure |

The mis-step is worth recording so it is not repeated: *"i still think the line looks out of place
and is unnecessary"* was read as the tab indicator, and `components/ui/tab-line.tsx` was deleted.
It meant *"the line below that"* — the column rules. The component is restored; the column rules
are gone.

**The moving rule** (`components/ui/tab-line.tsx`). Its two edges are transitioned separately —
`left` and `right` on one ease-in-out curve with a 90ms delay on the trailing edge — so the leading
edge leaves first, the rule briefly spans both tabs, and the tail closes it. `data-dir` swaps which
edge leads, or a leftward move stretches away from the tab that was clicked. Measured live at 1440:
158px → 655px → 113px, settling exactly on the target label.

It is the page's only script and it is decoration: it adds `is-enhanced` to the track, and until
that lands (and forever, with JS off) the CSS draws a static `border-bottom` on the checked label
instead. The two can never both show. Positions come from `offsetLeft`/`offsetWidth`, **not**
`getBoundingClientRect`, because the bar scrolls horizontally and rect values would be off by the
scroll distance.

**With the black column rules gone**, the feature column's blue rule is the only one in the row, so
it says more than it did when all three had one — and it doubles as the underline for the
`[ RECOMMENDED ]` tag above it. The other two columns keep its exact metrics as bare padding
(`calc(var(--space-5) + 2px)`), so all three `[ 00x ]` numbers still sit on one line; only the ink
differs. `.pkg__col-head` is `vertical-align: top` for the same reason — bottom-aligning would drop
a column's number whenever a neighbour's positioning line wrapped.

**Tabs are centred and set large** (22px at 1440, `clamp(1rem, 1.7vw, 1.375rem)`) — they are the
page's primary control and at 18px they read as a filter bar on top of the content rather than the
thing you use first. Centring is `justify-content: center` on a track that is `width: max-content;
min-width: 100%`: when the labels fit, the track fills the bar and they centre; when they do not,
the track is wider than the bar and centring silently stops applying, so the first tab stays flush
left and reachable. One rule, both behaviours, no breakpoint.

**Active is ink plus the moving rule** — solid black against `rgb(0 0 0 / 0.45)`, lighter than the
site's usual `--ink-muted` so the step is unmistakable (still clears 3:1 for large text). **Not
weight**: bold and regular set to different widths, so every click would reflow the row and,
centred, shift every other tab sideways — and the rule measures those widths.

**Making Elevated pull.** Asked for directly: distinguish it *and* make someone likelier to click
it. The reference does it with a solid blue button, which is ruled out here — filled pills were
rejected as "extremely out of place" in typographic blocks and the bracket CTA is the locked
signature (DESIGN.md §6.3). Three signals instead, no new furniture: **ink** (everything the card
owns switches to brand blue — the page's only accent, spent here and nowhere else, so it reads
pre-attentively); **mark** (a `[ RECOMMENDED ]` tag in the page's own bracket-and-caps register);
**height** (a 2px rule against the others' 1px, and the tag lifts the column). The tag row is
reserved on every card in a panel that has a feature card, so the three rules stay on one line.

| Tier | Second name | Price | Positioning line (verbatim) |
|---|---|---|---|
| Gold | Essential | £1,350/month | *Perfect for brands looking for a dedicated creative partner.* |
| Silver | Signature | £950/month | *Perfect for growing brands ready to elevate their social presence.* |
| Bronze | Elevated | £650/month | *Perfect for businesses building a consistent online presence.* |

**Gold / Essential** — 2 monthly content creation sessions · 20+ pieces of content ·
Daily Instagram Stories · Full social media management · Monthly planning call ·
Monthly performance report & recommendations · Priority support · Content calendar

**Silver / Signature** — 1 monthly content creation session · 12–16 pieces of content ·
12 Instagram Stories · Monthly content planning call · 2 revisions · Monthly performance report ·
Content calendar

> Deck line *"include some of our own content/taking some ourselves?"* is an open internal
> question to Laura & Poppy, not a customer-facing bullet. Excluded pending an answer.

**Bronze / Elevated** — Monthly content planning · 8 pieces of content · 8 Instagram Stories ·
Caption writing · Content scheduling · Content calendar · Monthly performance report

**TikTok add-on** — *"Available alongside any package."* +£250–400/month.

`RESOLVED: 1 — Do prices appear at all?` **No. Suppressed site-wide.** The deck's *"dont include
prices on website"* sits at the end of the whole PACKAGES parenthesis on p8, not on "website
building" alone; the client confirmed it directly on 2026-08-06. The real figures stay recorded in
`content/services.ts`, unrendered.

What replaces them is a **commitment line** on every row — the shape of the spend rather than the
amount, shown in the *closed* row so the shut list is still scannable: *"Monthly, ongoing"* ·
*"Half day or full day"* · *"By the hour, or by the project"* · *"Fixed project fee"* · *"Quoted by
scale"* · *"Quoted to you"*. A mono note above the closing CTA explains the absence, so it reads as
a decision rather than an oversight.

`RESOLVED: 2 — Which naming scheme?` **Metals dropped, word-names remapped to ascend.** Confirmed
by the client 2026-08-06. Metals read as a podium — the entry client is told they bought bronze —
which is off-brand for a studio selling *"authentic, considered, distinctive"*. The two
semantically-broken names simply swap; Signature does not move.

| Deck | Ships as |
|---|---|
| Bronze / *"Elevated"* (cheapest) | **001 Essential** |
| Silver / Signature | **002 Signature** |
| Gold / *"Essential"* (dearest) | **003 Elevated** |

`OPEN:` **Minimum term on the three monthly packages.** Nothing in the deck says. `commitment`
reads *"Monthly, ongoing"*, which is true either way and deliberately does not assert a rolling
contract. If there is a three-month minimum it belongs in that string.

`RESOLVED: 3 — PR is a package, not an add-on` (client, 2026-08-06). It shipped as an add-on first
because the deck prices it monthly and *"alongside"* is the pattern. It is now **006**, in its own
tab beside Events — the better read anyway: PR recurs, events are one-off, and putting them side
by side is what shows that. **TikTok is now the only add-on**, and stays one: the deck's own
framing is *"Available alongside any package"* (p13), so it is not an alternative to anything and
cannot be a column in a panel of alternatives. It renders as a single line under the social tiers.

`OPEN:` ⚠️ **The three tier lists have gaps, and an assumption has been made to cover them.** The
client asked (2026-08-06) that features appearing across all three tiers line up on one row, so the
social panel is now a real `<table>` built from `socialMatrix` in `content/packages.ts` — one row
per feature, `null` rendering as a dash.

Aligning them exposed what three separate lists hid: **the deck says a cheaper tier includes things
a dearer one does not.** Signature (p11) never mentions caption writing or content scheduling, both
of which Essential *below it* lists; Elevated (p10) never mentions Signature's 2 revisions. Read
literally that is a ladder that goes down as it goes up.

**The assumption, and it is an assumption: each tier includes everything below it.** The deck's
lists are summaries, not contracts, and every tiered offer works this way — so those cells are
filled cumulatively rather than left as dashes that would misrepresent the client's own product.
Marked `INHERITED` at each one in `content/packages.ts`. **Confirm with Laura & Poppy**; if any is
genuinely not in a tier, set that cell to `null` and the dash returns.

A **"Revisions"** row (deck p11, Signature's "2 revisions") was cut on request 2026-08-06. It was
also the only row whose Elevated cell was inherited purely to stop the ladder reading backwards, so
removing it takes one of the three deck contradictions off the page rather than papering over it.

**Row order is load-bearing.** Rows run from "in all three tiers" down to "in Elevated only", so
every column's dashes collect at the *bottom* — Essential 7 filled then 4 dashes, Signature 9 then
2, Elevated 11 and none. The first version grouped rows by subject, which scattered Essential's
dashes through the middle of its column and left holes in the list; cut on request (2026-08-06).
This only works because the matrix is cumulative, so the three sets nest strictly. A **build-time
assertion** at the foot of `socialMatrix` throws if a column ever has a filled cell below a gap —
verified by injecting one, which fails `next build` with the offending row named.

`OPEN:` **The comparison scrolls sideways on a phone** (`min-width: 46rem`), so Elevated — the
emphasised column — is the last one reached. Stacking was rejected: it destroys the row alignment
that is the whole requirement. If it matters, the mobile answer is a snapping carousel of one card
per screen, which is a second layout to build rather than a tweak.

`OPEN:` **Cross-links from `/services` into `/packages`.** Rule 3 runs one way so far — every
package row links out to its service. Only `#social-media` links back. Adding a link to the other
six sections means touching `/services`, whose layout the scroll-drawn thread measures itself
against, so it is a deliberate follow-up rather than a free change.

---

### 4.5 `/work` — Selected work

Deck p19:
> Include menu, airbnb and mia massage
> Layout nicely with photos and short description
> 3 photos take up the whole screen click to view desctiption

**Interaction:** three full-bleed, full-height panels stacked vertically. Click (or Enter on a
focused panel) reveals the description over the image. Keyboard-operable; `Esc` closes.

| Slug | Project | Assets |
|---|---|---|
| `bendito` | Menu design & illustration | ✅ artwork + in-situ photo supplied |
| `airbnb` | `OPEN:` real project name | ❌ |
| `mia-massage` | Mia Massage | ❌ |

**Bendito** is the only one that can be built fully today. It demonstrates the Design &
Illustration service: hand-drawn menu artwork, printed and photographed in situ.

`OPEN:` per-project description copy · the client's real name for "airbnb" · whether the in-situ
photography is cleared for public use · results/metrics if any.

---

### 4.6 `/enquire` — Enquire

Deck p20 shows two reference forms. Fields below merge them, keeping everything MaeMüllen would
actually need to quote.

| Field | Type | Required |
|---|---|---|
| First name | text | ✅ |
| Last name | text | ✅ |
| Brand / company name | text | ✅ |
| Email | email | ✅ |
| Social media handle(s) | text | ✅ |
| Website | url | — |
| Location | text | ✅ |
| Describe your brand | textarea | ✅ |
| Service(s) of interest | multi-select | `OPEN:` |
| Where did you hear about us? | select | — |
| Sign up for news and updates | checkbox | — |

Styling per `DESIGN.md` §7 — underline inputs, `(required)` in words, no placeholder-as-label.

**On submit:** confirmation replaces the form in place and focus moves to the confirmation
heading (never a silent success).

`OPEN:` where submissions go (email? Formspree? Resend? a CRM?) · whether the newsletter checkbox
needs a real mailing-list integration and a privacy statement · budget-range field, y/n.

---

### 4.7 `404` — ✅ built

Wordmark, a short line in the brand voice, and a link home. Low effort, but it should not look
like a default.

`app/not-found.tsx`, rendered by `components/InProgress.tsx`.

---

### 4.8 The unbuilt pages — ✅ stubbed 2026-08-04

`/about`, `/packages`, `/work` and `/enquire` all exist as real pages that say what is coming,
rather than returning the host's 404. Four of the six links in the header lead to one of them, so
on a live site the alternative was a header that mostly breaks.

One component — `components/InProgress.tsx`, copy in `content/soon.ts` — and it is **deliberately
plain**: a mono `[ IN PROGRESS ]` mark, the page's name, one sentence saying it is being built,
and two bracket links out (Services, Instagram). Centred in the space the chrome leaves. The 404
is the same component with a different mark and line.

**It was more than that first, and that was wrong.** The first version wore /services' masthead —
the scroll-drawn knot behind the display type, a strand down the right margin, a closing knot —
plus a contents list of what was coming, set on hairlines. Cut on the client's note the same day:
*"it should just say that its being built and be fairly plain. dont add the drawing effect that
was only for the services page."* **The drawn line belongs to /services and nowhere else.** An
unfinished page borrowing the most elaborate thing on the site was the wrong instinct.

A consequence worth keeping: with no `<ScrollThread>`, these pages ship no client JS of their own.

The one sentence is the only copy on this site not taken from the deck, because the deck has
nothing to say about pages that do not exist. Treat it as a placeholder.

Each stub is a single ~20-line file that is **deleted outright** when its real page is built.

---

## 5. Content readiness

| Page | Copy | Imagery |
|---|---|---|
| Home | ✅ verbatim | ⚠️ collage photography missing |
| About | ✅ verbatim | ❌ photo of Laura & Poppy, doodles |
| Services | ✅ verbatim (order to confirm) | ⚠️ optional |
| Packages | ✅ verbatim | ✅ none needed |
| Work | ❌ descriptions missing | ⚠️ 1 of 3 projects has assets |
| Enquire | ✅ | ✅ none needed |
| Entry | n/a | ❌ envelope artwork |

Everything without assets builds against clearly-marked placeholders (`DESIGN.md` §10) so no page
is blocked, and nothing can ship looking finished when it isn't.

---

## 6. Open questions index

| # | Question | Page |
|---|---|---|
| 1 | Do prices appear on the site at all? | Packages |
| 2 | Gold/Silver/Bronze or Essential/Signature/Elevated — and fix the reversed ladder | Packages |
| 3 | Confirm the real service list and order | Services |
| 4 | Packages: own route or a section of Services? | IA |
| 5 | `MaeMüllen` vs `Maemullen` in prose | Global |
| 6 | Domain, Instagram handle, contact email | Global |
| 7 | Privacy / terms / cookie notice | Footer |
| 8 | Hero contrast — accept as decorative or use a compliant variant | Home |
| 9 | SVG originals of wordmark + monogram | Global |
| 10 | Bendito — client name to credit, photo cleared? | Work |
| 11 | Envelope artwork | Entry |
| 12 | Photo of Laura & Poppy; which doodles | About |
| 13 | Real client name behind "airbnb"; case-study copy | Work |
| 14 | Where enquiry submissions are delivered | Enquire |
| 15 | Is a cart / shop ever needed? | IA |

---

## 7. Deployment

Static export (`output: "export"`) on GitHub Pages, published by `.github/workflows/deploy.yml`
on every push to `main`.

| | |
|---|---|
| URL | `codemasterbrown7.github.io/maemullen/` |
| Sub-path | `basePath: "/maemullen"`, from `NEXT_PUBLIC_BASE_PATH` in the workflow. Raw `src` strings go through `lib/asset.ts`, which Next cannot prefix on its own |
| Indexing | **`noindex, nofollow`** sitewide, set in `app/layout.tsx`. Deliberate while four of six pages are stubs — one line to reverse |
| Instagram strip | Fetched at BUILD time and frozen into the HTML. The workflow runs daily so it does not go stale |
| Enquiry form | There is no server. Q14 above is now a blocker rather than a detail: it needs a third-party endpoint, or a host that runs code |

Moving to a custom domain: drop `NEXT_PUBLIC_BASE_PATH` from the workflow, add `public/CNAME`.

**`public/assets/IMG_67*.jpg` — 6.8 MB of unreferenced originals** that every deploy still
carries. `public/scatter/*.webp` (920 KB for all fifteen) is what the site actually serves. They
are tracked, so deleting them frees the deploy but not the history.
