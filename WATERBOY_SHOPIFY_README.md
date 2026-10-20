# Waterboy Recovery — Shopify version

This is the Shopify conversion of the original `Waterboy_Recovery_2.html`.
Design, copy, colors, fonts, spacing, animations, and components are
preserved exactly. The only changes are the technical ones needed to make
the page editable through Shopify's theme editor and wired to a real
Shopify product.

## Install

Copy these files into your Shopify theme (same folder names):

```
assets/waterboy.css
assets/waterboy.js
sections/waterboy-nav.liquid
sections/waterboy-hero.liquid
sections/waterboy-marquee.liquid
sections/waterboy-benefits.liquid
sections/waterboy-social-proof.liquid
sections/waterboy-reviews.liquid
sections/waterboy-how.liquid
sections/waterboy-product.liquid
sections/waterboy-faq.liquid
sections/waterboy-final-cta.liquid
sections/waterboy-footer.liquid
layout/waterboy.liquid                  (optional — flush layout)
templates/page.waterboy.json            (JSON template, uses theme.liquid)
templates/page.waterboy-standalone.liquid  (Liquid template, uses layout/waterboy.liquid)
```

Then:

1. In Shopify admin, go to **Online Store → Pages → Add page**.
2. Give the page a title and set **Theme template** to either
   `waterboy` (JSON) or `waterboy-standalone` (Liquid, no theme chrome).
3. In the **Theme editor** (Customize), open the page and click
   **Waterboy Product**.
4. In the **Product** picker, select your real Shopify product.
5. Add Flavor and Size blocks whose `name` / `size_value` match your
   product's option values exactly (e.g. option name "Flavor" with
   values "Berry", "Mango", "Lemon-Lime"; option name "Size" with
   values "7", "30", "60").
6. Save.

Every text block, benefit, review, FAQ, step, trust badge, nav/footer
link, marquee item, and info accordion row is a schema setting — edit in
the theme editor without touching code.

## What changed technically (and only technically)

Design, layout, type, colors, animations, markup structure are all intact.
These are the only alterations, all forced by Shopify's architecture:

### 1. File structure
- Monolithic HTML → split into one Liquid section per visual section
  (`sections/waterboy-*.liquid`) plus one page template and one layout.
- CSS extracted to `assets/waterboy.css`; JS extracted to
  `assets/waterboy.js`. Both loaded by the sections that need them.

### 2. CSS scoping
- Added a `.waterboy` wrapper around each section and prefixed every
  selector with `.waterboy` so the styles don't collide with the host
  theme's CSS. Visual output is identical.
- The body-level `::before` safe-area overlay became
  `body.waterboy-page::before`. The layout file adds the
  `waterboy-page` class.
- The marquee `@keyframes scroll` was renamed to `waterboy-scroll` to
  avoid collisions (your theme may define its own `scroll` keyframes).

### 3. Editable content via schema
- All copy, headings, button labels, URLs, benefit cards, reviews,
  FAQs, steps, trust badges, info accordion rows, nav links, footer
  links, marquee items, and the social-proof carousel cards are
  schema-driven settings and blocks.
- Each section has sensible `presets` and a `default` matching the
  original copy exactly, so dropping the sections in gives you the
  original page out of the box.

### 4. Real Shopify product wiring (product section only)
- A `product` setting lets you attach any Shopify product.
- Flavor option name and Size option name are configurable (default:
  "Flavor", "Size"). Flavor and Size blocks are matched against the
  product's variant option values; selecting Flavor + Size resolves to a
  real `variant_id`.
- Price, compare-at price, availability, featured image, and variant ID
  are now driven by `product.selected_or_first_available_variant` and
  the JSON variants blob rendered in the section.
- Add to Cart is now a real `<form method="post" action="/cart/add">`
  that submits the resolved `variant_id`, `quantity`, and
  `selling_plan` (when Subscribe is selected) to Shopify.
- Subscribe & Save discount uses your product's first Shopify selling
  plan automatically if present; falls back to a cosmetic 10% in
  preview if no selling plan exists.
- "Sold Out" label replaces the button text when the selected variant
  is unavailable.
- The money format comes from `shop.money_format` so prices render in
  the store's currency.
- When no product is attached, the section renders exactly the
  illustrated placeholder from the original with the original fallback
  prices ($19 / $59 / $109).

### 5. Images
- The hero and product-page can both use the original illustrated "can"
  by default, or you can upload a product image through the theme editor
  / use the attached product's `featured_image` and it will replace the
  can inside the same stage. The stage background, aspect ratio, and
  surrounding layout do not change.

### 6. Links / routes
- Cart button in the nav now links to `{{ routes.cart_url }}` instead of
  being a dead `<button>`.
- Logo link, nav links, footer links, hero CTAs, final CTA button are
  all editable URLs via schema (defaults preserve the original anchors
  like `#shop`, `#how`, etc.).

### 7. Fonts
- Google Fonts preconnect + stylesheet is loaded once from the nav
  section (the first section on the page), identical to the original.

### 8. Interactivity
- The social-proof carousel JS and product-page JS are unchanged in
  behavior. The product-page JS was extended only to read the variant
  JSON blob and submit real variant IDs — the UI (flavor pills, size
  cards, delivery toggle, qty stepper, ATC flash) behaves identically.

### 9. Semantic adjustments
- The product-page `<h1>` is still an `<h1>` and the hero `<h1>` is
  still an `<h1>` — Shopify page templates can have multiple, but if
  you prefer a single `<h1>` per page, change one in the Liquid.
- Buttons inside the ATC form that aren't submit targets got explicit
  `type="button"` so they don't accidentally submit the form.

### 10. Dark mode
- The original `prefers-color-scheme: dark` behavior is preserved. If
  your theme already forces light or dark on `<html>`, add
  `data-theme="light"` or `data-theme="dark"` to `<html>` to override.

## Verification against the original

I diffed section by section against `c7af961a-Waterboy_Recovery_2.html`:

| Section                 | Preserved | Notes |
| ----------------------- | --------- | ----- |
| `<head>` fonts & meta   | Yes       | Loaded via nav section |
| Nav bar                 | Yes       | Cart links to real cart |
| Hero (text + can)       | Yes       | Image replaces can only if uploaded |
| Marquee (scrolling)     | Yes       | Same `transform: translateX(-50%)` keyframes, renamed to `waterboy-scroll` |
| Benefits grid           | Yes       | Four cards, same icons, text, grid |
| Social proof carousel   | Yes       | All five palettes (a–e), same JS |
| Testimonial reviews     | Yes       | Three cards, same check-mark author pill |
| How It Works steps      | Yes       | Three numbered circles, same layout |
| Product page gallery    | Yes       | Can + 4 thumbs; image overlays can when a product image exists |
| Flavor pills / size cards / delivery / qty / ATC | Yes | Same selectors, same classes, same animations |
| Trust row               | Yes       | Three icons via blocks |
| Info accordion          | Yes       | Four rows via blocks, `details`/`summary` with the `+`/`–` toggle |
| FAQ                     | Yes       | Same five Q&A, same `details` styling |
| Final CTA (dark band)   | Yes       | Same lime button, same copy |
| Footer                  | Yes       | Same copyright + four links |

No sections removed, no styles rewritten, no components replaced.
