import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * CONTENT MODEL
 * -------------
 * All of the website's words and images live in plain data files that the
 * Decap CMS dashboard edits for Maru. The UI components never hard-code text.
 *
 *  - "site"  -> one JSON file per language (src/content/site/en.json, es.json)
 *              holds the homepage text (story, projects, courses, contact...).
 *  - "blog"  -> one Markdown file per post, grouped by language folder
 *              (src/content/blog/en/*.md, src/content/blog/es/*.md).
 */

const projectItem = z.object({
  kicker: z.string().default(''),
  title: z.string(),
  body: z.string().default(''),
  pills: z.array(z.string()).default([]),
});

const courseItem = z.object({
  kicker: z.string().default(''),
  title: z.string(),
  body: z.string().default(''),
});

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.object({
    seo: z.object({
      title: z.string(),
      description: z.string().default(''),
    }),
    hero: z.object({
      eyebrow: z.string().default(''),
      title: z.string(),
      tagline: z.string().default(''),
      cta: z.string().default(''),
    }),
    story: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      portraitImage: z.string().optional().default(''),
      portraitBadge: z.string().default(''),
      signature: z.string().optional().default(''),
      body: z.string().default(''),
    }),
    projects: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      items: z.array(projectItem).default([]),
    }),
    courses: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      items: z.array(courseItem).default([]),
      showComingSoon: z.boolean().default(false),
      comingSoonTitle: z.string().default(''),
      comingSoonBody: z.string().default(''),
    }),
    blog: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      readMore: z.string().default('Read more'),
    }),
    contact: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      lead: z.string().default(''),
      email: z.string().default(''),
      instagram: z.string().optional().default(''),
      facebook: z.string().optional().default(''),
      linkedin: z.string().optional().default(''),
    }),
    footer: z.object({
      tagline: z.string().default(''),
    }),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.enum(['article', 'talk']).default('article'),
    summary: z.string().default(''),
    coverImage: z.string().optional().default(''),
    // Use the same value on the English and Spanish version of a post to link
    // them, so the language toggle jumps to the right translation.
    translationKey: z.string().optional(),
  }),
});

export const collections = { site, blog };
