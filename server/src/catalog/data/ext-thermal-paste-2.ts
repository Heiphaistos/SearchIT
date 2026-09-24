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

const PCM = 'Pad à changement de phase';
const LM = 'Métal liquide';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Gelid ───────────────────────────────────────────────────────────────
  tp('Gelid', 'GC-Extreme (1 g)', { family: 'GC', cond: '8,5 W/mK', qty: '1 g', tags: ['gaming'] }),
  tp('Gelid', 'GC-Extreme (10 g)', { family: 'GC', cond: '8,5 W/mK', qty: '10 g', tags: ['gaming', 'pro'] }),
  tp('Gelid', 'GC-Gemini', { family: 'GC', tags: ['gaming', 'bureautique'] }),
  tp('Gelid', 'GC-3 (3,5 g)', { family: 'GC', qty: '3,5 g', tags: ['bureautique', 'budget'] }),
  ...['0,5', '1', '1,5', '2', '2,5', '3'].flatMap((t) => [
    tp('Gelid', `GP-Extreme 80 x 40 mm (${t} mm)`, { family: 'GP', type: PAD, cond: '12 W/mK', qty: `80 x 40 x ${t} mm`, tags: ['gaming'] }),
    tp('Gelid', `GP-Ultimate 90 x 50 mm (${t} mm)`, { family: 'GP', type: PAD, cond: '15 W/mK', qty: `90 x 50 x ${t} mm`, tags: ['gaming'] }),
  ]),
  ...['1', '1,5', '2'].flatMap((t) => [
    tp('Gelid', `GP-Extreme 120 x 120 mm (${t} mm)`, { family: 'GP', type: PAD, cond: '12 W/mK', qty: `120 x 120 x ${t} mm`, tags: ['gaming'] }),
    tp('Gelid', `GP-Ultimate 120 x 120 mm (${t} mm)`, { family: 'GP', type: PAD, cond: '15 W/mK', qty: `120 x 120 x ${t} mm`, tags: ['gaming'] }),
  ]),

  // ─── Cooler Master ───────────────────────────────────────────────────────
  tp('Cooler Master', 'MasterGel', { family: 'MasterGel', cond: '5 W/mK', tags: ['bureautique', 'budget'] }),
  tp('Cooler Master', 'MasterGel Pro', { family: 'MasterGel', cond: '8 W/mK', tags: ['gaming', 'bureautique'] }),
  tp('Cooler Master', 'MasterGel Pro V2', { family: 'MasterGel', tags: ['gaming', 'bureautique'] }),
  tp('Cooler Master', 'MasterGel Maker Nano', { family: 'MasterGel', cond: '11 W/mK', tags: ['gaming'] }),
  tp('Cooler Master', 'CryoFuze', { family: 'CryoFuze', year: 2019, cond: '14 W/mK', tags: ['gaming'] }),
  tp('Cooler Master', 'CryoFuze 5', { family: 'CryoFuze', tags: ['gaming'] }),
  tp('Cooler Master', 'CryoFuze Violet', { family: 'CryoFuze', tags: ['gaming'] }),
  tp('Cooler Master', 'IC Value V1', { family: 'IC', tags: ['bureautique', 'budget'] }),
  tp('Cooler Master', 'IC Essential E1', { family: 'IC', tags: ['bureautique', 'budget'] }),

  // ─── Corsair / be quiet! / EK / Prolimatech ──────────────────────────────
  tp('Corsair', 'TM30 (3 g)', { family: 'TM', qty: '3 g', tags: ['bureautique', 'budget'] }),
  tp('Corsair', 'XTM50 (5 g)', { family: 'XTM', year: 2019, cond: '5 W/mK', qty: '5 g', tags: ['gaming'] }),
  tp('Corsair', 'XTM70 (5 g)', { family: 'XTM', year: 2021, qty: '5 g', tags: ['gaming'] }),
  tp('be quiet!', 'DC1', { family: 'Thermal Grease', tags: ['bureautique', 'budget'] }),
  tp('be quiet!', 'DC2', { family: 'Thermal Grease', tags: ['gaming'] }),
  tp('EK', 'EK-TIM Ectotherm', { family: 'EK-TIM', tags: ['gaming'] }),
  tp('Prolimatech', 'PK-1 (5 g)', { family: 'PK', qty: '5 g', tags: ['gaming', 'bureautique'] }),
  tp('Prolimatech', 'PK-3 (5 g)', { family: 'PK', cond: '11,2 W/mK', qty: '5 g', tags: ['gaming'] }),

  // ─── Métal liquide ───────────────────────────────────────────────────────
  tp('Coollaboratory', 'Liquid Pro', { family: 'Liquid', type: LM, tags: ['gaming'] }),
  tp('Coollaboratory', 'Liquid Ultra', { family: 'Liquid', type: LM, tags: ['gaming'] }),
  tp('Coollaboratory', 'Liquid MetalPad', { family: 'Liquid', type: 'Pad métal liquide', tags: ['gaming'] }),
  tp('Thermalright', 'Silver King', { family: 'Silver King', type: LM, tags: ['gaming'] }),

  // ─── Thermalright ────────────────────────────────────────────────────────
  tp('Thermalright', 'TF7 (2 g)', { family: 'TF', cond: '12,8 W/mK', qty: '2 g', tags: ['gaming', 'budget'] }),
  tp('Thermalright', 'TF8 (2 g)', { family: 'TF', cond: '13,8 W/mK', qty: '2 g', tags: ['gaming', 'budget'] }),
  tp('Thermalright', 'TFX (2 g)', { family: 'TF', cond: '14,3 W/mK', qty: '2 g', tags: ['gaming'] }),
  tp('Thermalright', 'TFX (6,2 g)', { family: 'TF', cond: '14,3 W/mK', qty: '6,2 g', tags: ['gaming'] }),
  ...['0,5', '1', '1,5', '2'].map((t) =>
    tp('Thermalright', `Odyssey 85 x 45 mm (${t} mm)`, { family: 'Odyssey', type: PAD, cond: '12,8 W/mK', qty: `85 x 45 x ${t} mm`, tags: ['gaming', 'budget'] })),
  ...['1', '1,5', '2'].flatMap((t) => [
    tp('Thermalright', `Odyssey 120 x 120 mm (${t} mm)`, { family: 'Odyssey', type: PAD, cond: '12,8 W/mK', qty: `120 x 120 x ${t} mm`, tags: ['gaming', 'budget'] }),
    tp('Thermalright', `Extreme Odyssey 120 x 120 mm (${t} mm)`, { family: 'Odyssey', type: PAD, qty: `120 x 120 x ${t} mm`, tags: ['gaming'] }),
  ]),

  // ─── Changement de phase / mastic ────────────────────────────────────────
  tp('Honeywell', 'PTM7950 40 x 40 mm', { family: 'PTM', type: PCM, cond: '8,5 W/mK', qty: '40 x 40 x 0,25 mm', tags: ['gaming', 'budget'] }),
  tp('Honeywell', 'PTM7950 80 x 40 mm', { family: 'PTM', type: PCM, cond: '8,5 W/mK', qty: '80 x 40 x 0,25 mm', tags: ['gaming', 'budget'] }),
  tp('Upsiren', 'U6 Pro', { family: 'U6', type: 'Mastic thermique', tags: ['gaming', 'budget'] }),

  // ─── Autres pâtes ────────────────────────────────────────────────────────
  tp('Kingpin Cooling', 'KPx (1,5 g)', { family: 'KPx', qty: '1,5 g', tags: ['gaming'] }),
  tp('Kingpin Cooling', 'KPx (3 g)', { family: 'KPx', qty: '3 g', tags: ['gaming'] }),
  tp('Phobya', 'NanoGrease Extreme (3,5 g)', { family: 'NanoGrease', cond: '16 W/mK', qty: '3,5 g', tags: ['gaming'] }),
  tp('Alphacool', 'Apex', { family: 'Apex', year: 2023, cond: '17 W/mK', tags: ['gaming'] }),
  tp('Alphacool', 'Subzero (4 g)', { family: 'Subzero', cond: '16 W/mK', qty: '4 g', tags: ['gaming'] }),
  tp('Alphacool', 'Eisfrost', { family: 'Eisfrost', tags: ['gaming', 'bureautique'] }),
  ...['0,5', '1', '1,5', '2', '3'].map((t) =>
    tp('Alphacool', `Eisschicht Ultra Soft 100 x 100 mm (${t} mm)`, { family: 'Eisschicht', type: PAD, cond: '14 W/mK', qty: `100 x 100 x ${t} mm`, tags: ['gaming'] })),
  ...['0,5', '1', '1,5'].flatMap((t) => [
    tp('Fujipoly', `Ultra Extreme XR-m 60 x 50 mm (${t} mm)`, { family: 'Sarcon', type: PAD, cond: '17 W/mK', qty: `60 x 50 x ${t} mm`, tags: ['gaming', 'pro'] }),
    tp('Fujipoly', `Extreme XR-e 60 x 50 mm (${t} mm)`, { family: 'Sarcon', type: PAD, cond: '11 W/mK', qty: `60 x 50 x ${t} mm`, tags: ['gaming', 'pro'] }),
  ]),
  tp('Laird', 'Tflex HD90000', { family: 'Tflex', type: PAD, cond: '7,5 W/mK', tags: ['gaming', 'pro'] }),
  tp('Akasa', 'AK-450', { family: 'AK', tags: ['bureautique', 'budget'] }),
  tp('Akasa', 'AK-455', { family: 'AK', tags: ['bureautique', 'budget'] }),
  tp('Akasa', 'AK-460', { family: 'AK', tags: ['bureautique', 'budget'] }),
  tp('Zalman', 'ZM-STC7', { family: 'ZM-STC', tags: ['bureautique', 'budget'] }),
  tp('Zalman', 'ZM-STC8', { family: 'ZM-STC', tags: ['bureautique', 'budget'] }),
  tp('Zalman', 'ZM-STC9', { family: 'ZM-STC', tags: ['bureautique', 'budget'] }),
  tp('Zalman', 'ZM-STG2M', { family: 'ZM-STG', tags: ['bureautique', 'budget'] }),
  tp('Innovation Cooling', 'IC Diamond 7 Carat (1,5 g)', { family: 'IC Diamond', qty: '1,5 g', tags: ['gaming'] }),
  tp('Innovation Cooling', 'IC Diamond 24 Carat', { family: 'IC Diamond', tags: ['gaming'] }),
  tp('Deepcool', 'Z3', { family: 'Z', tags: ['bureautique', 'budget'] }),
  tp('Deepcool', 'Z5', { family: 'Z', tags: ['bureautique', 'budget'] }),
  tp('Deepcool', 'Z9', { family: 'Z', tags: ['gaming', 'budget'] }),
  tp('Deepcool', 'EX750', { family: 'EX', tags: ['gaming'] }),
  tp('Thermaltake', 'TG-7', { family: 'TG', tags: ['gaming', 'bureautique'] }),
  tp('ID-Cooling', 'Frost X25', { family: 'Frost', tags: ['gaming', 'budget'] }),
  tp('ID-Cooling', 'Frost X45', { family: 'Frost', tags: ['gaming', 'budget'] }),
];
