import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue NAS : QNAP, modèles de bureau grand public / TPE (2012 → 2024).
 * Les références QNAP avec suffixe (-2G, -4G, -8G…) correspondent aux versions vendues
 * avec des quantités de RAM différentes. Clés omises lorsque la valeur n'est pas certaine.
 */

type Specs = Record<string, string | number | undefined>;

function clean(specs: Specs): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(specs)) if (v !== undefined) out[k] = v;
  return out;
}

function q(
  sku: string,
  year: number,
  family: string,
  baies: number,
  cpu: string | undefined,
  ram: string | undefined,
  reseau: string | undefined,
  tags: string[],
  extra: { ramMax?: string; m2?: string; os?: string } = {},
): CatalogProduct {
  const slug = sku.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9-]/g, '-');
  return {
    id: `nas-qnap-${slug}`,
    category: 'nas',
    brand: 'QNAP',
    name: `QNAP ${sku}`,
    family,
    year,
    refurbishable: true,
    tags: ['nas', ...tags],
    specs: clean({
      'Baies': baies,
      'Processeur': cpu,
      'RAM': ram,
      'RAM max': extra.ramMax,
      'Réseau': reseau,
      'Cache M.2': extra.m2,
      'Système': extra.os ?? 'QTS',
    }),
  };
}

const G1 = '1 × 1 GbE';
const G2 = '2 × 1 GbE';
const G4 = '4 × 1 GbE';
const M88 = 'Marvell (1 cœur, 1,6 GHz)';
const M20 = 'Marvell (1 cœur, 2 GHz)';
const D2700 = 'Intel Atom D2700 (2 cœurs, 2,13 GHz)';
const D2701 = 'Intel Atom D2701 (2 cœurs, 2,13 GHz)';
const J1800 = 'Intel Celeron J1800 (2 cœurs, 2,41 GHz)';
const J1900 = 'Intel Celeron J1900 (4 cœurs, 2 GHz)';
const N3150 = 'Intel Celeron N3150 (4 cœurs, 1,6 GHz)';
const N3060 = 'Intel Celeron N3060 (2 cœurs, 1,6 GHz)';
const J3455 = 'Intel Celeron J3455 (4 cœurs, 1,5 GHz)';
const J3355 = 'Intel Celeron J3355 (2 cœurs, 2 GHz)';
const J4125 = 'Intel Celeron J4125 (4 cœurs, 2 GHz)';
const AL212 = 'Annapurna Labs Alpine AL-212 (2 cœurs, 1,7 GHz)';
const AL314 = 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,7 GHz)';
const AL214 = 'Annapurna Labs Alpine AL-214 (4 cœurs, 1,7 GHz)';
const AL324 = 'Annapurna Labs Alpine AL-324 (4 cœurs, 1,7 GHz)';
const RTD1295 = 'Realtek RTD1295 (4 cœurs, 1,4 GHz)';
const RTD1296 = 'Realtek RTD1296 (4 cœurs, 1,4 GHz)';
const RX421 = 'AMD R-Series RX-421ND (4 cœurs, 2,1 GHz)';
const V1500 = 'AMD Ryzen V1500B (4 cœurs, 2,2 GHz)';
const N4505 = 'Intel Celeron N4505 (2 cœurs, 2 GHz)';
const N5095 = 'Intel Celeron N5095 (4 cœurs, 2 GHz)';
const J6412 = 'Intel Celeron J6412 (4 cœurs, 2 GHz)';
const A55 = 'ARM Cortex-A55 (4 cœurs, 2 GHz)';

export const PRODUCTS: CatalogProduct[] = [
  // ─── 2012-2013 : TS-x20 / x21 / x12P / x69 / x70 ───
  q('TS-120', 2012, 'TS-x20', 1, M88, '512 Mo DDR3', G1, ['budget']),
  q('TS-220', 2012, 'TS-x20', 2, M88, '512 Mo DDR3', G1, ['budget']),
  q('TS-420', 2012, 'TS-x20', 4, M88, '512 Mo DDR3', G1, []),
  q('TS-121', 2012, 'TS-x21', 1, M20, '1 Go DDR3', G1, ['budget']),
  q('TS-221', 2012, 'TS-x21', 2, M20, '1 Go DDR3', G1, []),
  q('TS-421', 2012, 'TS-x21', 4, M20, '1 Go DDR3', G2, []),
  q('TS-112P', 2013, 'TS-x12P', 1, M88, '512 Mo DDR3', G1, ['budget']),
  q('TS-212P', 2013, 'TS-x12P', 2, M88, '512 Mo DDR3', G1, ['budget']),
  q('TS-269L', 2012, 'TS-x69L', 2, D2701, '1 Go DDR3', G2, []),
  q('TS-469L', 2012, 'TS-x69L', 4, D2701, '1 Go DDR3', G2, []),
  q('TS-569L', 2012, 'TS-x69L', 5, D2701, '1 Go DDR3', G2, []),
  q('TS-669L', 2012, 'TS-x69L', 6, D2701, '1 Go DDR3', G2, []),
  q('TS-869L', 2012, 'TS-x69L', 8, D2701, '1 Go DDR3', G2, []),
  q('TS-269 Pro', 2012, 'TS-x69 Pro', 2, D2700, '1 Go DDR3', G2, ['pro']),
  q('TS-469 Pro', 2012, 'TS-x69 Pro', 4, D2700, '1 Go DDR3', G2, ['pro']),
  q('TS-569 Pro', 2012, 'TS-x69 Pro', 5, D2700, '1 Go DDR3', G2, ['pro']),
  q('TS-669 Pro', 2012, 'TS-x69 Pro', 6, D2700, '1 Go DDR3', G2, ['pro']),
  q('TS-869 Pro', 2012, 'TS-x69 Pro', 8, D2700, '1 Go DDR3', G2, ['pro']),
  q('TS-470 Pro', 2013, 'TS-x70 Pro', 4, undefined, '2 Go DDR3', G2, ['pro']),
  q('TS-670 Pro', 2013, 'TS-x70 Pro', 6, undefined, '2 Go DDR3', G2, ['pro']),
  q('TS-870 Pro', 2013, 'TS-x70 Pro', 8, undefined, '2 Go DDR3', G2, ['pro']),

  // ─── 2014-2015 : TS-x31 / x51 / x53 Pro ───
  q('TS-231', 2014, 'TS-x31', 2, undefined, '512 Mo DDR3', G1, ['budget']),
  q('TS-431', 2014, 'TS-x31', 4, undefined, '512 Mo DDR3', G2, ['budget']),
  q('TS-251', 2014, 'TS-x51', 2, J1800, '1 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-451', 2014, 'TS-x51', 4, J1800, '1 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-651', 2014, 'TS-x51', 6, J1800, '1 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-851', 2014, 'TS-x51', 8, J1800, '1 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-253 Pro', 2014, 'TS-x53 Pro', 2, J1900, '2 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453 Pro', 2014, 'TS-x53 Pro', 4, J1900, '2 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-653 Pro', 2014, 'TS-x53 Pro', 6, J1900, '2 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-853 Pro', 2014, 'TS-x53 Pro', 8, J1900, '2 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453mini', 2015, 'TS-x53', 4, J1900, '2 Go DDR3L', G2, ['homelab']),
  q('TS-231+', 2015, 'TS-x31+', 2, AL212, '1 Go DDR3', G2, ['budget']),
  q('TS-431+', 2015, 'TS-x31+', 4, AL212, '1 Go DDR3', G2, []),
  q('TS-251+-2G', 2015, 'TS-x51+', 2, J1900, '2 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-251+-8G', 2015, 'TS-x51+', 2, J1900, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-451+-2G', 2015, 'TS-x51+', 4, J1900, '2 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-451+-8G', 2015, 'TS-x51+', 4, J1900, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),

  // ─── 2015-2016 : TS-x53A / x51A / x28 / x31P / x31X ───
  q('TS-253A-4G', 2016, 'TS-x53A', 2, N3150, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-253A-8G', 2016, 'TS-x53A', 2, N3150, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453A-4G', 2015, 'TS-x53A', 4, N3150, '4 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453A-8G', 2015, 'TS-x53A', 4, N3150, '8 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-653A-4G', 2015, 'TS-x53A', 6, N3150, '4 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-653A-8G', 2015, 'TS-x53A', 6, N3150, '8 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-853A-4G', 2015, 'TS-x53A', 8, N3150, '4 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-853A-8G', 2015, 'TS-x53A', 8, N3150, '8 Go DDR3L', G4, ['homelab'], { ramMax: '8 Go' }),
  q('TS-251A-2G', 2016, 'TS-x51A', 2, N3060, '2 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-251A-4G', 2016, 'TS-x51A', 2, N3060, '4 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-451A-2G', 2016, 'TS-x51A', 4, N3060, '2 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-451A-4G', 2016, 'TS-x51A', 4, N3060, '4 Go DDR3L', G2, [], { ramMax: '8 Go' }),
  q('TS-128', 2016, 'TS-x28', 1, RTD1295, '1 Go DDR4', G1, ['budget']),
  q('TS-228', 2016, 'TS-x28', 2, RTD1295, '1 Go DDR4', G1, ['budget']),
  q('TS-131P', 2016, 'TS-x31P', 1, AL212, '1 Go DDR3', G1, ['budget']),
  q('TS-231P', 2016, 'TS-x31P', 2, AL212, '1 Go DDR3', G2, ['budget']),
  q('TS-431P', 2016, 'TS-x31P', 4, AL212, '1 Go DDR3', G2, []),
  q('TS-431X-2G', 2016, 'TS-x31X', 4, AL314, '2 Go DDR3', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '8 Go' }),
  q('TS-431X-8G', 2016, 'TS-x31X', 4, AL314, '8 Go DDR3', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '8 Go' }),
  q('TS-831X-4G', 2016, 'TS-x31X', 8, AL314, '4 Go DDR3', '2 × 1 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),
  q('TS-831X-8G', 2016, 'TS-x31X', 8, AL314, '8 Go DDR3', '2 × 1 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),

  // ─── 2017 : TS-x53B / x53Be / x31P2 / x63X ───
  q('TS-253B-4G', 2017, 'TS-x53B', 2, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-253B-8G', 2017, 'TS-x53B', 2, J3455, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453B-4G', 2017, 'TS-x53B', 4, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453B-8G', 2017, 'TS-x53B', 4, J3455, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-653B-4G', 2017, 'TS-x53B', 6, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-653B-8G', 2017, 'TS-x53B', 6, J3455, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453Bmini-4G', 2017, 'TS-x53B', 4, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453Bmini-8G', 2017, 'TS-x53B', 4, J3455, '8 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-253Be-2G', 2017, 'TS-x53Be', 2, J3455, '2 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-253Be-4G', 2017, 'TS-x53Be', 2, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453Be-2G', 2017, 'TS-x53Be', 4, J3455, '2 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-453Be-4G', 2017, 'TS-x53Be', 4, J3455, '4 Go DDR3L', G2, ['homelab'], { ramMax: '8 Go' }),
  q('TS-231P2-1G', 2017, 'TS-x31P2', 2, AL314, '1 Go DDR3', G2, ['budget'], { ramMax: '8 Go' }),
  q('TS-231P2-4G', 2017, 'TS-x31P2', 2, AL314, '4 Go DDR3', G2, [], { ramMax: '8 Go' }),
  q('TS-431P2-1G', 2017, 'TS-x31P2', 4, AL314, '1 Go DDR3', G2, [], { ramMax: '8 Go' }),
  q('TS-431P2-4G', 2017, 'TS-x31P2', 4, AL314, '4 Go DDR3', G2, [], { ramMax: '8 Go' }),
  q('TS-963X-2G', 2017, 'TS-x63X', 9, 'AMD GX-420MC (4 cœurs, 2 GHz)', '2 Go DDR3L', '1 × 1 GbE + 1 × 10 GbE', [], { ramMax: '8 Go' }),
  q('TS-963X-8G', 2017, 'TS-x63X', 9, 'AMD GX-420MC (4 cœurs, 2 GHz)', '8 Go DDR3L', '1 × 1 GbE + 1 × 10 GbE', [], { ramMax: '8 Go' }),

  // ─── 2018-2019 : TS-x28A / x51B / x31X2 / x73 / x32X / x31P3 ───
  q('TS-128A', 2018, 'TS-x28A', 1, RTD1295, '1 Go DDR4', G1, ['budget']),
  q('TS-228A', 2018, 'TS-x28A', 2, RTD1295, '1 Go DDR4', G1, ['budget']),
  q('TS-328', 2018, 'TS-x28', 3, RTD1296, '2 Go DDR4', G2, ['budget']),
  q('TS-251B-2G', 2018, 'TS-x51B', 2, J3355, '2 Go DDR3L', G1, [], { ramMax: '8 Go' }),
  q('TS-251B-4G', 2018, 'TS-x51B', 2, J3355, '4 Go DDR3L', G1, [], { ramMax: '8 Go' }),
  q('TS-431X2-2G', 2018, 'TS-x31X2', 4, AL314, '2 Go DDR3', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '8 Go' }),
  q('TS-431X2-8G', 2018, 'TS-x31X2', 4, AL314, '8 Go DDR3', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '8 Go' }),
  q('TS-473-4G', 2018, 'TS-x73', 4, RX421, '4 Go DDR4', G4, ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 SATA' }),
  q('TS-473-8G', 2018, 'TS-x73', 4, RX421, '8 Go DDR4', G4, ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 SATA' }),
  q('TS-673-8G', 2018, 'TS-x73', 6, RX421, '8 Go DDR4', G4, ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 SATA' }),
  q('TS-873-8G', 2018, 'TS-x73', 8, RX421, '8 Go DDR4', G4, ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 SATA' }),
  q('TS-932X-2G', 2018, 'TS-x32X', 9, AL324, '2 Go DDR4', '2 × 1 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),
  q('TS-932X-8G', 2018, 'TS-x32X', 9, AL324, '8 Go DDR4', '2 × 1 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),
  q('TS-332X-2G', 2019, 'TS-x32X', 3, AL324, '2 Go DDR4', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '16 Go', m2: '3 × M.2 SATA' }),
  q('TS-332X-4G', 2019, 'TS-x32X', 3, AL324, '4 Go DDR4', '2 × 1 GbE + 1 × 10 GbE SFP+', [], { ramMax: '16 Go', m2: '3 × M.2 SATA' }),
  q('TS-231P3-2G', 2019, 'TS-x31P3', 2, AL314, '2 Go DDR3', '1 × 1 GbE + 1 × 2,5 GbE', [], { ramMax: '8 Go' }),
  q('TS-231P3-4G', 2019, 'TS-x31P3', 2, AL314, '4 Go DDR3', '1 × 1 GbE + 1 × 2,5 GbE', [], { ramMax: '8 Go' }),
  q('TS-431P3-2G', 2019, 'TS-x31P3', 4, AL314, '2 Go DDR3', '1 × 1 GbE + 1 × 2,5 GbE', [], { ramMax: '8 Go' }),
  q('TS-431P3-4G', 2019, 'TS-x31P3', 4, AL314, '4 Go DDR3', '1 × 1 GbE + 1 × 2,5 GbE', [], { ramMax: '8 Go' }),
  q('TS-431P3-8G', 2019, 'TS-x31P3', 4, AL314, '8 Go DDR3', '1 × 1 GbE + 1 × 2,5 GbE', [], { ramMax: '8 Go' }),

  // ─── 2020-2021 : TS-x30 / x51D / x53D / x31K / x33 / x73A ───
  q('TS-230', 2020, 'TS-x30', 2, RTD1296, '2 Go DDR4', G1, ['budget']),
  q('TS-251D-2G', 2020, 'TS-x51D', 2, 'Intel Celeron J4005 (2 cœurs, 2 GHz)', '2 Go DDR4', G1, [], { ramMax: '8 Go' }),
  q('TS-251D-4G', 2020, 'TS-x51D', 2, 'Intel Celeron J4005 (2 cœurs, 2 GHz)', '4 Go DDR4', G1, [], { ramMax: '8 Go' }),
  q('TS-451D2-2G', 2020, 'TS-x51D', 4, 'Intel Celeron J4025 (2 cœurs, 2 GHz)', '2 Go DDR4', G2, [], { ramMax: '8 Go' }),
  q('TS-451D2-4G', 2020, 'TS-x51D', 4, 'Intel Celeron J4025 (2 cœurs, 2 GHz)', '4 Go DDR4', G2, [], { ramMax: '8 Go' }),
  q('TS-253D-4G', 2020, 'TS-x53D', 2, J4125, '4 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '8 Go' }),
  q('TS-453D-4G', 2020, 'TS-x53D', 4, J4125, '4 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '8 Go' }),
  q('TS-453D-8G', 2020, 'TS-x53D', 4, J4125, '8 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '8 Go' }),
  q('TS-653D-4G', 2020, 'TS-x53D', 6, J4125, '4 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '8 Go' }),
  q('TS-653D-8G', 2020, 'TS-x53D', 6, J4125, '8 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '8 Go' }),
  q('TS-431K', 2020, 'TS-x31K', 4, AL214, '1 Go DDR3', G2, ['budget']),
  q('TS-231K', 2021, 'TS-x31K', 2, AL214, '1 Go DDR3', G2, ['budget']),
  q('TS-431KX-2G', 2021, 'TS-x31K', 4, AL214, '2 Go DDR3', '2 × 1 GbE + 1 × 10 GbE SFP+', []),
  q('TS-133', 2021, 'TS-x33', 1, 'ARM Cortex-A55 (4 cœurs, 1,8 GHz)', '2 Go DDR4', G1, ['budget']),
  q('TS-473A-8G', 2021, 'TS-x73A', 4, V1500, '8 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-673A-8G', 2021, 'TS-x73A', 6, V1500, '8 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '64 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-832PX-4G', 2021, 'TS-x32PX', 8, AL324, '4 Go DDR4', '2 × 2,5 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),
  q('TS-932PX-4G', 2021, 'TS-x32PX', 9, AL324, '4 Go DDR4', '2 × 2,5 GbE + 2 × 10 GbE SFP+', [], { ramMax: '16 Go' }),

  // ─── 2022-2024 : TS-x62 / x64 / x53E / x16 / x10E / AI ───
  q('TS-262-4G', 2022, 'TS-x62', 2, N4505, '4 Go DDR4', '1 × 2,5 GbE', [], { m2: '2 × M.2 2280 NVMe' }),
  q('TS-462-2G', 2022, 'TS-x62', 4, N4505, '2 Go DDR4', '1 × 2,5 GbE', [], { m2: '2 × M.2 2280 NVMe' }),
  q('TS-462-4G', 2022, 'TS-x62', 4, N4505, '4 Go DDR4', '1 × 2,5 GbE', [], { m2: '2 × M.2 2280 NVMe' }),
  q('TS-364-4G', 2023, 'TS-x64', 3, N5095, '4 Go DDR4', '1 × 2,5 GbE', ['homelab'], { ramMax: '16 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-364-8G', 2023, 'TS-x64', 3, N5095, '8 Go DDR4', '1 × 2,5 GbE', ['homelab'], { ramMax: '16 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-664-4G', 2022, 'TS-x64', 6, N5095, '4 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '16 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-664-8G', 2022, 'TS-x64', 6, N5095, '8 Go DDR4', '2 × 2,5 GbE', ['homelab'], { ramMax: '16 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-253E-8G', 2022, 'TS-x53E', 2, J6412, '8 Go DDR4', '2 × 2,5 GbE', ['pro'], { ramMax: '64 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-453E-8G', 2022, 'TS-x53E', 4, J6412, '8 Go DDR4', '2 × 2,5 GbE', ['pro'], { ramMax: '64 Go', m2: '2 × M.2 2280 NVMe' }),
  q('TS-216G', 2023, 'TS-x16', 2, A55, '2 Go DDR4', G1, ['budget']),
  q('TS-416', 2023, 'TS-x16', 4, A55, '4 Go DDR4', '1 × 2,5 GbE', ['budget']),
  q('TS-410E-8G', 2023, 'TS-x10E', 4, J6412, '8 Go DDR4', '2 × 2,5 GbE', ['pro']),
  q('TS-AI642-8G', 2024, 'TS-AI', 6, 'Rockchip RK3588 (8 cœurs)', '8 Go', '1 × 2,5 GbE', ['ia', 'photo']),
];
