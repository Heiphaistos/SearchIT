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
const SAS = 'SAS 12 Gb/s';
const T = { brand: 'Toshiba' };
const MG = { brand: 'Toshiba', family: 'MG', usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab', 'nas'] };
const H = { brand: 'HGST' };

/** Disques durs Toshiba, HGST (historique) et Synology. */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Toshiba P300 / X300 ───────────────────────────────────────────────────
  ...line({ ...T, family: 'P300', name: 'Toshiba P300', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['500 Go', 'HDWD105', 7200, 64, 'CMR', 2016],
    ['1 To', 'HDWD110', 7200, 64, 'CMR', 2016, 50],
    ['2 To', 'HDWD120', 7200, 64, 'CMR', 2016, 65],
    ['3 To', 'HDWD130', 7200, 64, 'CMR', 2016, 85],
    ['4 To', 'HDWD240', 5400, 128, 'SMR', 2019, 100],
    ['6 To', 'HDWD260', 5400, 128, 'SMR', 2019, 150],
  ]),
  ...line({ ...T, family: 'X300', name: 'Toshiba X300', iface: SATA, usage: 'PC de bureau hautes performances', warranty: '2 ans', tags: ['gaming', 'creation'] }, [
    ['5 To', 'HDWE150', 7200, 128, 'CMR', 2016],
    ['6 To', 'HDWE160', 7200, 128, 'CMR', 2016],
    ['8 To', 'HDWF180', 7200, 128, 'CMR', 2017],
    ['10 To', 'HDWR11A', 7200, 256, HE, 2019],
    ['12 To', 'HDWR21C', 7200, 256, HE, 2019],
    ['14 To', 'HDWR21E', 7200, 256, HE, 2019],
    ['18 To', '', 7200, 512, HE, 2021],
  ]),

  // ─── Toshiba N300 / N300 Pro ───────────────────────────────────────────────
  ...line({ ...T, family: 'N300', name: 'Toshiba N300', iface: SATA, usage: 'NAS', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['6 To', 'HDWG460', 7200, 256, 'CMR', 2019],
    ['10 To', 'HDWG11A', 7200, 256, HE, 2019],
    ['14 To', 'HDWG21E', 7200, 256, HE, 2019],
    ['16 To', 'HDWG31G', 7200, 512, HE, 2021],
  ]),
  ...line({ ...T, family: 'N300 Pro', name: 'Toshiba N300 Pro', iface: SATA, usage: 'NAS (jusqu’à 24 baies)', warranty: '5 ans', tags: ['nas', 'pro'] }, [
    ['4 To', '', 7200, 0, 'CMR', 2023],
    ['6 To', '', 7200, 0, 'CMR', 2023],
    ['8 To', '', 7200, 0, 'CMR', 2023],
    ['10 To', '', 7200, 0, HE, 2023],
    ['12 To', '', 7200, 0, HE, 2023],
    ['14 To', '', 7200, 0, HE, 2023],
    ['16 To', '', 7200, 0, HE, 2023],
    ['18 To', '', 7200, 0, HE, 2023],
  ]),

  // ─── Toshiba S300 (vidéosurveillance) ──────────────────────────────────────
  ...line({ ...T, family: 'S300', name: 'Toshiba S300', iface: SATA, usage: 'Vidéosurveillance', warranty: '3 ans', tags: ['pro'] }, [
    ['1 To', 'HDWV110', 5700, 64, 'CMR', 2017],
    ['2 To', 'HDWT720', 0, 0, 'CMR', 2017],
    ['4 To', 'HDWT140', 0, 0, 'CMR', 2017],
    ['6 To', 'HDWT360', 0, 0, 'CMR', 2019],
  ]),
  ...line({ ...T, family: 'S300', name: 'Toshiba S300 Pro', iface: SATA, usage: 'Vidéosurveillance (NVR avec IA)', warranty: '3 ans', tags: ['pro'] }, [
    ['8 To', 'HDWT380', 7200, 256, 'CMR', 2019],
    ['10 To', 'HDWT31A', 7200, 256, HE, 2019],
  ]),

  // ─── Toshiba MG (entreprise) ───────────────────────────────────────────────
  ...line({ ...MG, name: 'Toshiba MG04', iface: SATA }, [
    ['1 To', 'MG04ACA100N', 7200, 128, 'CMR', 2014],
    ['2 To', 'MG04ACA200E', 7200, 128, 'CMR', 2014],
    ['3 To', 'MG04ACA300E', 7200, 128, 'CMR', 2014],
    ['4 To', 'MG04ACA400E', 7200, 128, 'CMR', 2014],
    ['5 To', 'MG04ACA500E', 7200, 128, 'CMR', 2014],
    ['6 To', 'MG04ACA600E', 7200, 128, 'CMR', 2014],
  ]),
  ...line({ ...MG, name: 'Toshiba MG04', suffix: ' SAS', iface: SAS }, [['4 To', 'MG04SCA40EE', 7200, 128, 'CMR', 2014]]),
  ...line({ ...MG, name: 'Toshiba MG05', iface: SATA }, [['8 To', 'MG05ACA800E', 7200, 128, 'CMR', 2016]]),
  ...line({ ...MG, name: 'Toshiba MG06', iface: SATA }, [
    ['8 To', 'MG06ACA800E', 7200, 256, 'CMR', 2018],
    ['10 To', 'MG06ACA10TE', 7200, 256, 'CMR', 2017],
  ]),
  ...line({ ...MG, name: 'Toshiba MG06', suffix: ' SAS', iface: SAS }, [['10 To', 'MG06SCA10TE', 7200, 256, 'CMR', 2017]]),
  ...line({ ...MG, name: 'Toshiba MG07', iface: SATA }, [
    ['12 To', 'MG07ACA12TE', 7200, 256, HE, 2018],
    ['14 To', 'MG07ACA14TE', 7200, 256, HE, 2018],
  ]),
  ...line({ ...MG, name: 'Toshiba MG07', suffix: ' SAS', iface: SAS }, [['14 To', 'MG07SCA14TA', 7200, 256, HE, 2018]]),
  ...line({ ...MG, name: 'Toshiba MG08', iface: SATA }, [
    ['4 To', 'MG08ADA400E', 7200, 256, 'CMR', 2020],
    ['6 To', 'MG08ADA600E', 7200, 256, 'CMR', 2020],
    ['8 To', 'MG08ADA800E', 7200, 256, 'CMR', 2020],
    ['14 To', 'MG08ACA14TE', 7200, 512, HE, 2019],
  ]),
  ...line({ ...MG, name: 'Toshiba MG08', suffix: ' SAS', iface: SAS }, [['16 To', 'MG08SCA16TE', 7200, 512, HE, 2019]]),
  ...line({ ...MG, name: 'Toshiba MG09', iface: SATA }, [['16 To', 'MG09ACA16TE', 7200, 512, HE, 2021]]),
  ...line({ ...MG, name: 'Toshiba MG09', suffix: ' SAS', iface: SAS }, [['18 To', 'MG09SCA18TE', 7200, 512, HE, 2021]]),
  ...line({ ...MG, name: 'Toshiba MG10F', iface: SATA }, [['22 To', 'MG10AFA22TE', 7200, 512, HE, 2023]]),
  ...line({ ...MG, name: 'Toshiba MG11', iface: SATA }, [['24 To', 'MG11ACA24TE', 7200, 512, HE, 2024]]),

  // ─── Toshiba historiques 3,5 pouces ────────────────────────────────────────
  ...line({ ...T, family: 'DT01', name: 'Toshiba DT01', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique', 'budget'] }, [
    ['1 To', 'DT01ACA100', 7200, 32, 'CMR', 2012],
    ['2 To', 'DT01ACA200', 7200, 64, 'CMR', 2012],
    ['3 To', 'DT01ACA300', 7200, 64, 'CMR', 2012],
  ]),
  ...line({ ...T, family: 'MD04', name: 'Toshiba MD04', iface: SATA, usage: 'PC de bureau', warranty: '2 ans', tags: ['bureautique'] }, [
    ['4 To', 'MD04ACA400', 7200, 128, 'CMR', 2014],
    ['5 To', 'MD04ACA500', 7200, 128, 'CMR', 2014],
  ]),

  // ─── Toshiba 2,5 pouces ────────────────────────────────────────────────────
  ...line({ ...T, family: 'L200', name: 'Toshiba L200', iface: SATA, usage: 'PC portable (2,5 pouces)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['500 Go', 'HDWJ105', 5400, 8, 'CMR', 2016, 45],
    ['1 To', 'HDWL110', 5400, 128, 'SMR', 2016, 55],
    ['2 To', 'HDWL120', 5400, 128, 'SMR', 2017, 85],
  ]),
  ...line({ ...T, family: 'MQ01', name: 'Toshiba MQ01ABD', iface: SATA, usage: 'PC portable (2,5 pouces, 9,5 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['1 To', 'MQ01ABD100', 5400, 8, 'CMR', 2012],
  ]),
  ...line({ ...T, family: 'MQ01', name: 'Toshiba MQ01ABF', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['500 Go', 'MQ01ABF050', 5400, 8, 'CMR', 2013],
  ]),
  ...line({ ...T, family: 'MQ04', name: 'Toshiba MQ04ABF', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['1 To', 'MQ04ABF100', 5400, 128, 'SMR', 2017],
  ]),
  ...line({ ...T, family: 'MQ04', name: 'Toshiba MQ04ABD', iface: SATA, usage: 'PC portable (2,5 pouces, 9,5 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['2 To', 'MQ04ABD200', 5400, 128, 'SMR', 2017],
  ]),
  ...line({ ...T, family: 'AL15SEB', name: 'Toshiba AL15SEB', iface: SAS, usage: 'Serveur (2,5 pouces)', warranty: '5 ans', tags: ['serveur'] }, [
    ['600 Go', 'AL15SEB06EQ', 10500, 128, 'CMR', 2017],
    ['900 Go', 'AL15SEB09EQ', 10500, 128, 'CMR', 2017],
    ['1,2 To', 'AL15SEB12EQ', 10500, 128, 'CMR', 2017],
    ['1,8 To', 'AL15SEB18EQ', 10500, 128, 'CMR', 2017],
    ['2,4 To', 'AL15SEB24EQ', 10500, 128, 'CMR', 2017],
  ]),

  // ─── HGST (historique, racheté par WD) ─────────────────────────────────────
  ...line({ ...H, family: 'Deskstar NAS', name: 'HGST Deskstar NAS', iface: SATA, usage: 'NAS', warranty: '3 ans', tags: ['nas', 'homelab'] }, [
    ['3 To', '', 7200, 0, 'CMR', 2014],
    ['4 To', '', 7200, 0, 'CMR', 2013],
    ['5 To', '', 7200, 0, 'CMR', 2015],
    ['6 To', '', 7200, 0, 'CMR', 2015],
    ['8 To', '', 7200, 0, HE, 2016],
  ]),
  ...line({ ...H, family: 'Deskstar', name: 'HGST Deskstar 7K4000', iface: SATA, usage: 'PC de bureau', warranty: '3 ans', tags: ['bureautique'] }, [
    ['4 To', 'HDS724040ALE640', 7200, 64, 'CMR', 2012],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar 7K4000', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['4 To', 'HUS724040ALE640', 7200, 64, 'CMR', 2012],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar 7K2', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['2 To', 'HUS722T2TALA604', 7200, 128, 'CMR', 2017],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar 7K6000', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['6 To', '', 7200, 128, 'CMR', 2014],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar He6', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['6 To', '', 7200, 64, HE, 2013],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar He8', iface: SATA, usage: 'Datacenter', warranty: '5 ans', tags: ['serveur', 'homelab'] }, [
    ['8 To', 'HUH728080ALE600', 7200, 128, HE, 2014],
  ]),
  ...line({ ...H, family: 'MegaScale', name: 'HGST MegaScale DC 4000.B', iface: SATA, usage: 'Datacenter (stockage froid)', tags: ['serveur', 'homelab'] }, [
    ['4 To', 'HMS5C4040BLE640', 5700, 32, 'CMR', 2013],
  ]),
  ...line({ ...H, family: 'Ultrastar', name: 'HGST Ultrastar C10K1800', iface: SAS, usage: 'Serveur (2,5 pouces)', warranty: '5 ans', tags: ['serveur'] }, [
    ['1,2 To', 'HUC101812CS4204', 10000, 128, 'CMR', 2015],
    ['1,8 To', 'HUC101818CS4204', 10000, 128, 'CMR', 2015],
  ]),
  ...line({ ...H, family: 'Travelstar', name: 'HGST Travelstar 7K1000', iface: SATA, usage: 'PC portable (2,5 pouces, 9,5 mm)', warranty: '2 ans', tags: ['mobile'] }, [
    ['1 To', 'HTS721010A9E630', 7200, 32, 'CMR', 2013],
  ]),
  ...line({ ...H, family: 'Travelstar', name: 'HGST Travelstar 5K1000', iface: SATA, usage: 'PC portable (2,5 pouces, 9,5 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['1 To', 'HTS541010A9E680', 5400, 8, 'CMR', 2013],
  ]),
  ...line({ ...H, family: 'Travelstar', name: 'HGST Travelstar Z5K500', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile', 'budget'] }, [
    ['500 Go', 'HTS545050A7E680', 5400, 8, 'CMR', 2013],
  ]),
  ...line({ ...H, family: 'Travelstar', name: 'HGST Travelstar Z7K500', iface: SATA, usage: 'PC portable (2,5 pouces, 7 mm)', warranty: '2 ans', tags: ['mobile'] }, [
    ['500 Go', 'HTS725050A7E630', 7200, 32, 'CMR', 2013],
  ]),

  // ─── Synology (disques certifiés pour NAS Synology) ───────────────────────
  ...line({ brand: 'Synology', family: 'HAT3300', name: 'Synology HAT3300', iface: SATA, usage: 'NAS Synology', warranty: '3 ans', tags: ['nas', 'homelab'], refurb: false }, [
    ['4 To', 'HAT3300-4T', 0, 0, 'CMR', 2021],
    ['6 To', 'HAT3300-6T', 0, 0, 'CMR', 2021],
    ['8 To', 'HAT3300-8T', 7200, 0, 'CMR', 2021],
    ['12 To', 'HAT3300-12T', 7200, 0, HE, 2021],
    ['16 To', 'HAT3300-16T', 7200, 0, HE, 2021],
  ]),
  ...line({ brand: 'Synology', family: 'HAT3300', name: 'Synology HAT3310', iface: SATA, usage: 'NAS Synology', warranty: '3 ans', tags: ['nas', 'homelab'], refurb: false }, [
    ['8 To', 'HAT3310-8T', 7200, 0, 'CMR', 2022],
    ['12 To', 'HAT3310-12T', 7200, 0, HE, 2022],
    ['16 To', 'HAT3310-16T', 7200, 0, HE, 2022],
  ]),
  ...line({ brand: 'Synology', family: 'HAT5300', name: 'Synology HAT5300', iface: SATA, usage: 'NAS Synology (entreprise)', warranty: '5 ans', tags: ['nas', 'pro'], refurb: false }, [
    ['4 To', 'HAT5300-4T', 7200, 0, 'CMR', 2020],
    ['8 To', 'HAT5300-8T', 7200, 0, 'CMR', 2020],
    ['12 To', 'HAT5300-12T', 7200, 0, HE, 2020],
    ['16 To', 'HAT5300-16T', 7200, 0, HE, 2020],
  ]),
  ...line({ brand: 'Synology', family: 'HAT5300', name: 'Synology HAT5310', iface: SATA, usage: 'NAS Synology (entreprise)', warranty: '5 ans', tags: ['nas', 'pro'], refurb: false }, [
    ['8 To', 'HAT5310-8T', 7200, 0, 'CMR', 2022],
    ['20 To', 'HAT5310-20T', 7200, 0, HE, 2023],
  ]),
  ...line({ brand: 'Synology', family: 'HAS5300', name: 'Synology HAS5300', iface: SAS, usage: 'NAS Synology (SAS)', warranty: '5 ans', tags: ['nas', 'serveur'], refurb: false }, [
    ['8 To', 'HAS5300-8T', 7200, 0, 'CMR', 2020],
    ['12 To', 'HAS5300-12T', 7200, 0, HE, 2020],
    ['16 To', 'HAS5300-16T', 7200, 0, HE, 2020],
  ]),
];
