# Suraag — Marketing Site

Static landing page for [suraagmusic.in](https://suraagmusic.in/), the offline-first
music streaming app for Android.

The site is a single hand-written `index.html` (no build step). Image assets are
generated from SVG sources by a small Node script.

---

## Project layout

```
.
├── index.html              # the entire site
├── robots.txt              # crawler rules (blocks AI scrapers, points to sitemap)
├── sitemap.xml             # search engine sitemap
├── site.webmanifest        # PWA manifest
├── CNAME                   # GitHub Pages custom domain (suraagmusic.in)
├── 404.html                # (optional, not yet present)
│
├── og-image.png            # 1200x630 social preview  ── generated
├── favicon.svg             # primary favicon          ── source
├── favicon-16.png          # legacy favicon           ── generated
├── favicon-32.png          # legacy favicon           ── generated
├── apple-touch-icon.png    # iOS home screen          ── generated
├── icon-192.png            # PWA / Android            ── generated
├── icon-512.png            # PWA splash / hi-res      ── generated
├── maskable-icon-512.png   # PWA maskable variant     ── generated
│
├── assets/
│   ├── og-image.svg        # OG image source (edit this, then regenerate)
│   └── favicon.svg         # favicon source (also referenced from index.html as /favicon.svg)
│
├── tools/
│   └── generate-images.mjs # SVG -> PNG renderer (sharp)
│
├── package.json
└── .gitignore
```

---

## Local development

Just open `index.html` in a browser, or serve with cache disabled:

```
npm run serve
# -> http://localhost:5173
```

## Regenerating image assets

Edit `assets/*.svg`, then:

```
npm install        # first time only
npm run build:images
```

The script overwrites the PNGs at the repo root. Commit the updated PNGs.

---

## Deploying to GitHub Pages

This repo is configured for GitHub Pages with the custom domain `suraagmusic.in`
via the `CNAME` file at the root.

Once-only setup:

1. Push this repo to GitHub.
2. **Settings → Pages** → set source to `main` branch, root folder.
3. Confirm "Custom domain" is set to `suraagmusic.in` and "Enforce HTTPS" is on.
4. DNS for `suraagmusic.in` should already be pointing at GitHub Pages
   (`A` records to `185.199.108–111.153` and a `CNAME` for `www`).

Every push to `main` redeploys the site automatically.

---

## Search Console & Bing Webmaster — verification

The site ships with placeholder meta tags for both. Once you register the domain
on each platform, paste your verification token into `index.html`:

### Google Search Console

1. Open <https://search.google.com/search-console>.
2. Add property → **URL prefix** → `https://suraagmusic.in/`.
3. Pick **HTML tag** verification, copy the `content="..."` value.
4. In `index.html`, uncomment and fill in:

   ```html
   <meta name="google-site-verification" content="REPLACE_WITH_GSC_TOKEN"/>
   ```

5. Push, wait for deploy, then click **Verify** in Search Console.
6. Once verified, submit the sitemap: `https://suraagmusic.in/sitemap.xml`.

### Bing Webmaster Tools

1. Open <https://www.bing.com/webmasters>.
2. Add site → `https://suraagmusic.in/`.
3. Pick **Meta tag** verification.
4. In `index.html`, uncomment and fill in:

   ```html
   <meta name="msvalidate.01" content="REPLACE_WITH_BING_TOKEN"/>
   ```

5. Push, deploy, click **Verify**.
6. Submit sitemap: `https://suraagmusic.in/sitemap.xml`.

> Tip: Bing Webmaster Tools has an **Import from GSC** option — once Google is
> verified, Bing can import the same sites automatically.

---

## Updating content

| Need to change…                | Where                                                                  |
| ------------------------------ | ---------------------------------------------------------------------- |
| Tagline / description          | `<title>`, `<meta name="description">`, `og:description`, `twitter:description` |
| App version or APK URL         | `index.html` — three places: `<a class="download-btn">`, JSON-LD `downloadUrl`, JSON-LD `softwareVersion` |
| OG/social preview image        | Edit `assets/og-image.svg`, run `npm run build:images`                 |
| Sitemap last-modified date     | `sitemap.xml` `<lastmod>`                                              |
| Add a new social link          | Footer `.social-row` block + JSON-LD `Organization.sameAs` array       |

---

## Credits

Crafted by [Gurupada Nayak](https://gurupadanayak.in/?ref=suraagmusic).
