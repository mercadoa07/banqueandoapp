import { describe, it, expect } from 'vitest';
import cardsData from '../../config/cards.json';
import creditData from '../../config/creditProducts.json';
import { CARD_GUIDES, CREDIT_GUIDES, guideProducts, findGuide } from './guides.js';
import { annualFeeCost } from '../engine/finance.js';

describe('guías para Google', () => {
  it('cada guía muestra al menos un producto, todos activos', () => {
    for (const g of CARD_GUIDES) {
      const list = guideProducts(g, 'tarjetas', cardsData);
      expect(list.length, g.slug).toBeGreaterThan(0);
      list.forEach(p => expect(p.active).not.toBe(false));
    }
    for (const g of CREDIT_GUIDES) {
      const list = guideProducts(g, 'creditos', creditData);
      expect(list.length, g.slug).toBeGreaterThan(0);
      list.forEach(p => { expect(p.active).not.toBe(false); expect(p.lastVerified, p.id).toBeTruthy(); });
    }
  });

  it('las descripciones tienen un largo que Google muestra completo', () => {
    for (const g of [...CARD_GUIDES, ...CREDIT_GUIDES]) {
      expect(g.description.length, g.slug).toBeGreaterThan(70);
      expect(g.description.length, g.slug).toBeLessThanOrEqual(170);
    }
  });

  it('sin cuota de manejo pone primero las que no cobran y deja fuera las que no se pueden dejar en $0', () => {
    const list = guideProducts(findGuide('tarjetas', 'sin-cuota-de-manejo'), 'tarjetas', cardsData);
    expect(annualFeeCost(list[0])).toBe(0);
    expect(list.map(c => c.id)).not.toContain('latam_pass_platinum');
    expect(list.map(c => c.id)).not.toContain('amex_green');
  });

  it('para negocio informal no muestra productos que exigen formalidad', () => {
    const list = guideProducts(findGuide('creditos', 'para-negocio-informal'), 'creditos', creditData);
    list.forEach(p => expect(!p.fit.formalization || p.fit.formalization.includes('informal'), p.id).toBe(true));
  });
});

describe('enlaces a las guías', () => {
  it('el pie de página enlaza todas las guías', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const footer = fs.readFileSync(path.resolve(__dirname, '../components/Footer.jsx'), 'utf8');
    const { allGuidePaths } = await import('./guides.js');
    for (const p of allGuidePaths()) expect(footer.includes(`'${p}'`), p).toBe(true);
  });
});
