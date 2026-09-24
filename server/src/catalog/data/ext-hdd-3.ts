import type { CatalogProduct } from '../types.js';

/** [capacité, référence, tr/min (0 = inconnu), cache en Mo (0 = inconnu), technologie ('' = inconnue), année, prix de lancement] */
type Row = [cap: string, model: string, rpm: number, cache: number, tech: string, year: number, msrp?: number];
interface Line { brand: string; family: string; name: string; iface: string; usage: string; warranty?: string; tags: string[]; refurb?: boolean; suffix?: string }

const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const slug = (s: string): string => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function line(l: Line, rows: Row[]): CatalogProduct[] {
  return rows.map(([cap, model, rpm, cache, tech, year, msrp]) => {
    const name = `${l.name} ${cap}${l.suffix ?? ''}${model ? ' ' + model : ''}`;
    const specs: Record<string, string | number> = { 'Capacité': cap };
    if (rpm) specs['Vitesse de rotation'] = `${fmt(rpm)} tr/min`;
    if (cache) specs['Cache'] = `${cache} Mo`;
    specs['Interface'] = l.iface;
    specs['Usage'] = l.usage;
    if (tech) specs['Technologie'] = tech;
    if (l.warranty) specs['Garantie'] = l.warranty;
    const p: CatalogProduct = { id: 'hdd-' + slug(name), category: 'hdd', brand: l.brand, name, family: l.family, year, refurbishable: l.refurb ?? true, tags: l.tags, specs };
    if (msrp) p.msrp = msrp;
    return p;
  });
}

const SATA = 'SATA III 6 Gb/s';
const HE = 'CMR, hélium';
const W = { brand: 'Western Digital' };

/** Disques durs Western Digital (WD Blue, Green, Black, Red, Purple, Gold, Re, Ultrastar DC). */
export const PRODUCTS: CatalogProduct[] = [
  // ─── WD Blue / Green ───────────────────────────────────────────────────────
  ...line({ ...W, family: 'WD Blue', name: 'WD Blue', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['500 Go', 'WD5000AZLX', 7200, 32, 'CMR', 2015, 50],
    ['1 To', 'WD10EZEX', 7200, 64, 'CMR', 2013, 55],
    ['1 To', 'WD10EZRZ', 5400, 64, 'CMR', 2015, 50],
    ['2 To', 'WD20EZRZ', 5400, 64, 'CMR', 2015, 70],
    ['3 To', 'WD30EZRZ', 5400, 64, 'CMR', 2015, 95],
    ['4 To', 'WD40EZRZ', 5400, 64, 'CMR', 2015, 130],
    ['6 To', 'WD60EZRZ', 5400, 64, 'CMR', 2016, 220],
    ['6 To', 'WD60EZAZ', 5400, 256, 'SMR', 2019, 170],
    ['8 To', 'WD80EAZZ', 0, 0, '', 2021, 190],
  ]),
  ...line({ ...W, family: 'WD Blue', name: 'WD Blue 2,5 pouces', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['320 Go', 'WD3200LPVX', 5400, 8, 'CMR', 2013],
    ['500 Go', 'WD5000LPVX', 5400, 8, 'CMR', 2013],
    ['500 Go', 'WD5000LPCX', 5400, 16, 'CMR', 2016, 45],
    ['750 Go', 'WD7500BPVX', 5400, 8, 'CMR', 2013],
    ['1 To', 'WD10JPVX', 5400, 8, 'CMR', 2013, 60],
    ['1 To', 'WD10SPZX', 5400, 128, 'SMR', 2017, 55],
    ['2 To', 'WD20SPZX', 5400, 128, 'SMR', 2017, 85],
  ]),
  ...line({ ...W, family: 'WD Green', name: 'WD Green', iface: SATA, usage: 'PC de bureau (basse consommation)', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['1 To', 'WD10EZRX', 0, 64, 'CMR', 2012],
    ['2 To', 'WD20EZRX', 0, 64, 'CMR', 2012],
    ['3 To', 'WD30EZRX', 0, 64, 'CMR', 2012],
    ['4 To', 'WD40EZRX', 0, 64, 'CMR', 2013],
  ]),

  // ─── WD Black ──────────────────────────────────────────────────────────────
  ...line({ ...W, family: 'WD Black', name: 'WD Black', iface: SATA, usage: 'PC de bureau hautes performances', warranty: '5 ans', tags: ['gaming', 'creation'] }, [
    ['500 Go', 'WD5003AZEX', 7200, 64, 'CMR', 2013],
    ['1 To', 'WD1003FZEX', 7200, 64, 'CMR', 2013, 85],
    ['2 To', 'WD2003FZEX', 7200, 64, 'CMR', 2013, 130],
    ['3 To', 'WD3003FZEX', 7200, 64, 'CMR', 2013],
    ['4 To', 'WD4004FZWX', 7200, 128, 'CMR', 2015],
    ['4 To', 'WD4005FZBX', 7200, 256, 'CMR', 2018, 200],
    ['6 To', 'WD6003FZBX', 7200, 256, 'CMR', 2018, 280],
    ['8 To', 'WD8001FZBX', 7200, 256, 'CMR', 2019, 330],
    ['10 To', 'WD101FZBX', 7200, 256, HE, 2019, 400],
  ]),
  ...line({ ...W, family: 'WD Black', name: 'WD Black 2,5 pouces', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '5 ans', tags: ['mobile', 'gaming'] }, [
    ['500 Go', 'WD5000LPLX', 7200, 32, 'CMR', 2014],
    ['750 Go', 'WD7500BPKX', 7200, 16, 'CMR', 2013],
    ['1 To', 'WD10SPSX', 7200, 64, 'CMR', 2017, 85],
  ]),

  // ─── WD Red (historique) / Red Plus / Red Pro ──────────────────────────────
  ...line({ ...W, family: 'WD Red', name: 'WD Red', iface: SATA, usage: 'NAS (1 à 8 baies)', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['1 To', 'WD10EFRX', 5400, 64, 'CMR', 2013],
    ['2 To', 'WD20EFRX', 5400, 64, 'CMR', 2012],
    ['3 To', 'WD30EFRX', 5400, 64, 'CMR', 2012],
    ['4 To', 'WD40EFRX', 5400, 64, 'CMR', 2013],
    ['5 To', 'WD50EFRX', 5400, 64, 'CMR', 2014],
    ['6 To', 'WD60EFRX', 5400, 64, 'CMR', 2014],
    ['8 To', 'WD80EFZX', 5400, 128, HE, 2016],
    ['10 To', 'WD100EFAX', 5400, 256, HE, 2017],
    ['12 To', 'WD120EFAX', 5400, 256, HE, 2018],
    ['2 To', 'WD20EFAX', 5400, 256, 'SMR', 2019],
    ['3 To', 'WD30EFAX', 5400, 256, 'SMR', 2019],
    ['4 To', 'WD40EFAX', 5400, 256, 'SMR', 2019],
    ['6 To', 'WD60EFAX', 5400, 256, 'SMR', 2019],
  ]),
  ...line({ ...W, family: 'WD Red', name: 'WD Red 2,5 pouces', iface: SATA, usage: 'NAS (2,5 pouces)', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['1 To', 'WD10JFCX', 5400, 16, 'CMR', 2014],
  ]),
  ...line({ ...W, family: 'WD Red Plus', name: 'WD Red Plus', iface: SATA, usage: 'NAS (1 à 8 baies)', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['2 To', 'WD20EFZX', 5400, 128, 'CMR', 2020, 90],
    ['3 To', 'WD30EFZX', 5400, 128, 'CMR', 2020, 110],
    ['10 To', 'WD101EFBX', 7200, 256, HE, 2021, 330],
    ['14 To', 'WD140EFGX', 5400, 512, HE, 2021, 420],
  ]),
  ...line({ ...W, family: 'WD Red Pro', name: 'WD Red Pro', iface: SATA, usage: 'NAS (jusqu’à 24 baies)', warranty: '5 ans', tags: ['nas', 'pro'] }, [
    ['2 To', 'WD2002FFSX', 7200, 64, 'CMR', 2014],
    ['3 To', 'WD3001FFSX', 7200, 64, 'CMR', 2014],
    ['4 To', 'WD4003FFBX', 7200, 256, 'CMR', 2018],
    ['6 To', 'WD6003FFBX', 7200, 256, 'CMR', 2018],
    ['8 To', 'WD8003FFBX', 7200, 256, HE, 2018],
    ['10 To', 'WD102KFBX', 7200, 256, HE, 2019],
    ['14 To', 'WD141KFGX', 7200, 512, HE, 2020],
    ['18 To', 'WD181KFGX', 7200, 512, HE, 2020],
    ['24 To', 'WD240KFGX', 7200, 512, HE, 2023],
    ['26 To', '', 7200, 0, HE, 2025],
  ]),

  // ─── WD Purple / Purple Pro ────────────────────────────────────────────────
  ...line({ ...W, family: 'WD Purple', name: 'WD Purple', iface: SATA, usage: 'Vidéosurveillance', warranty: '3 ans', tags: ['pro'] }, [
    ['1 To', 'WD10PURZ', 5400, 64, 'CMR', 2016],
    ['2 To', 'WD20PURZ', 5400, 64, 'CMR', 2016],
    ['3 To', 'WD30PURZ', 5400, 64, 'CMR', 2016],
    ['6 To', 'WD60PURZ', 5400, 64, 'CMR', 2016],
    ['8 To', 'WD80PURZ', 0, 0, 'CMR', 2017],
    ['10 To', '', 0, 0, 'CMR', 2018],
  ]),
  ...line({ ...W, family: 'WD Purple', name: 'WD Purple Pro', iface: SATA, usage: 'Vidéosurveillance (NVR avec IA)', warranty: '5 ans', tags: ['pro'] }, [
    ['8 To', 'WD8001PURP', 7200, 256, 'CMR', 2021],
    ['10 To', 'WD101PURP', 7200, 256, HE, 2021],
    ['14 To', 'WD141PURP', 7200, 512, HE, 2021],
    ['18 To', 'WD181PURP', 7200, 512, HE, 2021],
    ['22 To', 'WD221PURP', 7200, 512, HE, 2022],
    ['24 To', '', 7200, 0, HE, 2023],
  ]),

  // ─── WD Gold / Re / Se / VelociRaptor ──────────────────────────────────────
  ...line({ ...W, family: 'WD Gold', name: 'WD Gold', iface: SATA, usage: 'Datacenter / serveur', warranty: '5 ans', tags: ['serveur', 'pro'] }, [
    ['1 To', 'WD1005FBYZ', 7200, 128, 'CMR', 2017],
    ['2 To', 'WD2005FBYZ', 7200, 128, 'CMR', 2017],
    ['4 To', 'WD4003FRYZ', 7200, 256, 'CMR', 2017],
    ['6 To', 'WD6003FRYZ', 7200, 256, 'CMR', 2017],
    ['8 To', 'WD8004FRYZ', 7200, 256, HE, 2018],
    ['10 To', 'WD101KRYZ', 7200, 256, HE, 2017],
    ['12 To', 'WD121KRYZ', 7200, 256, HE, 2017],
    ['14 To', 'WD141KRYZ', 7200, 512, HE, 2019],
    ['16 To', 'WD161KRYZ', 7200, 512, HE, 2020],
    ['18 To', 'WD181KRYZ', 7200, 512, HE, 2020],
    ['20 To', '', 7200, 512, HE, 2021],
    ['22 To', 'WD221KRYZ', 7200, 512, HE, 2022],
    ['24 To', '', 7200, 512, HE, 2023],
    ['26 To', '', 7200, 0, HE, 2025],
  ]),
  ...line({ ...W, family: 'WD Re', name: 'WD Re', iface: SATA, usage: 'Datacenter / serveur', warranty: '5 ans', tags: ['serveur', 'pro'] }, [
    ['1 To', 'WD1003FBYZ', 7200, 64, 'CMR', 2013],
    ['2 To', 'WD2000FYYZ', 7200, 64, 'CMR', 2013],
    ['4 To', 'WD4000FYYZ', 7200, 64, 'CMR', 2012],
  ]),
  ...line({ ...W, family: 'WD Se', name: 'WD Se', iface: SATA, usage: 'Datacenter / serveur', warranty: '5 ans', tags: ['serveur', 'pro'] }, [
    ['4 To', 'WD4000F9YZ', 7200, 64, 'CMR', 2013],
  ]),
  ...line({ ...W, family: 'WD VelociRaptor', name: 'WD VelociRaptor', iface: SATA, usage: 'PC de bureau hautes performances (10 000 tr/min)', warranty: '5 ans', tags: ['gaming', 'creation'] }, [
    ['1 To', 'WD1000DHTZ', 10000, 64, 'CMR', 2012],
  ]),

  // ─── WD Ultrastar DC ───────────────────────────────────────────────────────
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC310', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['4 To', 'HUS726T4TALA6L4', 7200, 256, 'CMR', 2018],
    ['6 To', 'HUS726T6TALE6L4', 7200, 256, 'CMR', 2018],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC320', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['8 To', 'HUS728T8TALE6L4', 7200, 256, 'CMR', 2018],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC330', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['10 To', 'WUS721010ALE6L4', 7200, 256, 'CMR', 2019],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC510', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['8 To', 'HUH721008ALE604', 7200, 256, HE, 2017],
    ['10 To', 'HUH721010ALE604', 7200, 256, HE, 2017],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC520', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['12 To', 'HUH721212ALE604', 7200, 256, HE, 2018],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC530', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['14 To', 'WUH721414ALE6L4', 7200, 512, HE, 2019],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC550', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['16 To', 'WUH721816ALE6L4', 7200, 512, HE, 2020],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC580', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['24 To', '', 7200, 512, HE, 2023],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC590', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] }, [
    ['26 To', '', 7200, 512, HE, 2024],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC620', iface: SATA, usage: 'Datacenter (SMR géré par l’hôte)', warranty: '5 ans', tags: ['serveur'] }, [
    ['14 To', '', 7200, 0, 'SMR, hélium', 2019],
    ['15 To', '', 7200, 0, 'SMR, hélium', 2019],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC650', iface: SATA, usage: 'Datacenter (SMR géré par l’hôte)', warranty: '5 ans', tags: ['serveur'] }, [
    ['20 To', '', 7200, 0, 'SMR, hélium', 2020],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC670', iface: SATA, usage: 'Datacenter (SMR géré par l’hôte)', warranty: '5 ans', tags: ['serveur'] }, [
    ['26 To', '', 7200, 0, 'SMR, hélium', 2022],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC680', iface: SATA, usage: 'Datacenter (SMR géré par l’hôte)', warranty: '5 ans', tags: ['serveur'] }, [
    ['28 To', '', 7200, 0, 'SMR, hélium', 2024],
  ]),
  // Versions SAS 12 Gb/s
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC510', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['10 To', 'HUH721010AL5204', 7200, 256, HE, 2017],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC520', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['12 To', 'HUH721212AL5204', 7200, 256, HE, 2018],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC530', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['14 To', 'WUH721414AL5204', 7200, 512, HE, 2019],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC550', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['16 To', 'WUH721816AL5204', 7200, 512, HE, 2020],
    ['18 To', 'WUH721818AL5204', 7200, 512, HE, 2020],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC560', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['20 To', '', 7200, 512, HE, 2021],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC570', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['22 To', '', 7200, 512, HE, 2022],
  ]),
  ...line({ ...W, family: 'Ultrastar DC HC', name: 'WD Ultrastar DC HC580', suffix: ' SAS', iface: 'SAS 12 Gb/s', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['24 To', '', 7200, 512, HE, 2023],
  ]),
];
