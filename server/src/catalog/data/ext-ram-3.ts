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
  // ─── Kingston Fury / HyperX DDR4 ───
  ...g('Kingston', 'Fury Beast', 'Fury Beast DDR4', 2021, 'DDR4', {}, [
    ['1x8', 3200, 16], ['1x16', 3200, 16], ['1x32', 3200, 16], ['2x8', 2666, 16], ['2x8', 3600, 17], ['4x8', 3200, 16],
    ['2x16', 3200, 16], ['2x16', 3600, 18], ['4x16', 3200, 16], ['2x32', 3200, 16], ['2x32', 3600, 18],
  ]),
  ...g('Kingston', 'Fury Beast RGB', 'Fury Beast RGB DDR4', 2021, 'DDR4', {}, [
    ['2x8', 3200, 16], ['2x8', 3600, 17], ['2x16', 3200, 16], ['2x16', 3600, 18], ['2x32', 3600, 18],
  ]),
  ...g('Kingston', 'Fury Renegade', 'Fury Renegade DDR4', 2021, 'DDR4', {}, [['2x8', 3600, 16], ['2x8', 4000, 19], ['2x16', 3600, 16]]),
  ...g('Kingston', 'Fury Renegade RGB', 'Fury Renegade RGB DDR4', 2021, 'DDR4', {}, [['2x8', 3600, 16], ['2x16', 3600, 16]]),
  ...g('Kingston', 'HyperX Fury', 'HyperX Fury DDR4', 2015, 'DDR4', {}, [
    ['1x8', 2400, 15], ['1x16', 2666, 16, { y: 2017 }], ['2x8', 2666, 16, { y: 2017 }], ['2x8', 3200, 16, { y: 2018 }], ['2x16', 3200, 16, { y: 2019 }],
  ]),
  ...g('Kingston', 'HyperX Fury RGB', 'HyperX Fury RGB DDR4', 2019, 'DDR4', {}, [['2x8', 3200, 16], ['2x16', 3200, 16]]),
  ...g('Kingston', 'HyperX Predator', 'HyperX Predator DDR4', 2016, 'DDR4', {}, [['2x8', 3200, 16], ['2x8', 3600, 17]]),
  ...g('Kingston', 'HyperX Impact', 'HyperX Impact DDR4', 2016, 'DDR4', { f: 'SO-DIMM' }, [['2x8', 2666, 15]]),
  ...g('Kingston', 'HyperX Fury', 'HyperX Fury DDR3', 2013, 'DDR3', {}, [['1x8', 1600, 10], ['2x4', 1600, 10], ['2x8', 1866, 10]]),
  // ─── Kingston Fury DDR5 ───
  ...g('Kingston', 'Fury Beast', 'Fury Beast DDR5', 2022, 'DDR5', {}, [
    ['2x8', 4800, 38, { y: 2021 }], ['2x16', 4800, 38, { y: 2021 }], ['1x16', 5200, 40], ['2x16', 5200, 40], ['2x16', 5600, 40],
    ['2x16', 6000, 36], ['2x32', 5200, 40], ['2x32', 5600, 40], ['2x32', 6000, 36, { y: 2023 }], ['2x32', 6000, 30, { y: 2023 }],
  ]),
  ...g('Kingston', 'Fury Beast RGB', 'Fury Beast RGB DDR5', 2022, 'DDR5', {}, [
    ['2x16', 5200, 40], ['2x16', 5600, 40], ['2x16', 6000, 36], ['2x16', 6000, 30, { y: 2023 }], ['2x32', 6000, 36, { y: 2023 }],
  ]),
  ...g('Kingston', 'Fury Renegade', 'Fury Renegade DDR5', 2022, 'DDR5', {}, [
    ['2x16', 6400, 32], ['2x16', 6800, 36, { y: 2023 }], ['2x16', 7200, 38, { y: 2023 }], ['2x32', 6000, 32, { y: 2023 }],
  ]),
  ...g('Kingston', 'Fury Renegade RGB', 'Fury Renegade RGB DDR5', 2022, 'DDR5', {}, [
    ['2x16', 6000, 32], ['2x16', 6400, 32], ['2x16', 7200, 38, { y: 2023 }],
  ]),
  ...g('Kingston', 'Fury Renegade', 'Fury Renegade CUDIMM', 2024, 'DDR5', { f: 'CUDIMM' }, [['2x24', 8400, 40]]),
  // ─── Kingston Fury Impact SO-DIMM ───
  ...g('Kingston', 'Fury Impact', 'Fury Impact DDR4', 2021, 'DDR4', { f: 'SO-DIMM' }, [
    ['1x16', 2666, 15], ['1x8', 3200, 20], ['1x16', 3200, 20], ['1x32', 3200, 20], ['2x8', 3200, 20], ['2x16', 3200, 20],
  ]),
  ...g('Kingston', 'Fury Impact', 'Fury Impact DDR5', 2021, 'DDR5', { f: 'SO-DIMM' }, [
    ['1x16', 4800, 38], ['2x16', 4800, 38], ['1x16', 5600, 40, { y: 2022 }], ['1x32', 5600, 40, { y: 2022 }],
    ['2x32', 5600, 40, { y: 2022 }], ['1x16', 6400, 38, { y: 2023 }],
  ]),
  // ─── Kingston ValueRAM ───
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR4', 2016, 'DDR4', { nocl: true }, [
    ['1x4', 2400, 17], ['1x8', 2400, 17], ['1x8', 2666, 19, { y: 2017 }], ['1x16', 2666, 19, { y: 2017 }],
    ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }],
  ]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR4 SO-DIMM', 2017, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 2666, 19], ['1x16', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }],
  ]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR5', 2021, 'DDR5', { nocl: true }, [
    ['1x8', 4800, 40], ['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }],
  ]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR5 SO-DIMM', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [
    ['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }],
  ]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR3', 2012, 'DDR3', { nocl: true }, [['1x4', 1333, 9], ['1x4', 1600, 11], ['1x8', 1600, 11]]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR3 SO-DIMM', 2012, 'DDR3', { nocl: true, f: 'SO-DIMM' }, [['1x4', 1600, 11], ['1x8', 1600, 11]]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR3L SO-DIMM', 2013, 'DDR3L', { nocl: true, f: 'SO-DIMM', v: '1,35 V' }, [['1x8', 1600, 11]]),
  ...g('Kingston', 'ValueRAM', 'ValueRAM DDR3 ECC', 2012, 'DDR3', { f: 'RDIMM' }, [['1x16', 1600, 11, { pn: 'KVR16R11D4/16' }]]),
  // ─── Kingston Server Premier ───
  ...g('Kingston', 'Server Premier', 'Server Premier', 2018, 'DDR4', { f: 'RDIMM' }, [
    ['1x8', 2666, 19, { pn: 'KSM26RS8/8' }], ['1x16', 2666, 19, { pn: 'KSM26RS4/16' }], ['1x32', 2666, 19, { pn: 'KSM26RD4/32' }],
    ['1x16', 3200, 22, { pn: 'KSM32RS4/16', y: 2020 }], ['1x32', 3200, 22, { pn: 'KSM32RD4/32', y: 2020 }], ['1x64', 3200, 22, { pn: 'KSM32RD4/64', y: 2020 }],
  ]),
  ...g('Kingston', 'Server Premier', 'Server Premier', 2018, 'DDR4', { f: 'UDIMM' }, [
    ['1x16', 2666, 19, { pn: 'KSM26ES8/16' }], ['1x16', 3200, 22, { pn: 'KSM32ES8/16', y: 2020 }], ['1x32', 3200, 22, { pn: 'KSM32ED8/32', y: 2020 }],
  ]),
  ...g('Kingston', 'Server Premier', 'Server Premier', 2022, 'DDR5', { f: 'RDIMM' }, [
    ['1x16', 4800, 40, { pn: 'KSM48R40BS8-16' }], ['1x64', 4800, 40, { pn: 'KSM48R40BD4-64' }], ['1x16', 5600, 46, { pn: 'KSM56R46BS8-16', y: 2023 }],
    ['1x32', 5600, 46, { pn: 'KSM56R46BD8-32', y: 2023 }], ['1x64', 5600, 46, { pn: 'KSM56R46BD4-64', y: 2023 }],
  ]),
  ...g('Kingston', 'Server Premier', 'Server Premier', 2022, 'DDR5', { f: 'UDIMM' }, [
    ['1x16', 4800, 40, { pn: 'KSM48E40BS8KM-16' }], ['1x32', 4800, 40, { pn: 'KSM48E40BD8KM-32' }],
    ['1x16', 5600, 46, { pn: 'KSM56E46BS8KM-16', y: 2023 }], ['1x32', 5600, 46, { pn: 'KSM56E46BD8KM-32', y: 2023 }],
  ]),
];
