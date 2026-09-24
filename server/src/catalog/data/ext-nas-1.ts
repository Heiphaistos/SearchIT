import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue NAS : Synology DiskStation (2012 → 2025).
 * Clés omises lorsque la valeur n'est pas certaine.
 */

type Specs = Record<string, string | number | undefined>;

function clean(specs: Specs): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(specs)) if (v !== undefined) out[k] = v;
  return out;
}

/** Entrée DiskStation : modèle « DS920+ », « DS3622xs+ »… */
function ds(
  model: string,
  year: number,
  family: string,
  baies: number,
  cpu: string | undefined,
  ram: string | undefined,
  ramMax: string | undefined,
  reseau: string | undefined,
  tags: string[],
  extra: { m2?: string; msrp?: number; suffix?: string; idSuffix?: string } = {},
): CatalogProduct {
  const slug = model.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9-]/g, '-');
  return {
    id: `nas-synology-${slug}${extra.idSuffix ? '-' + extra.idSuffix : ''}`,
    category: 'nas',
    brand: 'Synology',
    name: `Synology DiskStation ${model}${extra.suffix ? ' ' + extra.suffix : ''}`,
    family,
    year,
    ...(extra.msrp ? { msrp: extra.msrp } : {}),
    refurbishable: true,
    tags: ['nas', ...tags],
    specs: clean({
      'Baies': baies,
      'Processeur': cpu,
      'RAM': ram,
      'RAM max': ramMax,
      'Réseau': reseau,
      'Cache M.2': extra.m2,
      'Système': 'DSM',
    }),
  };
}

const G1 = '1 × 1 GbE';
const G2 = '2 × 1 GbE';
const G4 = '4 × 1 GbE';
const NE = ' (non extensible)';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Série 12 / 13 ───
  ds('DS213j', 2013, 'DiskStation Value', 2, 'Marvell Armada 370 (1 cœur, 1,2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS213', 2012, 'DiskStation Value', 2, 'Marvell Kirkwood 88F6282 (1 cœur, 2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS213+', 2012, 'DiskStation Plus', 2, 'Freescale QorIQ P1022 (2 cœurs, 1,07 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, []),
  ds('DS213air', 2013, 'DiskStation Value', 2, 'Marvell Kirkwood 88F6282 (1 cœur, 2 GHz)', '256 Mo DDR3', '256 Mo' + NE, G1, ['budget']),
  ds('DS413j', 2012, 'DiskStation Value', 4, 'Marvell Kirkwood 88F6282 (1 cœur, 1,6 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS413', 2012, 'DiskStation Value', 4, 'Freescale QorIQ P1022 (2 cœurs, 2 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS412+', 2012, 'DiskStation Plus', 4, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G2, []),
  ds('DS713+', 2013, 'DiskStation Plus', 2, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '4 Go', G2, []),
  ds('DS1512+', 2012, 'DiskStation Plus', 5, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4, ['pro']),
  ds('DS1812+', 2012, 'DiskStation Plus', 8, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4, ['pro']),
  ds('DS1513+', 2013, 'DiskStation Plus', 5, 'Intel Atom D2701 (2 cœurs, 2,13 GHz)', '2 Go DDR3', '4 Go', G4, ['pro']),
  ds('DS1813+', 2013, 'DiskStation Plus', 8, 'Intel Atom D2701 (2 cœurs, 2,13 GHz)', '2 Go DDR3', '4 Go', G4, ['pro']),
  ds('DS2413+', 2012, 'DiskStation Plus', 12, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '2 Go DDR3', '4 Go', G2, ['pro']),
  ds('DS3612xs', 2012, 'DiskStation XS', 12, 'Intel Core i3-2100 (2 cœurs, 3,1 GHz)', '2 Go DDR3', '8 Go', G4, ['pro', 'serveur']),

  // ─── Série 14 ───
  ds('DS114', 2014, 'DiskStation Value', 1, 'Marvell Armada 370 (1 cœur, 1,2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS214se', 2014, 'DiskStation Value', 2, 'Marvell Armada 370 (1 cœur, 800 MHz)', '256 Mo DDR3', '256 Mo' + NE, G1, ['budget']),
  ds('DS214', 2013, 'DiskStation Value', 2, 'Marvell Armada XP (2 cœurs, 1,33 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, []),
  ds('DS214+', 2013, 'DiskStation Plus', 2, 'Marvell Armada XP (2 cœurs, 1,33 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS214play', 2013, 'DiskStation Play', 2, 'Intel Atom CE5335 (2 cœurs, 1,6 GHz)', '1 Go DDR3', '1 Go' + NE, G1, []),
  ds('DS214air', 2014, 'DiskStation Value', 2, 'Marvell Armada 370 (1 cœur, 1,2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS414', 2013, 'DiskStation Value', 4, 'Marvell Armada XP (2 cœurs, 1,33 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS414j', 2014, 'DiskStation Value', 4, 'Mindspeed Comcerto 2000 (2 cœurs, 1,2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS414slim', 2014, 'DiskStation Value', 4, 'Marvell Armada 370 (1 cœur, 1,2 GHz)', '512 Mo DDR3', '512 Mo' + NE, G2, []),

  // ─── Série 15 ───
  ds('DS115j', 2015, 'DiskStation Value', 1, 'Marvell Armada 370 (1 cœur, 800 MHz)', '256 Mo DDR3', '256 Mo' + NE, G1, ['budget']),
  ds('DS115', 2015, 'DiskStation Value', 1, 'Marvell Armada 385 (2 cœurs, 1,33 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS215j', 2015, 'DiskStation Value', 2, 'Marvell Armada 375 (2 cœurs, 800 MHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS215+', 2015, 'DiskStation Plus', 2, 'Annapurna Labs Alpine AL-212 (2 cœurs, 1,4 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS415+', 2015, 'DiskStation Plus', 4, 'Intel Atom C2538 (4 cœurs, 2,4 GHz)', '2 Go DDR3', '2 Go' + NE, G2, ['homelab']),
  ds('DS415play', 2015, 'DiskStation Play', 4, 'Intel Atom CE5335 (2 cœurs, 1,6 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS715', 2015, 'DiskStation Value', 2, 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,4 GHz)', '2 Go DDR3', '2 Go' + NE, G2, []),
  ds('DS1515', 2015, 'DiskStation Value', 5, 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,4 GHz)', '2 Go DDR3', '2 Go' + NE, G4, ['pro']),
  ds('DS1515+', 2015, 'DiskStation Plus', 5, 'Intel Atom C2538 (4 cœurs, 2,4 GHz)', '2 Go DDR3', '6 Go', G4, ['pro', 'homelab']),
  ds('DS1815+', 2014, 'DiskStation Plus', 8, 'Intel Atom C2538 (4 cœurs, 2,4 GHz)', '2 Go DDR3', '6 Go', G4, ['pro', 'homelab']),
  ds('DS2415+', 2014, 'DiskStation Plus', 12, 'Intel Atom C2538 (4 cœurs, 2,4 GHz)', '2 Go DDR3', '6 Go', G4, ['pro']),
  ds('DS2015xs', 2015, 'DiskStation XS', 8, 'Annapurna Labs Alpine AL-514 (4 cœurs, 1,7 GHz)', '4 Go DDR3', '4 Go' + NE, '2 × 1 GbE + 2 × 10 GbE SFP+', ['pro']),
  ds('DS3615xs', 2015, 'DiskStation XS', 12, 'Intel Core i3-4130 (2 cœurs, 3,4 GHz)', '4 Go DDR3', '32 Go', G4, ['pro', 'serveur']),

  // ─── Série 16 ───
  ds('DS116', 2016, 'DiskStation Value', 1, 'Marvell Armada 385 (2 cœurs, 1,8 GHz)', '1 Go DDR3', '1 Go' + NE, G1, ['budget']),
  ds('DS216se', 2016, 'DiskStation Value', 2, 'Marvell Armada 370 (1 cœur, 800 MHz)', '256 Mo DDR3', '256 Mo' + NE, G1, ['budget']),
  ds('DS216j', 2016, 'DiskStation Value', 2, 'Marvell Armada 385 (2 cœurs, 1 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS216', 2016, 'DiskStation Value', 2, 'Annapurna Labs Alpine AL-212 (2 cœurs, 1,4 GHz)', '1 Go DDR3', '1 Go' + NE, G1, []),
  ds('DS216play', 2016, 'DiskStation Play', 2, 'STMicroelectronics Monaco STiH412 (2 cœurs, 1,5 GHz)', '1 Go DDR3', '1 Go' + NE, G1, []),
  ds('DS216+', 2016, 'DiskStation Plus', 2, 'Intel Celeron N3050 (2 cœurs, 1,6 GHz)', '1 Go DDR3L', '1 Go' + NE, G1, []),
  ds('DS216+II', 2016, 'DiskStation Plus', 2, 'Intel Celeron N3060 (2 cœurs, 1,6 GHz)', '1 Go DDR3L', '8 Go', G1, []),
  ds('DS716+', 2016, 'DiskStation Plus', 2, 'Intel Celeron N3150 (4 cœurs, 1,6 GHz)', '2 Go DDR3L', '2 Go' + NE, G2, []),
  ds('DS716+II', 2016, 'DiskStation Plus', 2, 'Intel Celeron N3160 (4 cœurs, 1,6 GHz)', '2 Go DDR3L', '8 Go', G2, []),
  ds('DS416', 2016, 'DiskStation Value', 4, 'Annapurna Labs Alpine AL-212 (2 cœurs, 1,4 GHz)', '1 Go DDR3', '1 Go' + NE, G2, []),
  ds('DS416j', 2016, 'DiskStation Value', 4, 'Marvell Armada 385 (2 cœurs, 1,3 GHz)', '512 Mo DDR3', '512 Mo' + NE, G1, ['budget']),
  ds('DS416play', 2016, 'DiskStation Play', 4, 'Intel Celeron N3060 (2 cœurs, 1,6 GHz)', '1 Go DDR3L', '8 Go', G2, []),
  ds('DS416slim', 2016, 'DiskStation Value', 4, 'Marvell Armada 385 (2 cœurs, 1,3 GHz)', '512 Mo DDR3', '512 Mo' + NE, G2, []),
  ds('DS916+', 2016, 'DiskStation Plus', 4, 'Intel Pentium N3710 (4 cœurs, 1,6 GHz)', '2 Go DDR3L', '2 Go' + NE, G2, ['homelab'], { suffix: '(2 Go)', idSuffix: '2go' }),
  ds('DS916+', 2016, 'DiskStation Plus', 4, 'Intel Pentium N3710 (4 cœurs, 1,6 GHz)', '8 Go DDR3L', '8 Go' + NE, G2, ['homelab'], { suffix: '(8 Go)', idSuffix: '8go' }),

  // ─── Série 17 ───
  ds('DS1517', 2017, 'DiskStation Value', 5, 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,7 GHz)', '2 Go DDR3', '8 Go', G4, ['pro']),
  ds('DS1817', 2017, 'DiskStation Value', 8, 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,7 GHz)', undefined, '8 Go', undefined, ['pro']),
  ds('DS1517+', 2017, 'DiskStation Plus', 5, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '2 Go DDR4', '16 Go', G4, ['pro', 'homelab'], { suffix: '(2 Go)', idSuffix: '2go' }),
  ds('DS1517+', 2017, 'DiskStation Plus', 5, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '8 Go DDR4', '16 Go', G4, ['pro', 'homelab'], { suffix: '(8 Go)', idSuffix: '8go' }),
  ds('DS1817+', 2017, 'DiskStation Plus', 8, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '2 Go DDR4', '16 Go', G4, ['pro', 'homelab'], { suffix: '(2 Go)', idSuffix: '2go' }),
  ds('DS1817+', 2017, 'DiskStation Plus', 8, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '8 Go DDR4', '16 Go', G4, ['pro', 'homelab'], { suffix: '(8 Go)', idSuffix: '8go' }),
  ds('DS3617xs', 2017, 'DiskStation XS', 12, 'Intel Xeon D-1527 (4 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '48 Go', G4, ['pro', 'serveur']),
  ds('DS118', 2017, 'DiskStation Value', 1, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '1 Go DDR4', '1 Go' + NE, G1, ['budget']),
  ds('DS218j', 2017, 'DiskStation Value', 2, 'Marvell Armada 385 (2 cœurs, 1,3 GHz)', '512 Mo DDR3L', '512 Mo' + NE, G1, ['budget']),
  ds('DS218', 2017, 'DiskStation Value', 2, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '2 Go DDR4', '2 Go' + NE, G1, []),
  ds('DS218play', 2017, 'DiskStation Play', 2, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '1 Go DDR4', '1 Go' + NE, G1, []),
  ds('DS218+', 2017, 'DiskStation Plus', 2, 'Intel Celeron J3355 (2 cœurs, 2 GHz)', '2 Go DDR3L', '6 Go', G1, ['homelab'], { msrp: 330 }),
  ds('DS418j', 2017, 'DiskStation Value', 4, 'Realtek RTD1293 (2 cœurs, 1,4 GHz)', '1 Go DDR4', '1 Go' + NE, G1, ['budget']),
  ds('DS418', 2017, 'DiskStation Value', 4, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '2 Go DDR4', '2 Go' + NE, G2, []),
  ds('DS418play', 2017, 'DiskStation Play', 4, 'Intel Celeron J3355 (2 cœurs, 2 GHz)', '2 Go DDR3L', '6 Go', G2, []),
  ds('DS718+', 2017, 'DiskStation Plus', 2, 'Intel Celeron J3455 (4 cœurs, 1,5 GHz)', '2 Go DDR3L', '6 Go', G2, ['homelab']),

  // ─── Série 18 / 19 ───
  ds('DS918+', 2018, 'DiskStation Plus', 4, 'Intel Celeron J3455 (4 cœurs, 1,5 GHz)', '4 Go DDR3L', '8 Go', G2, ['homelab'], { m2: '2 × M.2 2280 NVMe', msrp: 560 }),
  ds('DS1618+', 2018, 'DiskStation Plus', 6, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '4 Go DDR4', '32 Go', G4, ['pro', 'homelab']),
  ds('DS3018xs', 2018, 'DiskStation XS', 6, 'Intel Pentium D1508 (2 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '32 Go', G4, ['pro']),
  ds('DS119j', 2019, 'DiskStation Value', 1, 'Marvell Armada 3700 88F3720 (2 cœurs, 800 MHz)', '256 Mo DDR3L', '256 Mo' + NE, G1, ['budget']),
  ds('DS419slim', 2019, 'DiskStation Value', 4, 'Marvell Armada 385 (2 cœurs, 1,33 GHz)', '512 Mo DDR3L', '512 Mo' + NE, G2, []),
  ds('DS620slim', 2019, 'DiskStation Plus', 6, 'Intel Celeron J3355 (2 cœurs, 2 GHz)', '2 Go DDR3L', '6 Go', G2, []),
  ds('DS1019+', 2019, 'DiskStation Plus', 5, 'Intel Celeron J3455 (4 cœurs, 1,5 GHz)', '8 Go DDR3L', '8 Go' + NE, G2, ['homelab'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS1819+', 2019, 'DiskStation Plus', 8, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '4 Go DDR4', '32 Go', G4, ['pro', 'homelab']),
  ds('DS2419+', 2019, 'DiskStation Plus', 12, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '4 Go DDR4', '32 Go', G4, ['pro']),

  // ─── Série 20 ───
  ds('DS120j', 2020, 'DiskStation Value', 1, 'Marvell Armada 3700 88F3720 (2 cœurs, 800 MHz)', '512 Mo DDR3L', '512 Mo' + NE, G1, ['budget']),
  ds('DS220j', 2020, 'DiskStation Value', 2, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '512 Mo DDR4', '512 Mo' + NE, G1, ['budget'], { msrp: 180 }),
  ds('DS420j', 2020, 'DiskStation Value', 4, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '1 Go DDR4', '1 Go' + NE, G1, ['budget']),
  ds('DS220+', 2020, 'DiskStation Plus', 2, 'Intel Celeron J4025 (2 cœurs, 2 GHz)', '2 Go DDR4', '6 Go', G2, ['homelab'], { msrp: 330 }),
  ds('DS420+', 2020, 'DiskStation Plus', 4, 'Intel Celeron J4025 (2 cœurs, 2 GHz)', '2 Go DDR4', '6 Go', G2, ['homelab'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS720+', 2020, 'DiskStation Plus', 2, 'Intel Celeron J4125 (4 cœurs, 2 GHz)', '2 Go DDR4', '6 Go', G2, ['homelab'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS920+', 2020, 'DiskStation Plus', 4, 'Intel Celeron J4125 (4 cœurs, 2 GHz)', '4 Go DDR4', '8 Go', G2, ['homelab'], { m2: '2 × M.2 2280 NVMe', msrp: 560 }),
  ds('DS1520+', 2020, 'DiskStation Plus', 5, 'Intel Celeron J4125 (4 cœurs, 2 GHz)', '8 Go DDR4', '8 Go' + NE, G4, ['homelab', 'pro'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS3617xsII', 2020, 'DiskStation XS', 12, 'Intel Xeon D-1527 (4 cœurs, 2,2 GHz)', '16 Go DDR4 ECC', '48 Go', G4, ['pro', 'serveur']),

  // ─── Série 21 / 22 ───
  ds('DS1621xs+', 2021, 'DiskStation XS', 6, 'Intel Xeon D-1527 (4 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '32 Go', '2 × 1 GbE + 1 × 10 GbE', ['pro'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS1821+', 2021, 'DiskStation Plus', 8, 'AMD Ryzen V1500B (4 cœurs, 2,2 GHz)', '4 Go DDR4 ECC', '32 Go', G4, ['pro', 'homelab'], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS2419+II', 2021, 'DiskStation Plus', 12, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '4 Go DDR4', '32 Go', G4, ['pro']),
  ds('DS3622xs+', 2021, 'DiskStation XS', 12, 'Intel Xeon D-1531 (6 cœurs, 2,2 GHz)', '16 Go DDR4 ECC', '48 Go', '2 × 1 GbE + 2 × 10 GbE', ['pro', 'serveur']),
  ds('DS2422+', 2022, 'DiskStation Plus', 12, 'AMD Ryzen V1500B (4 cœurs, 2,2 GHz)', '4 Go DDR4 ECC', '32 Go', G4, ['pro']),

  // ─── Série 23 / 25 ───
  ds('DS223j', 2023, 'DiskStation Value', 2, 'Realtek RTD1619B (4 cœurs, 1,7 GHz)', '1 Go DDR4', '1 Go' + NE, G1, ['budget']),
  ds('DS423', 2023, 'DiskStation Value', 4, 'Realtek RTD1619B (4 cœurs, 1,7 GHz)', '2 Go DDR4', '2 Go' + NE, G2, [], { m2: '2 × M.2 2280 NVMe' }),
  ds('DS725+', 2025, 'DiskStation Plus', 2, 'AMD Ryzen R1600 (2 cœurs, 2,6 GHz)', '4 Go DDR4 ECC', '32 Go', undefined, ['homelab'], { m2: '2 × M.2 2280 NVMe' }),
];
