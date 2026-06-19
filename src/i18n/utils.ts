import { ui, defaultLang, type Lang, type UIKey } from './ui';

/** Read the active language ("en" / "es") from the URL path. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang === 'en' || maybeLang === 'es') return maybeLang;
  return defaultLang;
}

/** Returns a translation helper t('key') bound to a language. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** The "other" language (used by the language toggle). */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

/** Format a date in a locale-aware, friendly way. */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Split a plain-text block into paragraphs. Maru types her text with a line
 * break between paragraphs in the dashboard; this turns that into <p> tags.
 */
export function toParagraphs(text: string | undefined | null): string[] {
  return (text ?? '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Take a blog entry id like "en/flowing-with-life" and return its language. */
export function langFromBlogId(id: string): Lang {
  return id.startsWith('es/') ? 'es' : 'en';
}

/** Take a blog entry id like "en/flowing-with-life" and return just the slug. */
export function slugFromBlogId(id: string): string {
  return id.split('/').slice(1).join('/');
}
