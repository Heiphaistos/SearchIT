import type { CatalogProduct } from '../types.js';

/*
 * Catalogue de référence : mémoire vive (extension). Chaque kit réel (capacité × modules,
 * fréquence, latence) est un produit distinct. Tension omise quand elle n'est pas certaine.
 */

type Fmt = 'DIMM' | 'SO-DIMM' | 'RDIMM' | 'LRDIMM' | 'UDIMM' | 'CUDIMM' | 'LPCAMM2';
/** f : format (UDIMM = ECC non bufferisée), nocl : mémoire JEDEC sans profil (latence hors du nom), pn : référence constructeur. */
type Opt = { f?: Fmt; rgb?: boolean; v?: string; t?: string[]; pn?: string; nocl?: boolean; y?: number };
type Row = [kit: string, freq: number, cl: number | null, o?: Opt];

const slug = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function tension(type: string, f: Fmt, freq: number, cl: number | null, jedec: boolean): string | undefined {
  if (type === 'DDR3') return freq <= 1866 ? '1,5 V' : undefined;
  if (type === 'DDR4') {
    if (jedec || freq <= 2666 || (freq <= 3200 && (cl ?? 0) >= 19)) return '1,2 V';
    if (freq <= 3600 && (cl ?? 0) >= 15) return '1,35 V';
    return undefined;
  }
  if (type === 'DDR5') {
    if (jedec || freq <= 4800 || (f === 'SO-DIMM' && freq <= 5600)) return '1,1 V';
    return undefined;
  }
  return undefined;
}

function g(brand: string, line: string, family: string, year: number, type: string, base: Opt, rows: Row[]): CatalogProduct[] {
  return rows.map(([kit, freq, cl, extra]) => {
    const o: Opt = { ...base, ...extra };
    const [n, m] = kit.split('x').map(Number);
    const cap = n * m;
    const f: Fmt = o.f ?? 'DIMM';
    const ecc = f === 'RDIMM' || f === 'LRDIMM' || f === 'UDIMM';
    const jedec = !!o.nocl || ecc;
    const prefix = line ? `${brand} ${line}` : brand;
    const capS = n > 1 ? `${cap} Go (${n} x ${m} Go)` : `${cap} Go`;
    const clS = !jedec && cl ? ` CL${cl}` : '';
    let fS = f === 'DIMM' ? '' : f === 'UDIMM' ? ' ECC UDIMM' : f === 'RDIMM' ? ' ECC RDIMM' : f === 'LRDIMM' ? ' ECC LRDIMM' : ` ${f}`;
    if (f !== 'DIMM' && !ecc && line.includes(f)) fS = '';
    const name = `${prefix} ${capS} ${type}-${freq}${clS}${fS}${o.pn ? ` (${o.pn})` : ''}`;
    const id = slug(['ram', brand, line, `${cap}gb`, n > 1 ? kit : '', type, String(freq), !jedec && cl ? `c${cl}` : '',
      f === 'DIMM' ? '' : ecc ? `ecc ${f}` : f, o.pn ?? ''].filter(Boolean).join(' '));
    const mobile = f === 'SO-DIMM' || f === 'LPCAMM2';
    const tags = o.t ?? (ecc
      ? (cap >= 64 ? ['serveur', 'homelab', 'pro', 'ia'] : ['serveur', 'homelab', 'pro'])
      : mobile
        ? (jedec ? ['mobile', 'bureautique', 'budget'] : ['mobile', 'gaming'])
        : jedec
          ? ['bureautique', 'budget']
          : type === 'DDR3'
            ? ['gaming', 'budget']
            : ['gaming', ...(cap >= 64 ? ['creation'] : []), ...(cap >= 96 ? ['ia'] : [])]);
    const specs: Record<string, string | number> = {
      'Type': f === 'RDIMM' ? `${type} ECC Registered` : f === 'LRDIMM' ? `${type} ECC Load-Reduced` : f === 'UDIMM' ? `${type} ECC` : type,
      'Capacité': `${cap} Go`,
      'Kit': `${n} x ${m} Go`,
      'Fréquence': `${freq} MT/s`,
    };
    if (cl) specs['Latence'] = `CL${cl}`;
    const v = o.v ?? tension(type, f, freq, cl, jedec);
    if (v) specs['Tension'] = v;
    specs['Format'] = f === 'UDIMM' ? 'UDIMM' : f;
    specs['RGB'] = (o.rgb ?? /RGB/.test(line)) ? 'Oui' : 'Non';
    const p: CatalogProduct = { id, category: 'ram', brand, name, family, year: o.y ?? year, specs, tags };
    if (type.startsWith('DDR3') || type === 'DDR4' || ecc) p.refurbishable = true;
    return p;
  });
}

export const PRODUCTS: CatalogProduct[] = [
  // ─── Corsair Vengeance LPX DDR4 ───
  ...g('Corsair', 'Vengeance LPX', 'Vengeance LPX', 2015, 'DDR4', {}, [
    ['2x4', 2133, 13], ['2x4', 2400, 16], ['2x4', 3000, 15], ['1x8', 2400, 16], ['1x8', 3200, 16, { y: 2017 }],
    ['2x8', 2133, 13], ['2x8', 2400, 16], ['2x8', 2666, 16, { y: 2016 }], ['2x8', 3000, 15], ['2x8', 3600, 18, { y: 2018 }],
    ['1x16', 2666, 16, { y: 2017 }], ['1x16', 3200, 16, { y: 2018 }], ['2x16', 2400, 16, { y: 2016 }], ['2x16', 2666, 16, { y: 2016 }],
    ['2x16', 3000, 15, { y: 2016 }], ['2x16', 3600, 18, { y: 2019 }], ['4x8', 3200, 16, { y: 2017 }], ['4x16', 2666, 16, { y: 2016 }],
    ['4x16', 3200, 16, { y: 2018 }], ['1x32', 3200, 16, { y: 2020 }], ['2x32', 3200, 16, { y: 2019 }], ['2x32', 3600, 18, { y: 2019 }],
    ['4x32', 3200, 16, { y: 2019 }], ['4x32', 3600, 18, { y: 2019 }],
  ]),
  ...g('Corsair', 'Value Select', 'Value Select', 2015, 'DDR4', { nocl: true }, [
    ['1x8', 2133, 15], ['1x8', 2666, 18, { y: 2017 }], ['1x16', 2666, 18, { y: 2017 }],
  ]),
  // ─── Corsair Vengeance RGB Pro / SL / RS DDR4 ───
  ...g('Corsair', 'Vengeance RGB Pro', 'Vengeance RGB Pro', 2018, 'DDR4', {}, [
    ['2x8', 3000, 15], ['2x8', 3200, 16], ['2x8', 3600, 18], ['4x8', 3200, 16], ['2x16', 3200, 16], ['4x16', 3200, 16],
    ['4x16', 3600, 18, { y: 2019 }], ['2x32', 3200, 16, { y: 2019 }], ['2x32', 3600, 18, { y: 2019 }], ['4x32', 3200, 16, { y: 2019 }],
  ]),
  ...g('Corsair', 'Vengeance RGB Pro SL', 'Vengeance RGB Pro SL', 2020, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16], ['2x16', 3600, 18],
  ]),
  ...g('Corsair', 'Vengeance RGB RS', 'Vengeance RGB RS', 2021, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x16', 3200, 16], ['2x16', 3600, 18],
  ]),
  ...g('Corsair', 'Dominator Platinum RGB', 'Dominator Platinum RGB DDR4', 2019, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x8', 3600, 18], ['4x8', 3200, 16], ['2x16', 3200, 16], ['2x16', 3600, 18], ['4x16', 3200, 16],
  ]),
  // ─── Corsair DDR5 ───
  ...g('Corsair', 'Vengeance', 'Vengeance DDR5', 2022, 'DDR5', {}, [
    ['2x16', 4800, 40, { y: 2021 }], ['2x16', 5200, 40], ['2x16', 5600, 36], ['2x16', 6000, 36], ['2x16', 6400, 32, { y: 2023 }],
    ['2x32', 4800, 40, { y: 2021 }], ['2x32', 5200, 40], ['2x32', 5600, 40], ['2x32', 6000, 30, { y: 2023 }], ['2x32', 6400, 32, { y: 2023 }],
    ['2x48', 5600, 40, { y: 2023 }], ['4x48', 5200, 38, { y: 2023 }],
  ]),
  ...g('Corsair', 'Vengeance RGB', 'Vengeance RGB DDR5', 2022, 'DDR5', {}, [
    ['2x16', 5200, 40], ['2x16', 5600, 36], ['2x16', 6000, 36], ['2x16', 6000, 30, { y: 2023 }], ['2x16', 6400, 32, { y: 2023 }],
    ['2x16', 7200, 34, { y: 2023 }], ['2x32', 5600, 40], ['2x32', 6400, 32, { y: 2023 }],
  ]),
  ...g('Corsair', 'Dominator Platinum RGB', 'Dominator Platinum RGB DDR5', 2021, 'DDR5', {}, [
    ['2x16', 5200, 40], ['2x16', 5600, 36, { y: 2022 }], ['2x16', 6000, 36, { y: 2022 }], ['2x16', 6200, 36, { y: 2022 }],
    ['2x16', 6400, 32, { y: 2022 }], ['2x32', 5200, 40, { y: 2022 }], ['2x32', 5600, 40, { y: 2022 }],
  ]),
  ...g('Corsair', 'Dominator Titanium RGB', 'Dominator Titanium', 2023, 'DDR5', {}, [
    ['2x16', 6000, 30], ['2x16', 6600, 32], ['2x16', 7200, 34], ['2x32', 6000, 30], ['2x32', 6400, 32],
  ]),
  // ─── Corsair SO-DIMM ───
  ...g('Corsair', 'Vengeance', 'Vengeance SO-DIMM DDR4', 2016, 'DDR4', { f: 'SO-DIMM' }, [
    ['2x8', 2400, 16], ['2x8', 2666, 18, { y: 2017 }], ['2x16', 2666, 18, { y: 2017 }], ['1x16', 3200, 22, { y: 2020 }],
    ['1x32', 3200, 22, { y: 2020 }], ['2x8', 3200, 22, { y: 2020 }], ['2x16', 3200, 22, { y: 2020 }], ['2x32', 3200, 22, { y: 2020 }],
  ]),
  ...g('Corsair', 'Vengeance', 'Vengeance SO-DIMM DDR5', 2021, 'DDR5', { f: 'SO-DIMM' }, [
    ['1x16', 4800, 40], ['1x32', 4800, 40], ['2x16', 4800, 40], ['2x32', 4800, 40],
    ['1x32', 5600, 48, { y: 2023 }], ['2x16', 5600, 48, { y: 2023 }], ['2x32', 5600, 48, { y: 2023 }],
  ]),
  // ─── Corsair DDR3 (occasion) ───
  ...g('Corsair', 'Vengeance', 'Vengeance DDR3', 2012, 'DDR3', {}, [
    ['2x4', 1600, 9], ['2x8', 1600, 9], ['2x8', 1600, 10], ['4x4', 1600, 9],
  ]),
  ...g('Corsair', 'Vengeance LP', 'Vengeance LP DDR3', 2012, 'DDR3', {}, [['2x4', 1600, 9]]),
  ...g('Corsair', 'Vengeance Pro', 'Vengeance Pro DDR3', 2013, 'DDR3', {}, [['2x4', 1600, 9], ['2x8', 1866, 9], ['2x8', 2400, 11]]),
  ...g('Corsair', 'Dominator Platinum', 'Dominator Platinum DDR3', 2013, 'DDR3', {}, [['2x8', 2400, 10]]),
  ...g('Corsair', 'Vengeance', 'Vengeance SO-DIMM DDR3', 2012, 'DDR3', { f: 'SO-DIMM', t: ['mobile', 'bureautique', 'budget'] }, [
    ['2x4', 1600, 9], ['2x8', 1600, 10],
  ]),
  ...g('Corsair', 'Value Select', 'Value Select DDR3', 2012, 'DDR3', { nocl: true }, [['1x4', 1333, 9], ['1x8', 1600, 11]]),
];
