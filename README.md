# Daniel Terblans — Resume Website

A simple, static resume site (HTML/CSS/JS, no build step, no dependencies) covering work experience,
education, and future plans.

## Structure

```
index.html
css/style.css
js/script.js
robots.txt
.nojekyll
```

## Run locally

No build tools needed. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Save — GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`.

The `.nojekyll` file tells GitHub Pages to skip Jekyll processing and serve the files as-is.

## Security notes

This site is 100% static with no server, no forms, and no third-party scripts or CDNs, which keeps
the attack surface small. A few extra things are baked in:

- A `Content-Security-Policy` meta tag restricts all scripts, styles, and connections to same-origin
  (`'self'`), blocks framing (`frame-ancestors 'none'`), and disallows form submission.
- No inline `on*` event handlers or inline `<script>`/`<style>` blocks — everything goes through the
  external `js/script.js` and `css/style.css` files, consistent with the CSP.
- No `innerHTML`/`eval`/`document.write` usage — all DOM updates use `textContent`/`createElement`.
- The contact email is assembled at runtime in JavaScript rather than sitting in the page source, as
  a mild deterrent against basic scraping.
- `X-Content-Type-Options: nosniff` is set via meta tag.

GitHub Pages doesn't let you set custom HTTP response headers, so the CSP and other protections are
applied via `<meta>` tags in `index.html`, which is the standard approach for static GitHub Pages
sites. If you later move to a host that supports custom headers (Netlify, Cloudflare Pages, etc.),
you can additionally set the equivalent headers server-side for stronger enforcement.

## Editing content

- Work experience: edit the `<section id="experience">` block in `index.html`.
- Education: edit the `<section id="education">` block.
- Future plans: edit the `<section id="future">` block.
- Colors/spacing: edit the CSS custom properties at the top of `css/style.css`.
