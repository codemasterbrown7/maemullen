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

**Primary nav:** Home · About · Services · Packages · Work · Enquire, plus an Instagram icon.

- The wordmark (top-left or centred, per the Round 4 header decision) always links to `/`.
- The services marquee is a *secondary* route into `/services` — deck p4:
  > Top of the website maemullen below moving constantly stops with cursor links to our services page
- Every page ends with a CTA band into `/enquire`. That is the site's single conversion goal.
- Footer repeats the nav, plus Instagram, email and copyright.

`OPEN:` Instagram handle · contact email · domain · whether a cart/shop is ever needed (one
reference screenshot had a cart icon; nothing in MaeMüllen's own brief suggests e-commerce).

---

## 3. Global elements

### 3.1 Entry experience — Round 1 decision 🎚

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

### 3.2 Header

Round 4 decision — two directions, both in the deck. Spec in `DESIGN.md` §8.1.

### 3.3 Services marquee

Deck p4. Full spec in `DESIGN.md` §8.2 — 40s loop, pauses on hover **and** focus-within, duplicate
track `aria-hidden`, stops under reduced motion.

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
| 1 | Header | Wordmark + nav | Round 4 |
| 2 | Marquee | Services, scrolling → `/services` | 🔒 |
| 3 | Hero | Wordmark, full-bleed | 🔒 asset supplied |
| 4 | Moving collage | Drifting overlapping photo tiles | ⚠ needs photography |
| 5 | About summary | Verbatim below | 🔒 |
| 6 | Services teaser | Numbered `001…` list → `/services` | 🔒 structure |
| 7 | Selected work | 3 case studies → `/work` | ⚠ 1 of 3 has assets |
| 8 | CTA band | → `/enquire` | 🔒 |
| 9 | Footer | | 🔒 |

**Hero.** Deck p3 shows the cream wordmark on a pink field. See the contrast caveat in
`DESIGN.md` §2.3 — as supplied this is 2.27:1. The `<h1>` must carry real text regardless.

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

Deck p10–p13. Three tiers plus the TikTok add-on.

> ⚠️ **Two unresolved contradictions — see the OPEN items below. Do not ship this page until both
> are settled.**

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

`OPEN: 1 — Do prices appear at all?` Deck p8 says
> PACKAGES (bronze, silver, gold, content days, tiktok management, pr & events, website building
> **dont include prices on website**)

…yet every single service page in the deck states a price. Two readings: (a) suppress *all*
pricing and drive to enquiry, or (b) the note attaches only to website building. This changes the
whole page — a price grid versus a "request a quote" layout.

`OPEN: 2 — Which naming scheme?` Gold/Silver/Bronze *and* Essential/Signature/Elevated are both
present. They also conflict semantically: **"Elevated" is attached to the cheapest tier**, which
reads backwards, and "Essential" to the most expensive. Options: pick metals, pick names, or
re-map names so the ladder ascends sensibly.

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

### 4.7 `404`

Wordmark, a short line in the brand voice, and a link home. Low effort, but it should not look
like a default.

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
