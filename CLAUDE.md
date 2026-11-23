# Project instructions

## Git workflow
- Commit and push all changes directly to the `main` branch. Do not create feature branches or pull requests unless explicitly asked.

## Indexing
- This site must never be indexed by search engines.
- `vercel.json` sends `X-Robots-Tag: noindex, nofollow, noarchive` on every response. Keep it.
- Every HTML page must also include `<meta name="robots" content="noindex, nofollow">` in `<head>`.
- Do NOT add a `robots.txt` that disallows crawling: blocked crawlers can't see the noindex directives, so URLs could still be indexed from external links.

## Site structure
- Static site, no build step. `index.html` (root) is an index of landing pages, with one card per page.
- Each landing page lives in its own folder as `<slug>/index.html` (e.g. `facelift/index.html` is served at `/facelift/`). Add a card to the root index for every new page.
- Shared assets: `assets/css/styles.css`, `assets/js/main.js`, `assets/img/`. Always reference them with root-absolute paths (`/assets/...`) so they work from any slug.
- Design system is shared with the main Dr Davide site (repo `OnlineMarketingForDoctors/constantino-davide`): navy #1A3350, brass #C6A27A, Figtree for text. Headlines on this page use Tenor Sans (the main site uses Bodoni Moda).
- Images are webp in `assets/img/` (`fl/` = generated for this page, `gen/` and `real/` = reused from the main site, `ba/` = facelift before and afters).
- Pricing is placeholder (marked with an HTML comment). The booking form is front end only and is not connected to a CRM yet.
- Copy rule: no em dashes.
