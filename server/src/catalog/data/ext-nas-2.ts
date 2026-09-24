import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue NAS : Synology RackStation, FlashStation, SA/UC/HD,
 * unités d'extension (DX/RX), NVR/DVA et BeeStation.
 * Clés omises lorsque la valeur n'est pas certaine.
 */

type Specs = Record<string, string | number | undefined>;

function clean(specs: Specs): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(specs)) if (v !== undefined) out[k] = v;
  return out;
}

function syn(
  line: string,
  model: string,
  year: number,
  family: string,
  baies: number,
  cpu: string | undefined,
  ram: string | undefined,
  ramMax: string | undefined,
  reseau: string | undefined,
  tags: string[],
  extra: { m2?: string; os?: string | null; msrp?: number } = {},
): CatalogProduct {
  const slug = model.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9-]/g, '-');
  return {
    id: `nas-synology-${slug}`,
    category: 'nas',
    brand: 'Synology',
    name: `Synology ${line ? line + ' ' : ''}${model}`,
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
      'Système': extra.os === null ? undefined : (extra.os ?? 'DSM'),
    }),
  };
}

const rs = (model: string, year: number, family: string, baies: number, cpu?: string, ram?: string, ramMax?: string, reseau?: string, tags: string[] = []) =>
  syn('RackStation', model, year, family, baies, cpu, ram, ramMax, reseau, ['pro', 'serveur', ...tags]);

/** Unité d'extension : pas de processeur ni de système propre. */
const exp = (model: string, year: number, family: string, baies: number, link?: string) => {
  const p = syn('', model, year, family, baies, undefined, undefined, undefined, undefined, ['pro'], { os: null });
  p.name = `Synology ${model} (unité d’extension)`;
  if (link) p.specs['Connexion'] = link;
  return p;
};

const G4 = '4 × 1 GbE';
const C2538 = 'Intel Atom C2538 (4 cœurs, 2,4 GHz)';
const C3538 = 'Intel Atom C3538 (4 cœurs, 2,1 GHz)';
const V1500 = 'AMD Ryzen V1500B (4 cœurs, 2,2 GHz)';

export const PRODUCTS: CatalogProduct[] = [
  // ─── RackStation ───
  rs('RS812', 2012, 'RackStation Value', 4, undefined, '512 Mo DDR3', undefined, '2 × 1 GbE'),
  rs('RS812+', 2012, 'RackStation Plus', 4, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4),
  rs('RS812RP+', 2012, 'RackStation Plus', 4, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4),
  rs('RS3413xs+', 2013, 'RackStation XS', 12, 'Intel Xeon E3-1230 (4 cœurs, 3,2 GHz)', '4 Go DDR3 ECC', undefined, G4),
  rs('RS10613xs+', 2013, 'RackStation XS', 10, 'Intel Xeon E5-2620 (6 cœurs, 2 GHz)', '8 Go DDR3 ECC', '64 Go', '4 × 1 GbE + 2 × 10 GbE'),
  rs('RS214', 2014, 'RackStation Value', 2, undefined, '512 Mo DDR3', '512 Mo (non extensible)', '2 × 1 GbE'),
  rs('RS814', 2014, 'RackStation Value', 4, 'Marvell Armada XP (4 cœurs, 1,33 GHz)', '1 Go DDR3', '1 Go (non extensible)', G4),
  rs('RS814+', 2014, 'RackStation Plus', 4, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4),
  rs('RS814RP+', 2014, 'RackStation Plus', 4, 'Intel Atom D2700 (2 cœurs, 2,13 GHz)', '1 Go DDR3', '3 Go', G4),
  rs('RS2414+', 2014, 'RackStation Plus', 12, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS2414RP+', 2014, 'RackStation Plus', 12, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS3614xs', 2014, 'RackStation XS', 12, 'Intel Core i3-4130 (2 cœurs, 3,4 GHz)', '4 Go DDR3', '32 Go', G4),
  rs('RS3614xs+', 2014, 'RackStation XS', 12, 'Intel Xeon E3-1230 v2 (4 cœurs, 3,3 GHz)', '8 Go DDR3 ECC', '32 Go', G4),
  rs('RS3614RPxs', 2014, 'RackStation XS', 12, 'Intel Core i3-4130 (2 cœurs, 3,4 GHz)', '4 Go DDR3', '32 Go', G4),
  rs('RS815', 2015, 'RackStation Value', 4, 'Annapurna Labs Alpine AL-314 (4 cœurs, 1,4 GHz)', '2 Go DDR3', '2 Go (non extensible)', G4),
  rs('RS815+', 2015, 'RackStation Plus', 4, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS815RP+', 2015, 'RackStation Plus', 4, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS2416+', 2016, 'RackStation Plus', 12, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS2416RP+', 2016, 'RackStation Plus', 12, C2538, '2 Go DDR3', '6 Go', G4),
  rs('RS816', 2016, 'RackStation Value', 4, 'Marvell Armada 385 (2 cœurs, 1,8 GHz)', '1 Go DDR3', '1 Go (non extensible)', '2 × 1 GbE'),
  rs('RS18016xs+', 2016, 'RackStation XS', 12, '2 × Intel Xeon E5-2620 v3 (6 cœurs, 2,4 GHz)', '64 Go DDR4 ECC', '512 Go', G4),
  rs('RS217', 2017, 'RackStation Value', 2, 'Marvell Armada 385 (2 cœurs, 1,3 GHz)', '512 Mo DDR3', '512 Mo (non extensible)', '2 × 1 GbE'),
  rs('RS3617xs', 2017, 'RackStation XS', 12, 'Intel Xeon D-1521 (4 cœurs, 2,4 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS3617RPxs', 2017, 'RackStation XS', 12, 'Intel Xeon D-1521 (4 cœurs, 2,4 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS3617xs+', 2017, 'RackStation XS', 12, 'Intel Xeon E3-1230 v6 (4 cœurs, 3,5 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS4017xs+', 2017, 'RackStation XS', 16, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '8 Go DDR4 ECC', '64 Go', '2 × 1 GbE + 2 × 10 GbE'),
  rs('RS18017xs+', 2017, 'RackStation XS', 12, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 1 GbE + 2 × 10 GbE'),
  rs('RS818+', 2018, 'RackStation Plus', 4, C3538, '2 Go DDR4', '16 Go', G4),
  rs('RS818RP+', 2018, 'RackStation Plus', 4, C3538, '2 Go DDR4', '16 Go', G4),
  rs('RS2418+', 2018, 'RackStation Plus', 12, C3538, '4 Go DDR4', '64 Go', G4),
  rs('RS2418RP+', 2018, 'RackStation Plus', 12, C3538, '4 Go DDR4', '64 Go', G4),
  rs('RS2818RP+', 2018, 'RackStation Plus', 16, C3538, '4 Go DDR4', '64 Go', G4),
  rs('RS3618xs', 2018, 'RackStation XS', 12, 'Intel Xeon D-1521 (4 cœurs, 2,4 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS819', 2019, 'RackStation Value', 4, 'Realtek RTD1296 (4 cœurs, 1,4 GHz)', '2 Go DDR4', '2 Go (non extensible)', '2 × 1 GbE'),
  rs('RS1219+', 2019, 'RackStation Plus', 8, C2538, '2 Go DDR3', '16 Go', G4),
  rs('RS1619xs+', 2019, 'RackStation XS', 4, 'Intel Xeon D-1527 (4 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS820+', 2020, 'RackStation Plus', 4, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '2 Go DDR4', '18 Go', G4),
  rs('RS820RP+', 2020, 'RackStation Plus', 4, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', '2 Go DDR4', '18 Go', G4),
  rs('RS1221RP+', 2021, 'RackStation Plus', 8, V1500, '4 Go DDR4 ECC', '32 Go', G4),
  rs('RS2421+', 2021, 'RackStation Plus', 12, V1500, '4 Go DDR4 ECC', '32 Go', G4),
  rs('RS2421RP+', 2021, 'RackStation Plus', 12, V1500, '4 Go DDR4 ECC', '32 Go', G4),
  rs('RS2821RP+', 2021, 'RackStation Plus', 16, V1500, '4 Go DDR4 ECC', '32 Go', G4),
  rs('RS3621xs+', 2021, 'RackStation XS', 12, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '8 Go DDR4 ECC', '64 Go', '4 × 1 GbE + 2 × 10 GbE'),
  rs('RS3621RPxs', 2021, 'RackStation XS', 12, 'Intel Xeon D-1531 (6 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '64 Go', G4),
  rs('RS4021xs+', 2021, 'RackStation XS', 16, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '64 Go', '4 × 1 GbE + 2 × 10 GbE'),
  rs('RS422+', 2022, 'RackStation Plus', 4, 'AMD Ryzen R1600 (2 cœurs, 2,6 GHz)', '2 Go DDR4', undefined, G4),
  rs('RS822RP+', 2022, 'RackStation Plus', 4, V1500, '2 Go DDR4 ECC', '32 Go', G4),
  rs('RS2423+', 2023, 'RackStation Plus', 12, 'AMD Ryzen V1780B (4 cœurs, 3,35 GHz)', '8 Go DDR4 ECC', '32 Go', '2 × 1 GbE + 1 × 10 GbE'),
  rs('RS2423RP+', 2023, 'RackStation Plus', 12, 'AMD Ryzen V1780B (4 cœurs, 3,35 GHz)', '8 Go DDR4 ECC', '32 Go', '2 × 1 GbE + 1 × 10 GbE'),

  // ─── FlashStation (100 % SSD) ───
  syn('FlashStation', 'FS2017', 2017, 'FlashStation', 24, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE', ['pro', 'serveur']),
  syn('FlashStation', 'FS3017', 2017, 'FlashStation', 24, '2 × Intel Xeon E5-2620 v3 (6 cœurs, 2,4 GHz)', '64 Go DDR4 ECC', '512 Go', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),
  syn('FlashStation', 'FS1018', 2018, 'FlashStation', 12, 'Intel Pentium D1508 (2 cœurs, 2,2 GHz)', '8 Go DDR4 ECC', '32 Go', '2 × 1 GbE', ['pro']),
  syn('FlashStation', 'FS3400', 2019, 'FlashStation', 24, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE + 4 × 1 GbE', ['pro', 'serveur']),
  syn('FlashStation', 'FS3600', 2019, 'FlashStation', 24, 'Intel Xeon D-1567 (12 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE + 4 × 1 GbE', ['pro', 'serveur']),
  syn('FlashStation', 'FS6400', 2019, 'FlashStation', 24, '2 × Intel Xeon Silver 4110 (8 cœurs, 2,1 GHz)', '32 Go DDR4 ECC', '512 Go', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),
  syn('FlashStation', 'FS2500', 2021, 'FlashStation', 12, 'AMD Ryzen V1780B (4 cœurs, 3,35 GHz)', '8 Go DDR4 ECC', '32 Go', '2 × 1 GbE + 2 × 10 GbE', ['pro']),
  syn('FlashStation', 'FS3410', 2022, 'FlashStation', 24, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),

  // ─── SA / UC / HD (entreprise) ───
  syn('', 'SA3400', 2019, 'SA', 12, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '4 × 1 GbE + 2 × 10 GbE', ['pro', 'serveur']),
  syn('', 'SA3600', 2019, 'SA', 12, 'Intel Xeon D-1567 (12 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '4 × 1 GbE + 2 × 10 GbE', ['pro', 'serveur']),
  syn('', 'SA3200D', 2019, 'SA', 12, '2 × Intel Xeon D-1521 (4 cœurs, 2,4 GHz)', undefined, undefined, undefined, ['pro', 'serveur']),
  syn('', 'SA3400D', 2022, 'SA', 12, '2 × Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', undefined, undefined, undefined, ['pro', 'serveur']),
  syn('', 'SA3410', 2022, 'SA', 12, 'Intel Xeon D-1541 (8 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),
  syn('', 'SA3610', 2022, 'SA', 12, 'Intel Xeon D-1567 (12 cœurs, 2,1 GHz)', '16 Go DDR4 ECC', '128 Go', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),
  syn('', 'SA6400', 2022, 'SA', 12, 'AMD EPYC 7272 (12 cœurs, 2,9 GHz)', '32 Go DDR4 ECC', '1 To', '2 × 10 GbE + 2 × 1 GbE', ['pro', 'serveur']),
  syn('Unified Controller', 'UC3200', 2019, 'Unified Controller', 12, '2 × Intel Xeon D-1521 (4 cœurs, 2,4 GHz)', undefined, undefined, undefined, ['pro', 'serveur'], { os: 'DSM UC' }),
  syn('Unified Controller', 'UC3400', 2023, 'Unified Controller', 12, undefined, undefined, undefined, undefined, ['pro', 'serveur'], { os: 'DSM UC' }),
  syn('', 'HD6500', 2022, 'HD', 60, '2 × Intel Xeon Silver 4210R (10 cœurs, 2,4 GHz)', '64 Go DDR4 ECC', '2 To', undefined, ['pro', 'serveur']),

  // ─── Unités d'extension ───
  exp('DX213', 2013, 'DX', 2, 'eSATA'),
  exp('DX513', 2013, 'DX', 5, 'eSATA'),
  exp('DX1215', 2015, 'DX', 12, 'Infiniband'),
  exp('DX517', 2017, 'DX', 5, 'eSATA'),
  exp('DX1215II', 2021, 'DX', 12, 'Infiniband'),
  exp('DX1222', 2021, 'DX', 12, 'eSATA'),
  exp('DX525', 2025, 'DX', 5),
  exp('RX1214', 2014, 'RX', 12, 'Infiniband'),
  exp('RX1214RP', 2014, 'RX', 12, 'Infiniband'),
  exp('RX415', 2015, 'RX', 4, 'eSATA'),
  exp('RX1217', 2017, 'RX', 12, 'Infiniband'),
  exp('RX1217RP', 2017, 'RX', 12, 'Infiniband'),
  exp('RX1217sas', 2017, 'RX', 12, 'Mini-SAS HD'),
  exp('RX2417sas', 2017, 'RX', 24, 'Mini-SAS HD'),
  exp('RX418', 2018, 'RX', 4, 'eSATA'),
  exp('RX1222sas', 2022, 'RX', 12, 'Mini-SAS HD'),
  exp('RX6022sas', 2022, 'RX', 60, 'Mini-SAS HD'),
  exp('RX1223RP', 2023, 'RX', 12),

  // ─── Vidéosurveillance (NVR / DVA) ───
  syn('', 'NVR216', 2016, 'NVR', 2, undefined, undefined, undefined, '1 × 1 GbE', ['pro'], { os: 'DSM (Surveillance Station)' }),
  syn('', 'NVR1218', 2018, 'NVR', 2, undefined, undefined, undefined, '1 × 1 GbE', ['pro'], { os: 'DSM (Surveillance Station)' }),
  syn('', 'DVA3219', 2019, 'Deep Video Analytics', 4, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', undefined, undefined, '4 × 1 GbE', ['pro', 'ia'], { os: 'DSM (Surveillance Station)' }),
  syn('', 'DVA3221', 2021, 'Deep Video Analytics', 4, 'Intel Atom C3538 (4 cœurs, 2,1 GHz)', undefined, undefined, '4 × 1 GbE', ['pro', 'ia'], { os: 'DSM (Surveillance Station)' }),
  syn('', 'DVA1622', 2022, 'Deep Video Analytics', 2, 'Intel Celeron J4125 (4 cœurs, 2 GHz)', undefined, undefined, '2 × 1 GbE', ['pro', 'ia'], { os: 'DSM (Surveillance Station)' }),

  // ─── BeeStation ───
  { id: 'nas-synology-beestation-plus-8to', category: 'nas', brand: 'Synology', name: 'Synology BeeStation Plus 8 To', family: 'BeeStation', year: 2025, tags: ['nas', 'budget'], specs: { 'Baies': 1, 'Réseau': '1 × 1 GbE', 'Capacité max': '8 To (disque inclus)', 'Système': 'BSM' } },
];
