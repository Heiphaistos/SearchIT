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
  // ─── Crucial Ballistix (DDR4, occasion) ───
  ...g('Crucial', 'Ballistix', 'Ballistix', 2019, 'DDR4', {}, [
    ['1x8', 3200, 16], ['1x16', 3200, 16], ['2x8', 3000, 15], ['2x8', 3200, 16], ['2x8', 3600, 16], ['2x16', 3000, 15],
    ['2x16', 3200, 16], ['2x16', 3600, 16], ['2x32', 3200, 16, { y: 2020 }], ['2x32', 3600, 16, { y: 2020 }],
  ]),
  ...g('Crucial', 'Ballistix RGB', 'Ballistix', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 16], ['2x16', 3200, 16], ['2x16', 3600, 16]]),
  ...g('Crucial', 'Ballistix MAX', 'Ballistix MAX', 2019, 'DDR4', {}, [['2x8', 4000, 18], ['2x8', 4400, 19], ['2x8', 5100, 19, { y: 2020 }], ['2x16', 4000, 18]]),
  ...g('Crucial', 'Ballistix MAX RGB', 'Ballistix MAX', 2020, 'DDR4', {}, [['2x8', 4000, 18]]),
  ...g('Crucial', 'Ballistix Sport LT', 'Ballistix Sport LT', 2016, 'DDR4', {}, [['1x8', 2400, 16], ['2x8', 2400, 16], ['2x8', 2666, 16], ['2x8', 3000, 15]]),
  ...g('Crucial', 'Ballistix Sport', 'Ballistix Sport DDR3', 2012, 'DDR3', {}, [['2x4', 1600, 9], ['2x8', 1600, 9]]),
  // ─── Crucial DDR4 standard / Pro ───
  ...g('Crucial', '', 'Crucial DDR4', 2016, 'DDR4', { nocl: true }, [
    ['1x4', 2400, 17], ['1x8', 2400, 17], ['1x16', 2400, 17], ['1x8', 2666, 19, { y: 2017 }], ['1x16', 2666, 19, { y: 2017 }],
    ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }], ['2x16', 3200, 22, { y: 2020 }],
  ]),
  ...g('Crucial', 'Pro', 'Crucial Pro DDR4', 2023, 'DDR4', { t: ['bureautique', 'gaming'] }, [['1x16', 3200, 22], ['2x8', 3200, 22], ['2x32', 3200, 22]]),
  ...g('Crucial', '', 'Crucial SO-DIMM', 2016, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 2400, 17], ['1x16', 2400, 17], ['1x8', 2666, 19, { y: 2017 }], ['1x16', 2666, 19, { y: 2017 }],
    ['1x8', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }], ['2x8', 3200, 22, { y: 2020 }], ['2x16', 3200, 22, { y: 2020 }], ['2x32', 3200, 22, { y: 2020 }],
  ]),
  // ─── Crucial DDR5 ───
  ...g('Crucial', '', 'Crucial DDR5', 2021, 'DDR5', { nocl: true }, [
    ['1x8', 4800, 40], ['1x16', 4800, 40], ['1x32', 4800, 40], ['2x16', 4800, 40], ['2x32', 4800, 40],
    ['1x16', 5200, 42, { y: 2022 }], ['1x32', 5200, 42, { y: 2022 }], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }],
    ['1x48', 5600, 46, { y: 2023 }], ['2x16', 5600, 46, { y: 2023 }], ['2x32', 5600, 46, { y: 2023 }],
  ]),
  ...g('Crucial', 'Pro', 'Crucial Pro DDR5', 2023, 'DDR5', {}, [['2x24', 5600, 46], ['2x48', 5600, 46], ['2x16', 6000, 48, { y: 2024 }], ['2x32', 6000, 48, { y: 2024 }]]),
  ...g('Crucial', 'Pro OC', 'Crucial Pro OC DDR5', 2024, 'DDR5', {}, [['2x16', 6000, 36], ['2x16', 6400, 38]]),
  ...g('Crucial', '', 'Crucial CUDIMM', 2024, 'DDR5', { nocl: true, f: 'CUDIMM' }, [['1x16', 6400, 52], ['1x32', 6400, 52]]),
  ...g('Crucial', '', 'Crucial SO-DIMM', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 4800, 40], ['1x16', 4800, 40], ['1x32', 4800, 40], ['2x16', 4800, 40], ['2x32', 4800, 40],
    ['1x16', 5200, 42, { y: 2022 }], ['1x16', 5600, 46, { y: 2023 }], ['1x48', 5600, 46, { y: 2023 }],
    ['2x16', 5600, 46, { y: 2023 }], ['2x32', 5600, 46, { y: 2023 }],
  ]),
  ...g('Crucial', 'LPCAMM2', 'Crucial LPCAMM2', 2024, 'LPDDR5X', { nocl: true, f: 'LPCAMM2' }, [['1x32', 7500, null], ['1x64', 7500, null]]),
  // ─── Crucial DDR3 ───
  ...g('Crucial', '', 'Crucial DDR3', 2012, 'DDR3', { nocl: true }, [['1x4', 1600, 11], ['1x8', 1600, 11]]),
  ...g('Crucial', '', 'Crucial SO-DIMM DDR3', 2013, 'DDR3L', { nocl: true, f: 'SO-DIMM', v: '1,35 V' }, [['1x4', 1600, 11], ['1x8', 1600, 11]]),
  // ─── Lexar ───
  ...g('Lexar', 'Ares RGB', 'Ares RGB DDR5', 2022, 'DDR5', {}, [['2x16', 6000, 30, { y: 2023 }], ['2x16', 6400, 32, { y: 2023 }], ['2x16', 6800, 34, { y: 2023 }], ['2x16', 7200, 34, { y: 2023 }]]),
  ...g('Lexar', 'Ares', 'Ares DDR5', 2023, 'DDR5', {}, [['2x16', 6000, 30]]),
  ...g('Lexar', 'Thor', 'Thor DDR5', 2023, 'DDR5', {}, [['2x16', 6000, 38]]),
  ...g('Lexar', 'Thor OC', 'Thor OC DDR5', 2023, 'DDR5', {}, [['2x16', 6000, 32]]),
  ...g('Lexar', 'Ares RGB', 'Ares RGB DDR4', 2021, 'DDR4', {}, [['2x8', 3600, 18], ['2x16', 3600, 18]]),
  ...g('Lexar', 'Ares', 'Ares DDR4', 2021, 'DDR4', {}, [['2x8', 3600, 18], ['2x16', 3600, 18]]),
  ...g('Lexar', 'Thor', 'Thor DDR4', 2022, 'DDR4', {}, [['2x8', 3200, 16], ['2x16', 3200, 16], ['2x16', 3600, 18]]),
  ...g('Lexar', '', 'Lexar DDR4', 2021, 'DDR4', { nocl: true }, [['1x8', 3200, 22], ['1x16', 3200, 22]]),
  ...g('Lexar', '', 'Lexar SO-DIMM', 2021, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [['1x8', 3200, 22], ['1x16', 3200, 22], ['1x32', 3200, 22]]),
  ...g('Lexar', '', 'Lexar DDR5', 2022, 'DDR5', { nocl: true }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }]]),
  ...g('Lexar', '', 'Lexar SO-DIMM', 2022, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [
    ['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }],
  ]),
];
