# Project instructions

## Git workflow
- Commit and push all changes directly to the `main` branch. Do not create feature branches or pull requests unless explicitly asked.

## Indexing
- This site must never be indexed by search engines.
- `vercel.json` sends `X-Robots-Tag: noindex, nofollow, noarchive` on every response. Keep it.
- Every HTML page must also include `<meta name="robots" content="noindex, nofollow">` in `<head>`.
- Do NOT add a `robots.txt` that disallows crawling: blocked crawlers can't see the noindex directives, so URLs could still be indexed from external links.
