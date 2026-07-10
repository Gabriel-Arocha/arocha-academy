# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Arocha Academy** — a bilingual (English / Spanish) marketing + blog website for
Maru Arocha, a life coach & mentor. It is built so a **non-technical owner** can edit
every word, image, and blog post from a friendly dashboard, with no code or manual deploys.

- **Framework:** Astro 5, static output (`output: 'static'`), zero JS shipped by default.
- **CMS:** Decap CMS at `/admin` (Git-based), Spanish-language dashboard UI.
- **Auth (editor):** Netlify Identity + Git Gateway.
- **Hosting:** Netlify — auto-rebuilds `dist/` on every commit the CMS pushes.
- **i18n:** `/en/` and `/es/` routes; bare `/` redirects to `/en/`.
- **Styling:** hand-written CSS ported from `prototype-reference.html`.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321  (visit /en/ or /es/)
npm run build     # static output -> dist/
npm run preview   # preview the production build

# Optional: test the CMS dashboard locally (config.yml has local_backend: true)
npx decap-server  # terminal 1, then `npm run dev` in terminal 2, open /admin/
```

There is no test suite and no linter configured. `npm run build` is the main
correctness check — it validates content against the schemas in `content.config.ts`.

## Core architecture — content is fully separated from UI

The Astro components contain **no hard-coded page text**. All editable words/images
live in data files that Decap CMS commits:

```
src/content/
  site/en.json, es.json     # homepage text (hero, story, projects, courses, contact, footer)
  blog/en/*.md, blog/es/*.md # blog posts & talks, one Markdown file per post per language
```

- `src/content.config.ts` — Zod schemas validating both collections (`site`, `blog`).
- `public/admin/config.yml` — the CMS field definitions. **Must stay in sync** with the
  JSON shape and the schema: fields exist twice, under `home_en` and `home_es`.
- `src/i18n/ui.ts` — the few fixed "chrome" strings (nav, buttons); NOT editable in the CMS.
- `src/i18n/utils.ts` — language detection from URL, date formatting, `toParagraphs`
  (blank-line-separated text -> `<p>` tags), blog-id helpers.
- `src/layouts/BaseLayout.astro` — `<head>`, fonts, Netlify Identity widget, and the
  client-side password gate. Renders `Header` + `<slot>` + `Footer`.
- `src/components/` — `Hero`, `Story`, `Projects`, `Courses`, `BlogTalks`, `Contact`,
  `Header`, `Footer`. These receive content as props and render it.
- `src/pages/[lang]/index.astro` — homepage; `[lang]/blog/index.astro` + `[slug].astro` — blog.

## Things to know before editing

- **Adding an editable homepage section requires 4 coordinated edits:** (1) the field in
  both `src/content/site/en.json` and `es.json`, (2) the Zod schema in `content.config.ts`,
  (3) rendering in a `src/components/` file, (4) matching fields under **both** `home_en`
  and `home_es` in `public/admin/config.yml`. Skipping any one breaks the build or the CMS.
- **Linking translations:** give an EN post and its ES post the same `translationKey`
  frontmatter value so the language toggle jumps to the translation.
- **Theme tokens** (colors, fonts) are CSS variables at the top of `src/styles/global.css`.
- **Password gate:** `BaseLayout.astro` + `src/pages/password.astro` gate the whole site
  behind a client-side password (`localStorage` flag). This is a lightweight pre-launch
  cover, **not real security** — the password is in client JS. `/admin` and `/password`
  are exempt. Remove the gate script when the site goes public.
- `SITE_URL` in `astro.config.mjs` is only used for SEO/sitemaps; update it at launch.

## Audience-specific docs (do not overwrite)

- `README.md` — full developer setup + Netlify/Identity deployment steps.
- `MOM_INSTRUCTIONS.md` — plain-language guide for Maru (the non-technical editor).
  Keep it jargon-free (EN + ES).
