/**
 * Small interface strings (buttons, labels) that are part of the website's
 * "chrome" rather than its editable content. The main page text lives in the
 * CMS (src/content/site/*.json); these are the few fixed words around it.
 */

export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang: Lang = 'en';

export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'nav.menu': 'Menu',
    'lang.label': 'Language',
    'lang.switchTo': 'Ver en español',
    'blog.back': '← Back to all posts',
    'blog.all': 'Blog & Talks',
    'blog.readMore': 'Read more',
    'blog.empty': 'New articles and talks are on the way.',
    'blog.published': 'Published',
    'tag.article': 'Article',
    'tag.talk': 'Talk',
    'skip': 'Skip to content',
  },
  es: {
    'nav.menu': 'Menú',
    'lang.label': 'Idioma',
    'lang.switchTo': 'View in English',
    'blog.back': '← Volver a todas las publicaciones',
    'blog.all': 'Blog y Charlas',
    'blog.readMore': 'Leer más',
    'blog.empty': 'Nuevos artículos y charlas en camino.',
    'blog.published': 'Publicado',
    'tag.article': 'Artículo',
    'tag.talk': 'Charla',
    'skip': 'Saltar al contenido',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
