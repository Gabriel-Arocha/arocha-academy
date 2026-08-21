# Arocha Academy

Bilingual (English / Spanish) website for a life coach & mentor.

Built so a **non-technical owner** can edit all text, images, and blog posts from a
friendly dashboard — no code, no IDE, no deploys by hand.

| | |
|---|---|
| **Framework** | [Astro 5](https://astro.build) (static output, zero JS shipped by default) |
| **CMS** | [Decap CMS](https://decapcms.org) (free, open-source, Git-based) at `/admin` |
| **Auth** | Decap CMS GitHub backend (editor logs in with a GitHub account) |
| **Hosting** | Netlify (static `dist/`, auto-rebuild on every saved edit) |
| **i18n** | `/en/` and `/es/` routes; `/` redirects to `/en/` |
| **Styling** | Hand-written CSS ported from the original design prototype (`prototype-reference.html`) |

> The end-user guide is in **[`INSTRUCTIONS.md`](./INSTRUCTIONS.md)**

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
git remote add origin https://github.com/Gabriel-Arocha/arocha-academy.git
git push -u origin main
```

### 2. Create the Netlify site
1. Log in to [Netlify](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Connect GitHub and pick the repo.
3. Build settings are auto-detected from `netlify.toml` (build: `npm run build`,
   publish: `dist`). Click **Deploy**.

### 3. Turn on logins for the editor (GitHub OAuth)
Netlify Identity is no longer offered on new sites, so the CMS authenticates editors
via GitHub instead of email/password.

1. On GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Homepage URL: your Netlify site URL (e.g. `https://arochaacademy.netlify.app`)
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Register the app, then generate a **Client secret**. Copy the Client ID + secret.
2. In Netlify: **Site configuration → Access & security → OAuth** → **Install provider**
   → **GitHub** → paste in the Client ID and secret.
3. `public/admin/config.yml` already points `backend.name` to `github` with this repo —
   no further config changes needed.

### 4. Give the editor access
1. Add her as a **collaborator** on the GitHub repo: **Settings → Collaborators →
   Add people**, enter her GitHub username/email, and give her **Write** access.
2. She accepts the collaborator invite (from email or her GitHub notifications).
3. She goes to `/admin`, clicks **"Log in with GitHub"**, and signs in with her own
   GitHub account.

That's it. She now edits at `https://arochaacademy.netlify.app/admin`.

### 5. Custom domain (optional)
Add `arochaacademy.com` under **Domain management** in Netlify, then update:
- `SITE_URL` in [`astro.config.mjs`](./astro.config.mjs) (used for SEO/sitemaps), and
- the address line at the top of [`INSTRUCTIONS.md`](./INSTRUCTIONS.md).

---

## Project structure

```
.
├─ public/
│  ├─ admin/
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
├─ INSTRUCTIONS.md          # give this to the editor
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

**Paragraphs**: in the JSON text fields (story, project/course descriptions), a line
break starts a new paragraph. The blog post body is full Markdown.

**Colors / fonts**: all theme tokens are CSS variables at the top of
`src/styles/global.css`. Change them there to restyle the whole site.

---

## Notes & alternatives

- This project uses Decap's **GitHub backend** for login, since Netlify Identity is
  no longer offered on new sites. The editor needs her own GitHub account added as a
  repo collaborator (see step 4 above) — a little less "zero-setup" than email/password,
  but it needs no extra services and keeps the site fully static.
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** is a modern, faster
  drop-in replacement for Decap that reads the *same* `config.yml`. If you ever want
  a snappier dashboard, you can switch the script tag in `public/admin/index.html`
  with no other changes.
- To give Maru a Draft → Publish review step, add `publish_mode: editorial_workflow`
  to `config.yml`. It was intentionally left off to keep her flow as simple as
  possible (edit → Publish → live).

Enhanced with [Claude Code](https://claude.com/claude-code)
