import type { Lang } from './locales.js';
import { translations } from './locales.js';

const STORAGE_KEY = 'founders-lang';
const DEFAULT_LANG: Lang = 'pt';
const VALID_LANGS: Lang[] = ['pt', 'en', 'de', 'es'];

const LANG_HTML: Record<Lang, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
};

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (VALID_LANGS.includes(stored as Lang)) return stored as Lang;
  } catch {
    /* ignore — private browsing may block localStorage */
  }
  return DEFAULT_LANG;
}

function setHtmlLang(lang: Lang) {
  document.documentElement.lang = LANG_HTML[lang];
}

// Keys whose values contain HTML and should be set via innerHTML.
const HTML_KEYS = new Set(['hero.title', 'tech.title']);

function applyTranslations(lang: Lang) {
  const dict = translations[lang];
  const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
  for (const el of elements) {
    const key = el.getAttribute('data-i18n');
    if (!key) continue;
    const value = dict[key];
    if (value === undefined) continue;
    const attr = el.getAttribute('data-i18n-attr');
    if (attr) {
      el.setAttribute(attr, value);
    } else if (HTML_KEYS.has(key)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }
}

function updateActiveButton(activeLang: Lang) {
  const buttons = document.querySelectorAll<HTMLElement>('[data-lang]');
  for (const btn of buttons) {
    const isActive = btn.getAttribute('data-lang') === activeLang;
    btn.setAttribute('aria-pressed', String(isActive));
  }
}

export function initI18n() {
  const lang = getStoredLang();
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  setHtmlLang(lang);
  applyTranslations(lang);
  updateActiveButton(lang);

  const buttons = document.querySelectorAll<HTMLElement>('[data-lang]');
  for (const btn of buttons) {
    btn.addEventListener('click', () => {
      const clicked = btn.getAttribute('data-lang') as Lang | null;
      if (!clicked) return;
      try {
        localStorage.setItem(STORAGE_KEY, clicked);
      } catch {
        /* ignore */
      }
      setHtmlLang(clicked);
      applyTranslations(clicked);
      updateActiveButton(clicked);
    });
  }
}
