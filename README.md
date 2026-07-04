# DokoDocs Website

The marketing site for [DokoDocs](https://github.com/dokodocs) — an
open-source, privacy-first document scanner. Plain HTML/CSS/JS, no build
step, no framework.

## Structure

```
index.html          Home page
privacy.html         Privacy policy
terms.html            Terms of use
404.html               Not-found page
css/styles.css          Brand stylesheet (see docs/BrandGuidelines.md)
js/main.js               Nav toggle, scroll-reveal, active-link highlighting
assets/                    Logo, icons, illustrations, store badges
docs/                        Source-of-truth brand & product docs (not deployed)
robots.txt, sitemap.xml       SEO
```

## Local development

No build tooling required — it's static HTML. Serve the folder with any
static file server, for example:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

or the VS Code "Live Server" extension.

## Before going live — placeholders to update

A few values are placeholders pending real accounts/domain (per
`docs/# DokoDocs Launch Kit.md`, Step 1):

- **Domain**: all canonical/OG URLs assume `https://dokodocs.com` — update
  every `<link rel="canonical">`, `og:*`/`twitter:*` meta tag, `robots.txt`,
  and `sitemap.xml` once the real domain is bought.
- **Social links**: GitHub/X/Instagram/LinkedIn URLs in the header, footer,
  and download section use the handles the launch kit recommends
  (`dokodocs`) — confirm each account was actually claimed before publishing.
- **Contact email**: `dokodocsnepal@gmail.com` is wired into
  `privacy.html`, `terms.html`, and the iOS notify form.
- **Download section**: both store badges are intentionally in a
  "coming soon" state — the app has no published Play Store or App Store
  listing yet (see `docs/github readme.txt`, status: MVP in development).
  Once Google Play publishes, link the Google Play badge directly to the
  listing URL and drop the "Coming soon" pill.

## Deploying to GitHub Pages

1. Push this folder to the repo (root, or a `gh-pages` branch/`docs/` folder
   per your preference).
2. Repo → **Settings → Pages** → set the source branch/folder.
3. If deploying as a **project site** (`username.github.io/reponame/`,
   not a custom domain at root), double-check `404.html`'s relative asset
   paths still resolve — GitHub Pages serves `404.html` for any unmatched
   path, and relative URLs resolve against the *requested* path, not the
   file's own location. Using a custom domain (see below) avoids this.
4. Optional custom domain: add a `CNAME` file containing just the domain
   (e.g. `dokodocs.com`), and point the domain's DNS at GitHub Pages per
   [GitHub's docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Deploying to Cloudflare Pages

1. Connect the repo in the Cloudflare Pages dashboard.
2. Build command: *(none)* — leave blank.
3. Build output directory: `/` (repo root).
4. Deploy. Add a custom domain under the project's **Custom domains** tab
   once the domain is bought.

## License

Apache 2.0, matching the main DokoDocs app — see
[LICENSE](https://www.apache.org/licenses/LICENSE-2.0).
