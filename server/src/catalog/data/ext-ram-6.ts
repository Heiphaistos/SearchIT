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
  // ─── ADATA / XPG ───
  ...g('ADATA', 'XPG Lancer', 'XPG Lancer', 2021, 'DDR5', {}, [['2x16', 5200, 38], ['2x16', 6000, 40, { y: 2022 }], ['2x16', 6000, 30, { y: 2023 }]]),
  ...g('ADATA', 'XPG Lancer RGB', 'XPG Lancer RGB', 2022, 'DDR5', {}, [
    ['2x16', 6000, 40], ['2x16', 6000, 30, { y: 2023 }], ['2x16', 6400, 32, { y: 2023 }], ['2x16', 7200, 34, { y: 2023 }], ['2x32', 6000, 30, { y: 2023 }],
  ]),
  ...g('ADATA', 'XPG Lancer Blade', 'XPG Lancer Blade', 2023, 'DDR5', {}, [['2x16', 6000, 30]]),
  ...g('ADATA', 'XPG Lancer Blade RGB', 'XPG Lancer Blade', 2023, 'DDR5', {}, [['2x16', 6000, 30], ['2x32', 6000, 30]]),
  ...g('ADATA', 'XPG Spectrix D41', 'XPG Spectrix', 2018, 'DDR4', { rgb: true }, [['2x8', 3000, 16], ['2x8', 3200, 16], ['2x16', 3200, 16, { y: 2019 }]]),
  ...g('ADATA', 'XPG Spectrix D50', 'XPG Spectrix', 2020, 'DDR4', { rgb: true }, [['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16], ['2x16', 3600, 18]]),
  ...g('ADATA', 'XPG Spectrix D35G', 'XPG Spectrix', 2021, 'DDR4', { rgb: true }, [['2x8', 3200, 16], ['2x8', 3600, 18], ['2x16', 3200, 16], ['2x16', 3600, 18]]),
  ...g('ADATA', 'XPG Spectrix D60G', 'XPG Spectrix', 2019, 'DDR4', { rgb: true }, [['2x8', 3200, 16]]),
  ...g('ADATA', 'XPG Gammix D10', 'XPG Gammix', 2017, 'DDR4', {}, [['1x8', 3200, 16], ['1x16', 3200, 16], ['2x8', 3000, 16], ['2x8', 3200, 16], ['2x16', 3200, 16]]),
  ...g('ADATA', 'XPG Gammix D30', 'XPG Gammix', 2018, 'DDR4', {}, [['2x8', 3000, 16], ['2x8', 3200, 16]]),
  ...g('ADATA', 'XPG Gammix D35', 'XPG Gammix', 2021, 'DDR4', {}, [['2x8', 3200, 16], ['2x16', 3200, 16], ['2x16', 3600, 18]]),
  ...g('ADATA', 'Premier', 'ADATA Premier DDR4', 2017, 'DDR4', { nocl: true }, [['1x8', 2666, 19], ['1x8', 3200, 22, { y: 2020 }], ['1x16', 3200, 22, { y: 2020 }], ['1x32', 3200, 22, { y: 2020 }]]),
  ...g('ADATA', 'Premier', 'ADATA Premier SO-DIMM', 2020, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [['1x8', 3200, 22], ['1x16', 3200, 22]]),
  ...g('ADATA', 'Premier', 'ADATA Premier DDR5', 2021, 'DDR5', { nocl: true }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }], ['1x32', 5600, 46, { y: 2023 }]]),
  ...g('ADATA', 'Premier', 'ADATA Premier SO-DIMM', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }]]),
  // ─── Samsung (OEM / serveur) ───
  ...g('Samsung', '', 'Samsung RDIMM DDR4', 2016, 'DDR4', { f: 'RDIMM' }, [
    ['1x16', 2400, 17, { pn: 'M393A2K40BB1-CRC' }], ['1x32', 2400, 17, { pn: 'M393A4K40BB1-CRC' }],
    ['1x16', 2666, 19, { pn: 'M393A2K40CB2-CTD', y: 2018 }], ['1x32', 2666, 19, { pn: 'M393A4K40CB2-CTD', y: 2018 }],
    ['1x16', 2933, 21, { pn: 'M393A2K40CB2-CVF', y: 2019 }], ['1x32', 2933, 21, { pn: 'M393A4K40CB2-CVF', y: 2019 }], ['1x64', 2933, 21, { pn: 'M393A8G40MB2-CVF', y: 2019 }],
    ['1x16', 3200, 22, { pn: 'M393A2K40DB3-CWE', y: 2020 }], ['1x64', 3200, 22, { pn: 'M393A8G40AB2-CWE', y: 2020 }],
  ]),
  ...g('Samsung', '', 'Samsung LRDIMM DDR4', 2016, 'DDR4', { f: 'LRDIMM' }, [
    ['1x64', 2400, 17, { pn: 'M386A8K40BM1-CRC' }], ['1x64', 2666, 19, { pn: 'M386A8K40BM2-CTD', y: 2018 }],
  ]),
  ...g('Samsung', '', 'Samsung ECC UDIMM DDR4', 2020, 'DDR4', { f: 'UDIMM' }, [
    ['1x16', 3200, 22, { pn: 'M391A2K43DB1-CWE' }], ['1x32', 3200, 22, { pn: 'M391A4G43AB1-CWE' }],
  ]),
  ...g('Samsung', '', 'Samsung DDR4', 2018, 'DDR4', { nocl: true }, [
    ['1x8', 2666, 19, { pn: 'M378A1K43CB2-CTD' }], ['1x16', 2666, 19, { pn: 'M378A2K43CB1-CTD' }],
    ['1x8', 3200, 22, { pn: 'M378A1K43EB2-CWE', y: 2020 }], ['1x16', 3200, 22, { pn: 'M378A2K43EB1-CWE', y: 2020 }], ['1x32', 3200, 22, { pn: 'M378A4G43AB2-CWE', y: 2020 }],
  ]),
  ...g('Samsung', '', 'Samsung SO-DIMM DDR4', 2018, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 2666, 19, { pn: 'M471A1K43CB1-CTD' }], ['1x16', 2666, 19, { pn: 'M471A2K43CB1-CTD' }],
    ['1x8', 3200, 22, { pn: 'M471A1K43DB1-CWE', y: 2020 }], ['1x16', 3200, 22, { pn: 'M471A2K43EB1-CWE', y: 2020 }], ['1x32', 3200, 22, { pn: 'M471A4G43AB1-CWE', y: 2020 }],
  ]),
  ...g('Samsung', '', 'Samsung RDIMM DDR5', 2022, 'DDR5', { f: 'RDIMM' }, [
    ['1x16', 4800, 40, { pn: 'M321R2GA3BB6-CQK' }], ['1x32', 4800, 40, { pn: 'M321R4GA3BB6-CQK' }],
    ['1x16', 5600, 46, { pn: 'M321R2GA3PB0-CWM', y: 2023 }], ['1x32', 5600, 46, { pn: 'M321R4GA3PB0-CWM', y: 2023 }], ['1x64', 5600, 46, { pn: 'M321R8GA0PB0-CWM', y: 2023 }],
  ]),
  ...g('Samsung', '', 'Samsung DDR5', 2021, 'DDR5', { nocl: true }, [
    ['1x8', 4800, 40, { pn: 'M323R1GB4BB0-CQK' }], ['1x16', 4800, 40, { pn: 'M323R2GA3BB0-CQK' }], ['1x32', 4800, 40, { pn: 'M323R4GA3BB0-CQK' }],
    ['1x16', 5600, 46, { pn: 'M323R2GA3DB0-CWM', y: 2023 }], ['1x32', 5600, 46, { pn: 'M323R4GA3DB0-CWM', y: 2023 }],
  ]),
  ...g('Samsung', '', 'Samsung SO-DIMM DDR5', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 4800, 40, { pn: 'M425R1GB4BB0-CQK' }], ['1x16', 4800, 40, { pn: 'M425R2GA3BB0-CQK' }], ['1x32', 4800, 40, { pn: 'M425R4GA3BB0-CQK' }],
    ['1x32', 5600, 46, { pn: 'M425R4GA3PB0-CWM', y: 2023 }],
  ]),
  ...g('Samsung', '', 'Samsung DDR3', 2012, 'DDR3', { nocl: true }, [['1x4', 1600, 11, { pn: 'M378B5173QH0-CK0' }], ['1x8', 1600, 11, { pn: 'M378B1G73EB0-CK0' }]]),
  ...g('Samsung', '', 'Samsung SO-DIMM DDR3', 2013, 'DDR3L', { nocl: true, f: 'SO-DIMM', v: '1,35 V' }, [['1x4', 1600, 11, { pn: 'M471B5173QH0-YK0' }], ['1x8', 1600, 11, { pn: 'M471B1G73EB0-YK0' }]]),
  ...g('Samsung', '', 'Samsung RDIMM DDR3', 2012, 'DDR3', { f: 'RDIMM' }, [['1x8', 1600, 11, { pn: 'M393B1K70DH0-CK0' }], ['1x16', 1600, 11, { pn: 'M393B2G70BH0-CK0' }]]),
  // ─── SK hynix ───
  ...g('SK hynix', '', 'SK hynix RDIMM DDR4', 2018, 'DDR4', { f: 'RDIMM' }, [
    ['1x16', 2666, 19, { pn: 'HMA82GR7AFR8N-VK' }], ['1x32', 2666, 19, { pn: 'HMA84GR7AFR4N-VK' }],
    ['1x32', 2933, 21, { pn: 'HMA84GR7CJR4N-WM', y: 2019 }], ['1x64', 2933, 21, { pn: 'HMAA8GR7AJR4N-WM', y: 2019 }],
    ['1x16', 3200, 22, { pn: 'HMA82GR7CJR8N-XN', y: 2020 }], ['1x32', 3200, 22, { pn: 'HMA84GR7CJR4N-XN', y: 2020 }], ['1x64', 3200, 22, { pn: 'HMAA8GR7AJR4N-XN', y: 2020 }],
  ]),
  ...g('SK hynix', '', 'SK hynix RDIMM DDR5', 2022, 'DDR5', { f: 'RDIMM' }, [
    ['1x16', 4800, 40, { pn: 'HMCG78AGBRA190N' }], ['1x32', 4800, 40, { pn: 'HMCG88AGBRA190N' }], ['1x64', 4800, 40],
    ['1x32', 5600, 46, { y: 2023 }], ['1x64', 5600, 46, { y: 2023 }],
  ]),
  ...g('SK hynix', '', 'SK hynix SO-DIMM DDR4', 2018, 'DDR4', { nocl: true, f: 'SO-DIMM' }, [
    ['1x8', 2666, 19, { pn: 'HMA81GS6CJR8N-VK' }], ['1x16', 2666, 19, { pn: 'HMA82GS6CJR8N-VK' }],
    ['1x8', 3200, 22, { pn: 'HMA81GS6DJR8N-XN', y: 2020 }], ['1x16', 3200, 22, { pn: 'HMAA2GS6CJR8N-XN', y: 2020 }],
  ]),
  ...g('SK hynix', '', 'SK hynix SO-DIMM DDR5', 2021, 'DDR5', { nocl: true, f: 'SO-DIMM' }, [['1x16', 4800, 40], ['1x32', 4800, 40], ['1x16', 5600, 46, { y: 2023 }]]),
  // ─── Micron (serveur) ───
  ...g('Micron', '', 'Micron RDIMM DDR4', 2018, 'DDR4', { f: 'RDIMM' }, [
    ['1x16', 2666, 19, { pn: 'MTA18ASF2G72PZ-2G6' }], ['1x32', 2666, 19, { pn: 'MTA36ASF4G72PZ-2G6' }],
    ['1x16', 2933, 21, { pn: 'MTA18ASF2G72PZ-2G9', y: 2019 }], ['1x32', 2933, 21, { pn: 'MTA36ASF4G72PZ-2G9', y: 2019 }],
    ['1x16', 3200, 22, { pn: 'MTA18ASF2G72PZ-3G2', y: 2020 }], ['1x32', 3200, 22, { pn: 'MTA36ASF4G72PZ-3G2', y: 2020 }], ['1x64', 3200, 22, { pn: 'MTA36ASF8G72PZ-3G2', y: 2020 }],
  ]),
  ...g('Micron', '', 'Micron ECC UDIMM DDR4', 2020, 'DDR4', { f: 'UDIMM' }, [
    ['1x8', 3200, 22, { pn: 'MTA9ASF1G72AZ-3G2' }], ['1x16', 3200, 22, { pn: 'MTA9ASF2G72AZ-3G2' }], ['1x32', 3200, 22, { pn: 'MTA18ASF4G72AZ-3G2' }],
  ]),
  ...g('Micron', '', 'Micron RDIMM DDR5', 2022, 'DDR5', { f: 'RDIMM' }, [
    ['1x16', 4800, 40, { pn: 'MTC10F1084S1RC48B' }], ['1x32', 4800, 40, { pn: 'MTC20F2085S1RC48B' }], ['1x64', 4800, 40, { pn: 'MTC40F2046S1RC48B' }],
    ['1x32', 5600, 46, { pn: 'MTC20F2085S1RC56B', y: 2023 }], ['1x64', 5600, 46, { pn: 'MTC40F2046S1RC56B', y: 2023 }],
  ]),
  ...g('Micron', '', 'Micron ECC UDIMM DDR5', 2022, 'DDR5', { f: 'UDIMM' }, [
    ['1x16', 4800, 40, { pn: 'MTC10C1084S1EC48B' }], ['1x32', 4800, 40, { pn: 'MTC20C2085S1EC48B' }],
    ['1x16', 5600, 46, { pn: 'MTC10C1084S1EC56B', y: 2023 }], ['1x32', 5600, 46, { pn: 'MTC20C2085S1EC56B', y: 2023 }],
  ]),
];
