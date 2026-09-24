import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « refroidissement » : ventirads Noctua, Thermalright, be quiet!, Scythe
 * et leurs watercoolings AIO. Clé de spec omise quand la valeur n'est pas certaine.
 */

type Opt = { h?: number; tdp?: number; sockets?: string; tags?: string[]; msrp?: number; refurb?: boolean };

const ft = (n: number) => (n === 120 ? '1 x 120 mm' : n === 140 ? '1 x 140 mm' : n === 240 ? '2 x 120 mm' : n === 280 ? '2 x 140 mm' : n === 360 ? '3 x 120 mm' : n === 420 ? '3 x 140 mm' : `${n} mm`);

function air(id: string, brand: string, name: string, family: string, year: number | undefined, type: string, size: string, fans: string, o: Opt = {}): CatalogProduct {
  const specs: Record<string, string | number> = { 'Type': type, 'Taille': size };
  if (o.tdp) specs['TDP supporté'] = `${o.tdp} W`;
  if (o.h) specs['Hauteur'] = `${o.h} mm`;
  specs['Ventilateurs'] = fans;
  if (o.sockets) specs['Sockets'] = o.sockets;
  const p: CatalogProduct = { id: `cooling-${id}`, category: 'cooling', brand, name, family, specs, refurbishable: o.refurb ?? (year === undefined || year <= 2022), tags: o.tags ?? ['gaming'] };
  if (year) p.year = year;
  if (o.msrp) p.msrp = o.msrp;
  return p;
}

function aio(id: string, brand: string, name: string, family: string, year: number | undefined, rad: number, o: Opt = {}): CatalogProduct {
  const specs: Record<string, string | number> = { 'Type': 'Watercooling AIO', 'Taille': `Radiateur ${rad} mm` };
  if (o.tdp) specs['TDP supporté'] = `${o.tdp} W`;
  specs['Ventilateurs'] = ft(rad);
  if (o.sockets) specs['Sockets'] = o.sockets;
  const p: CatalogProduct = { id: `cooling-${id}`, category: 'cooling', brand, name, family, specs, refurbishable: o.refurb ?? (year === undefined || year <= 2022), tags: o.tags ?? ['gaming'] };
  if (year) p.year = year;
  if (o.msrp) p.msrp = o.msrp;
  return p;
}

const T = 'Ventirad tour';
const DT = 'Ventirad double tour';
const LP = 'Ventirad low-profile';
const TD = 'Ventirad top-flow';
const SRV = ['serveur', 'homelab', 'pro'];
const HTPC = ['bureautique', 'homelab'];
const NOC = 'Noctua';
const TR = 'Thermalright';
const BQ = 'be quiet!';
const SC = 'Scythe';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Noctua ───────────────────────────────────────────────────────────────
  air('noctua-nh-d15s', NOC, 'Noctua NH-D15S', 'NH-D15', 2016, DT, '140 mm', '1 x NF-A15 PWM', { h: 160, msrp: 89 }),
  air('noctua-nh-d15-chromax-black', NOC, 'Noctua NH-D15 chromax.black', 'NH-D15', 2019, DT, '2 x 140 mm', '2 x NF-A15 HS-PWM chromax.black', { h: 165, msrp: 109 }),
  air('noctua-nh-d15s-chromax-black', NOC, 'Noctua NH-D15S chromax.black', 'NH-D15', 2021, DT, '140 mm', '1 x NF-A15 HS-PWM chromax.black', { h: 160, msrp: 99 }),
  air('noctua-nh-d15-se-am4', NOC, 'Noctua NH-D15 SE-AM4', 'NH-D15', 2017, DT, '2 x 140 mm', '2 x NF-A15 PWM', { h: 165, sockets: 'AM4' }),
  air('noctua-nh-d15-g2-lbc', NOC, 'Noctua NH-D15 G2 LBC', 'NH-D15', 2024, DT, '2 x 140 mm', '2 x NF-A14x25r G2 PWM', { h: 168, msrp: 149 }),
  air('noctua-nh-d15-g2-hbc', NOC, 'Noctua NH-D15 G2 HBC', 'NH-D15', 2024, DT, '2 x 140 mm', '2 x NF-A14x25r G2 PWM', { h: 168, msrp: 149 }),
  air('noctua-nh-d14', NOC, 'Noctua NH-D14', 'NH-D14', undefined, DT, '140 mm + 120 mm', '1 x NF-P14, 1 x NF-P12', { h: 160 }),
  air('noctua-nh-u12s', NOC, 'Noctua NH-U12S', 'NH-U12', 2013, T, '120 mm', '1 x NF-F12 PWM', { h: 158, msrp: 59 }),
  air('noctua-nh-u12s-chromax-black', NOC, 'Noctua NH-U12S chromax.black', 'NH-U12', 2020, T, '120 mm', '1 x NF-F12 PWM chromax.black', { h: 158, msrp: 69 }),
  air('noctua-nh-u12s-redux', NOC, 'Noctua NH-U12S redux', 'NH-U12', 2020, T, '120 mm', '1 x NF-P12 redux-1700 PWM', { h: 158, msrp: 49, tags: ['gaming', 'budget'] }),
  air('noctua-nh-u12s-se-am4', NOC, 'Noctua NH-U12S SE-AM4', 'NH-U12', 2017, T, '120 mm', '1 x NF-F12 PWM', { h: 158, sockets: 'AM4' }),
  air('noctua-nh-u12s-tr4-sp3', NOC, 'Noctua NH-U12S TR4-SP3', 'NH-U12', 2017, T, '120 mm', '1 x NF-F12 PWM', { h: 158, sockets: 'TR4, sTRX4, SP3', tags: ['creation', 'serveur', 'pro'] }),
  air('noctua-nh-u12s-dx-3647', NOC, 'Noctua NH-U12S DX-3647', 'NH-U12', 2017, T, '120 mm', '1 x NF-F12 PWM', { h: 158, sockets: 'LGA3647', tags: SRV }),
  air('noctua-nh-u12a-chromax-black', NOC, 'Noctua NH-U12A chromax.black', 'NH-U12', 2022, T, '120 mm', '2 x NF-A12x25 HS-PWM chromax.black', { h: 158, msrp: 139 }),
  air('noctua-nh-u14s', NOC, 'Noctua NH-U14S', 'NH-U14', 2013, T, '140 mm', '1 x NF-A15 PWM', { h: 165, msrp: 79 }),
  air('noctua-nh-u14s-tr4-sp3', NOC, 'Noctua NH-U14S TR4-SP3', 'NH-U14', 2017, T, '140 mm', '1 x NF-A15 PWM', { h: 165, sockets: 'TR4, sTRX4, SP3', tags: ['creation', 'serveur', 'pro'] }),
  air('noctua-nh-u14s-tr5-sp6', NOC, 'Noctua NH-U14S TR5-SP6', 'NH-U14', 2023, T, '140 mm', '1 x NF-A15 PWM', { h: 165, sockets: 'sTR5, SP6', tags: ['creation', 'serveur', 'pro'] }),
  air('noctua-nh-u14s-dx-3647', NOC, 'Noctua NH-U14S DX-3647', 'NH-U14', 2017, T, '140 mm', '1 x NF-A15 PWM', { h: 165, sockets: 'LGA3647', tags: SRV }),
  air('noctua-nh-u9s-chromax-black', NOC, 'Noctua NH-U9S chromax.black', 'NH-U9', 2021, T, '92 mm', '1 x NF-A9 PWM chromax.black', { h: 125 }),
  air('noctua-nh-u9-tr4-sp3', NOC, 'Noctua NH-U9 TR4-SP3', 'NH-U9', 2017, T, '92 mm', '2 x NF-A9 PWM', { sockets: 'TR4, sTRX4, SP3', tags: SRV }),
  air('noctua-nh-u9-dx-3647', NOC, 'Noctua NH-U9 DX-3647', 'NH-U9', 2017, T, '92 mm', '2 x NF-A9 PWM', { sockets: 'LGA3647', tags: SRV }),
  air('noctua-nh-d9l', NOC, 'Noctua NH-D9L', 'NH-D9', 2015, DT, '92 mm', '1 x NF-A9 PWM', { h: 110, tags: HTPC }),
  air('noctua-nh-d9l-chromax-black', NOC, 'Noctua NH-D9L chromax.black', 'NH-D9', 2022, DT, '92 mm', '1 x NF-A9 PWM chromax.black', { h: 110, tags: HTPC }),
  air('noctua-nh-d9-tr4-sp3', NOC, 'Noctua NH-D9 TR4-SP3', 'NH-D9', 2017, DT, '92 mm', '2 x NF-A9 PWM', { sockets: 'TR4, sTRX4, SP3', tags: SRV }),
  air('noctua-nh-d9-dx-3647-4u', NOC, 'Noctua NH-D9 DX-3647 4U', 'NH-D9', 2017, DT, '92 mm', '2 x NF-A9 PWM', { sockets: 'LGA3647', tags: SRV }),
  air('noctua-nh-l9i', NOC, 'Noctua NH-L9i', 'NH-L9', 2012, LP, '92 mm', '1 x NF-A9x14 PWM', { h: 37, tags: HTPC }),
  air('noctua-nh-l9i-chromax-black', NOC, 'Noctua NH-L9i chromax.black', 'NH-L9', 2020, LP, '92 mm', '1 x NF-A9x14 HS-PWM chromax.black', { h: 37, tags: HTPC }),
  air('noctua-nh-l9i-17xx', NOC, 'Noctua NH-L9i-17xx', 'NH-L9', 2021, LP, '92 mm', '1 x NF-A9x14 PWM', { h: 37, sockets: 'LGA1700, LGA1851', tags: HTPC }),
  air('noctua-nh-l9i-17xx-chromax-black', NOC, 'Noctua NH-L9i-17xx chromax.black', 'NH-L9', 2021, LP, '92 mm', '1 x NF-A9x14 HS-PWM chromax.black', { h: 37, sockets: 'LGA1700, LGA1851', tags: HTPC }),
  air('noctua-nh-l9a-am4', NOC, 'Noctua NH-L9a-AM4', 'NH-L9', 2019, LP, '92 mm', '1 x NF-A9x14 PWM', { h: 37, sockets: 'AM4', tags: HTPC }),
  air('noctua-nh-l9a-am4-chromax-black', NOC, 'Noctua NH-L9a-AM4 chromax.black', 'NH-L9', 2020, LP, '92 mm', '1 x NF-A9x14 HS-PWM chromax.black', { h: 37, sockets: 'AM4', tags: HTPC }),
  air('noctua-nh-l9x65', NOC, 'Noctua NH-L9x65', 'NH-L9', 2012, LP, '92 mm', '1 x NF-B9 PWM', { h: 65, tags: HTPC }),
  air('noctua-nh-l12s', NOC, 'Noctua NH-L12S', 'NH-L12', 2018, LP, '120 mm', '1 x NF-A12x15 PWM', { h: 70, tags: HTPC }),
  air('noctua-nh-l12', NOC, 'Noctua NH-L12', 'NH-L12', 2012, LP, '120 mm + 92 mm', '1 x NF-F12 PWM, 1 x NF-B9 PWM', { h: 93, tags: HTPC }),
  air('noctua-nh-l12-ghost-s1-edition', NOC, 'Noctua NH-L12 Ghost S1 edition', 'NH-L12', 2019, LP, '92 mm', '1 x NF-A9x14 PWM', { h: 66, tags: HTPC }),
  air('noctua-nh-c14s', NOC, 'Noctua NH-C14S', 'NH-C14', 2016, TD, '140 mm', '1 x NF-A14 PWM', { h: 142 }),
  air('noctua-nh-c14', NOC, 'Noctua NH-C14', 'NH-C14', 2013, TD, '140 mm', '2 x NF-A14 PWM', { h: 142 }),
  air('noctua-nh-d12l', NOC, 'Noctua NH-D12L', 'NH-D12', 2021, DT, '120 mm', '1 x NF-A12x25 PWM', { h: 145 }),
  air('noctua-nh-d12l-chromax-black', NOC, 'Noctua NH-D12L chromax.black', 'NH-D12', 2023, DT, '120 mm', '1 x NF-A12x25 HS-PWM chromax.black', { h: 145 }),
  air('noctua-nh-p1', NOC, 'Noctua NH-P1', 'NH-P1', 2021, 'Ventirad passif', 'Passif', 'Aucun (fanless)', { h: 158, tags: ['bureautique', 'homelab', 'creation'] }),

  // ─── Thermalright : ventirads ─────────────────────────────────────────────
  air('thermalright-peerless-assassin-120', TR, 'Thermalright Peerless Assassin 120', 'Peerless Assassin', 2022, DT, '2 x 120 mm', '2 x TL-C12C', { h: 155, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-120-white', TR, 'Thermalright Peerless Assassin 120 White', 'Peerless Assassin', 2022, DT, '2 x 120 mm', '2 x TL-C12CW', { h: 155, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-120-se-argb', TR, 'Thermalright Peerless Assassin 120 SE ARGB', 'Peerless Assassin', 2023, DT, '2 x 120 mm', '2 x TL-C12C-S ARGB', { h: 155, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-120-white-argb', TR, 'Thermalright Peerless Assassin 120 White ARGB', 'Peerless Assassin', 2023, DT, '2 x 120 mm', '2 x TL-C12CW-S ARGB', { h: 155, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-120-digital', TR, 'Thermalright Peerless Assassin 120 Digital', 'Peerless Assassin', 2024, DT, '2 x 120 mm', '2 x 120 mm ARGB', { h: 157, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-140', TR, 'Thermalright Peerless Assassin 140', 'Peerless Assassin', 2023, DT, '140 mm + 120 mm', '1 x TL-D14X, 1 x TL-C12', { h: 157, tags: ['gaming', 'budget'] }),
  air('thermalright-peerless-assassin-140-white', TR, 'Thermalright Peerless Assassin 140 White', 'Peerless Assassin', 2023, DT, '140 mm + 120 mm', '1 x 140 mm, 1 x 120 mm', { h: 157, tags: ['gaming', 'budget'] }),
  air('thermalright-phantom-spirit-120', TR, 'Thermalright Phantom Spirit 120', 'Phantom Spirit', 2023, DT, '2 x 120 mm', '2 x TL-C12B', { h: 154, tags: ['gaming', 'budget'] }),
  air('thermalright-phantom-spirit-120-evo', TR, 'Thermalright Phantom Spirit 120 EVO', 'Phantom Spirit', 2024, DT, '2 x 120 mm', '2 x TL-K12', { h: 154, tags: ['gaming', 'budget'] }),
  air('thermalright-phantom-spirit-120-se-argb', TR, 'Thermalright Phantom Spirit 120 SE ARGB', 'Phantom Spirit', 2023, DT, '2 x 120 mm', '2 x TL-C12C-S ARGB', { h: 154, tags: ['gaming', 'budget'] }),
  air('thermalright-phantom-spirit-120-se-white', TR, 'Thermalright Phantom Spirit 120 SE White', 'Phantom Spirit', 2023, DT, '2 x 120 mm', '2 x 120 mm ARGB', { h: 154, tags: ['gaming', 'budget'] }),
  air('thermalright-frost-commander-140', TR, 'Thermalright Frost Commander 140', 'Frost Commander', 2023, DT, '140 mm + 120 mm', '1 x TL-D14X, 1 x TL-C12', { h: 158, tags: ['gaming'] }),
  air('thermalright-frost-commander-140-white', TR, 'Thermalright Frost Commander 140 White', 'Frost Commander', 2023, DT, '140 mm + 120 mm', '1 x 140 mm, 1 x 120 mm', { h: 158, tags: ['gaming'] }),
  air('thermalright-frost-spirit-140', TR, 'Thermalright Frost Spirit 140', 'Frost Spirit', 2022, T, '140 mm', '1 x TL-D14X', { tags: ['gaming', 'budget'] }),
  air('thermalright-assassin-x-120-refined-se', TR, 'Thermalright Assassin X 120 Refined SE', 'Assassin X', 2022, T, '120 mm', '1 x TL-C12C', { h: 148, tags: ['gaming', 'budget', 'bureautique'] }),
  air('thermalright-assassin-x-120-refined-se-argb', TR, 'Thermalright Assassin X 120 Refined SE ARGB', 'Assassin X', 2023, T, '120 mm', '1 x TL-C12C-S ARGB', { h: 148, tags: ['gaming', 'budget', 'bureautique'] }),
  air('thermalright-assassin-x-120-refined-se-white-argb', TR, 'Thermalright Assassin X 120 Refined SE White ARGB', 'Assassin X', 2023, T, '120 mm', '1 x TL-C12CW-S ARGB', { h: 148, tags: ['gaming', 'budget', 'bureautique'] }),
  air('thermalright-assassin-x-120-r-se-plus', TR, 'Thermalright Assassin X 120 R SE Plus', 'Assassin X', 2023, T, '120 mm', '1 x 120 mm', { h: 148, tags: ['gaming', 'budget', 'bureautique'] }),
  air('thermalright-assassin-king-120-se', TR, 'Thermalright Assassin King 120 SE', 'Assassin King', 2022, T, '120 mm', '1 x TL-C12C', { h: 148, tags: ['gaming', 'budget'] }),
  air('thermalright-assassin-king-120-se-argb', TR, 'Thermalright Assassin King 120 SE ARGB', 'Assassin King', 2023, T, '120 mm', '1 x TL-C12C-S ARGB', { h: 148, tags: ['gaming', 'budget'] }),
  air('thermalright-burst-assassin-120-se', TR, 'Thermalright Burst Assassin 120 SE', 'Burst Assassin', 2023, T, '120 mm', '1 x 120 mm', { tags: ['gaming', 'budget'] }),
  air('thermalright-burst-assassin-120-se-argb', TR, 'Thermalright Burst Assassin 120 SE ARGB', 'Burst Assassin', 2023, T, '120 mm', '1 x 120 mm ARGB', { tags: ['gaming', 'budget'] }),
  air('thermalright-axp90-x36', TR, 'Thermalright AXP90-X36', 'AXP', 2020, LP, '92 mm', '1 x TL-9015', { h: 36, tags: HTPC }),
  air('thermalright-axp90-x47', TR, 'Thermalright AXP90-X47', 'AXP', 2020, LP, '92 mm', '1 x TL-9015', { h: 47, tags: HTPC }),
  air('thermalright-axp90-x53', TR, 'Thermalright AXP90-X53', 'AXP', 2020, LP, '92 mm', '1 x TL-9015', { h: 53, tags: HTPC }),
  air('thermalright-axp120-x67', TR, 'Thermalright AXP120-X67', 'AXP', 2021, LP, '120 mm', '1 x TL-C12015', { h: 67, tags: HTPC }),
  air('thermalright-le-grand-macho-rt', TR, 'Thermalright Le Grand Macho RT', 'Macho', 2016, T, '140 mm', '1 x TY-147B', { h: 159 }),
  air('thermalright-macho-rev-b', TR, 'Thermalright Macho Rev.B', 'Macho', 2014, T, '140 mm', '1 x TY-147A', { h: 162 }),
  air('thermalright-true-spirit-140-power', TR, 'Thermalright True Spirit 140 Power', 'True Spirit', 2013, T, '140 mm', '1 x TY-147A', { h: 171 }),

  // ─── Thermalright : AIO ───────────────────────────────────────────────────
  aio('thermalright-aqua-elite-240', TR, 'Thermalright Aqua Elite 240', 'Aqua Elite', 2023, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-aqua-elite-360', TR, 'Thermalright Aqua Elite 360', 'Aqua Elite', 2023, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-aqua-elite-240-white', TR, 'Thermalright Aqua Elite 240 White', 'Aqua Elite', 2023, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-aqua-elite-360-white', TR, 'Thermalright Aqua Elite 360 White', 'Aqua Elite', 2023, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-aqua-elite-240-v3', TR, 'Thermalright Aqua Elite 240 V3', 'Aqua Elite', 2024, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-aqua-elite-360-v3', TR, 'Thermalright Aqua Elite 360 V3', 'Aqua Elite', 2024, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-magic-240', TR, 'Thermalright Frozen Magic 240', 'Frozen Magic', 2022, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-magic-280', TR, 'Thermalright Frozen Magic 280', 'Frozen Magic', 2022, 280, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-magic-360', TR, 'Thermalright Frozen Magic 360', 'Frozen Magic', 2022, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-notte-240', TR, 'Thermalright Frozen Notte 240', 'Frozen Notte', 2023, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-notte-360', TR, 'Thermalright Frozen Notte 360', 'Frozen Notte', 2023, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-prism-240', TR, 'Thermalright Frozen Prism 240', 'Frozen Prism', 2023, 240, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-prism-360', TR, 'Thermalright Frozen Prism 360', 'Frozen Prism', 2023, 360, { tags: ['gaming', 'budget'] }),
  aio('thermalright-frozen-warframe-240', TR, 'Thermalright Frozen Warframe 240', 'Frozen Warframe', 2024, 240, { tags: ['gaming'] }),
  aio('thermalright-frozen-warframe-360', TR, 'Thermalright Frozen Warframe 360', 'Frozen Warframe', 2024, 360, { tags: ['gaming'] }),

  // ─── be quiet! : ventirads ────────────────────────────────────────────────
  air('be-quiet-pure-rock', BQ, 'be quiet! Pure Rock', 'Pure Rock', 2015, T, '120 mm', '1 x Pure Wings 2 120 mm', { tdp: 150, h: 155, tags: ['gaming', 'budget'] }),
  air('be-quiet-pure-rock-2-black', BQ, 'be quiet! Pure Rock 2 Black', 'Pure Rock', 2020, T, '120 mm', '1 x Pure Wings 2 120 mm PWM', { tdp: 150, h: 155, tags: ['gaming', 'budget'] }),
  air('be-quiet-pure-rock-2-fx', BQ, 'be quiet! Pure Rock 2 FX', 'Pure Rock', 2021, T, '120 mm', '1 x Light Wings 120 mm PWM', { tdp: 150, h: 155, tags: ['gaming', 'budget'] }),
  air('be-quiet-pure-rock-slim', BQ, 'be quiet! Pure Rock Slim', 'Pure Rock', 2016, T, '92 mm', '1 x Pure Wings 2 92 mm', { h: 126, tags: ['bureautique', 'budget'] }),
  air('be-quiet-pure-rock-slim-2', BQ, 'be quiet! Pure Rock Slim 2', 'Pure Rock', 2021, T, '92 mm', '1 x Pure Wings 2 92 mm PWM', { tdp: 130, tags: ['bureautique', 'budget'] }),
  air('be-quiet-dark-rock-5', BQ, 'be quiet! Dark Rock 5', 'Dark Rock', 2023, T, '135 mm', '1 x Silent Wings 4 135 mm PWM', { tdp: 210, h: 161, msrp: 79 }),
  air('be-quiet-dark-rock-pro-4', BQ, 'be quiet! Dark Rock Pro 4', 'Dark Rock', 2018, DT, '135 mm + 120 mm', '1 x Silent Wings 135 mm, 1 x Silent Wings 120 mm', { tdp: 250, h: 163, msrp: 89 }),
  air('be-quiet-dark-rock-pro-3', BQ, 'be quiet! Dark Rock Pro 3', 'Dark Rock', 2014, DT, '135 mm + 120 mm', '1 x Silent Wings 2 135 mm, 1 x Silent Wings 2 120 mm', { tdp: 250, h: 163 }),
  air('be-quiet-dark-rock-3', BQ, 'be quiet! Dark Rock 3', 'Dark Rock', 2014, T, '135 mm', '1 x Silent Wings 2 135 mm', { tdp: 190, h: 160 }),
  air('be-quiet-dark-rock-pro-tr4', BQ, 'be quiet! Dark Rock Pro TR4', 'Dark Rock', 2018, DT, '135 mm + 120 mm', '1 x Silent Wings 135 mm, 1 x Silent Wings 120 mm', { tdp: 250, h: 163, sockets: 'TR4, sTRX4', tags: ['creation', 'pro'] }),
  air('be-quiet-dark-rock-slim', BQ, 'be quiet! Dark Rock Slim', 'Dark Rock', 2019, T, '120 mm', '1 x Silent Wings 3 120 mm PWM', { tdp: 180, h: 159 }),
  air('be-quiet-dark-rock-elite', BQ, 'be quiet! Dark Rock Elite', 'Dark Rock', 2023, DT, '135 mm + 120 mm', '1 x Silent Wings 4 135 mm, 1 x Silent Wings 4 120 mm', { tdp: 280, h: 168, msrp: 115 }),
  air('be-quiet-dark-rock-tf', BQ, 'be quiet! Dark Rock TF', 'Dark Rock TF', 2016, TD, '135 mm + 120 mm', '1 x Silent Wings 135 mm, 1 x Silent Wings 120 mm', { tdp: 220 }),
  air('be-quiet-dark-rock-tf-2', BQ, 'be quiet! Dark Rock TF 2', 'Dark Rock TF', 2021, TD, '135 mm + 120 mm', '1 x Silent Wings 3 135 mm, 1 x Silent Wings 3 120 mm', { tdp: 230 }),
  air('be-quiet-shadow-rock-3', BQ, 'be quiet! Shadow Rock 3', 'Shadow Rock', 2017, T, '120 mm', '1 x Shadow Wings 2 120 mm PWM', { tdp: 190, h: 163 }),
  air('be-quiet-shadow-rock-2', BQ, 'be quiet! Shadow Rock 2', 'Shadow Rock', 2015, T, '120 mm', '1 x Shadow Wings 120 mm PWM', { h: 160 }),
  air('be-quiet-shadow-rock-slim', BQ, 'be quiet! Shadow Rock Slim', 'Shadow Rock', 2016, T, '135 mm', '1 x Shadow Wings 135 mm PWM', { tdp: 160 }),
  air('be-quiet-shadow-rock-lp', BQ, 'be quiet! Shadow Rock LP', 'Shadow Rock', 2014, LP, '120 mm', '1 x Shadow Wings 120 mm PWM', { h: 75, tags: HTPC }),
  air('be-quiet-shadow-rock-tf-2', BQ, 'be quiet! Shadow Rock TF 2', 'Shadow Rock', 2017, TD, '135 mm', '1 x Shadow Wings 135 mm PWM', { tdp: 160 }),

  // ─── be quiet! : AIO ──────────────────────────────────────────────────────
  aio('be-quiet-pure-loop-120', BQ, 'be quiet! Pure Loop 120', 'Pure Loop', 2020, 120, { tags: ['gaming', 'budget'] }),
  aio('be-quiet-pure-loop-240', BQ, 'be quiet! Pure Loop 240', 'Pure Loop', 2020, 240),
  aio('be-quiet-pure-loop-280', BQ, 'be quiet! Pure Loop 280', 'Pure Loop', 2020, 280),
  aio('be-quiet-pure-loop-360', BQ, 'be quiet! Pure Loop 360', 'Pure Loop', 2020, 360),
  aio('be-quiet-pure-loop-2-240', BQ, 'be quiet! Pure Loop 2 240', 'Pure Loop 2', 2023, 240),
  aio('be-quiet-pure-loop-2-280', BQ, 'be quiet! Pure Loop 2 280', 'Pure Loop 2', 2023, 280),
  aio('be-quiet-pure-loop-2-360', BQ, 'be quiet! Pure Loop 2 360', 'Pure Loop 2', 2023, 360),
  aio('be-quiet-pure-loop-2-fx-240', BQ, 'be quiet! Pure Loop 2 FX 240', 'Pure Loop 2', 2022, 240),
  aio('be-quiet-pure-loop-2-fx-280', BQ, 'be quiet! Pure Loop 2 FX 280', 'Pure Loop 2', 2022, 280),
  aio('be-quiet-pure-loop-2-fx-360', BQ, 'be quiet! Pure Loop 2 FX 360', 'Pure Loop 2', 2022, 360),
  aio('be-quiet-silent-loop-240', BQ, 'be quiet! Silent Loop 240', 'Silent Loop', 2018, 240),
  aio('be-quiet-silent-loop-280', BQ, 'be quiet! Silent Loop 280', 'Silent Loop', 2018, 280),
  aio('be-quiet-silent-loop-360', BQ, 'be quiet! Silent Loop 360', 'Silent Loop', 2018, 360),
  aio('be-quiet-silent-loop-2-120', BQ, 'be quiet! Silent Loop 2 120', 'Silent Loop 2', 2021, 120),
  aio('be-quiet-silent-loop-2-240', BQ, 'be quiet! Silent Loop 2 240', 'Silent Loop 2', 2021, 240),
  aio('be-quiet-silent-loop-2-280', BQ, 'be quiet! Silent Loop 2 280', 'Silent Loop 2', 2021, 280),
  aio('be-quiet-silent-loop-2-360', BQ, 'be quiet! Silent Loop 2 360', 'Silent Loop 2', 2021, 360),
  aio('be-quiet-light-loop-240', BQ, 'be quiet! Light Loop 240', 'Light Loop', 2024, 240),
  aio('be-quiet-light-loop-360', BQ, 'be quiet! Light Loop 360', 'Light Loop', 2024, 360),

  // ─── Scythe ───────────────────────────────────────────────────────────────
  air('scythe-fuma-2', SC, 'Scythe Fuma 2', 'Fuma', 2018, DT, '2 x 120 mm', '2 x Kaze Flex 120 PWM', { h: 155 }),
  air('scythe-fuma-2-rev-b', SC, 'Scythe Fuma 2 Rev.B', 'Fuma', 2021, DT, '2 x 120 mm', '2 x Kaze Flex II 120 PWM', { h: 155 }),
  air('scythe-fuma-3', SC, 'Scythe Fuma 3', 'Fuma', 2023, DT, '2 x 120 mm', '2 x Kaze Flex II 120 PWM', { h: 155 }),
  air('scythe-mugen-4', SC, 'Scythe Mugen 4', 'Mugen', 2014, T, '120 mm', '1 x Glide Stream 120 PWM', { h: 157 }),
  air('scythe-mugen-5-rev-b', SC, 'Scythe Mugen 5 Rev.B', 'Mugen', 2017, T, '120 mm', '1 x Kaze Flex 120 PWM', { h: 155 }),
  air('scythe-mugen-5-rev-c', SC, 'Scythe Mugen 5 Rev.C', 'Mugen', 2021, T, '120 mm', '1 x Kaze Flex 120 PWM', { h: 155 }),
  air('scythe-mugen-5-pcgh-edition', SC, 'Scythe Mugen 5 PCGH Edition', 'Mugen', 2018, T, '120 mm', '2 x Kaze Flex 120 PWM', { h: 155 }),
  air('scythe-mugen-6', SC, 'Scythe Mugen 6', 'Mugen', 2023, DT, '120 mm', '1 x Kaze Flex II 120 PWM', { h: 155 }),
  air('scythe-mugen-6-black-edition', SC, 'Scythe Mugen 6 Black Edition', 'Mugen', 2023, DT, '120 mm', '1 x Kaze Flex II 120 PWM', { h: 155 }),
  air('scythe-ninja-4', SC, 'Scythe Ninja 4', 'Ninja', 2015, T, '120 mm', '1 x Glide Stream 120 PWM', { h: 155 }),
  air('scythe-ninja-5', SC, 'Scythe Ninja 5', 'Ninja', 2019, T, '120 mm', '2 x Kaze Flex 120 PWM', { h: 155 }),
  air('scythe-kotetsu-mark-ii', SC, 'Scythe Kotetsu Mark II', 'Kotetsu', 2017, T, '120 mm', '1 x Kaze Flex 120 PWM', { h: 154, tags: ['gaming', 'budget'] }),
  air('scythe-big-shuriken-3', SC, 'Scythe Big Shuriken 3', 'Shuriken', 2017, LP, '120 mm', '1 x Kaze Flex 120 Slim PWM', { h: 69, tags: HTPC }),
  air('scythe-choten', SC, 'Scythe Choten', 'Choten', 2018, TD, '120 mm', '1 x Kaze Flex 120 PWM', { tags: ['bureautique', 'homelab'] }),
];
