# Kotori — Authentic Japanese Restaurant

A website for **Kotori Authentic Japanese Restaurant** in Aurora, Ontario.
Built as a static site (HTML / CSS / vanilla JS — no build step, no framework).

> **Address:** 15263 Yonge St, Aurora, ON L4G 1N5
> **Phone:** (905) 726-2083
> **Email:** kotorijapaneserestaurant@gmail.com
> **Hours:** Sun / Tue – Sat · 11:30 a.m. – 3 p.m. · 5 – 9 p.m. · Closed Mon & Wed

---

## Live preview (temporary tunnel)

While iterating, the site has been served from the developer's machine via a
Cloudflare quick-tunnel. The current public URL is rotated each session — see
your active session for the live link. To preview locally:

```bash
cd "Wood vibe test"
python -m http.server 8000
# open http://localhost:8000/
```

---

## Pages

| File           | Purpose |
|----------------|---------|
| `index.html`   | Home — hero video, food gallery (16 photos in masonry layout with lightbox), wave-banner with animated sailboat fleet, footer with embedded mini-map |
| `about.html`   | About — three editorial rows (Origin / The Chef / Sourcing) with real photographs of the counter, chef, and tuna boat |
| `order.html`   | Order Online — single Uber Eats card linking to the live restaurant page |
| `contact.html` | Contact — team photo, phone / email / address rows, full weekly hours, call & email CTAs |
| `map.html`     | Find Us — full Google Maps embed of the Aurora location with directions / open-in-Maps buttons |

All pages share the same **header** (wood-plank deck with logo + nav) and
**footer** (Visit column with address, phone, and clickable mini-map preview).

---

## Visual identity

| Element        | Details |
|----------------|---------|
| **Display font** | Shippori Mincho B1 (Google Fonts) — used for all headings and the brand mark |
| **Body font**    | Manrope — paragraphs, navigation, captions |
| **Colour tokens** | Defined in `css/base.css` `:root` — `sumi` (deep black), `hinoki` (cedar warm browns), `cedar-red`, `washi` (cream), `vermillion` (`#c14a2a`, brand red), `gold` (`#b89968`) |
| **Logo**          | `images/kotori-logo.png` — small bird mark with cherry blossom |
| **Header**        | "Wood plank" deck — multi-layer SVG fractal-noise + gradient bark texture, deep wood undertones, etched-into-wood navigation buttons with cream text and inset shadow |
| **Body backgrounds** | Hero is the dark sumi base; about / contact / order / map share a warm vermillion-ember + cedar + gold radial layering with a subtle SVG turbulence overlay (parchment noise effect) |

---

## Key features

### Menu modal (`js/book.js`)
- Three-leaf 3D flipping book containing photographed menu pages
  (`images/menu-1.png`, `menu-2.png`, `menu-3.png`)
- Triggered by the **MENU** nav link on any page (the script self-injects its
  markup if not present, so the modal works on every page, not just the home)
- Opens with a fade-in over a backdrop-blurred page; auto-flips to the first
  spread after 2.5 seconds
- Close via X button, ESC, or backdrop click
- On phones (< 600px) the 3D book is replaced by a clean vertical stack of the
  three menu images at full screen width — much more legible than a cramped
  two-page spread on a 390px viewport
- Per-image `transform: translate(...) scale(...)` rules in `pages.css` were
  dialled in via a temporary in-modal editor that has since been removed; the
  final positions are baked into the CSS

### Gallery + lightbox (`js/gallery.js`)
- 16 food photos rendered as a masonry layout (CSS `column-count`) — 3 columns
  desktop, 2 on tablet/phone, 1 on very narrow viewports
- Each photo retains its natural aspect ratio (no forced crop)
- IntersectionObserver fades each photo in as it scrolls into view
- Click any photo to open it full-size in a lightbox modal — same backdrop-blur
  pattern as the menu modal; close via X / ESC / backdrop click

### Boat fleet (`js/boats.js`)
- Sits at the top of the gallery section (no banner background — boats drift
  across the warm parchment of the gallery itself)
- Four hand-coded SVG boat templates with vertical gradient shading for
  faux-3D look: red junk-style boat, blue motorized fishing boat with
  wheelhouse, yellow rowboat with a small figure, tall white sailboat with
  jib + main sail
- Spawner releases boats at randomised intervals (1.5–7.5 s) with random
  direction (~18% sail right-to-left), traversal duration (16–30 s), bob
  period and phase, vertical position, and scale (0.85×–1.1×)
- Each boat's SVG is animated with a six-keyframe `boatPhysics` cycle that
  composes **heave** (`translateY` ±3px), **pitch** (`rotateX` ±3°), and
  **roll** (`rotateZ` ±3°) — combined with the parent fleet container's
  `perspective: 480px`, the result reads as ocean physics rather than a 2D
  slide
- `transform-origin: 50% 85%` so each boat pivots near its waterline (rocked
  by the water from below) rather than tumbling around its centre
- Spawner pauses when the tab is backgrounded and removes spent boats from
  the DOM after they exit the viewport

### Map embeds
- Footer mini-maps and the dedicated `map.html` use Google Maps' free
  `output=embed` iframe (no API key required)
- Query is the registered business name + address so the marker resolves to
  Kotori Authentic Japanese Restaurant's place card (with photos, ratings,
  Order Online button) rather than a generic address pin
- Footer mini-map is wrapped in an `<a href="map.html">` with
  `pointer-events: none` on the iframe so the click bubbles through to the
  larger map page

### Intro splash
- `js/intro.js` + `images/kotori-logo.png` — brief logo fade-in / fade-out
  on first load before the home page reveals
- Uses `prefers-reduced-motion: reduce` to skip the animation entirely

### Accessibility
- All decorative animations (boat fleet, hero video, gallery fade-ins, intro
  splash) honour `prefers-reduced-motion: reduce` and become static
- Lightbox / menu modal both trap focus while open, support ESC to close,
  and restore body scroll on close
- All interactive elements have visible focus states
- Decorative SVGs use `aria-hidden="true"`

---

## File structure

```
Wood vibe test/
├── index.html               Home + gallery + boat fleet
├── about.html               Editorial rows about the restaurant
├── order.html               Uber Eats handoff
├── contact.html             Phone / email / hours / map
├── map.html                 Full-page interactive map
│
├── css/
│   ├── base.css             :root tokens, reset, header, footer, buttons
│   └── pages.css            Per-page sections, modal, gallery, boats, etc.
│
├── js/
│   ├── intro.js             Splash logo fade
│   ├── book.js              Menu book modal + flip mechanic + phone fallback
│   ├── gallery.js           IntersectionObserver fade-in + lightbox
│   └── boats.js             Boat-fleet spawner with random voyages
│
└── images/
    ├── kotori-logo.png      Brand mark
    ├── kotori-team.png      Team portrait (used on contact page)
    ├── about-counter.png    "The Counter" photo
    ├── about-chef.png       "The Chef" portrait
    ├── about-sourcing.png   "From the Sea" / tuna boat
    ├── menu-1.png           Menu page 1 — Mother's Day omakase
    ├── menu-2.png           Menu page 2
    ├── menu-3.png           Menu page 3 — drinks
    └── food-1.jpg .. food-16.jpg
                              Curated subset of dish/ingredient photos for
                              the home gallery
```

---

## Development log (chronological highlights)

This section documents what was iterated on through the build, so future
contributors can pick up the thread.

### Header
- Started as a single dark deck with text wordmark "kotori — authentic
  japanese restaurant" → swapped to logo image + tagline
- Carved-into-wood styling for nav buttons (inset shadow + cream text +
  subtle warm highlight on the bottom edge)
- Logo size and tagline baseline tuned together so the two read as one mark

### Home page evolution
- Originally had a long teaser strip with the philosophy copy + an inline
  menu-book on the right side of a two-column grid
- Replaced with a **food gallery** section — first 4-up uniform grid, then
  the user requested "stretched to actual size, not necessarily uniform" so
  it became a CSS-columns masonry layout
- Photo count went 8 → 32 → 16 → 6 → 11 (ended at 11 after a "5 more" iteration)
- Removed the "Three Pillars" three-up section per user request; home now
  flows hero → gallery → footer

### Menu book
- Original markup had 5 leaves with full dish lists (starters, hearth,
  omakase, sake/tea, etc.)
- Restructured to 3 leaves once the user supplied photographed menu pages
  — leaves now hold the menu images directly via a `.page-image` modifier
  with `object-fit: contain`
- Added the modal layer (open via nav link from any page, animation, X
  close, backdrop click, ESC, auto-flip after 2.5s)
- Built and removed an in-modal photo-position editor; final transforms
  are baked into `css/pages.css` per `[src$="menu-N.png"]` selectors

### About page
- Started with three abstract gradient swatches → swapped each for a real
  photograph (counter, chef, tuna boat) supplied by the user
- "Sourcing" panel got an `--landscape` modifier (4:3 instead of 4:5) so
  the wide tuna-boat photo wasn't cropped weirdly
- Per-image `object-position` overrides via a temporary editor (since
  removed); final values baked in CSS
- Mobile layout iterated several times: side-by-side uniform → side-by-side
  scaled-down → vertical stack with image-first per row (current — the
  industry-standard editorial mobile pattern, more legible than scaled-down
  side-by-side)

### Contact page
- New page introduced mid-build with team photo, phone, email, address,
  hours
- Hours rendered as a clean two-column day/time grid with "Closed" days
  italicised and dimmed
- Real address (15263 Yonge St) and phone ((905) 726-2083) replace the
  fictional placeholders site-wide

### Footer
- Started as 3-column (brand / visit / the house links) → reduced to a
  single Visit column on user request
- Added a clickable mini-map next to the address that links to the
  dedicated `map.html` page
- Visit column re-laid as text-on-left + map-on-right with tight spacing

### Boat fleet (recent)
- First iteration: a single static red SVG sailboat with a translateY bob
- Then: tweaked size / colour / animation pacing
- Then: replaced with a **fleet** — `js/boats.js` spawns up to 4 different
  boat designs at random intervals with composed heave/pitch/roll motion,
  perspective parent for 3D feel, alternating directions
- The accompanying seigaiha (青海波) blue-wave banner that originally sat
  underneath has been removed per user request — only the boats remain,
  drifting across the parchment background

### Mobile polish
- Viewed via the Cloudflare tunnel on actual iPhone hardware
- Gallery: switched to 2-column masonry on phones (was collapsing to 1
  column which made the gallery a giant vertical feed)
- About rows: stacked vertically with image-first / text-below (was
  side-by-side scaled-down — too cramped)
- Menu modal: replaced 3D book with full-width vertical scroll of the three
  menu images on phones

---

## License & attribution

All client copy, photography, and brand assets are property of Kotori
Authentic Japanese Restaurant. Code is provided as-is for the Kotori site
and not licensed for re-use elsewhere without permission.

Built collaboratively in Claude Code by Karl Kaliber (Kaliber Autonomy).
