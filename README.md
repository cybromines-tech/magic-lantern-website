# Magic Lantern

Marketing site for **Magic Lantern Entertainments** — a media house doing branding,
digital marketing, web development and video/photography end to end.

Rebuilt from the `Magic Lantern - Home.html` bundle (a self-extracting export with a
React UMD runtime and an `x-dc` template dialect) into a real static site.

## Stack

| Concern     | Choice                                                              |
| ----------- | ------------------------------------------------------------------- |
| Framework   | [Astro](https://astro.build) — static HTML out, zero JS by default   |
| Language    | TypeScript (`astro check` is clean)                                  |
| Styling     | Plain CSS — tokens in `src/styles/global.css`, the rest scoped per component |
| 3D          | `three` + `SVGLoader`, dynamically imported into its own chunk       |
| Scrolling   | `lenis` for inertial scroll, also lazily imported                    |
| Fonts       | `@fontsource` (Anton, Sora, Manrope, Caveat) — self-hosted, no Google Fonts calls |

No CSS framework and no UI library: the source design is a fixed, fully specified
composition, so tokens plus scoped styles carry it without a utility layer.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve dist/
npm run check    # astro + TypeScript diagnostics
```

`dist/` is plain static files (`build.format: 'file'`, so `/about.html` not
`/about/index.html`) and drops onto any static host as-is.

## Structure

```
public/assets/
  logo-mark.svg        flame monogram — also the mesh the WebGL hero extrudes
  logo-white.svg       full lockup, for OG/social
  covers/*.svg         placeholder work thumbnails
src/
  components/          Logo, LogoMark, Nav, Footer, MLScene, PageHero, ContentPending
  data/site.ts         contact details, nav tree, service list
  layouts/Base.astro   head, fonts, nav + footer, script entry
  pages/               one file per route
  scripts/
    ml-scene.ts        <ml-scene> custom element (three.js)
    site.ts            page transitions, smooth scroll, reveals, stat counters
  styles/global.css    tokens, base, keyframes, layout + button primitives
```

## The brand

- **Name:** Magic Lantern (legally Magic Lantern Entertainments)
- **Mark:** an ML flame monogram, `#9A1F17`
- **Palette:** near-black surfaces (`#0f1012` → `#1e2026`) under a crimson/flame ramp
  (`#7c130f`, `#b22319`, `#e0564a`, `#f0a89f`)
- **Type:** Anton (display), Sora (UI), Manrope (body), Caveat (script accents)

## The 3D effect

`<ml-scene>` is a custom element with three variants:

- `hero` — the monogram SVG extruded into a bevelled solid, lit by a flickering
  point light (two detuned sines), over a drifting ember particle field, with the
  camera easing toward the pointer for parallax
- `orbit` — same monogram on a continuous slow spin, used on inner page heroes
- `ambient` — embers only, no monogram

It stays off the critical path: three.js loads on `requestIdleCallback`, the render
loop pauses when the element scrolls out of view or the tab is hidden, and the
element renders nothing at all under `prefers-reduced-motion` or without WebGL —
the CSS gradient behind it carries the section either way.

## Navigation

Astro's `<ClientRouter>` (in `Base.astro`) swaps the document in place rather than
reloading it, and cross-fades the two pages via the View Transitions API. Browsers
without it fall back to a plain instant navigation.

Two consequences worth knowing before editing client code:

- **Bundled `<script>` blocks evaluate once per session, not per page.** Anything
  that must apply to each new page hangs off `astro:page-load`; see `site.ts` and
  the delegated listeners in `Nav.astro`. Binding a handler directly to a nav or
  header element will silently stop working after the first navigation, because
  that node has been replaced.
- **`window` and `document` survive a swap, so Lenis is created once** and is
  re-synced on `astro:after-swap`. Without that re-sync it keeps animating toward
  the previous page's scroll target.

## Performance constraints (don't undo these)

Scrolling is smoothed by Lenis, which owns the scroll position and writes it
every frame. A few rules follow from that, and breaking any of them brings the
stutter back:

- **Never set `scroll-behavior: smooth`.** Native smooth scrolling re-interpolates
  every position Lenis writes, which reads as lag. `lenis/dist/lenis.css` is
  imported in `Base.astro` and enforces `scroll-behavior: auto` via `html.lenis`.
- **`body` uses `overflow-x: clip`, not `hidden`.** `hidden` makes the body a
  scroll container that Lenis then competes with.
- **Never hide `body` behind an opacity fade.** An earlier version faded the body
  out, reloaded the document, then faded it back in — which showed a blank page
  for the entire load. `<ClientRouter>` handles the transition now.
- **The WebGL scene is capped**: pixel ratio 1.25 (not `devicePixelRatio`) and
  60fps. Uncapped on a retina ProMotion display that was ~3.3 megapixels of MSAA
  at 120Hz, all of it competing with scroll compositing. It's a soft background —
  the resolution isn't missed.
- **The marquee's `will-change: transform` is applied by JS only while it's on
  screen**, and its animation pauses off screen. Left on permanently it pins a
  very wide compositor layer for the life of the page.
- **Reveals show instantly if they're already at or above the viewport on load.**
  Otherwise a reload mid-page (or a back-navigation) leaves everything above you
  blank until you scroll back up through it.

## Notes / TODO

The source bundle shipped **only the home page**, but its nav and footer link to nine
more routes. Those exist here with the real shell (hero + nav + footer) and a
`<ContentPending>` block — navigation is whole, no 404s, and each is a one-file swap
once copy lands. Delete the `ContentPending` import as you fill each in.

Placeholder values carried over from the source, all in `src/data/site.ts`:

- `whatsapp` / `phone` — `+91 00000 00000` is a stub
- `address` — still says "(update with your real address)" in the footer
- `socials` — all four links point at `#`
- `public/assets/covers/*.svg` — generic thumbnails, swap for real stills
- `site` in `astro.config.mjs` — set to the real domain before deploying, it feeds
  the canonical and OG URLs
