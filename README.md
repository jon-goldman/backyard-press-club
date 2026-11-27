# Backyard Press Club website

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser to see it.

## Pages
- `index.html` — Shop: everything on sale, with filters. Click a print for the quick look.
- `catalogue.html` — every edition, numbered BPC–001 onwards, list or grid.
- `printing.html` — riso printing services, file guide, ink picker, quote.
- `about.html` — studio, shipping and returns, contact.

## Adding a print
Everything comes from `assets/works.js`. Copy a block, fill it in, and:
1. Put photos in an `images/` folder and set `image`.
2. In Stripe, create a Payment Link for the print (Products → Payment Links), turn on "Let customers adjust quantity" and collect shipping address. Paste the link into `buy`.
3. When it sells out, set `status: "sold-out"`. It leaves the shop and stays in the catalogue.

## Still to fill
Every `[bracketed]` item: titles, prices, paper, city, email, Instagram handle, and the margin size on the printing page.

## Hosting
Any static host works (Netlify, Cloudflare Pages, GitHub Pages). Upload this folder as is.

## Publishing
GitHub Pages serves the `main` branch as is (Settings → Pages → Deploy from a branch → `main` / root). Every merge to `main` updates the live site in a minute or two.
