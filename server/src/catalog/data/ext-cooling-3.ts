import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « refroidissement » : AIO et ventirads Corsair, NZXT, Lian Li, MSI, ASUS
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
const CO = 'Corsair';
const NZ = 'NZXT';
const LL = 'Lian Li';
const MS = 'MSI';
const AS = 'ASUS';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Corsair : AIO Hydro / iCUE ───────────────────────────────────────────
  aio('corsair-hydro-h45', CO, 'Corsair Hydro Series H45', 'Hydro', 2015, 120, { tags: ['bureautique', 'budget'] }),
  aio('corsair-hydro-h55', CO, 'Corsair Hydro Series H55', 'Hydro', 2013, 120, { tags: ['bureautique', 'budget'] }),
  aio('corsair-hydro-h60', CO, 'Corsair Hydro Series H60', 'Hydro', 2013, 120, { tags: ['gaming', 'budget'] }),
  aio('corsair-hydro-h80i-v2', CO, 'Corsair Hydro Series H80i v2', 'Hydro', 2016, 120),
  aio('corsair-hydro-h90', CO, 'Corsair Hydro Series H90', 'Hydro', 2013, 140),
  aio('corsair-hydro-h100i-v2', CO, 'Corsair Hydro Series H100i v2', 'Hydro', 2016, 240),
  aio('corsair-hydro-h100i-gtx', CO, 'Corsair Hydro Series H100i GTX', 'Hydro', 2014, 240),
  aio('corsair-hydro-h105', CO, 'Corsair Hydro Series H105', 'Hydro', 2014, 240),
  aio('corsair-hydro-h110i', CO, 'Corsair Hydro Series H110i', 'Hydro', 2015, 280),
  aio('corsair-hydro-h115i', CO, 'Corsair Hydro Series H115i', 'Hydro', 2016, 280),
  aio('corsair-hydro-h150i-pro', CO, 'Corsair Hydro Series H150i Pro', 'Hydro', 2018, 360),
  aio('corsair-h100i-pro', CO, 'Corsair Hydro Series H100i Pro', 'Hydro', 2017, 240),
  aio('corsair-h115i-pro', CO, 'Corsair Hydro Series H115i Pro', 'Hydro', 2017, 280),
  aio('corsair-h100i-rgb-platinum', CO, 'Corsair Hydro Series H100i RGB Platinum', 'Hydro Platinum', 2018, 240),
  aio('corsair-h115i-rgb-platinum', CO, 'Corsair Hydro Series H115i RGB Platinum', 'Hydro Platinum', 2018, 280),
  aio('corsair-h100i-rgb-platinum-se', CO, 'Corsair Hydro Series H100i RGB Platinum SE', 'Hydro Platinum', 2019, 240),
  aio('corsair-h100i-rgb-pro-xt', CO, 'Corsair Hydro Series H100i RGB Pro XT', 'Hydro Pro XT', 2019, 240),
  aio('corsair-h115i-rgb-pro-xt', CO, 'Corsair Hydro Series H115i RGB Pro XT', 'Hydro Pro XT', 2019, 280),
  aio('corsair-h150i-rgb-pro-xt', CO, 'Corsair Hydro Series H150i RGB Pro XT', 'Hydro Pro XT', 2019, 360),
  aio('corsair-h60-2018', CO, 'Corsair Hydro Series H60 (2018)', 'Hydro', 2018, 120, { tags: ['gaming', 'budget'] }),
  aio('corsair-icue-h100i-elite-capellix', CO, 'Corsair iCUE H100i Elite Capellix', 'Elite Capellix', 2020, 240),
  aio('corsair-icue-h115i-elite-capellix', CO, 'Corsair iCUE H115i Elite Capellix', 'Elite Capellix', 2020, 280),
  aio('corsair-icue-h150i-elite-capellix', CO, 'Corsair iCUE H150i Elite Capellix', 'Elite Capellix', 2020, 360),
  aio('corsair-icue-h170i-elite-capellix', CO, 'Corsair iCUE H170i Elite Capellix', 'Elite Capellix', 2021, 420),
  aio('corsair-icue-h100i-elite-capellix-white', CO, 'Corsair iCUE H100i Elite Capellix White', 'Elite Capellix', 2021, 240),
  aio('corsair-icue-h150i-elite-capellix-white', CO, 'Corsair iCUE H150i Elite Capellix White', 'Elite Capellix', 2021, 360),
  aio('corsair-icue-h100i-elite-capellix-xt', CO, 'Corsair iCUE H100i Elite Capellix XT', 'Elite Capellix', 2022, 240),
  aio('corsair-icue-h115i-elite-capellix-xt', CO, 'Corsair iCUE H115i Elite Capellix XT', 'Elite Capellix', 2022, 280),
  aio('corsair-icue-h170i-elite-capellix-xt', CO, 'Corsair iCUE H170i Elite Capellix XT', 'Elite Capellix', 2022, 420),
  aio('corsair-icue-h100i-elite-lcd', CO, 'Corsair iCUE H100i Elite LCD', 'Elite LCD', 2021, 240),
  aio('corsair-icue-h150i-elite-lcd', CO, 'Corsair iCUE H150i Elite LCD', 'Elite LCD', 2021, 360),
  aio('corsair-icue-h170i-elite-lcd', CO, 'Corsair iCUE H170i Elite LCD', 'Elite LCD', 2021, 420),
  aio('corsair-icue-h100i-elite-lcd-xt', CO, 'Corsair iCUE H100i Elite LCD XT', 'Elite LCD', 2022, 240),
  aio('corsair-icue-h150i-elite-lcd-xt', CO, 'Corsair iCUE H150i Elite LCD XT', 'Elite LCD', 2022, 360),
  aio('corsair-icue-h170i-elite-lcd-xt', CO, 'Corsair iCUE H170i Elite LCD XT', 'Elite LCD', 2022, 420),
  aio('corsair-icue-h100i-rgb-elite', CO, 'Corsair iCUE H100i RGB Elite', 'RGB Elite', 2021, 240),
  aio('corsair-icue-h115i-rgb-elite', CO, 'Corsair iCUE H115i RGB Elite', 'RGB Elite', 2021, 280),
  aio('corsair-icue-h150i-rgb-elite', CO, 'Corsair iCUE H150i RGB Elite', 'RGB Elite', 2021, 360),
  aio('corsair-icue-h60x-rgb-elite', CO, 'Corsair iCUE H60x RGB Elite', 'RGB Elite', 2022, 120, { tags: ['gaming', 'budget'] }),
  aio('corsair-icue-h100x-rgb-elite', CO, 'Corsair iCUE H100x RGB Elite', 'RGB Elite', 2022, 240),
  aio('corsair-icue-link-h100i-rgb', CO, 'Corsair iCUE LINK H100i RGB', 'iCUE LINK', 2023, 240),
  aio('corsair-icue-link-h115i-rgb', CO, 'Corsair iCUE LINK H115i RGB', 'iCUE LINK', 2023, 280),
  aio('corsair-icue-link-h150i-rgb', CO, 'Corsair iCUE LINK H150i RGB', 'iCUE LINK', 2023, 360),
  aio('corsair-icue-link-h170i-rgb', CO, 'Corsair iCUE LINK H170i RGB', 'iCUE LINK', 2023, 420),
  aio('corsair-icue-link-h100i-lcd', CO, 'Corsair iCUE LINK H100i LCD', 'iCUE LINK', 2023, 240),
  aio('corsair-icue-link-h150i-lcd', CO, 'Corsair iCUE LINK H150i LCD', 'iCUE LINK', 2023, 360),
  aio('corsair-icue-link-h170i-lcd', CO, 'Corsair iCUE LINK H170i LCD', 'iCUE LINK', 2023, 420),
  aio('corsair-icue-link-titan-240-rx-rgb', CO, 'Corsair iCUE LINK TITAN 240 RX RGB', 'iCUE LINK TITAN', 2024, 240),
  aio('corsair-icue-link-titan-280-rx-rgb', CO, 'Corsair iCUE LINK TITAN 280 RX RGB', 'iCUE LINK TITAN', 2024, 280),
  aio('corsair-icue-link-titan-360-rx-rgb', CO, 'Corsair iCUE LINK TITAN 360 RX RGB', 'iCUE LINK TITAN', 2024, 360),
  aio('corsair-icue-link-titan-420-rx-rgb', CO, 'Corsair iCUE LINK TITAN 420 RX RGB', 'iCUE LINK TITAN', 2024, 420),
  aio('corsair-nautilus-240-rs', CO, 'Corsair Nautilus 240 RS', 'Nautilus', 2024, 240, { tags: ['gaming', 'budget'] }),
  aio('corsair-nautilus-360-rs', CO, 'Corsair Nautilus 360 RS', 'Nautilus', 2024, 360, { tags: ['gaming', 'budget'] }),
  aio('corsair-nautilus-240-rs-argb', CO, 'Corsair Nautilus 240 RS ARGB', 'Nautilus', 2024, 240, { tags: ['gaming', 'budget'] }),
  aio('corsair-nautilus-360-rs-argb', CO, 'Corsair Nautilus 360 RS ARGB', 'Nautilus', 2024, 360, { tags: ['gaming', 'budget'] }),
  air('corsair-a500', CO, 'Corsair A500', 'A', 2020, DT, '2 x 120 mm', '2 x ML120', { h: 169 }),
  air('corsair-a115', CO, 'Corsair A115', 'A', 2024, DT, '2 x 140 mm', '2 x 140 mm PWM'),

  // ─── NZXT ─────────────────────────────────────────────────────────────────
  aio('nzxt-kraken-x31', NZ, 'NZXT Kraken X31', 'Kraken X', 2015, 120),
  aio('nzxt-kraken-x41', NZ, 'NZXT Kraken X41', 'Kraken X', 2015, 140),
  aio('nzxt-kraken-x61', NZ, 'NZXT Kraken X61', 'Kraken X', 2015, 280),
  aio('nzxt-kraken-x42', NZ, 'NZXT Kraken X42', 'Kraken X', 2016, 140),
  aio('nzxt-kraken-x52', NZ, 'NZXT Kraken X52', 'Kraken X', 2016, 240),
  aio('nzxt-kraken-x62', NZ, 'NZXT Kraken X62', 'Kraken X', 2016, 280),
  aio('nzxt-kraken-x72', NZ, 'NZXT Kraken X72', 'Kraken X', 2018, 360),
  aio('nzxt-kraken-m22', NZ, 'NZXT Kraken M22', 'Kraken M', 2018, 120, { tags: ['gaming', 'budget'] }),
  aio('nzxt-kraken-x53', NZ, 'NZXT Kraken X53', 'Kraken X', 2019, 240),
  aio('nzxt-kraken-x63', NZ, 'NZXT Kraken X63', 'Kraken X', 2019, 280),
  aio('nzxt-kraken-x73', NZ, 'NZXT Kraken X73', 'Kraken X', 2019, 360),
  aio('nzxt-kraken-x53-rgb', NZ, 'NZXT Kraken X53 RGB', 'Kraken X', 2021, 240),
  aio('nzxt-kraken-x63-rgb', NZ, 'NZXT Kraken X63 RGB', 'Kraken X', 2021, 280),
  aio('nzxt-kraken-x73-rgb', NZ, 'NZXT Kraken X73 RGB', 'Kraken X', 2021, 360),
  aio('nzxt-kraken-z53', NZ, 'NZXT Kraken Z53', 'Kraken Z', 2020, 240),
  aio('nzxt-kraken-z63', NZ, 'NZXT Kraken Z63', 'Kraken Z', 2020, 280),
  aio('nzxt-kraken-z73', NZ, 'NZXT Kraken Z73', 'Kraken Z', 2020, 360),
  aio('nzxt-kraken-z73-rgb', NZ, 'NZXT Kraken Z73 RGB', 'Kraken Z', 2021, 360),
  aio('nzxt-kraken-120', NZ, 'NZXT Kraken 120', 'Kraken 2023', 2023, 120, { tags: ['gaming', 'budget'] }),
  aio('nzxt-kraken-240', NZ, 'NZXT Kraken 240', 'Kraken 2023', 2023, 240),
  aio('nzxt-kraken-280', NZ, 'NZXT Kraken 280', 'Kraken 2023', 2023, 280),
  aio('nzxt-kraken-240-rgb', NZ, 'NZXT Kraken 240 RGB', 'Kraken 2023', 2023, 240),
  aio('nzxt-kraken-280-rgb', NZ, 'NZXT Kraken 280 RGB', 'Kraken 2023', 2023, 280),
  aio('nzxt-kraken-360-rgb', NZ, 'NZXT Kraken 360 RGB', 'Kraken 2023', 2023, 360),
  aio('nzxt-kraken-elite-240', NZ, 'NZXT Kraken Elite 240', 'Kraken Elite', 2023, 240),
  aio('nzxt-kraken-elite-280', NZ, 'NZXT Kraken Elite 280', 'Kraken Elite', 2023, 280),
  aio('nzxt-kraken-elite-360', NZ, 'NZXT Kraken Elite 360', 'Kraken Elite', 2023, 360),
  aio('nzxt-kraken-elite-240-rgb', NZ, 'NZXT Kraken Elite 240 RGB', 'Kraken Elite', 2023, 240),
  aio('nzxt-kraken-elite-280-rgb', NZ, 'NZXT Kraken Elite 280 RGB', 'Kraken Elite', 2023, 280),
  aio('nzxt-kraken-elite-360-rgb', NZ, 'NZXT Kraken Elite 360 RGB', 'Kraken Elite', 2023, 360),
  air('nzxt-t120', NZ, 'NZXT T120', 'T120', 2023, T, '120 mm', '1 x F120P', { h: 159 }),
  air('nzxt-t120-rgb', NZ, 'NZXT T120 RGB', 'T120', 2023, T, '120 mm', '1 x F120 RGB', { h: 159 }),

  // ─── Lian Li ──────────────────────────────────────────────────────────────
  aio('lian-li-galahad-240', LL, 'Lian Li Galahad 240 AIO', 'Galahad', 2021, 240),
  aio('lian-li-galahad-360', LL, 'Lian Li Galahad 360 AIO', 'Galahad', 2021, 360),
  aio('lian-li-galahad-240-uni-fan-sl', LL, 'Lian Li Galahad 240 AIO UNI FAN SL', 'Galahad', 2021, 240),
  aio('lian-li-galahad-360-uni-fan-sl', LL, 'Lian Li Galahad 360 AIO UNI FAN SL', 'Galahad', 2021, 360),
  aio('lian-li-galahad-ii-trinity-240', LL, 'Lian Li Galahad II Trinity 240', 'Galahad II', 2023, 240),
  aio('lian-li-galahad-ii-trinity-360', LL, 'Lian Li Galahad II Trinity 360', 'Galahad II', 2023, 360),
  aio('lian-li-galahad-ii-trinity-performance-240', LL, 'Lian Li Galahad II Trinity Performance 240', 'Galahad II', 2023, 240),
  aio('lian-li-galahad-ii-trinity-performance-360', LL, 'Lian Li Galahad II Trinity Performance 360', 'Galahad II', 2023, 360),
  aio('lian-li-galahad-ii-lcd-280', LL, 'Lian Li Galahad II LCD 280', 'Galahad II', 2023, 280),
  aio('lian-li-galahad-ii-lcd-360', LL, 'Lian Li Galahad II LCD 360', 'Galahad II', 2023, 360),

  // ─── MSI ──────────────────────────────────────────────────────────────────
  aio('msi-mag-coreliquid-240r', MS, 'MSI MAG Coreliquid 240R', 'MAG Coreliquid', 2020, 240),
  aio('msi-mag-coreliquid-360r', MS, 'MSI MAG Coreliquid 360R', 'MAG Coreliquid', 2020, 360),
  aio('msi-mag-coreliquid-240r-v2', MS, 'MSI MAG Coreliquid 240R V2', 'MAG Coreliquid', 2021, 240),
  aio('msi-mag-coreliquid-360r-v2', MS, 'MSI MAG Coreliquid 360R V2', 'MAG Coreliquid', 2021, 360),
  aio('msi-mag-coreliquid-c240', MS, 'MSI MAG Coreliquid C240', 'MAG Coreliquid', 2021, 240),
  aio('msi-mag-coreliquid-c360', MS, 'MSI MAG Coreliquid C360', 'MAG Coreliquid', 2021, 360),
  aio('msi-mag-coreliquid-m240', MS, 'MSI MAG Coreliquid M240', 'MAG Coreliquid', 2022, 240, { tags: ['gaming', 'budget'] }),
  aio('msi-mag-coreliquid-m360', MS, 'MSI MAG Coreliquid M360', 'MAG Coreliquid', 2022, 360, { tags: ['gaming', 'budget'] }),
  aio('msi-mag-coreliquid-e240', MS, 'MSI MAG Coreliquid E240', 'MAG Coreliquid', 2023, 240),
  aio('msi-mag-coreliquid-e360', MS, 'MSI MAG Coreliquid E360', 'MAG Coreliquid', 2023, 360),
  aio('msi-mag-coreliquid-i240', MS, 'MSI MAG Coreliquid I240', 'MAG Coreliquid', 2024, 240),
  aio('msi-mag-coreliquid-i360', MS, 'MSI MAG Coreliquid I360', 'MAG Coreliquid', 2024, 360),
  aio('msi-mag-coreliquid-a13-240', MS, 'MSI MAG Coreliquid A13 240', 'MAG Coreliquid', 2024, 240),
  aio('msi-mag-coreliquid-a13-360', MS, 'MSI MAG Coreliquid A13 360', 'MAG Coreliquid', 2024, 360),
  aio('msi-mpg-coreliquid-k240', MS, 'MSI MPG Coreliquid K240', 'MPG Coreliquid', 2021, 240),
  aio('msi-mpg-coreliquid-k360', MS, 'MSI MPG Coreliquid K360', 'MPG Coreliquid', 2021, 360),
  aio('msi-meg-coreliquid-s280', MS, 'MSI MEG Coreliquid S280', 'MEG Coreliquid', 2021, 280),
  aio('msi-meg-coreliquid-s360', MS, 'MSI MEG Coreliquid S360', 'MEG Coreliquid', 2021, 360),

  // ─── ASUS ─────────────────────────────────────────────────────────────────
  aio('asus-rog-ryujin-240', AS, 'ASUS ROG Ryujin 240', 'ROG Ryujin', 2019, 240),
  aio('asus-rog-ryujin-360', AS, 'ASUS ROG Ryujin 360', 'ROG Ryujin', 2019, 360),
  aio('asus-rog-ryujin-ii-240', AS, 'ASUS ROG Ryujin II 240', 'ROG Ryujin II', 2021, 240),
  aio('asus-rog-ryujin-ii-360', AS, 'ASUS ROG Ryujin II 360', 'ROG Ryujin II', 2021, 360),
  aio('asus-rog-ryujin-ii-360-argb', AS, 'ASUS ROG Ryujin II 360 ARGB', 'ROG Ryujin II', 2022, 360),
  aio('asus-rog-ryujin-iii-240', AS, 'ASUS ROG Ryujin III 240', 'ROG Ryujin III', 2023, 240),
  aio('asus-rog-ryujin-iii-360', AS, 'ASUS ROG Ryujin III 360', 'ROG Ryujin III', 2023, 360),
  aio('asus-rog-ryujin-iii-360-argb', AS, 'ASUS ROG Ryujin III 360 ARGB', 'ROG Ryujin III', 2023, 360),
  aio('asus-rog-ryuo-120', AS, 'ASUS ROG Ryuo 120', 'ROG Ryuo', 2018, 120),
  aio('asus-rog-ryuo-240', AS, 'ASUS ROG Ryuo 240', 'ROG Ryuo', 2018, 240),
  aio('asus-rog-ryuo-iii-240-argb', AS, 'ASUS ROG Ryuo III 240 ARGB', 'ROG Ryuo III', 2023, 240),
  aio('asus-rog-ryuo-iii-360-argb', AS, 'ASUS ROG Ryuo III 360 ARGB', 'ROG Ryuo III', 2023, 360),
  aio('asus-rog-strix-lc-120', AS, 'ASUS ROG Strix LC 120', 'ROG Strix LC', 2019, 120),
  aio('asus-rog-strix-lc-240', AS, 'ASUS ROG Strix LC 240', 'ROG Strix LC', 2019, 240),
  aio('asus-rog-strix-lc-360', AS, 'ASUS ROG Strix LC 360', 'ROG Strix LC', 2019, 360),
  aio('asus-rog-strix-lc-240-rgb', AS, 'ASUS ROG Strix LC 240 RGB', 'ROG Strix LC', 2020, 240),
  aio('asus-rog-strix-lc-360-rgb', AS, 'ASUS ROG Strix LC 360 RGB', 'ROG Strix LC', 2020, 360),
  aio('asus-rog-strix-lc-ii-240', AS, 'ASUS ROG Strix LC II 240', 'ROG Strix LC II', 2021, 240),
  aio('asus-rog-strix-lc-ii-280', AS, 'ASUS ROG Strix LC II 280', 'ROG Strix LC II', 2021, 280),
  aio('asus-rog-strix-lc-ii-360', AS, 'ASUS ROG Strix LC II 360', 'ROG Strix LC II', 2021, 360),
  aio('asus-rog-strix-lc-ii-240-argb', AS, 'ASUS ROG Strix LC II 240 ARGB', 'ROG Strix LC II', 2021, 240),
  aio('asus-rog-strix-lc-ii-280-argb', AS, 'ASUS ROG Strix LC II 280 ARGB', 'ROG Strix LC II', 2021, 280),
  aio('asus-rog-strix-lc-ii-360-argb', AS, 'ASUS ROG Strix LC II 360 ARGB', 'ROG Strix LC II', 2021, 360),
  aio('asus-rog-strix-lc-iii-240-argb', AS, 'ASUS ROG Strix LC III 240 ARGB', 'ROG Strix LC III', 2024, 240),
  aio('asus-rog-strix-lc-iii-360-argb', AS, 'ASUS ROG Strix LC III 360 ARGB', 'ROG Strix LC III', 2024, 360),
  aio('asus-tuf-gaming-lc-240-rgb', AS, 'ASUS TUF Gaming LC 240 RGB', 'TUF Gaming LC', 2020, 240, { tags: ['gaming', 'budget'] }),
  aio('asus-tuf-gaming-lc-240-argb', AS, 'ASUS TUF Gaming LC 240 ARGB', 'TUF Gaming LC', 2021, 240, { tags: ['gaming', 'budget'] }),
  aio('asus-proart-lc-420', AS, 'ASUS ProArt LC 420', 'ProArt LC', 2023, 420, { tags: ['creation', 'pro'] }),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [LP, TD, SRV, HTPC];
