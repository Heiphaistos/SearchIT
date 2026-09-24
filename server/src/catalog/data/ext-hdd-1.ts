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
const SSHD = 'SSHD (8 Go de NAND)';

/** Disques durs Seagate grand public, NAS et vidéosurveillance (3,5 et 2,5 pouces). */
export const PRODUCTS: CatalogProduct[] = [
  // ─── BarraCuda 3,5 pouces ──────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'BarraCuda', name: 'Seagate BarraCuda', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['500 Go', 'ST500DM009', 7200, 32, 'CMR', 2016, 50],
    ['1 To', 'ST1000DM010', 7200, 64, 'CMR', 2016, 50],
    ['2 To', 'ST2000DM005', 5400, 256, 'SMR', 2017, 60],
    ['2 To', 'ST2000DM006', 7200, 64, 'CMR', 2015, 70],
    ['3 To', 'ST3000DM007', 5400, 256, 'SMR', 2017, 85],
    ['3 To', 'ST3000DM008', 7200, 256, '', 2017, 90],
    ['4 To', 'ST4000DM005', 5900, 64, '', 2016, 120],
    ['6 To', 'ST6000DM003', 5400, 256, 'SMR', 2017, 160],
  ]),
  ...line({ brand: 'Seagate', family: 'Barracuda 7200.14', name: 'Seagate Barracuda 7200.14', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['500 Go', 'ST500DM002', 7200, 16, 'CMR', 2012],
    ['1 To', 'ST1000DM003', 7200, 64, 'CMR', 2012],
    ['2 To', 'ST2000DM001', 7200, 64, 'CMR', 2012],
    ['3 To', 'ST3000DM001', 7200, 64, 'CMR', 2012],
  ]),
  ...line({ brand: 'Seagate', family: 'Desktop HDD', name: 'Seagate Desktop HDD', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['4 To', 'ST4000DM000', 5900, 64, 'CMR', 2013],
    ['5 To', 'ST5000DM000', 5900, 128, 'CMR', 2014],
  ]),

  // ─── BarraCuda 2,5 pouces et disques portables ─────────────────────────────
  ...line({ brand: 'Seagate', family: 'BarraCuda 2,5"', name: 'Seagate BarraCuda 2,5 pouces', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['500 Go', 'ST500LM030', 5400, 128, 'SMR', 2016, 45],
    ['1 To', 'ST1000LM048', 5400, 128, 'SMR', 2016, 55],
    ['2 To', 'ST2000LM015', 5400, 128, 'SMR', 2016, 85],
  ]),
  ...line({ brand: 'Seagate', family: 'BarraCuda 2,5"', name: 'Seagate BarraCuda 2,5 pouces', iface: SATA, usage: 'Console / boîtier externe (2,5 pouces, 15 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['3 To', 'ST3000LM024', 5400, 128, 'SMR', 2016],
    ['4 To', 'ST4000LM024', 5400, 128, 'SMR', 2016],
    ['5 To', 'ST5000LM000', 5400, 128, 'SMR', 2016],
  ]),
  ...line({ brand: 'Seagate', family: 'Mobile HDD', name: 'Seagate Mobile HDD', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['1 To', 'ST1000LM035', 5400, 128, 'SMR', 2015],
    ['2 To', 'ST2000LM007', 5400, 128, 'SMR', 2015],
  ]),
  ...line({ brand: 'Seagate', family: 'Laptop Thin', name: 'Seagate Laptop Thin', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['500 Go', 'ST500LT012', 5400, 16, 'CMR', 2012],
    ['500 Go', 'ST500LM021', 7200, 32, 'CMR', 2013],
  ]),
  ...line({ brand: 'Seagate', family: 'Spinpoint M9T', name: 'Seagate Spinpoint M9T', iface: SATA, usage: 'PC portable (2,5 pouces, 9,5 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['1 To', 'ST1000LM024', 5400, 0, 'CMR', 2012],
    ['2 To', 'ST2000LM003', 5400, 0, 'CMR', 2012],
  ]),

  // ─── BarraCuda Pro ─────────────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'BarraCuda Pro', name: 'Seagate BarraCuda Pro', iface: SATA, usage: 'PC de bureau hautes performances', warranty: '5 ans', tags: ['creation', 'gaming'] }, [
    ['2 To', 'ST2000DM009', 7200, 0, 'CMR', 2017],
    ['4 To', 'ST4000DM006', 7200, 0, 'CMR', 2017],
    ['6 To', 'ST6000DM004', 7200, 0, 'CMR', 2017],
    ['8 To', 'ST8000DM005', 7200, 256, 'CMR', 2017],
    ['10 To', 'ST10000DM0004', 7200, 256, HE, 2016, 530],
    ['12 To', 'ST12000DM0007', 7200, 256, HE, 2017, 600],
    ['14 To', 'ST14000DM001', 7200, 256, HE, 2018, 650],
  ]),
  ...line({ brand: 'Seagate', family: 'BarraCuda Pro', name: 'Seagate BarraCuda Pro 2,5 pouces', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '5 ans', tags: ['mobile', 'gaming'] }, [
    ['500 Go', 'ST500LM034', 7200, 128, 'CMR', 2016],
    ['1 To', 'ST1000LM049', 7200, 128, 'CMR', 2016],
  ]),

  // ─── FireCuda et SSHD ──────────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'FireCuda', name: 'Seagate FireCuda 2,5 pouces', iface: SATA, usage: 'PC portable / console (2,5 pouces)', warranty: '5 ans', tags: ['gaming', 'mobile'] }, [
    ['500 Go', 'ST500LX025', 5400, 128, SSHD, 2016],
    ['1 To', 'ST1000LX015', 5400, 128, SSHD, 2016, 80],
    ['2 To', 'ST2000LX001', 5400, 128, SSHD, 2016, 120],
  ]),
  ...line({ brand: 'Seagate', family: 'FireCuda', name: 'Seagate FireCuda', iface: SATA, usage: 'PC de bureau gaming', warranty: '5 ans', tags: ['gaming'] }, [
    ['1 To', 'ST1000DX002', 7200, 64, SSHD, 2016, 80],
    ['2 To', 'ST2000DX002', 7200, 64, SSHD, 2016, 110],
  ]),
  ...line({ brand: 'Seagate', family: 'SSHD', name: 'Seagate Desktop SSHD', iface: SATA, usage: 'PC de bureau', warranty: '3 ans', tags: ['gaming', 'bureautique'] }, [
    ['1 To', 'ST1000DX001', 7200, 64, SSHD, 2013],
    ['2 To', 'ST2000DX001', 7200, 64, SSHD, 2013],
  ]),
  ...line({ brand: 'Seagate', family: 'SSHD', name: 'Seagate Laptop SSHD', iface: SATA, usage: 'PC portable (2,5 pouces)', warranty: '3 ans', tags: ['mobile', 'gaming'] }, [
    ['500 Go', 'ST500LM000', 5400, 64, SSHD, 2013],
    ['1 To', 'ST1000LM014', 5400, 64, SSHD, 2013],
  ]),

  // ─── IronWolf / NAS HDD ────────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'IronWolf', name: 'Seagate IronWolf', iface: SATA, usage: 'NAS (1 à 8 baies)', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['1 To', 'ST1000VN002', 5900, 64, 'CMR', 2016, 65],
    ['2 To', 'ST2000VN004', 5900, 64, 'CMR', 2016, 85],
    ['3 To', 'ST3000VN007', 5900, 64, 'CMR', 2016, 110],
    ['4 To', 'ST4000VN008', 5900, 64, 'CMR', 2016, 140],
    ['6 To', 'ST6000VN001', 5400, 256, 'CMR', 2019, 180],
    ['6 To', 'ST6000VN0033', 7200, 256, 'CMR', 2016, 240],
    ['8 To', 'ST8000VN0022', 7200, 256, 'CMR', 2016, 300],
    ['10 To', 'ST10000VN0008', 7200, 256, HE, 2017, 380],
    ['12 To', 'ST12000VN0007', 7200, 256, HE, 2017, 450],
    ['14 To', 'ST14000VN0008', 7200, 256, HE, 2018, 520],
  ]),
  ...line({ brand: 'Seagate', family: 'NAS HDD', name: 'Seagate NAS HDD', iface: SATA, usage: 'NAS (1 à 8 baies)', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['2 To', 'ST2000VN000', 5900, 64, 'CMR', 2013],
    ['3 To', 'ST3000VN000', 5900, 64, 'CMR', 2013],
    ['4 To', 'ST4000VN000', 5900, 64, 'CMR', 2013],
  ]),

  // ─── IronWolf Pro ──────────────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'IronWolf Pro', name: 'Seagate IronWolf Pro', iface: SATA, usage: 'NAS (jusqu’à 24 baies)', warranty: '5 ans', tags: ['nas', 'pro'] }, [
    ['2 To', 'ST2000NE0025', 7200, 128, 'CMR', 2017],
    ['4 To', 'ST4000NE001', 7200, 128, 'CMR', 2019],
    ['6 To', 'ST6000NE000', 7200, 256, 'CMR', 2019],
    ['10 To', 'ST10000NE0008', 7200, 256, HE, 2018],
    ['12 To', 'ST12000NE0008', 7200, 256, HE, 2018],
    ['14 To', 'ST14000NE0008', 7200, 256, HE, 2018],
    ['18 To', 'ST18000NE000', 7200, 256, HE, 2020],
    ['4 To', 'ST4000NT001', 7200, 256, 'CMR', 2023],
    ['6 To', 'ST6000NT001', 7200, 256, 'CMR', 2023],
    ['10 To', 'ST10000NT001', 7200, 256, HE, 2023],
    ['12 To', 'ST12000NT001', 7200, 256, HE, 2023],
    ['14 To', 'ST14000NT001', 7200, 256, HE, 2023],
    ['18 To', 'ST18000NT001', 7200, 256, HE, 2023],
    ['22 To', 'ST22000NT001', 7200, 512, HE, 2022],
    ['30 To', '', 7200, 0, '', 2025],
  ]),

  // ─── SkyHawk (vidéosurveillance) ───────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'SkyHawk', name: 'Seagate SkyHawk', iface: SATA, usage: 'Vidéosurveillance', warranty: '3 ans', tags: ['pro'] }, [
    ['1 To', 'ST1000VX005', 5900, 64, 'CMR', 2016],
    ['2 To', 'ST2000VX008', 5900, 64, 'CMR', 2016],
    ['3 To', 'ST3000VX010', 5900, 64, 'CMR', 2016],
    ['6 To', 'ST6000VX001', 0, 256, 'CMR', 2017],
    ['8 To', 'ST8000VX004', 7200, 256, 'CMR', 2017],
    ['10 To', 'ST10000VX0004', 7200, 256, HE, 2017],
  ]),
  ...line({ brand: 'Seagate', family: 'SkyHawk', name: 'Seagate SkyHawk AI', iface: SATA, usage: 'Vidéosurveillance (NVR avec IA)', warranty: '5 ans', tags: ['pro'] }, [
    ['8 To', 'ST8000VE000', 7200, 256, 'CMR', 2018],
    ['10 To', 'ST10000VE0008', 7200, 256, HE, 2017],
    ['16 To', 'ST16000VE002', 7200, 256, HE, 2020],
    ['18 To', 'ST18000VE002', 7200, 256, HE, 2021],
    ['20 To', 'ST20000VE002', 7200, 256, HE, 2022],
    ['24 To', 'ST24000VE002', 7200, 0, HE, 2023],
  ]),
  ...line({ brand: 'Seagate', family: 'Surveillance HDD', name: 'Seagate Surveillance HDD', iface: SATA, usage: 'Vidéosurveillance', warranty: '3 ans', tags: ['pro'] }, [
    ['2 To', 'ST2000VX000', 5900, 64, 'CMR', 2013],
    ['3 To', 'ST3000VX000', 5900, 64, 'CMR', 2013],
    ['4 To', 'ST4000VX000', 5900, 64, 'CMR', 2013],
  ]),

  // ─── Archive HDD (SMR) ─────────────────────────────────────────────────────
  ...line({ brand: 'Seagate', family: 'Archive HDD', name: 'Seagate Archive HDD', iface: SATA, usage: 'Archivage / sauvegarde', warranty: '3 ans', tags: ['homelab'] }, [
    ['5 To', 'ST5000AS0011', 5900, 128, 'SMR', 2014],
    ['8 To', 'ST8000AS0002', 5900, 128, 'SMR', 2014, 260],
  ]),
];
