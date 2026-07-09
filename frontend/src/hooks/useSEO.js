import { useEffect } from 'react';

const BASE_URL = 'https://dalirium.art';
const DEFAULT_IMAGE = `${BASE_URL}/og.image.png`;
const SITE_NAME = 'Dalirium';

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.content = content;
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({ title, description, image, url, type = 'website' }) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedUrl = url ? `${BASE_URL}${url}` : BASE_URL;
    const resolvedDesc =
      description ||
      'Galería virtual exclusiva de obras de Salvador Dalí. Cuadros, litografías, medallas olímpicas, vajilla y colección privada.';

    document.title = fullTitle;
    setMeta('meta[name="description"]', resolvedDesc);
    setLink('canonical', resolvedUrl);

    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', resolvedDesc);
    setMeta('meta[property="og:image"]', resolvedImage);
    setMeta('meta[property="og:image:alt"]', fullTitle);
    setMeta('meta[property="og:url"]', resolvedUrl);
    setMeta('meta[property="og:type"]', type === 'artwork' ? 'article' : 'website');

    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', resolvedDesc);
    setMeta('meta[name="twitter:image"]', resolvedImage);
    setMeta('meta[name="twitter:image:alt"]', fullTitle);

    return () => {
      document.title = `${SITE_NAME} — Galería de Arte Salvador Dalí`;
      setMeta('meta[name="description"]', 'Galería virtual exclusiva de obras de Salvador Dalí. Cuadros, litografías, medallas olímpicas, vajilla y colección privada.');
      setLink('canonical', BASE_URL + '/');
      setMeta('meta[property="og:title"]', `${SITE_NAME} — Galería de Arte Salvador Dalí`);
      setMeta('meta[property="og:description"]', 'Galería virtual exclusiva de obras de Salvador Dalí. Arte surrealista auténtico.');
      setMeta('meta[property="og:image"]', DEFAULT_IMAGE);
      setMeta('meta[property="og:image:alt"]', `${SITE_NAME} — Galería de Arte Salvador Dalí`);
      setMeta('meta[property="og:url"]', BASE_URL + '/');
      setMeta('meta[property="og:type"]', 'website');
      setMeta('meta[name="twitter:title"]', `${SITE_NAME} — Galería de Arte Salvador Dalí`);
      setMeta('meta[name="twitter:description"]', 'Galería virtual exclusiva de obras de Salvador Dalí. Arte surrealista auténtico.');
      setMeta('meta[name="twitter:image"]', DEFAULT_IMAGE);
      setMeta('meta[name="twitter:image:alt"]', `${SITE_NAME} — Galería de Arte Salvador Dalí`);
    };
  }, [title, description, image, url, type]);
}
