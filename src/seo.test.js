// Lo que ven WhatsApp, Facebook y Google sin ejecutar JavaScript: etiquetas de index.html,
// imagen para compartir, mapa del sitio y robots.txt.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allGuidePaths } from './lib/guides.js';

const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const meta = (html, attr, key) => (html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`)) || [])[1];

describe('compartir y Google', () => {
  const html = read('index.html');

  it('index.html trae título, descripción y vista previa completa', () => {
    expect(html).toMatch(/<title>[^<]{10,70}<\/title>/);
    const description = meta(html, 'name', 'description');
    expect(description.length).toBeGreaterThan(70);
    expect(description.length).toBeLessThanOrEqual(170);
    expect(description).not.toMatch(/\bIA\b/);
    for (const key of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) expect(meta(html, 'property', key), key).toBeTruthy();
    expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image');
  });

  it('la imagen para compartir existe y mide 1200x630', () => {
    const url = meta(html, 'property', 'og:image');
    const file = path.join(root, 'public', new URL(url).pathname);
    const png = fs.readFileSync(file);
    expect(png.readUInt32BE(16)).toBe(1200); // ancho en la cabecera IHDR del PNG
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(300 * 1024); // WhatsApp no muestra imágenes muy pesadas
  });

  it('el mapa del sitio solo lista rutas que existen y robots.txt lo anuncia', () => {
    const app = read('src/App.jsx');
    const locs = [...read('public/sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
    expect(locs.length).toBeGreaterThan(3);
    const guides = allGuidePaths();
    for (const p of locs) expect(app.includes(`path="${p}"`) || guides.includes(p), p).toBe(true);
    for (const g of guides) expect(locs, `falta ${g} en el mapa del sitio`).toContain(g);
    expect(locs).not.toContain('/admin');
    const robots = read('public/robots.txt');
    expect(robots).toMatch(/Disallow: \/admin/);
    expect(robots).toMatch(/Sitemap: https:\/\/www\.banqueando\.co\/sitemap\.xml/);
  });
});
