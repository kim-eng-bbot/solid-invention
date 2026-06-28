# Strong Threads Africa LTD — Company Website

Static marketing website for **Strong Threads Africa LTD**, a Kenyan supplier of
premium workwear, protective equipment, school uniforms, and custom embroidery.

## Structure

```
strong-threads-africa/
├── index.html          # Single-page site (hero, about, products, gallery, testimonials, contact)
├── css/
│   └── styles.css      # Design system (tokens) + all component styles
├── js/
│   └── main.js         # Interactions + SITE config (single source of contact data)
├── assets/
│   └── images/         # Optimized WebP (primary) + JPEG (fallback)
├── robots.txt          # Crawler directives
└── sitemap.xml         # XML sitemap
```

## Running locally

It's a pure static site — no build step required.

```bash
cd strong-threads-africa
python3 -m http.server 8000
# open http://localhost:8000
```

Any static file server works (e.g. `npx serve`, VS Code Live Server, Netlify, GitHub Pages).

## Updating content

### Contact details (phone / WhatsApp / email)

All contact information is defined **once** at the top of `js/main.js` in the
`SITE` config object, then injected into every relevant element via `data-bind`
attributes. To change a phone number or email, edit `SITE` and it updates
everywhere (header, contact section, footer, floating WhatsApp button, and the
form's WhatsApp handoff).

```js
const SITE = {
  phoneDisplay:   '+254 0711 942 888',
  phoneRaw:       '+254711942888',
  whatsappNumber: '254711942888',
  email:          'info@strongthreadsafrica.co.ke'
};
```

> Note: the same values also appear in `index.html` as visible fallback text and
> in the JSON-LD structured data in `<head>` (crawlers require literal values).
> Update those if you change the canonical details.

### Images

Images use `<picture>` with WebP as the primary format and JPEG as a fallback.
To replace an image, provide both `.webp` and `.jpg` variants in
`assets/images/` and keep the `width`/`height` attributes on the `<img>` in sync
to prevent layout shift.

### Social links

YouTube / Instagram / TikTok links in the contact section and footer currently
point to `#` (placeholders). Replace the `href="#"` values with real profile URLs
when available.

## Notable implementation details

- **Responsive navigation**: a single `<nav class="primary-nav">` serves both
  desktop and mobile (the mobile state is a CSS-driven full-screen overlay).
- **Accessibility**: skip-to-content link, focus-visible outlines,
  `prefers-reduced-motion` support (disables parallax, autoplay, and reveal
  animations), an accessible lightbox (`role="dialog"`, focus restore), and
  labelled carousel/stars.
- **SEO**: Open Graph + Twitter cards, canonical URL, JSON-LD `LocalBusiness`
  structured data, `robots.txt`, and `sitemap.xml`.
- **Performance**: WebP/JPEG images with explicit dimensions, non-blocking font
  loading via `preconnect`, and a deferred script.

## Browser support

Targets all modern evergreen browsers (Chrome, Firefox, Safari, Edge). WebP is
served with a JPEG fallback for older clients.
