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
3. When it sells out, set `status: "sold-out"`. It moves to the end of the shop, fades back, and stays in the catalogue.

## Still to fill
Every `[bracketed]` item: titles, prices, paper, city, email, Instagram handle, and the margin size on the printing page.

## Hosting
Any static host works (Netlify, Cloudflare Pages, GitHub Pages). Upload this folder as is.

## Publishing
GitHub Pages serves the `main` branch as is (Settings → Pages → Deploy from a branch → `main` / root). Every merge to `main` updates the live site in a minute or two.

## Email signup
The signup in the footer posts to a free Kit form (kit.com, free up to 10,000 subscribers, no monthly fee).
1. Make a free Kit account, then Grow → Landing pages & forms → New → Form → Inline.
2. Copy the form's number from its embed code (`app.kit.com/forms/1234567/...`).
3. Paste it into `BPC_SIGNUP_FORM` in `assets/works.js`. Until then the form shows as "coming soon".

## Your own domain
Once the domain is bought:
1. Add a file named `CNAME` at the root containing just the domain, e.g. `backyardpressclub.com`.
2. At the domain registrar, add four `A` records for the bare domain pointing to GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `CNAME` record
   for `www` pointing to `jon-goldman.github.io`.
3. In the repo, Settings → Pages → Custom domain, enter the domain, wait for the check, then tick "Enforce HTTPS".
All links on the site are relative, so nothing else needs to change.
