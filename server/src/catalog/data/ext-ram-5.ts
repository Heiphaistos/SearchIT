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
  // ─── TeamGroup T-Force DDR4 ───
  ...g('TeamGroup', 'T-Force Vulcan Z', 'T-Force Vulcan Z', 2019, 'DDR4', {}, [
    ['1x8', 3200, 16], ['2x8', 3000, 16], ['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16], ['2x16', 3600, 18], ['2x32', 3200, 16, { y: 2020 }],
  ]),
  ...g('TeamGroup', 'T-Force Delta RGB', 'T-Force Delta RGB DDR4', 2018, 'DDR4', {}, [
    ['2x8', 3000, 16], ['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16], ['2x16', 3600, 18],
  ]),
  ...g('TeamGroup', 'T-Force Dark Z', 'T-Force Dark Z', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16]]),
  ...g('TeamGroup', 'T-Force Xtreem ARGB', 'T-Force Xtreem ARGB DDR4', 2020, 'DDR4', {}, [['2x8', 3600, 18], ['2x8', 4000, 18], ['2x16', 3600, 18], ['2x16', 3600, 14]]),
  ...g('TeamGroup', 'T-Create Expert', 'T-Create Expert DDR4', 2021, 'DDR4', { t: ['creation', 'gaming'] }, [['2x16', 3200, 14]]),
  // ─── TeamGroup T-Force DDR5 ───
  ...g('TeamGroup', 'T-Force Vulcan', 'T-Force Vulcan DDR5', 2022, 'DDR5', {}, [
    ['2x16', 5200, 40], ['2x16', 5600, 40], ['2x16', 6000, 38], ['2x16', 6000, 30, { y: 2023 }],
  ]),
  ...g('TeamGroup', 'T-Force Delta RGB', 'T-Force Delta RGB DDR5', 2022, 'DDR5', {}, [
    ['2x16', 6000, 38], ['2x16', 6400, 40], ['2x16', 6400, 32, { y: 2023 }], ['2x16', 7200, 34, { y: 2023 }], ['2x32', 6000, 30, { y: 2023 }],
  ]),
  ...g('TeamGroup', 'T-Force Xtreem ARGB', 'T-Force Xtreem ARGB DDR5', 2022, 'DDR5', {}, [['2x16', 7200, 34], ['2x16', 7600, 36, { y: 2023 }], ['2x16', 8000, 38, { y: 2023 }]]),
  ...g('TeamGroup', 'T-Create Expert', 'T-Create Expert DDR5', 2022, 'DDR5', { t: ['creation', 'gaming'] }, [['2x16', 6000, 30], ['2x32', 6000, 30, { y: 2023 }]]),
  // ─── TeamGroup Elite ───
  ...g('TeamGroup', 'Elite', 'Team Elite DDR4', 2017, 'DDR4', { nocl: true }, [['1x8', 2666, 19], ['1x16', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }]]),
  ...g('TeamGroup', 'Elite Plus', 'Team Elite Plus DDR4', 2019, 'DDR4', { nocl: true }, [['1x8', 3200, 22], ['1x16', 3200, 22]]),
  ...g('TeamGroup', 'Elite', 'Team Elite SO-DIMM', 2020, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [['1x8', 3200, 22], ['1x16', 3200, 22], ['1x32', 3200, 22]]),
  ...g('TeamGroup', 'Elite', 'Team Elite DDR5', 2021, 'DDR5', { nocl: true }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }]]),
  ...g('TeamGroup', 'Elite', 'Team Elite SO-DIMM', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [['1x16', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }]]),
  ...g('TeamGroup', 'Elite', 'Team Elite DDR3', 2013, 'DDR3', { nocl: true }, [['1x8', 1600, 11]]),
  // ─── Patriot Viper ───
  ...g('Patriot', 'Viper Steel', 'Viper Steel', 2019, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x8', 4000, 19], ['2x8', 4400, 19], ['2x16', 3200, 16], ['2x16', 3600, 18], ['2x16', 4000, 19], ['2x32', 3600, 18, { y: 2020 }],
  ]),
  ...g('Patriot', 'Viper Steel RGB', 'Viper Steel RGB', 2021, 'DDR4', {}, [['2x8', 3600, 20], ['2x16', 3600, 20]]),
  ...g('Patriot', 'Viper 4 Blackout', 'Viper 4 Blackout', 2018, 'DDR4', {}, [['2x8', 3000, 16], ['2x8', 3200, 16], ['2x8', 3600, 17], ['2x16', 3200, 16]]),
  ...g('Patriot', 'Viper RGB', 'Viper RGB DDR4', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 17]]),
  ...g('Patriot', 'Viper Elite II', 'Viper Elite II', 2021, 'DDR4', { t: ['gaming', 'budget'] }, [['2x8', 3200, 18], ['2x8', 3600, 20], ['2x16', 3200, 18], ['2x16', 3600, 20]]),
  ...g('Patriot', 'Viper Venom', 'Viper Venom DDR5', 2022, 'DDR5', {}, [
    ['2x16', 5200, 36], ['2x16', 5600, 36], ['2x16', 6000, 36], ['2x16', 6200, 40], ['2x16', 6000, 30, { y: 2023 }],
  ]),
  ...g('Patriot', 'Viper Venom RGB', 'Viper Venom RGB DDR5', 2022, 'DDR5', {}, [['2x16', 6000, 36], ['2x16', 6200, 40]]),
  ...g('Patriot', 'Viper Xtreme 5', 'Viper Xtreme 5', 2023, 'DDR5', {}, [['2x16', 7600, 36], ['2x16', 8000, 38]]),
  // ─── Patriot Signature Line ───
  ...g('Patriot', 'Signature Line', 'Signature Line DDR4', 2017, 'DDR4', { nocl: true }, [['1x8', 2666, 19], ['1x16', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }]]),
  ...g('Patriot', 'Signature Line', 'Signature Line SO-DIMM', 2017, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [['1x8', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }]]),
  ...g('Patriot', 'Signature Line', 'Signature Line DDR5', 2022, 'DDR5', { nocl: true }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }]]),
  ...g('Patriot', 'Signature Line', 'Signature Line SO-DIMM', 2022, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [['1x16', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }]]),
  ...g('Patriot', 'Signature Line', 'Signature Line DDR3', 2012, 'DDR3', { nocl: true }, [['1x8', 1600, 11]]),
  // ─── Goodram ───
  ...g('Goodram', 'IRDM X', 'IRDM X', 2017, 'DDR4', {}, [['1x8', 3200, 16], ['2x8', 3000, 16], ['2x8', 3200, 16], ['2x16', 3200, 16]]),
  ...g('Goodram', 'IRDM Pro', 'IRDM Pro', 2020, 'DDR4', {}, [['2x8', 3600, 17]]),
  ...g('Goodram', 'IRDM', 'IRDM DDR5', 2022, 'DDR5', {}, [['2x16', 6000, 30, { y: 2023 }], ['2x16', 6400, 32, { y: 2023 }]]),
  ...g('Goodram', '', 'Goodram DDR4', 2018, 'DDR4', { nocl: true }, [['1x8', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }]]),
  ...g('Goodram', '', 'Goodram SO-DIMM', 2020, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [['1x8', 3200, 22], ['1x16', 3200, 22]]),
  ...g('Goodram', '', 'Goodram DDR5', 2022, 'DDR5', { nocl: true }, [['1x16', 4800, 40]]),
  // ─── PNY / Thermaltake ───
  ...g('PNY', 'XLR8 Gaming', 'XLR8 Gaming DDR4', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16]]),
  ...g('PNY', 'XLR8 Gaming Epic-X RGB', 'XLR8 Gaming DDR4', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x16', 3600, 18]]),
  ...g('Thermaltake', 'ToughRAM RGB', 'ToughRAM RGB', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3600, 18]]),
];
