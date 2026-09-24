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
const SAS = 'SAS 12 Gb/s';
const HE = 'CMR, hélium';
const DC = 'Datacenter';
const S = { brand: 'Seagate', usage: DC, warranty: '5 ans', tags: ['serveur', 'homelab'] };

/** Disques durs Seagate entreprise : Exos E / X / M, Constellation, 2,5 pouces SAS 10K / 15K. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Exos E (7E8, 7E10) ────────────────────────────────────────────────────
  ...line({ ...S, family: 'Exos E', name: 'Seagate Exos 7E8', iface: SATA }, [
    ['1 To', 'ST1000NM0055', 7200, 128, 'CMR', 2017],
    ['2 To', 'ST2000NM0055', 7200, 128, 'CMR', 2017],
    ['4 To', 'ST4000NM0035', 7200, 128, 'CMR', 2017],
    ['6 To', 'ST6000NM0115', 7200, 256, 'CMR', 2017],
    ['8 To', 'ST8000NM0055', 7200, 256, 'CMR', 2017],
  ]),
  ...line({ ...S, family: 'Exos E', name: 'Seagate Exos 7E8', iface: SAS, suffix: ' SAS' }, [
    ['4 To', 'ST4000NM0025', 7200, 128, 'CMR', 2017],
    ['8 To', 'ST8000NM0075', 7200, 256, 'CMR', 2017],
  ]),
  ...line({ ...S, family: 'Exos E', name: 'Seagate Exos 7E10', iface: SATA }, [
    ['4 To', 'ST4000NM000B', 7200, 0, 'CMR', 2021],
    ['8 To', 'ST8000NM017B', 7200, 0, 'CMR', 2021],
    ['10 To', 'ST10000NM017B', 7200, 0, 'CMR', 2021],
  ]),
  ...line({ ...S, family: 'Exos E', name: 'Seagate Exos 7E2000', iface: SATA, usage: 'Serveur (2,5 pouces)' }, [
    ['2 To', 'ST2000NX0403', 7200, 128, 'CMR', 2017],
  ]),

  // ─── Exos X ────────────────────────────────────────────────────────────────
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X10', iface: SATA }, [['10 To', 'ST10000NM0016', 7200, 256, HE, 2017]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X10', iface: SAS, suffix: ' SAS' }, [['10 To', 'ST10000NM0096', 7200, 256, HE, 2017]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X12', iface: SATA }, [['12 To', 'ST12000NM0007', 7200, 256, HE, 2017]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X12', iface: SAS, suffix: ' SAS' }, [['12 To', 'ST12000NM0027', 7200, 256, HE, 2017]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X14', iface: SATA }, [
    ['10 To', 'ST10000NM0478', 7200, 256, HE, 2018],
    ['12 To', 'ST12000NM0008', 7200, 256, HE, 2018],
    ['14 To', 'ST14000NM0018', 7200, 256, HE, 2018],
  ]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X14', iface: SAS, suffix: ' SAS' }, [['14 To', '', 7200, 256, HE, 2018]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X16', iface: SATA }, [
    ['10 To', 'ST10000NM001G', 7200, 256, HE, 2019],
    ['12 To', 'ST12000NM001G', 7200, 256, HE, 2019],
    ['14 To', 'ST14000NM001G', 7200, 256, HE, 2019],
  ]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X16', iface: SAS, suffix: ' SAS' }, [['16 To', 'ST16000NM002G', 7200, 256, HE, 2019]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X18', iface: SATA }, [
    ['10 To', 'ST10000NM018G', 7200, 256, HE, 2020],
    ['12 To', 'ST12000NM000J', 7200, 256, HE, 2020],
    ['14 To', 'ST14000NM000J', 7200, 256, HE, 2020],
    ['16 To', 'ST16000NM000J', 7200, 256, HE, 2020],
  ]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X18', iface: SAS, suffix: ' SAS' }, [
    ['16 To', 'ST16000NM004J', 7200, 256, HE, 2020],
    ['18 To', 'ST18000NM004J', 7200, 256, HE, 2020],
  ]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X20', iface: SATA }, [['18 To', 'ST18000NM003D', 7200, 256, HE, 2021]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X20', iface: SAS, suffix: ' SAS' }, [['20 To', 'ST20000NM002D', 7200, 256, HE, 2021]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X22', iface: SATA }, [['22 To', 'ST22000NM001E', 7200, 512, HE, 2022]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X22', iface: SAS, suffix: ' SAS' }, [['22 To', 'ST22000NM000E', 7200, 512, HE, 2022]]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X24', iface: SATA }, [
    ['12 To', '', 7200, 512, HE, 2023],
    ['16 To', '', 7200, 512, HE, 2023],
    ['20 To', '', 7200, 512, HE, 2023],
  ]),
  ...line({ ...S, family: 'Exos X', name: 'Seagate Exos X24', iface: SAS, suffix: ' SAS' }, [['24 To', '', 7200, 512, HE, 2023]]),
  ...line({ ...S, family: 'Exos M', name: 'Seagate Exos M', iface: SATA }, [['30 To', '', 7200, 0, 'HAMR (Mozaic 3+), hélium', 2024]]),
  ...line({ ...S, family: 'Exos 2X', name: 'Seagate Exos 2X14', iface: SAS, suffix: ' SAS' }, [['14 To', 'ST14000NM0001', 7200, 256, 'CMR, double actionneur (MACH.2), hélium', 2019]]),
  ...line({ ...S, family: 'Exos 2X', name: 'Seagate Exos 2X18', iface: SAS, suffix: ' SAS' }, [['18 To', 'ST18000NM0272', 7200, 256, 'CMR, double actionneur (MACH.2), hélium', 2021]]),

  // ─── 2,5 pouces SAS 10K / 15K ──────────────────────────────────────────────
  ...line({ ...S, family: 'Exos 10E2400', name: 'Seagate Exos 10E2400', iface: SAS, usage: 'Serveur (2,5 pouces)' }, [
    ['1,2 To', 'ST1200MM0129', 10000, 0, 'CMR', 2017],
    ['1,8 To', 'ST1800MM0129', 10000, 0, 'CMR', 2017],
    ['2,4 To', 'ST2400MM0129', 10000, 0, 'CMR', 2017],
  ]),
  ...line({ ...S, family: 'Exos 15E900', name: 'Seagate Exos 15E900', iface: SAS, usage: 'Serveur (2,5 pouces)' }, [
    ['300 Go', 'ST300MP0006', 15000, 256, 'CMR', 2017],
    ['600 Go', 'ST600MP0006', 15000, 256, 'CMR', 2017],
    ['900 Go', 'ST900MP0006', 15000, 256, 'CMR', 2017],
  ]),
  ...line({ ...S, family: 'Savvio', name: 'Seagate Savvio 10K.6', iface: 'SAS 6 Gb/s', usage: 'Serveur (2,5 pouces)' }, [
    ['900 Go', 'ST900MM0006', 10000, 64, 'CMR', 2012],
  ]),

  // ─── Constellation ES.3 ────────────────────────────────────────────────────
  ...line({ ...S, family: 'Constellation', name: 'Seagate Constellation ES.3', iface: SATA }, [
    ['1 To', 'ST1000NM0033', 7200, 128, 'CMR', 2013],
    ['2 To', 'ST2000NM0033', 7200, 128, 'CMR', 2013],
    ['4 To', 'ST4000NM0033', 7200, 128, 'CMR', 2013],
  ]),
];
