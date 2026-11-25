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
- `thank-you/index.html` (`/thank-you/`) is the shared page users are redirected to after submitting a form. The redirect is set in the LeadConnector form settings, not in this repo.
- Shared assets: `assets/css/styles.css`, `assets/js/main.js`, `assets/img/`. Always reference them with root-absolute paths (`/assets/...`) so they work from any slug.
- Design system is shared with the main Dr Davide site (repo `OnlineMarketingForDoctors/constantino-davide`): navy #1A3350, brass #C6A27A, Figtree for text. Headlines on this page use Tenor Sans (the main site uses Bodoni Moda).
- Images are webp in `assets/img/` (`fl/` = generated for this page, `gen/` and `real/` = reused from the main site, `ba/` = facelift before and afters).
- Pricing (confirmed by the client): facelift from £10,500 and facelift plus neck lift from £13,000, both including an overnight stay. The booking form is a LeadConnector (GoHighLevel) iframe embed, form ID `Lp9l7e4aHfZ1Xum5ykQl`; `form_embed.js` sizes the iframe to its content.
- Reviews carousel (facelift page, below the hero): real Google and RealSelf reviews, copied word for word from the client's screenshots. The card list is written twice in the HTML so the marquee loops; edit both copies. RealSelf logo: `assets/img/reviews/realself.webp`.
- Google tag (GTM-M39T7P9V) sits immediately after `<head>` on every page. Add it to every new page, once only.
- Copy rule: no em dashes.
