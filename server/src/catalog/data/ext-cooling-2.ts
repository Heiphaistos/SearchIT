import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « refroidissement » : ventirads et AIO DeepCool, Arctic, Cooler Master
 * et leurs watercoolings AIO. Clé de spec omise quand la valeur n'est pas certaine.
 */

type Opt = { h?: number; tdp?: number; sockets?: string; tags?: string[]; msrp?: number; refurb?: boolean };

const ft = (n: number) => (n === 120 ? '1 x 120 mm' : n === 140 ? '1 x 140 mm' : n === 240 ? '2 x 120 mm' : n === 280 ? '2 x 140 mm' : n === 360 ? '3 x 120 mm' : n === 420 ? '3 x 140 mm' : `${n} mm`);

function air(id: string, brand: string, name: string, family: string, year: number | undefined, type: string, size: string, fans: string, o: Opt = {}): CatalogProduct {
  const specs: Record<string, string | number> = { 'Type': type };
  if (size) specs['Taille'] = size;
  if (o.tdp) specs['TDP supporté'] = `${o.tdp} W`;
  if (o.h) specs['Hauteur'] = `${o.h} mm`;
  if (fans) specs['Ventilateurs'] = fans;
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
const DC = 'DeepCool';
const AR = 'Arctic';
const CM = 'Cooler Master';

export const PRODUCTS: CatalogProduct[] = [
  // ─── DeepCool : ventirads ─────────────────────────────────────────────────
  air('deepcool-ak400-digital', DC, 'DeepCool AK400 Digital', 'AK', 2023, T, '120 mm', '1 x FK120', { tdp: 220, h: 155, tags: ['gaming', 'budget'] }),
  air('deepcool-ak400-wh', DC, 'DeepCool AK400 WH', 'AK', 2022, T, '120 mm', '1 x FK120 WH', { tdp: 220, h: 155, tags: ['gaming', 'budget'] }),
  air('deepcool-ak400-zero-dark', DC, 'DeepCool AK400 Zero Dark', 'AK', 2022, T, '120 mm', '1 x FK120', { tdp: 220, h: 155, tags: ['gaming', 'budget'] }),
  air('deepcool-ak400-zero-dark-plus', DC, 'DeepCool AK400 Zero Dark Plus', 'AK', 2022, T, '120 mm', '2 x FK120', { tdp: 220, h: 155, tags: ['gaming', 'budget'] }),
  air('deepcool-ak500', DC, 'DeepCool AK500', 'AK', 2022, T, '120 mm', '1 x FK120', { tdp: 240, h: 158 }),
  air('deepcool-ak500-wh', DC, 'DeepCool AK500 WH', 'AK', 2022, T, '120 mm', '1 x FK120 WH', { tdp: 240, h: 158 }),
  air('deepcool-ak500-zero-dark', DC, 'DeepCool AK500 Zero Dark', 'AK', 2022, T, '120 mm', '1 x FK120', { tdp: 240, h: 158 }),
  air('deepcool-ak500-digital', DC, 'DeepCool AK500 Digital', 'AK', 2023, T, '120 mm', '1 x FK120', { tdp: 240, h: 158 }),
  air('deepcool-ak500s-digital', DC, 'DeepCool AK500S Digital', 'AK', 2023, T, '120 mm', '1 x FK120', { tdp: 240 }),
  air('deepcool-ak620-wh', DC, 'DeepCool AK620 WH', 'AK', 2022, DT, '2 x 120 mm', '2 x FK120 WH', { tdp: 260, h: 160 }),
  air('deepcool-ak620-zero-dark', DC, 'DeepCool AK620 Zero Dark', 'AK', 2022, DT, '2 x 120 mm', '2 x FK120', { tdp: 260, h: 160 }),
  air('deepcool-ak620-digital', DC, 'DeepCool AK620 Digital', 'AK', 2023, DT, '2 x 120 mm', '2 x FK120', { tdp: 260, h: 162 }),
  air('deepcool-ag300', DC, 'DeepCool AG300', 'AG', 2022, T, '92 mm', '1 x 92 mm', { tdp: 150, tags: ['bureautique', 'budget'] }),
  air('deepcool-ag400', DC, 'DeepCool AG400', 'AG', 2022, T, '120 mm', '1 x 120 mm PWM', { tdp: 220, h: 150, tags: ['gaming', 'budget'] }),
  air('deepcool-ag400-argb', DC, 'DeepCool AG400 ARGB', 'AG', 2022, T, '120 mm', '1 x 120 mm ARGB PWM', { tdp: 220, h: 150, tags: ['gaming', 'budget'] }),
  air('deepcool-ag400-plus', DC, 'DeepCool AG400 Plus', 'AG', 2022, T, '120 mm', '2 x 120 mm PWM', { tdp: 220, h: 150, tags: ['gaming', 'budget'] }),
  air('deepcool-ag400-digital', DC, 'DeepCool AG400 Digital', 'AG', 2023, T, '120 mm', '1 x 120 mm ARGB PWM', { tdp: 220, tags: ['gaming', 'budget'] }),
  air('deepcool-ag620', DC, 'DeepCool AG620', 'AG', 2022, DT, '2 x 120 mm', '2 x 120 mm PWM', { tdp: 260, h: 157, tags: ['gaming', 'budget'] }),
  air('deepcool-ag620-argb', DC, 'DeepCool AG620 ARGB', 'AG', 2022, DT, '2 x 120 mm', '2 x 120 mm ARGB PWM', { tdp: 260, h: 157, tags: ['gaming', 'budget'] }),
  air('deepcool-ag620-digital', DC, 'DeepCool AG620 Digital', 'AG', 2023, DT, '2 x 120 mm', '2 x 120 mm ARGB PWM', { tdp: 260, tags: ['gaming', 'budget'] }),
  air('deepcool-assassin-iv', DC, 'DeepCool Assassin IV', 'Assassin', 2023, DT, '140 mm + 120 mm', '1 x 140 mm, 1 x 120 mm', { tdp: 280, h: 164, msrp: 109 }),
  air('deepcool-assassin-iv-wh', DC, 'DeepCool Assassin IV WH', 'Assassin', 2023, DT, '140 mm + 120 mm', '1 x 140 mm, 1 x 120 mm', { tdp: 280, h: 164 }),
  air('deepcool-assassin-iii', DC, 'DeepCool Assassin III', 'Assassin', 2018, DT, '2 x 140 mm', '2 x TF140S', { tdp: 280, h: 165 }),
  air('deepcool-gammaxx-400-v2', DC, 'DeepCool Gammaxx 400 V2', 'Gammaxx', 2019, T, '120 mm', '1 x 120 mm PWM', { tdp: 180, tags: ['gaming', 'budget', 'bureautique'] }),
  air('deepcool-gammaxx-400-xt', DC, 'DeepCool Gammaxx 400 XT', 'Gammaxx', 2019, T, '120 mm', '1 x 120 mm PWM', { tdp: 180, tags: ['gaming', 'budget', 'bureautique'] }),
  air('deepcool-gammaxx-gte-v2', DC, 'DeepCool Gammaxx GTE V2', 'Gammaxx', 2019, T, '120 mm', '1 x 120 mm PWM', { tdp: 180, tags: ['gaming', 'budget'] }),
  air('deepcool-gammaxx-400', DC, 'DeepCool Gammaxx 400', 'Gammaxx', 2014, T, '120 mm', '1 x 120 mm PWM', { tdp: 130, tags: ['bureautique', 'budget'] }),

  // ─── DeepCool : AIO ───────────────────────────────────────────────────────
  aio('deepcool-gammaxx-l240-v2', DC, 'DeepCool Gammaxx L240 V2', 'Gammaxx L', 2019, 240, { tags: ['gaming', 'budget'] }),
  aio('deepcool-gammaxx-l360-a-rgb', DC, 'DeepCool Gammaxx L360 A-RGB', 'Gammaxx L', 2019, 360, { tags: ['gaming', 'budget'] }),
  aio('deepcool-gammaxx-l240-a-rgb', DC, 'DeepCool Gammaxx L240 A-RGB', 'Gammaxx L', 2019, 240, { tags: ['gaming', 'budget'] }),
  aio('deepcool-castle-240ex', DC, 'DeepCool Castle 240EX', 'Castle', 2020, 240),
  aio('deepcool-castle-280ex', DC, 'DeepCool Castle 280EX', 'Castle', 2020, 280),
  aio('deepcool-castle-360ex', DC, 'DeepCool Castle 360EX', 'Castle', 2020, 360),
  aio('deepcool-castle-240rgb-v2', DC, 'DeepCool Castle 240RGB V2', 'Castle', 2019, 240),
  aio('deepcool-castle-360rgb-v2', DC, 'DeepCool Castle 360RGB V2', 'Castle', 2019, 360),
  aio('deepcool-ls520', DC, 'DeepCool LS520', 'LS', 2022, 240),
  aio('deepcool-ls720', DC, 'DeepCool LS720', 'LS', 2022, 360),
  aio('deepcool-ls520-wh', DC, 'DeepCool LS520 WH', 'LS', 2022, 240),
  aio('deepcool-ls720-wh', DC, 'DeepCool LS720 WH', 'LS', 2022, 360),
  aio('deepcool-ls520-se', DC, 'DeepCool LS520 SE', 'LS', 2023, 240),
  aio('deepcool-ls720-se', DC, 'DeepCool LS720 SE', 'LS', 2023, 360),
  aio('deepcool-lt520', DC, 'DeepCool LT520', 'LT', 2022, 240),
  aio('deepcool-lt720', DC, 'DeepCool LT720', 'LT', 2022, 360),
  aio('deepcool-lt720-wh', DC, 'DeepCool LT720 WH', 'LT', 2023, 360),
  aio('deepcool-le500', DC, 'DeepCool LE500', 'LE', 2022, 240, { tags: ['gaming', 'budget'] }),
  aio('deepcool-le520', DC, 'DeepCool LE520', 'LE', 2023, 240, { tags: ['gaming', 'budget'] }),
  aio('deepcool-le720', DC, 'DeepCool LE720', 'LE', 2023, 360, { tags: ['gaming', 'budget'] }),
  aio('deepcool-lq240', DC, 'DeepCool LQ240', 'LQ', 2024, 240),
  aio('deepcool-lq360', DC, 'DeepCool LQ360', 'LQ', 2024, 360),
  aio('deepcool-mystique-240', DC, 'DeepCool Mystique 240', 'Mystique', 2024, 240),
  aio('deepcool-mystique-360', DC, 'DeepCool Mystique 360', 'Mystique', 2024, 360),
  aio('deepcool-ld240', DC, 'DeepCool LD240', 'LD', 2024, 240),
  aio('deepcool-ld360', DC, 'DeepCool LD360', 'LD', 2024, 360),

  // ─── Arctic : ventirads ───────────────────────────────────────────────────
  air('arctic-freezer-7-x', AR, 'Arctic Freezer 7 X', 'Freezer', 2021, T, '92 mm', '1 x 92 mm PWM', { h: 132, tags: ['bureautique', 'budget'] }),
  air('arctic-freezer-7-x-co', AR, 'Arctic Freezer 7 X CO', 'Freezer', 2021, T, '92 mm', '1 x 92 mm PWM', { h: 132, tags: ['bureautique', 'budget', 'serveur'] }),
  air('arctic-freezer-7-pro-rev-2', AR, 'Arctic Freezer 7 Pro Rev.2', 'Freezer', undefined, T, '92 mm', '1 x 92 mm PWM', { tags: ['bureautique', 'budget'] }),
  air('arctic-freezer-34', AR, 'Arctic Freezer 34', 'Freezer 34', 2018, T, '120 mm', '1 x 120 mm PWM', { h: 157, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-34-co', AR, 'Arctic Freezer 34 CO', 'Freezer 34', 2018, T, '120 mm', '1 x 120 mm PWM', { h: 157, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-34-esports', AR, 'Arctic Freezer 34 eSports', 'Freezer 34', 2018, T, '120 mm', '1 x BioniX P120', { h: 157, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-34-esports-duo', AR, 'Arctic Freezer 34 eSports DUO', 'Freezer 34', 2018, T, '120 mm', '2 x BioniX P120', { h: 157, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-33-esports-one', AR, 'Arctic Freezer 33 eSports One', 'Freezer 33', 2017, T, '120 mm', '1 x BioniX F120', { tags: ['gaming', 'budget'] }),
  air('arctic-freezer-36-a-rgb', AR, 'Arctic Freezer 36 A-RGB', 'Freezer 36', 2023, T, '120 mm', '2 x P12 PWM PST A-RGB', { h: 159, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-36-co', AR, 'Arctic Freezer 36 CO', 'Freezer 36', 2023, T, '120 mm', '2 x P12 PWM PST CO', { h: 159, tags: ['gaming', 'budget'] }),
  air('arctic-freezer-a35', AR, 'Arctic Freezer A35', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST', { h: 159, sockets: 'AM4, AM5', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-a35-a-rgb', AR, 'Arctic Freezer A35 A-RGB', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST A-RGB', { h: 159, sockets: 'AM4, AM5', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-a35-co', AR, 'Arctic Freezer A35 CO', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST CO', { h: 159, sockets: 'AM4, AM5', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-i35', AR, 'Arctic Freezer i35', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST', { h: 159, sockets: 'LGA1700, LGA1851', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-i35-a-rgb', AR, 'Arctic Freezer i35 A-RGB', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST A-RGB', { h: 159, sockets: 'LGA1700, LGA1851', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-i35-co', AR, 'Arctic Freezer i35 CO', 'Freezer 35', 2023, T, '120 mm', '1 x P12 PWM PST CO', { h: 159, sockets: 'LGA1700, LGA1851', tags: ['gaming', 'budget'] }),
  air('arctic-freezer-50', AR, 'Arctic Freezer 50', 'Freezer 50', 2018, DT, '', '', { tags: ['gaming'] }),
  air('arctic-freezer-50-tr', AR, 'Arctic Freezer 50 TR', 'Freezer 50', 2018, DT, '', '', { sockets: 'TR4', tags: ['creation', 'pro'] }),
  air('arctic-alpine-17', AR, 'Arctic Alpine 17', 'Alpine', 2021, TD, '', '', { sockets: 'LGA1700', tags: ['bureautique', 'budget'] }),
  air('arctic-alpine-17-co', AR, 'Arctic Alpine 17 CO', 'Alpine', 2021, TD, '', '', { sockets: 'LGA1700', tags: ['bureautique', 'budget', 'serveur'] }),
  air('arctic-alpine-23', AR, 'Arctic Alpine 23', 'Alpine', 2018, TD, '', '', { sockets: 'AM4', tags: ['bureautique', 'budget'] }),
  air('arctic-alpine-23-co', AR, 'Arctic Alpine 23 CO', 'Alpine', 2018, TD, '', '', { sockets: 'AM4', tags: ['bureautique', 'budget', 'serveur'] }),
  air('arctic-alpine-12', AR, 'Arctic Alpine 12', 'Alpine', 2016, TD, '', '', { sockets: 'LGA1150, LGA1151, LGA1155', tags: ['bureautique', 'budget'] }),
  air('arctic-alpine-12-co', AR, 'Arctic Alpine 12 CO', 'Alpine', 2016, TD, '', '', { sockets: 'LGA1150, LGA1151, LGA1155', tags: ['bureautique', 'budget', 'serveur'] }),
  air('arctic-freezer-4u-m', AR, 'Arctic Freezer 4U-M', 'Freezer 4U', 2023, T, '120 mm', '2 x P12 PWM PST', { tags: SRV }),
  air('arctic-freezer-4u-sp5', AR, 'Arctic Freezer 4U-SP5', 'Freezer 4U', 2023, T, '120 mm', '2 x P12 PWM PST', { sockets: 'SP5', tags: SRV }),

  // ─── Arctic : AIO ─────────────────────────────────────────────────────────
  aio('arctic-liquid-freezer-120', AR, 'Arctic Liquid Freezer 120', 'Liquid Freezer', 2017, 120, { tags: ['gaming', 'budget'] }),
  aio('arctic-liquid-freezer-240', AR, 'Arctic Liquid Freezer 240', 'Liquid Freezer', 2017, 240, { tags: ['gaming', 'budget'] }),
  aio('arctic-liquid-freezer-360', AR, 'Arctic Liquid Freezer 360', 'Liquid Freezer', 2017, 360, { tags: ['gaming'] }),
  aio('arctic-liquid-freezer-ii-120', AR, 'Arctic Liquid Freezer II 120', 'Liquid Freezer II', 2019, 120, { tags: ['gaming', 'budget'] }),
  aio('arctic-liquid-freezer-ii-240', AR, 'Arctic Liquid Freezer II 240', 'Liquid Freezer II', 2019, 240, { tags: ['gaming', 'budget'], msrp: 90 }),
  aio('arctic-liquid-freezer-ii-280', AR, 'Arctic Liquid Freezer II 280', 'Liquid Freezer II', 2019, 280, { tags: ['gaming'], msrp: 100 }),
  aio('arctic-liquid-freezer-ii-360', AR, 'Arctic Liquid Freezer II 360', 'Liquid Freezer II', 2019, 360, { tags: ['gaming'], msrp: 115 }),
  aio('arctic-liquid-freezer-ii-420', AR, 'Arctic Liquid Freezer II 420', 'Liquid Freezer II', 2021, 420, { tags: ['gaming', 'creation'] }),
  aio('arctic-liquid-freezer-ii-240-a-rgb', AR, 'Arctic Liquid Freezer II 240 A-RGB', 'Liquid Freezer II', 2021, 240),
  aio('arctic-liquid-freezer-ii-280-a-rgb', AR, 'Arctic Liquid Freezer II 280 A-RGB', 'Liquid Freezer II', 2021, 280),
  aio('arctic-liquid-freezer-ii-360-a-rgb', AR, 'Arctic Liquid Freezer II 360 A-RGB', 'Liquid Freezer II', 2021, 360),
  aio('arctic-liquid-freezer-iii-120', AR, 'Arctic Liquid Freezer III 120', 'Liquid Freezer III', 2024, 120, { tags: ['gaming', 'budget'] }),
  aio('arctic-liquid-freezer-iii-420', AR, 'Arctic Liquid Freezer III 420', 'Liquid Freezer III', 2024, 420, { tags: ['gaming', 'creation'] }),
  aio('arctic-liquid-freezer-iii-240-a-rgb', AR, 'Arctic Liquid Freezer III 240 A-RGB', 'Liquid Freezer III', 2024, 240),
  aio('arctic-liquid-freezer-iii-280-a-rgb', AR, 'Arctic Liquid Freezer III 280 A-RGB', 'Liquid Freezer III', 2024, 280),
  aio('arctic-liquid-freezer-iii-360-a-rgb', AR, 'Arctic Liquid Freezer III 360 A-RGB', 'Liquid Freezer III', 2024, 360),
  aio('arctic-liquid-freezer-iii-420-a-rgb', AR, 'Arctic Liquid Freezer III 420 A-RGB', 'Liquid Freezer III', 2024, 420),
  aio('arctic-liquid-freezer-iii-240-a-rgb-white', AR, 'Arctic Liquid Freezer III 240 A-RGB White', 'Liquid Freezer III', 2024, 240),
  aio('arctic-liquid-freezer-iii-360-a-rgb-white', AR, 'Arctic Liquid Freezer III 360 A-RGB White', 'Liquid Freezer III', 2024, 360),
  aio('arctic-liquid-freezer-iii-pro-240', AR, 'Arctic Liquid Freezer III Pro 240', 'Liquid Freezer III Pro', 2025, 240),
  aio('arctic-liquid-freezer-iii-pro-280', AR, 'Arctic Liquid Freezer III Pro 280', 'Liquid Freezer III Pro', 2025, 280),
  aio('arctic-liquid-freezer-iii-pro-360', AR, 'Arctic Liquid Freezer III Pro 360', 'Liquid Freezer III Pro', 2025, 360),
  aio('arctic-liquid-freezer-iii-pro-420', AR, 'Arctic Liquid Freezer III Pro 420', 'Liquid Freezer III Pro', 2025, 420, { tags: ['gaming', 'creation'] }),

  // ─── Cooler Master : ventirads ────────────────────────────────────────────
  air('cooler-master-hyper-212-evo', CM, 'Cooler Master Hyper 212 EVO', 'Hyper 212', undefined, T, '120 mm', '1 x 120 mm PWM', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-plus', CM, 'Cooler Master Hyper 212 Plus', 'Hyper 212', undefined, T, '120 mm', '1 x 120 mm PWM', { h: 159, tags: ['bureautique', 'budget'] }),
  air('cooler-master-hyper-212-x', CM, 'Cooler Master Hyper 212 X', 'Hyper 212', 2014, T, '120 mm', '1 x 120 mm PWM', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-led', CM, 'Cooler Master Hyper 212 LED', 'Hyper 212', 2016, T, '120 mm', '1 x 120 mm LED PWM', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-led-turbo', CM, 'Cooler Master Hyper 212 LED Turbo', 'Hyper 212', 2017, T, '120 mm', '2 x 120 mm LED PWM', { h: 163, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-turbo', CM, 'Cooler Master Hyper 212 Turbo', 'Hyper 212', 2017, T, '120 mm', '2 x 120 mm PWM', { h: 163, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-black-edition', CM, 'Cooler Master Hyper 212 Black Edition', 'Hyper 212', 2020, T, '120 mm', '1 x SickleFlow 120', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-rgb-black-edition', CM, 'Cooler Master Hyper 212 RGB Black Edition', 'Hyper 212', 2020, T, '120 mm', '1 x MasterFan MF120R RGB', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-evo-v2', CM, 'Cooler Master Hyper 212 EVO V2', 'Hyper 212', 2021, T, '120 mm', '1 x SickleFlow 120', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-spectrum', CM, 'Cooler Master Hyper 212 Spectrum', 'Hyper 212', 2020, T, '120 mm', '1 x SickleFlow 120 ARGB', { h: 159, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-spectrum-v3', CM, 'Cooler Master Hyper 212 Spectrum V3', 'Hyper 212', 2023, T, '120 mm', '1 x SickleFlow 120 ARGB', { tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-halo', CM, 'Cooler Master Hyper 212 Halo', 'Hyper 212', 2023, T, '120 mm', '1 x MasterFan MF120 Halo²', { h: 154, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-halo-white', CM, 'Cooler Master Hyper 212 Halo White', 'Hyper 212', 2023, T, '120 mm', '1 x MasterFan MF120 Halo² White', { h: 154, tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-212-black', CM, 'Cooler Master Hyper 212 Black', 'Hyper 212', 2023, T, '120 mm', '1 x 120 mm PWM', { tags: ['gaming', 'budget'] }),
  air('cooler-master-hyper-622-halo', CM, 'Cooler Master Hyper 622 Halo', 'Hyper 622', 2022, DT, '2 x 120 mm', '2 x MasterFan MF120 Halo', { h: 157 }),
  air('cooler-master-hyper-622-halo-white', CM, 'Cooler Master Hyper 622 Halo White', 'Hyper 622', 2022, DT, '2 x 120 mm', '2 x MasterFan MF120 Halo White', { h: 157 }),
  air('cooler-master-hyper-620s', CM, 'Cooler Master Hyper 620S', 'Hyper 620', 2023, DT, '2 x 120 mm', '2 x 120 mm PWM'),
  air('cooler-master-hyper-h410r', CM, 'Cooler Master Hyper H410R', 'Hyper H4', 2018, T, '92 mm', '1 x 92 mm RGB PWM', { h: 136, tags: ['bureautique', 'budget'] }),
  air('cooler-master-hyper-h411r', CM, 'Cooler Master Hyper H411R', 'Hyper H4', 2018, T, '92 mm', '1 x 92 mm RGB PWM', { h: 136, tags: ['bureautique', 'budget'] }),
  air('cooler-master-hyper-tx3-evo', CM, 'Cooler Master Hyper TX3 EVO', 'Hyper TX3', 2013, T, '92 mm', '1 x 92 mm PWM', { h: 139, tags: ['bureautique', 'budget'] }),
  air('cooler-master-masterair-ma410m', CM, 'Cooler Master MasterAir MA410M', 'MasterAir', 2017, T, '120 mm', '2 x MasterFan MF120R RGB', { h: 160 }),
  air('cooler-master-masterair-ma610p', CM, 'Cooler Master MasterAir MA610P', 'MasterAir', 2017, T, '120 mm', '2 x MasterFan MF120R RGB', { h: 166 }),
  air('cooler-master-masterair-ma620p', CM, 'Cooler Master MasterAir MA620P', 'MasterAir', 2018, DT, '2 x 120 mm', '2 x MasterFan MF120R RGB', { h: 165 }),
  air('cooler-master-masterair-ma620m', CM, 'Cooler Master MasterAir MA620M', 'MasterAir', 2018, DT, '2 x 120 mm', '2 x MasterFan MF120R ARGB', { h: 165 }),
  air('cooler-master-masterair-ma624-stealth', CM, 'Cooler Master MasterAir MA624 Stealth', 'MasterAir', 2020, DT, '140 mm + 120 mm', '1 x 140 mm, 1 x 120 mm', { h: 165 }),
  air('cooler-master-masterair-ma612-stealth', CM, 'Cooler Master MasterAir MA612 Stealth', 'MasterAir', 2020, T, '120 mm', '2 x SickleFlow 120', { h: 158 }),
  air('cooler-master-masterair-g100m', CM, 'Cooler Master MasterAir G100M', 'MasterAir', 2018, LP, '92 mm', '1 x 92 mm RGB', { tags: HTPC }),

  // ─── Cooler Master : AIO ──────────────────────────────────────────────────
  aio('cooler-master-masterliquid-lite-120', CM, 'Cooler Master MasterLiquid Lite 120', 'MasterLiquid', 2017, 120, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-lite-240', CM, 'Cooler Master MasterLiquid Lite 240', 'MasterLiquid', 2017, 240, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-pro-240', CM, 'Cooler Master MasterLiquid Pro 240', 'MasterLiquid', 2016, 240),
  aio('cooler-master-masterliquid-pro-280', CM, 'Cooler Master MasterLiquid Pro 280', 'MasterLiquid', 2016, 280),
  aio('cooler-master-masterliquid-ml120l-rgb', CM, 'Cooler Master MasterLiquid ML120L RGB', 'MasterLiquid ML', 2018, 120, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml240l-rgb', CM, 'Cooler Master MasterLiquid ML240L RGB', 'MasterLiquid ML', 2018, 240, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml120l-v2-rgb', CM, 'Cooler Master MasterLiquid ML120L V2 RGB', 'MasterLiquid ML', 2020, 120, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml240l-v2-rgb', CM, 'Cooler Master MasterLiquid ML240L V2 RGB', 'MasterLiquid ML', 2020, 240, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml240l-v2-argb', CM, 'Cooler Master MasterLiquid ML240L V2 ARGB', 'MasterLiquid ML', 2020, 240, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml360l-v2-argb', CM, 'Cooler Master MasterLiquid ML360L V2 ARGB', 'MasterLiquid ML', 2020, 360, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-ml240r-rgb', CM, 'Cooler Master MasterLiquid ML240R RGB', 'MasterLiquid ML', 2018, 240),
  aio('cooler-master-masterliquid-ml360r-rgb', CM, 'Cooler Master MasterLiquid ML360R RGB', 'MasterLiquid ML', 2018, 360),
  aio('cooler-master-masterliquid-ml240-illusion', CM, 'Cooler Master MasterLiquid ML240 Illusion', 'MasterLiquid ML', 2020, 240),
  aio('cooler-master-masterliquid-ml360-illusion', CM, 'Cooler Master MasterLiquid ML360 Illusion', 'MasterLiquid ML', 2020, 360),
  aio('cooler-master-masterliquid-ml280-mirror', CM, 'Cooler Master MasterLiquid ML280 Mirror', 'MasterLiquid ML', 2020, 280),
  aio('cooler-master-masterliquid-ml360-sub-zero', CM, 'Cooler Master MasterLiquid ML360 Sub-Zero', 'MasterLiquid ML', 2020, 360, { tags: ['gaming', 'creation'] }),
  aio('cooler-master-masterliquid-pl240-flux', CM, 'Cooler Master MasterLiquid PL240 Flux', 'MasterLiquid PL', 2021, 240),
  aio('cooler-master-masterliquid-pl360-flux', CM, 'Cooler Master MasterLiquid PL360 Flux', 'MasterLiquid PL', 2021, 360),
  aio('cooler-master-masterliquid-240l-core-argb', CM, 'Cooler Master MasterLiquid 240L Core ARGB', 'MasterLiquid Core', 2022, 240, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-360l-core-argb', CM, 'Cooler Master MasterLiquid 360L Core ARGB', 'MasterLiquid Core', 2022, 360, { tags: ['gaming', 'budget'] }),
  aio('cooler-master-masterliquid-240-atmos', CM, 'Cooler Master MasterLiquid 240 Atmos', 'MasterLiquid Atmos', 2023, 240),
  aio('cooler-master-masterliquid-360-atmos', CM, 'Cooler Master MasterLiquid 360 Atmos', 'MasterLiquid Atmos', 2023, 360),
  aio('cooler-master-masterliquid-360-ion', CM, 'Cooler Master MasterLiquid 360 Ion', 'MasterLiquid Ion', 2023, 360),
];
