import type { CatalogProduct } from '../types.js';

type Opt = { family?: string; year?: number; msrp?: number; tags?: string[]; cond?: string; qty?: string; type?: string };

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/,/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tp(brand: string, model: string, o: Opt = {}): CatalogProduct {
  const name = `${brand} ${model}`;
  const specs: Record<string, string> = { 'Type': o.type ?? 'Pâte thermique' };
  if (o.cond) specs['Conductivité'] = o.cond;
  if (o.qty) specs['Contenance'] = o.qty;
  const p: CatalogProduct = {
    id: `thermal-paste-${slug(name)}`,
    category: 'thermal-paste',
    brand,
    name,
    specs,
    tags: o.tags ?? ['gaming', 'bureautique'],
  };
  if (o.family) p.family = o.family;
  if (o.year) p.year = o.year;
  if (o.msrp) p.msrp = o.msrp;
  return p;
}

const PAD = 'Pad thermique';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Arctic MX ───────────────────────────────────────────────────────────
  tp('Arctic', 'MX-2 (4 g)', { family: 'MX', qty: '4 g', msrp: 5, tags: ['bureautique', 'budget'] }),
  tp('Arctic', 'MX-2 (8 g)', { family: 'MX', qty: '8 g', msrp: 7, tags: ['bureautique', 'budget'] }),
  tp('Arctic', 'MX-2 (30 g)', { family: 'MX', qty: '30 g', tags: ['bureautique', 'budget', 'pro'] }),
  tp('Arctic', 'MX-2 (65 g)', { family: 'MX', qty: '65 g', tags: ['bureautique', 'budget', 'pro'] }),
  tp('Arctic', 'MX-4 (2 g)', { family: 'MX', year: 2019, cond: '8,5 W/mK', qty: '2 g', msrp: 5, tags: ['gaming', 'bureautique', 'budget'] }),
  tp('Arctic', 'MX-4 (8 g)', { family: 'MX', year: 2019, cond: '8,5 W/mK', qty: '8 g', msrp: 10, tags: ['gaming', 'bureautique', 'budget'] }),
  tp('Arctic', 'MX-4 (20 g)', { family: 'MX', year: 2019, cond: '8,5 W/mK', qty: '20 g', msrp: 18, tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Arctic', 'MX-4 (45 g)', { family: 'MX', year: 2019, cond: '8,5 W/mK', qty: '45 g', msrp: 35, tags: ['bureautique', 'pro'] }),
  tp('Arctic', 'MX-5 (4 g)', { family: 'MX', year: 2020, qty: '4 g', msrp: 8 }),
  tp('Arctic', 'MX-5 (8 g)', { family: 'MX', year: 2020, qty: '8 g', msrp: 12 }),
  tp('Arctic', 'MX-5 (20 g)', { family: 'MX', year: 2020, qty: '20 g', msrp: 22, tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Arctic', 'MX-5 (50 g)', { family: 'MX', year: 2020, qty: '50 g', tags: ['bureautique', 'pro'] }),
  tp('Arctic', 'MX-6 (2 g)', { family: 'MX', year: 2022, qty: '2 g', msrp: 6, tags: ['gaming', 'bureautique', 'budget'] }),
  tp('Arctic', 'MX-6 (8 g)', { family: 'MX', year: 2022, qty: '8 g', msrp: 12, tags: ['gaming', 'bureautique', 'budget'] }),
  tp('Arctic', 'MX-6 (20 g)', { family: 'MX', year: 2022, qty: '20 g', msrp: 22, tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Arctic', 'MX-7 (2 g)', { family: 'MX', year: 2025, qty: '2 g' }),
  tp('Arctic', 'MX-7 (8 g)', { family: 'MX', year: 2025, qty: '8 g' }),
  tp('Arctic', 'MX-7 (20 g)', { family: 'MX', year: 2025, qty: '20 g', tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Arctic', 'MX Cleaner (40 lingettes)', { family: 'MX', type: 'Kit de nettoyage', qty: '40 lingettes', tags: ['bureautique', 'budget'] }),

  // ─── Arctic TP pads ──────────────────────────────────────────────────────
  ...(['0,5', '1', '1,5'] as const).flatMap((t) => [
    tp('Arctic', `TP-2 50 x 50 mm (${t} mm)`, { family: 'TP', year: 2019, type: PAD, cond: '6 W/mK', qty: `50 x 50 x ${t} mm`, tags: ['gaming', 'budget'] }),
    tp('Arctic', `TP-2 145 x 145 mm (${t} mm)`, { family: 'TP', year: 2019, type: PAD, cond: '6 W/mK', qty: `145 x 145 x ${t} mm`, tags: ['gaming', 'budget'] }),
    tp('Arctic', `TP-3 100 x 100 mm (${t} mm)`, { family: 'TP', year: 2021, type: PAD, qty: `100 x 100 x ${t} mm`, tags: ['gaming'] }),
    tp('Arctic', `TP-3 200 x 100 mm (${t} mm)`, { family: 'TP', year: 2021, type: PAD, qty: `200 x 100 x ${t} mm`, tags: ['gaming'] }),
  ]),

  // ─── Arctic Silver ───────────────────────────────────────────────────────
  tp('Arctic Silver', '5 (3,5 g)', { family: 'Arctic Silver 5', qty: '3,5 g', tags: ['gaming', 'bureautique'] }),
  tp('Arctic Silver', '5 (12 g)', { family: 'Arctic Silver 5', qty: '12 g', tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Arctic Silver', 'Céramique 2 (2,7 g)', { family: 'Céramique', qty: '2,7 g', tags: ['bureautique', 'budget'] }),
  tp('Arctic Silver', 'Céramique 2 (25 g)', { family: 'Céramique', qty: '25 g', tags: ['bureautique', 'pro'] }),
  tp('Arctic Silver', 'Arctic Alumina (1,75 g)', { family: 'Alumina', qty: '1,75 g', tags: ['bureautique', 'budget'] }),
  tp('Arctic Silver', 'ArctiClean (kit 2 x 30 ml)', { family: 'ArctiClean', type: 'Kit de nettoyage', qty: '2 x 30 ml', tags: ['bureautique', 'pro'] }),

  // ─── Thermal Grizzly pâtes ───────────────────────────────────────────────
  tp('Thermal Grizzly', 'Kryonaut (5,55 g)', { family: 'Kryonaut', year: 2015, cond: '12,5 W/mK', qty: '5,55 g', msrp: 20, tags: ['gaming', 'creation'] }),
  tp('Thermal Grizzly', 'Kryonaut (11,1 g)', { family: 'Kryonaut', year: 2015, cond: '12,5 W/mK', qty: '11,1 g', msrp: 35, tags: ['gaming', 'creation'] }),
  tp('Thermal Grizzly', 'Kryonaut (37 g)', { family: 'Kryonaut', year: 2015, cond: '12,5 W/mK', qty: '37 g', tags: ['gaming', 'pro'] }),
  tp('Thermal Grizzly', 'Kryonaut Extreme (2 g)', { family: 'Kryonaut', year: 2020, cond: '14,2 W/mK', qty: '2 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'Kryonaut Extreme (6,6 g)', { family: 'Kryonaut', year: 2020, cond: '14,2 W/mK', qty: '6,6 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'Kryonaut Extreme (33,84 g)', { family: 'Kryonaut', year: 2020, cond: '14,2 W/mK', qty: '33,84 g', tags: ['gaming', 'pro'] }),
  ...['1 g', '3,9 g', '7,8 g', '26 g'].flatMap((q) => [
    tp('Thermal Grizzly', `Hydronaut (${q})`, { family: 'Hydronaut', cond: '11,8 W/mK', qty: q, tags: ['gaming', 'bureautique'] }),
    tp('Thermal Grizzly', `Aeronaut (${q})`, { family: 'Aeronaut', cond: '8,5 W/mK', qty: q, tags: ['gaming', 'bureautique', 'budget'] }),
  ]),
  tp('Thermal Grizzly', 'Duronaut (2 g)', { family: 'Duronaut', year: 2025, qty: '2 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'Duronaut (6 g)', { family: 'Duronaut', year: 2025, qty: '6 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'Conductonaut (5 g)', { family: 'Conductonaut', type: 'Métal liquide', cond: '73 W/mK', qty: '5 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'Conductonaut Extreme (1 g)', { family: 'Conductonaut', year: 2023, type: 'Métal liquide', qty: '1 g', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'TG Putty Pro', { family: 'TG Putty', year: 2024, type: 'Mastic thermique', tags: ['gaming'] }),
  tp('Thermal Grizzly', 'TG Putty Basic', { family: 'TG Putty', year: 2024, type: 'Mastic thermique', tags: ['gaming', 'budget'] }),
  tp('Thermal Grizzly', 'TG Putty Traditional', { family: 'TG Putty', year: 2024, type: 'Mastic thermique', tags: ['gaming'] }),

  // ─── Thermal Grizzly pads ────────────────────────────────────────────────
  ...['25 x 25', '31 x 25', '32 x 32', '38 x 38'].map((d) =>
    tp('Thermal Grizzly', `Carbonaut ${d} mm`, { family: 'Carbonaut', year: 2019, type: 'Pad thermique carbone', cond: '62,5 W/mK', qty: `${d} x 0,2 mm`, tags: ['gaming'] })),
  ...['33 x 33', '38 x 38', '50 x 50'].map((d) =>
    tp('Thermal Grizzly', `KryoSheet ${d} mm`, { family: 'KryoSheet', year: 2022, type: 'Pad thermique graphène', qty: `${d} mm`, tags: ['gaming'] })),
  ...['0,5', '1', '1,5', '2'].flatMap((t) => [
    tp('Thermal Grizzly', `Minus Pad 8 30 x 30 mm (${t} mm)`, { family: 'Minus Pad', type: PAD, cond: '8 W/mK', qty: `30 x 30 x ${t} mm`, tags: ['gaming'] }),
    tp('Thermal Grizzly', `Minus Pad 8 100 x 100 mm (${t} mm)`, { family: 'Minus Pad', type: PAD, cond: '8 W/mK', qty: `100 x 100 x ${t} mm`, tags: ['gaming'] }),
    tp('Thermal Grizzly', `Minus Pad 8 120 x 20 mm (${t} mm)`, { family: 'Minus Pad', type: PAD, cond: '8 W/mK', qty: `120 x 20 x ${t} mm`, tags: ['gaming'] }),
  ]),
  ...['0,5', '1', '1,5'].flatMap((t) => [
    tp('Thermal Grizzly', `Minus Pad Extreme 100 x 100 mm (${t} mm)`, { family: 'Minus Pad', type: PAD, cond: '14,2 W/mK', qty: `100 x 100 x ${t} mm`, tags: ['gaming'] }),
    tp('Thermal Grizzly', `Minus Pad Extreme 120 x 20 mm (${t} mm)`, { family: 'Minus Pad', type: PAD, cond: '14,2 W/mK', qty: `120 x 20 x ${t} mm`, tags: ['gaming'] }),
  ]),

  // ─── Noctua ──────────────────────────────────────────────────────────────
  tp('Noctua', 'NT-H1 (10 g)', { family: 'NT-H', qty: '10 g', msrp: 20, tags: ['gaming', 'bureautique', 'pro'] }),
  tp('Noctua', 'NT-H2 (10 g)', { family: 'NT-H', year: 2020, qty: '10 g', msrp: 25, tags: ['gaming', 'pro'] }),
  tp('Noctua', 'NA-CW1 (lingettes de nettoyage)', { family: 'NA', type: 'Kit de nettoyage', tags: ['bureautique'] }),
];
