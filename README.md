# Arocha Academy

Bilingual (English / Spanish) website for **Maru Arocha**, life coach & mentor.

Built so a **non-technical owner** can edit all text, images, and blog posts from a
friendly dashboard — no code, no IDE, no deploys by hand.

| | |
|---|---|
| **Framework** | [Astro 5](https://astro.build) (static output, zero JS shipped by default) |
| **CMS** | [Decap CMS](https://decapcms.org) (free, open-source, Git-based) at `/admin` |
| **Auth** | Netlify Identity + Git Gateway (email/password login for the editor) |
| **Hosting** | Netlify (static `dist/`, auto-rebuild on every saved edit) |
| **i18n** | `/en/` and `/es/` routes; `/` redirects to `/en/` |
| **Styling** | Hand-written CSS ported from the original design prototype (`prototype-reference.html`) |

> The end-user guide for Maru is in **[`MOM_INSTRUCTIONS.md`](./MOM_INSTRUCTIONS.md)**
> (written in plain language, English + Spanish). Give her that file — not this one.

---

## How it works (the important idea)

**Content is fully separated from the UI.** The Astro components contain *no* text.
All words and images live in data files that Decap CMS edits:

```
src/content/
  site/
    en.json          ← English homepage text (Hero, Story, Projects, Courses, Contact…)
    es.json          ← Spanish homepage text
  blog/
    en/*.md          ← English blog posts & talks
    es/*.md          ← Spanish blog posts & talks
```

When Maru clicks **Publish** in the dashboard, Decap commits the changed file to the
Git repo. Netlify sees the commit, rebuilds the site, and it's live in ~1–2 minutes.

---

## Local development

```bash
npm install
npm run dev            # http://localhost:4321  (visit /en/ or /es/)
npm run build          # outputs static site to dist/
npm run preview        # preview the production build locally
```

### Previewing the CMS dashboard locally (optional)

`config.yml` has `local_backend: true`, so you can test the admin UI without Netlify:

```bash
# Terminal 1
npx decap-server
# Terminal 2
npm run dev
# Then open http://localhost:4321/admin/  (no login needed in local mode)
```

---

## Deploying to Netlify (one-time setup)

### 1. Put the project on GitHub
Create a new GitHub repository and push this folder to it (branch: `main`).

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<you>/arocha-academy.git
git push -u origin main
```

### 2. Create the Netlify site
1. Log in to [Netlify](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Connect GitHub and pick the repo.
3. Build settings are auto-detected from `netlify.toml` (build: `npm run build`,
   publish: `dist`). Click **Deploy**.

### 3. Turn on logins for the editor (Netlify Identity + Git Gateway)
This is what lets Maru log in with just an email and password.

1. In your site → **Integrations / Identity** → **Enable Identity**.
   *(On newer Netlify UIs this may appear as a setup card; enable it.)*
2. Identity → **Registration preferences** → set to **Invite only**
   (so only people you invite can log in).
3. Identity → **Services → Git Gateway** → **Enable Git Gateway**.
   This grants the dashboard permission to save changes to your GitHub repo.

### 4. Invite Maru
1. Identity → **Invite users** → enter her email address.
2. She receives an email, clicks the link, sets a password, and is sent to `/admin`.
   (The redirect is already wired up in `BaseLayout.astro`.)

That's it. She now edits at `https://<your-site>/admin`.

### 5. Custom domain (optional)
Add `arochaacademy.com` under **Domain management** in Netlify, then update:
- `SITE_URL` in [`astro.config.mjs`](./astro.config.mjs) (used for SEO/sitemaps), and
- the address line at the top of [`MOM_INSTRUCTIONS.md`](./MOM_INSTRUCTIONS.md).

---

## Project structure

```
.
├─ public/
│  ├─ admin/
│  │  ├─ index.html         # Decap CMS + Netlify Identity loader
│  │  └─ config.yml         # CMS collections & fields (bilingual, Spanish UI)
│  ├─ uploads/              # images uploaded from the dashboard land here
│  └─ favicon.svg
├─ src/
│  ├─ content/              # all editable content (see "How it works")
│  ├─ content.config.ts     # content collection schemas (validation)
│  ├─ i18n/
│  │  ├─ ui.ts              # fixed interface strings (buttons, labels)
│  │  └─ utils.ts           # language helpers, date/paragraph formatting
│  ├─ layouts/BaseLayout.astro
│  ├─ components/           # Header, Footer, Hero, Story, Projects, Courses, BlogTalks, Contact
│  └─ pages/
│     ├─ [lang]/index.astro            # homepage  → /en/, /es/
│     └─ [lang]/blog/index.astro       # blog list → /en/blog, /es/blog
│        └─ [slug].astro               # blog post → /en/blog/…, /es/blog/…
├─ astro.config.mjs         # i18n, sitemap, root redirect
├─ netlify.toml             # build command + publish dir
├─ MOM_INSTRUCTIONS.md      # give this to Maru
└─ prototype-reference.html # the original single-file design (kept for reference)
```

---

## Common "how do I…" notes

**Add a new editable section to the homepage**
1. Add the field(s) to `src/content/site/en.json` and `es.json`.
2. Add them to the schema in `src/content.config.ts`.
3. Render them in a component under `src/components/`.
4. Add matching fields under **both** `home_en` and `home_es` in `public/admin/config.yml`.

**Link an EN post to its ES translation** — give both files the same `translationKey`
in their frontmatter. The language toggle on a post then jumps to its translation
(otherwise it falls back to that language's blog index).

**Paragraphs** — in the JSON text fields (story, project/course descriptions), a line
break starts a new paragraph. The blog post body is full Markdown.

**Colors / fonts** — all theme tokens are CSS variables at the top of
`src/styles/global.css`. Change them there to restyle the whole site.

---

## Notes & alternatives

- **Netlify Identity** is in maintenance mode but fully functional and remains the
  simplest *email/password* login for a non-technical editor. If you'd rather avoid
  it, Decap also supports a **GitHub backend** (the editor logs in with a GitHub
  account) — swap the `backend:` block in `config.yml` accordingly.
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** is a modern, faster
  drop-in replacement for Decap that reads the *same* `config.yml`. If you ever want
  a snappier dashboard, you can switch the script tag in `public/admin/index.html`
  with no other changes.
- To give Maru a Draft → Publish review step, add `publish_mode: editorial_workflow`
  to `config.yml`. It was intentionally left off to keep her flow as simple as
  possible (edit → Publish → live).

Generated with [Claude Code](https://claude.com/claude-code)
