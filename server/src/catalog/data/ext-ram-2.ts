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
  // ─── G.Skill DDR4 ───
  ...g('G.Skill', 'Ripjaws V', 'Ripjaws V', 2015, 'DDR4', {}, [
    ['2x8', 2400, 15], ['2x8', 3000, 16], ['2x8', 3200, 16], ['2x8', 3600, 16, { y: 2019 }], ['2x8', 3600, 18, { y: 2019 }],
    ['1x8', 3200, 16, { y: 2017 }], ['1x16', 3200, 16, { y: 2017 }], ['2x16', 3000, 16, { y: 2016 }], ['2x16', 3200, 16, { y: 2016 }],
    ['2x16', 3200, 14, { y: 2017 }], ['2x16', 3600, 18, { y: 2019 }], ['4x16', 3200, 16, { y: 2017 }], ['2x32', 3200, 16, { y: 2019 }],
    ['2x32', 3600, 18, { y: 2019 }], ['4x32', 3200, 16, { y: 2019 }], ['4x32', 3600, 18, { y: 2019 }],
  ]),
  ...g('G.Skill', 'Ripjaws 4', 'Ripjaws 4', 2014, 'DDR4', {}, [['4x4', 2133, 15], ['4x4', 2400, 15]]),
  ...g('G.Skill', 'Aegis', 'Aegis', 2016, 'DDR4', { t: ['gaming', 'budget'] }, [
    ['1x8', 2400, 15], ['2x8', 3000, 16], ['2x8', 3200, 16], ['1x16', 3200, 16, { y: 2019 }], ['2x16', 3000, 16], ['2x16', 3200, 16, { y: 2019 }],
  ]),
  ...g('G.Skill', 'Trident Z', 'Trident Z', 2015, 'DDR4', {}, [
    ['2x8', 3000, 15], ['2x8', 3200, 16], ['2x8', 3200, 14, { y: 2016 }], ['2x16', 3200, 14, { y: 2016 }], ['2x16', 3200, 16, { y: 2016 }],
  ]),
  ...g('G.Skill', 'Trident Z RGB', 'Trident Z RGB', 2017, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x8', 3200, 14], ['2x8', 3600, 17], ['4x8', 3200, 16], ['2x16', 3200, 16], ['2x16', 3200, 14],
    ['2x16', 3600, 18, { y: 2018 }], ['4x16', 3200, 16],
  ]),
  ...g('G.Skill', 'Trident Z Neo', 'Trident Z Neo', 2019, 'DDR4', { rgb: true }, [
    ['2x8', 3200, 16], ['2x8', 3600, 16], ['2x8', 3600, 18], ['2x8', 3600, 14], ['4x8', 3600, 16], ['2x16', 3200, 16],
    ['2x16', 3600, 14], ['2x16', 3600, 16], ['2x16', 3600, 18], ['4x16', 3600, 16], ['2x32', 3600, 16, { y: 2020 }],
    ['2x32', 3600, 18, { y: 2020 }], ['4x32', 3600, 18, { y: 2020 }],
  ]),
  ...g('G.Skill', 'Trident Z Royal', 'Trident Z Royal', 2019, 'DDR4', { rgb: true }, [
    ['2x8', 3200, 16], ['2x8', 3600, 16], ['2x16', 3200, 16], ['2x16', 3600, 16],
  ]),
  ...g('G.Skill', 'Flare X', 'Flare X', 2017, 'DDR4', {}, [['2x8', 3200, 14]]),
  // ─── G.Skill DDR5 ───
  ...g('G.Skill', 'Ripjaws S5', 'Ripjaws S5', 2022, 'DDR5', {}, [
    ['2x16', 5200, 36], ['2x16', 5600, 36], ['2x16', 6000, 32], ['2x16', 6000, 36], ['2x16', 6400, 32, { y: 2023 }],
    ['2x32', 5600, 36], ['2x32', 6000, 30, { y: 2023 }], ['2x32', 6400, 32, { y: 2023 }], ['2x48', 5600, 40, { y: 2023 }],
    ['2x48', 6400, 32, { y: 2023 }],
  ]),
  ...g('G.Skill', 'Ripjaws M5 RGB', 'Ripjaws M5 RGB', 2024, 'DDR5', {}, [['2x16', 6000, 30], ['2x16', 6400, 32]]),
  ...g('G.Skill', 'Flare X5', 'Flare X5', 2022, 'DDR5', {}, [
    ['2x16', 5600, 36], ['2x16', 6000, 32], ['2x16', 6000, 36], ['2x32', 6000, 30, { y: 2023 }],
  ]),
  ...g('G.Skill', 'Trident Z5', 'Trident Z5', 2021, 'DDR5', {}, [['2x16', 5600, 36], ['2x16', 6000, 36]]),
  ...g('G.Skill', 'Trident Z5 RGB', 'Trident Z5 RGB', 2021, 'DDR5', {}, [
    ['2x16', 5600, 36], ['2x16', 6000, 32, { y: 2022 }], ['2x16', 6400, 32, { y: 2022 }], ['2x16', 6800, 34, { y: 2022 }],
    ['2x16', 7200, 34, { y: 2022 }], ['2x16', 7600, 36, { y: 2023 }], ['2x16', 8000, 38, { y: 2023 }],
    ['2x32', 6000, 30, { y: 2023 }], ['2x32', 6400, 32, { y: 2023 }], ['2x48', 6400, 32, { y: 2023 }],
  ]),
  ...g('G.Skill', 'Trident Z5 Neo RGB', 'Trident Z5 Neo', 2022, 'DDR5', {}, [
    ['2x16', 6000, 32], ['2x16', 6000, 36], ['2x16', 6000, 28, { y: 2024 }], ['2x16', 6400, 32, { y: 2023 }], ['2x32', 6000, 30, { y: 2023 }],
  ]),
  ...g('G.Skill', 'Trident Z5 Neo', 'Trident Z5 Neo', 2022, 'DDR5', {}, [['2x16', 6000, 30]]),
  ...g('G.Skill', 'Trident Z5 Royal', 'Trident Z5 Royal', 2023, 'DDR5', { rgb: true }, [['2x16', 6400, 32], ['2x16', 7200, 34]]),
  ...g('G.Skill', 'Trident Z5 CK', 'Trident Z5 CK', 2024, 'DDR5', { f: 'CUDIMM', rgb: true }, [['2x24', 8200, 40]]),
  // ─── G.Skill SO-DIMM ───
  ...g('G.Skill', 'Ripjaws', 'Ripjaws SO-DIMM DDR4', 2015, 'DDR4', { f: 'SO-DIMM' }, [
    ['2x8', 2400, 16], ['2x8', 3200, 22, { y: 2019 }], ['2x16', 3200, 22, { y: 2019 }], ['2x32', 3200, 22, { y: 2020 }],
  ]),
  ...g('G.Skill', 'Ripjaws', 'Ripjaws SO-DIMM DDR5', 2022, 'DDR5', { f: 'SO-DIMM' }, [['2x16', 4800, 40], ['2x16', 5600, 40, { y: 2023 }]]),
  // ─── G.Skill DDR3 ───
  ...g('G.Skill', 'Ripjaws X', 'Ripjaws X DDR3', 2012, 'DDR3', {}, [['2x4', 1600, 9], ['2x8', 1600, 9], ['4x4', 1600, 9]]),
  ...g('G.Skill', 'RipjawsZ', 'RipjawsZ DDR3', 2012, 'DDR3', {}, [['4x4', 1600, 9]]),
  ...g('G.Skill', 'Trident X', 'Trident X DDR3', 2012, 'DDR3', {}, [['2x4', 2400, 10], ['2x8', 2400, 10, { y: 2013 }]]),
];
