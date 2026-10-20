# Waterboy Recovery — Shopify theme

A complete Shopify theme built around the original `Waterboy_Recovery_2.html`
landing page. Design, copy, colors, fonts, spacing, animations, and
components are preserved exactly. The only changes are the technical
ones needed to make a valid Shopify theme that passes GitHub-sync
validation, is editable through Shopify's theme editor, and is wired to
a real Shopify product.

## Install

### Via Shopify ↔ GitHub integration

1. In Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**.
2. Select the `claude/charming-curie-u96d1x` branch of your repository.
3. The theme will install as "Waterboy".
4. Click **Customize** on the theme to open the theme editor.
5. In the editor, open the **Waterboy Product** section and attach your
   Shopify product in the Product picker.
6. Add Flavor and Size blocks whose `name` / `size_value` match your
   product's option values exactly (e.g. Flavor option values "Berry",
   "Mango", "Lemon-Lime"; Size option values "7", "30", "60").
7. Publish the theme.

The homepage (`/`) renders the Waterboy landing. You can also create
additional pages that use the Waterboy template: **Pages → Add page →
Theme template → waterboy**.

## File layout

```
assets/
  waterboy.css                       landing-page styles (scoped under .waterboy)
  waterboy.js                        carousel + product UI + variant selection
config/
  settings_schema.json               theme-level settings
  settings_data.json                 saved theme settings
locales/
  en.default.json                    translations
layout/
  theme.liquid                       default layout (minimal — no injected chrome)
sections/
  waterboy-nav.liquid                sticky nav
  waterboy-hero.liquid               hero
  waterboy-marquee.liquid            scrolling marquee
  waterboy-benefits.liquid           4 benefit cards
  waterboy-social-proof.liquid       video thumb carousel
  waterboy-reviews.liquid            3 testimonial cards
  waterboy-how.liquid                3-step row
  waterboy-product.liquid            product block — wires to Shopify product
  waterboy-faq.liquid                FAQ accordion
  waterboy-final-cta.liquid          dark CTA band
  waterboy-footer.liquid             footer
templates/
  index.json                         homepage — all 11 Waterboy sections
  page.waterboy.json                 alt page template using the Waterboy sections
  page.liquid                        generic CMS page (nav + content + footer)
  product.liquid                     generic product page (nav + product + footer)
  collection.liquid                  generic collection grid
  cart.liquid                        cart
  blog.liquid                        blog index
  article.liquid                     article
  list-collections.liquid            all collections
  search.liquid                      search
  404.liquid                         404
  gift_card.liquid                   gift card
  password.liquid                    password gate
  customers/
    account.liquid
    activate_account.liquid
    addresses.liquid
    login.liquid
    order.liquid
    register.liquid
    reset_password.liquid
```

## What changed technically (no design changes)

1. **Monolithic HTML → Shopify theme.** Split the one HTML file into 11
   Liquid sections, each with its own schema so every string, link,
   benefit, review, FAQ, step, trust badge, info row, flavor, and size
   is editable in the theme editor.
2. **CSS extracted and scoped** to `assets/waterboy.css` under a
   `.waterboy` prefix so it can't collide with other theme CSS. Marquee
   keyframes renamed to `waterboy-scroll` for the same reason. The
   body-level `::before` safe-area overlay now scopes to
   `body.waterboy-page::before`; the layout adds that class.
3. **JS extracted** to `assets/waterboy.js`. Same two IIFEs as the
   original (carousel + product UI). The product UI was extended only
   to read a JSON blob of real Shopify variants, resolve the current
   Flavor + Size + Delivery selection to a real `variant_id`, format
   prices via `shop.money_format`, and show "Sold Out" when the chosen
   variant is unavailable.
4. **Real Shopify product in the shop section.** The `waterboy-product`
   section has a `product` picker. When attached, price, compare-at
   price, image, variants, selling plans, and availability come from
   Shopify. Add to Cart is a real `<form method="post" action="/cart/add">`
   that submits `id`, `quantity`, and `selling_plan` (when Subscribe is
   selected). When no product is attached the section renders exactly
   the illustrated placeholder with the original fallback prices.
5. **Full theme scaffolding** added so the repo passes Shopify's
   theme-validation check: default `layout/theme.liquid`,
   `config/settings_schema.json`, `config/settings_data.json`,
   `locales/en.default.json`, and all required templates
   (`product`, `collection`, `cart`, `page`, `blog`, `article`,
   `list-collections`, `search`, `404`, `gift_card`, `password`, and
   all seven `customers/*` templates). The non-Waterboy templates are
   minimal, Waterboy-styled, and functional, so the store works end to
   end even though the Waterboy landing is the star.
6. **Cart link in the nav** now points to `routes.cart_url`.
7. **Google Fonts** preconnect + stylesheet is loaded once from the
   nav section (the first section on any Waterboy page), same as the
   original.

## Verification against the original

Every section in `c7af961a-Waterboy_Recovery_2.html` is present with its
original markup structure, class names, animations, and copy:

| Section                 | Preserved | Notes |
| ----------------------- | --------- | ----- |
| Nav bar                 | Yes       | Cart links to the real cart |
| Hero                    | Yes       | Image replaces can only if uploaded |
| Marquee                 | Yes       | Same scrolling animation (keyframes renamed) |
| Benefits grid           | Yes       | 4 cards, same icons/text |
| Social proof carousel   | Yes       | All 5 palette variants, same JS |
| Testimonial reviews     | Yes       | 3 cards, same check-mark author pill |
| How It Works            | Yes       | 3 numbered circles |
| Product page            | Yes       | Can + 4 thumbs; real variants when a product is attached |
| Flavor / Size / Delivery / Qty / ATC | Yes | Same selectors, classes, animations |
| Trust row               | Yes       | 3 icons via blocks |
| Info accordion          | Yes       | 4 rows via blocks |
| FAQ                     | Yes       | Same 5 Q&A, same `details` styling |
| Final CTA               | Yes       | Same lime button and copy |
| Footer                  | Yes       | Same copyright + 4 links |

No sections were removed, no styles rewritten, no components replaced.
