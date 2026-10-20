import { useEffect } from 'react';

// Título y descripción de cada página (pestaña del navegador y resultado de Google).
// La vista previa al compartir (Open Graph) es una sola para todo el sitio y vive en index.html:
// WhatsApp y Facebook no ejecutan JavaScript.
export function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    document.title = title;
    const set = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    if (description) set('description', description);
    set('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://www.banqueando.co${window.location.pathname}`);
  }, [title, description, noindex]);
}
