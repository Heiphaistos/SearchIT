import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « network » (1/4) : routeurs Wi-Fi grand public, gaming,
 * box/modems-routeurs xDSL/fibre/câble et routeurs de voyage.
 * Specs omises quand la valeur n'est pas certaine.
 */

type Spec = Record<string, string | number>;

const W4 = 'Wi-Fi 4 (802.11n)';
const W5 = 'Wi-Fi 5 (802.11ac)';
const W6 = 'Wi-Fi 6 (802.11ax)';
const W6E = 'Wi-Fi 6E (802.11ax)';
const W7 = 'Wi-Fi 7 (802.11be)';
const B1 = 'Mono-bande 2,4 GHz';
const B2 = 'Bi-bande 2,4 / 5 GHz';
const B3 = 'Tri-bande 2,4 / 5 / 5 GHz';
const B3E = 'Tri-bande 2,4 / 5 / 6 GHz';
const B4 = 'Quad-bande 2,4 / 5 / 5 / 6 GHz';

const R = 'Routeur Wi-Fi';
const RG = 'Routeur Wi-Fi gaming';
const RT = 'Routeur de voyage';

function s(type: string, norme?: string, debit?: string, ports?: string, bandes?: string, poe?: string): Spec {
  const o: Spec = { 'Type': type };
  if (norme) o['Norme'] = norme;
  if (debit) o['Débit'] = debit;
  if (ports) o['Ports'] = ports;
  if (poe) o['PoE'] = poe;
  if (bandes) o['Bandes'] = bandes;
  return o;
}

function p(id: string, brand: string, name: string, family: string, year: number | undefined, msrp: number | undefined, tags: string[], specs: Spec, refurbishable = true): CatalogProduct {
  const o: CatalogProduct = { id: 'network-' + id, category: 'network', brand, name, family, specs, tags, refurbishable };
  if (year) o.year = year;
  if (msrp) o.msrp = msrp;
  return o;
}

const t = ['reseau'];
const tb = ['reseau', 'budget'];
const tg = ['reseau', 'gaming'];
const th = ['reseau', 'homelab'];
const tm = ['reseau', 'mobile'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── TP-Link Archer ─────────────────────────────────────────────────────────
  p('tp-link-tl-wr841n', 'TP-Link', 'TP-Link TL-WR841N', 'TL-WR', undefined, 20, tb, s(R, W4, 'N300', '1 x WAN + 4 x LAN 100 Mbit/s', B1)),
  p('tp-link-tl-wr840n', 'TP-Link', 'TP-Link TL-WR840N', 'TL-WR', 2015, 18, tb, s(R, W4, 'N300', '1 x WAN + 4 x LAN 100 Mbit/s', B1)),
  p('tp-link-tl-wr940n', 'TP-Link', 'TP-Link TL-WR940N', 'TL-WR', 2014, 30, tb, s(R, W4, 'N450', '1 x WAN + 4 x LAN 100 Mbit/s', B1)),
  p('tp-link-archer-c50', 'TP-Link', 'TP-Link Archer C50', 'Archer AC', 2016, 35, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x WAN + 4 x LAN 100 Mbit/s', B2)),
  p('tp-link-archer-c6', 'TP-Link', 'TP-Link Archer C6', 'Archer AC', 2018, 50, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-c64', 'TP-Link', 'TP-Link Archer C64', 'Archer AC', 2020, 50, tb, s(R, W5, 'AC1200 (867 + 400 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-c7', 'TP-Link', 'TP-Link Archer C7', 'Archer AC', 2013, 90, t, s(R, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-c80', 'TP-Link', 'TP-Link Archer C80', 'Archer AC', 2020, 70, t, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-c2300', 'TP-Link', 'TP-Link Archer C2300', 'Archer AC', 2018, 150, t, s(R, W5, 'AC2300 (1625 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-c4000', 'TP-Link', 'TP-Link Archer C4000', 'Archer AC', 2018, 250, t, s(R, W5, 'AC4000', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('tp-link-archer-c5400x', 'TP-Link', 'TP-Link Archer C5400X', 'Archer AC', 2017, 380, tg, s(RG, W5, 'AC5400', '1 x 1 GbE WAN + 8 x 1 GbE LAN', B3)),
  p('tp-link-archer-ax10', 'TP-Link', 'TP-Link Archer AX10', 'Archer AX', 2019, 70, tb, s(R, W6, 'AX1500 (1201 + 300 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax20', 'TP-Link', 'TP-Link Archer AX20', 'Archer AX', 2019, 90, tb, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax23', 'TP-Link', 'TP-Link Archer AX23', 'Archer AX', 2021, 70, tb, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax50', 'TP-Link', 'TP-Link Archer AX50', 'Archer AX', 2019, 120, t, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax53', 'TP-Link', 'TP-Link Archer AX53', 'Archer AX', 2021, 90, t, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax72', 'TP-Link', 'TP-Link Archer AX72', 'Archer AX', 2022, 130, t, s(R, W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax75', 'TP-Link', 'TP-Link Archer AX75', 'Archer AX', 2022, 170, t, s(R, W6, 'AX5400 (2402 + 2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('tp-link-archer-ax80', 'TP-Link', 'TP-Link Archer AX80', 'Archer AX', 2022, 200, t, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN/LAN + 3 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax6000', 'TP-Link', 'TP-Link Archer AX6000', 'Archer AX', 2019, 300, t, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 2,5 GbE WAN + 8 x 1 GbE LAN', B2)),
  p('tp-link-archer-ax90', 'TP-Link', 'TP-Link Archer AX90', 'Archer AX', 2020, 300, t, s(R, W6, 'AX6600 (4804 + 1201 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN/LAN + 3 x 1 GbE LAN', B3)),
  p('tp-link-archer-ax11000', 'TP-Link', 'TP-Link Archer AX11000', 'Archer AX', 2019, 450, tg, s(RG, W6, 'AX11000 (4804 + 4804 + 1148 Mbit/s)', '1 x 2,5 GbE WAN + 8 x 1 GbE LAN', B3)),
  p('tp-link-archer-axe75', 'TP-Link', 'TP-Link Archer AXE75', 'Archer AXE', 2022, 180, t, s(R, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3E)),
  p('tp-link-archer-gxe75', 'TP-Link', 'TP-Link Archer GXE75', 'Archer Gaming', 2022, 250, tg, s(RG, W6E, 'AXE5400', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN/LAN + 3 x 1 GbE LAN', B3E)),
  p('tp-link-archer-axe300', 'TP-Link', 'TP-Link Archer AXE300', 'Archer AXE', 2023, 600, t, s(R, W6E, 'AXE16000', '2 x 10 GbE (dont 1 combo SFP+) + 1 x 2,5 GbE + 4 x 1 GbE', B4)),
  p('tp-link-archer-be230', 'TP-Link', 'TP-Link Archer BE230', 'Archer BE', 2024, 110, t, s(R, W7, 'BE3600 (2882 + 688 Mbit/s)', undefined, B2)),
  p('tp-link-archer-be400', 'TP-Link', 'TP-Link Archer BE400', 'Archer BE', 2024, 150, t, s(R, W7, 'BE6500', undefined, B2)),
  p('tp-link-archer-be900', 'TP-Link', 'TP-Link Archer BE900', 'Archer BE', 2024, 700, t, s(R, W7, 'BE24000', '2 x 10 GbE (dont 1 combo SFP+) + 4 x 2,5 GbE + 1 x 1 GbE', B4)),
  p('tp-link-archer-ge800', 'TP-Link', 'TP-Link Archer GE800', 'Archer Gaming', 2023, 600, tg, s(RG, W7, 'BE19000', undefined, B3E)),
  p('tp-link-archer-vr400', 'TP-Link', 'TP-Link Archer VR400', 'Archer VR', 2016, 90, t, s('Modem-routeur VDSL/ADSL', W5, 'AC1200', '4 x 1 GbE (1 WAN/LAN)', B2)),
  p('tp-link-archer-vr600', 'TP-Link', 'TP-Link Archer VR600', 'Archer VR', 2016, 150, t, s('Modem-routeur VDSL/ADSL', W5, 'AC1600 (1300 + 300 Mbit/s)', '4 x 1 GbE (1 WAN/LAN)', B2)),

  // ─── ASUS RT ────────────────────────────────────────────────────────────────
  p('asus-rt-ac66u', 'ASUS', 'ASUS RT-AC66U', 'RT-AC', 2012, 180, t, s(R, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac66u-b1', 'ASUS', 'ASUS RT-AC66U B1', 'RT-AC', 2016, 130, t, s(R, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac68u', 'ASUS', 'ASUS RT-AC68U', 'RT-AC', 2013, 200, t, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac58u', 'ASUS', 'ASUS RT-AC58U', 'RT-AC', 2016, 100, tb, s(R, W5, 'AC1300 (867 + 400 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac87u', 'ASUS', 'ASUS RT-AC87U', 'RT-AC', 2014, 250, t, s(R, W5, 'AC2400 (1734 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac88u', 'ASUS', 'ASUS RT-AC88U', 'RT-AC', 2015, 300, tg, s(R, W5, 'AC3100 (2167 + 1000 Mbit/s)', '1 x 1 GbE WAN + 8 x 1 GbE LAN', B2)),
  p('asus-rt-ac86u', 'ASUS', 'ASUS RT-AC86U', 'RT-AC', 2017, 220, tg, s(R, W5, 'AC2900 (2167 + 750 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ac5300', 'ASUS', 'ASUS RT-AC5300', 'RT-AC', 2015, 400, tg, s(R, W5, 'AC5300 (2167 + 2167 + 1000 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('asus-rt-ax53u', 'ASUS', 'ASUS RT-AX53U', 'RT-AX', 2021, 80, tb, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('asus-rt-ax55', 'ASUS', 'ASUS RT-AX55', 'RT-AX', 2020, 90, tb, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax56u', 'ASUS', 'ASUS RT-AX56U', 'RT-AX', 2019, 120, t, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax57', 'ASUS', 'ASUS RT-AX57', 'RT-AX', 2022, 100, tb, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax3000', 'ASUS', 'ASUS RT-AX3000', 'RT-AX', 2020, 150, t, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax59u', 'ASUS', 'ASUS RT-AX59U', 'RT-AX', 2023, 150, t, s(R, W6, 'AX4200 (3603 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('asus-rt-ax68u', 'ASUS', 'ASUS RT-AX68U', 'RT-AX', 2020, 180, t, s(R, W6, 'AX2700 (1802 + 861 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax82u', 'ASUS', 'ASUS RT-AX82U', 'RT-AX', 2020, 230, tg, s(RG, W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax86s', 'ASUS', 'ASUS RT-AX86S', 'RT-AX', 2021, 220, tg, s(RG, W6, 'AX5700 (4804 + 861 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax86u-pro', 'ASUS', 'ASUS RT-AX86U Pro', 'RT-AX', 2022, 280, tg, s(RG, W6, 'AX5700 (4804 + 861 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rt-ax88u', 'ASUS', 'ASUS RT-AX88U', 'RT-AX', 2018, 330, tg, s(RG, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 1 GbE WAN + 8 x 1 GbE LAN', B2)),
  p('asus-rt-ax89x', 'ASUS', 'ASUS RT-AX89X', 'RT-AX', 2020, 500, th, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 10 GbE RJ45 + 1 x SFP+ 10G + 1 x 1 GbE WAN + 8 x 1 GbE LAN', B2)),
  p('asus-rt-ax92u', 'ASUS', 'ASUS RT-AX92U', 'RT-AX', 2019, 250, t, s(R, W6, 'AX6100', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('asus-rt-axe7800', 'ASUS', 'ASUS RT-AXE7800', 'RT-AXE', 2022, 330, t, s(R, W6E, 'AXE7800 (4804 + 2402 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 4 x 1 GbE LAN', B3E)),
  p('asus-rt-be58u', 'ASUS', 'ASUS RT-BE58U', 'RT-BE', 2024, 150, t, s(R, W7, 'BE3600 (2882 + 688 Mbit/s)', undefined, B2)),
  p('asus-rt-be86u', 'ASUS', 'ASUS RT-BE86U', 'RT-BE', 2024, 350, t, s(R, W7, 'BE6800', undefined, B2)),
  p('asus-rt-be92u', 'ASUS', 'ASUS RT-BE92U', 'RT-BE', 2024, 400, t, s(R, W7, 'BE9700', undefined, B3E)),
  p('asus-rt-be96u', 'ASUS', 'ASUS RT-BE96U', 'RT-BE', 2023, 700, th, s(R, W7, 'BE19000', '2 x 10 GbE RJ45 + 1 x SFP+ 10G + 4 x 1 GbE', B3E)),
  p('asus-dsl-ac68u', 'ASUS', 'ASUS DSL-AC68U', 'DSL', 2015, 200, t, s('Modem-routeur VDSL/ADSL', W5, 'AC1900 (1300 + 600 Mbit/s)', '4 x 1 GbE (1 WAN/LAN)', B2)),
  p('asus-dsl-ax82u', 'ASUS', 'ASUS DSL-AX82U', 'DSL', 2021, 280, t, s('Modem-routeur VDSL/ADSL', W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),

  // ─── ASUS ROG Rapture / TUF Gaming ──────────────────────────────────────────
  p('asus-rog-rapture-gt-ac5300', 'ASUS', 'ASUS ROG Rapture GT-AC5300', 'ROG Rapture', 2017, 400, tg, s(RG, W5, 'AC5300 (2167 + 2167 + 1000 Mbit/s)', '1 x 1 GbE WAN + 8 x 1 GbE LAN', B3)),
  p('asus-rog-rapture-gt-ac2900', 'ASUS', 'ASUS ROG Rapture GT-AC2900', 'ROG Rapture', 2019, 280, tg, s(RG, W5, 'AC2900 (2167 + 750 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-rog-rapture-gt-ax11000', 'ASUS', 'ASUS ROG Rapture GT-AX11000', 'ROG Rapture', 2019, 500, tg, s(RG, W6, 'AX11000 (4804 + 4804 + 1148 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('asus-rog-rapture-gt-ax11000-pro', 'ASUS', 'ASUS ROG Rapture GT-AX11000 Pro', 'ROG Rapture', 2022, 500, tg, s(RG, W6, 'AX11000 (4804 + 4804 + 1148 Mbit/s)', '1 x 10 GbE + 1 x 2,5 GbE + 1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('asus-rog-rapture-gt-axe11000', 'ASUS', 'ASUS ROG Rapture GT-AXE11000', 'ROG Rapture', 2021, 550, tg, s(RG, W6E, 'AXE11000 (4804 + 4804 + 1148 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 4 x 1 GbE LAN', B3E)),
  p('asus-rog-rapture-gt-ax6000', 'ASUS', 'ASUS ROG Rapture GT-AX6000', 'ROG Rapture', 2021, 380, tg, s(RG, W6, 'AX6000 (4804 + 1148 Mbit/s)', undefined, B2)),
  p('asus-rog-rapture-gt-axe16000', 'ASUS', 'ASUS ROG Rapture GT-AXE16000', 'ROG Rapture', 2022, 700, tg, s(RG, W6E, 'AXE16000', undefined, B4)),
  p('asus-rog-rapture-gt-be98', 'ASUS', 'ASUS ROG Rapture GT-BE98', 'ROG Rapture', 2023, 800, tg, s(RG, W7, 'BE25000', '2 x 10 GbE + 1 x 2,5 GbE + 4 x 1 GbE', B4)),
  p('asus-rog-rapture-gt-be98-pro', 'ASUS', 'ASUS ROG Rapture GT-BE98 Pro', 'ROG Rapture', 2024, 850, tg, s(RG, W7, 'BE30000', '2 x 10 GbE + 1 x 2,5 GbE + 4 x 1 GbE', 'Quad-bande 2,4 / 5 / 6 / 6 GHz')),
  p('asus-tuf-gaming-ax3000', 'ASUS', 'ASUS TUF Gaming AX3000 (TUF-AX3000)', 'TUF Gaming', 2021, 130, tg, s(RG, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-tuf-gaming-ax3000-v2', 'ASUS', 'ASUS TUF Gaming AX3000 V2', 'TUF Gaming', 2023, 130, tg, s(RG, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('asus-tuf-gaming-ax4200', 'ASUS', 'ASUS TUF Gaming AX4200 (TUF-AX4200)', 'TUF Gaming', 2022, 150, tg, s(RG, W6, 'AX4200 (3603 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('asus-tuf-gaming-ax5400', 'ASUS', 'ASUS TUF Gaming AX5400 (TUF-AX5400)', 'TUF Gaming', 2021, 180, tg, s(RG, W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('asus-tuf-gaming-ax6000', 'ASUS', 'ASUS TUF Gaming AX6000 (TUF-AX6000)', 'TUF Gaming', 2022, 250, tg, s(RG, W6, 'AX6000 (4804 + 1148 Mbit/s)', undefined, B2)),

  // ─── Netgear Nighthawk ──────────────────────────────────────────────────────
  p('netgear-nighthawk-r6400', 'Netgear', 'Netgear Nighthawk R6400', 'Nighthawk AC', 2016, 120, t, s(R, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-r6700', 'Netgear', 'Netgear Nighthawk R6700', 'Nighthawk AC', 2015, 130, t, s(R, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-r7000', 'Netgear', 'Netgear Nighthawk R7000', 'Nighthawk AC', 2013, 200, t, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-x4s-r7800', 'Netgear', 'Netgear Nighthawk X4S R7800', 'Nighthawk AC', 2016, 250, t, s(R, W5, 'AC2600 (1733 + 800 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-x6-r8000', 'Netgear', 'Netgear Nighthawk X6 R8000', 'Nighthawk AC', 2014, 300, t, s(R, W5, 'AC3200 (1300 + 1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('netgear-nighthawk-x8-r8500', 'Netgear', 'Netgear Nighthawk X8 R8500', 'Nighthawk AC', 2015, 400, t, s(R, W5, 'AC5300 (2166 + 2166 + 1000 Mbit/s)', '1 x 1 GbE WAN + 6 x 1 GbE LAN', B3)),
  p('netgear-nighthawk-x10-r9000', 'Netgear', 'Netgear Nighthawk X10 R9000', 'Nighthawk AC', 2016, 500, tg, s(R, 'Wi-Fi 5 (802.11ac) + 802.11ad', 'AD7200', '1 x SFP+ 10G + 1 x 1 GbE WAN + 6 x 1 GbE LAN', 'Tri-bande 2,4 / 5 / 60 GHz')),
  p('netgear-nighthawk-rax10', 'Netgear', 'Netgear Nighthawk RAX10', 'Nighthawk AX', 2020, 100, tb, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-rax40', 'Netgear', 'Netgear Nighthawk RAX40', 'Nighthawk AX', 2018, 200, t, s(R, W6, 'AX3000 (2400 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-rax50', 'Netgear', 'Netgear Nighthawk RAX50', 'Nighthawk AX', 2019, 250, t, s(R, W6, 'AX5400 (4800 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-rax80', 'Netgear', 'Netgear Nighthawk RAX80', 'Nighthawk AX', 2018, 400, t, s(R, W6, 'AX6000 (4800 + 1200 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-rax200', 'Netgear', 'Netgear Nighthawk RAX200', 'Nighthawk AX', 2019, 600, t, s(R, W6, 'AX11000 (4800 + 4800 + 1200 Mbit/s)', '1 x 2,5 GbE/1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('netgear-nighthawk-raxe500', 'Netgear', 'Netgear Nighthawk RAXE500', 'Nighthawk AXE', 2021, 600, t, s(R, W6E, 'AXE11000 (4800 + 4800 + 1200 Mbit/s)', '1 x 2,5 GbE/1 GbE WAN + 4 x 1 GbE LAN', B3E)),
  p('netgear-nighthawk-rs200', 'Netgear', 'Netgear Nighthawk RS200', 'Nighthawk BE', 2024, 230, t, s(R, W7, 'BE6500', undefined, B2)),
  p('netgear-nighthawk-rs300', 'Netgear', 'Netgear Nighthawk RS300', 'Nighthawk BE', 2024, 330, t, s(R, W7, 'BE9300', undefined, B3E)),
  p('netgear-nighthawk-xr500', 'Netgear', 'Netgear Nighthawk Pro Gaming XR500', 'Nighthawk Pro Gaming', 2017, 300, tg, s(RG, W5, 'AC2600 (1733 + 800 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-xr700', 'Netgear', 'Netgear Nighthawk Pro Gaming XR700', 'Nighthawk Pro Gaming', 2018, 500, tg, s(RG, 'Wi-Fi 5 (802.11ac) + 802.11ad', 'AD7200', '1 x SFP+ 10G + 1 x 1 GbE WAN + 6 x 1 GbE LAN', 'Tri-bande 2,4 / 5 / 60 GHz')),
  p('netgear-nighthawk-xr1000', 'Netgear', 'Netgear Nighthawk Pro Gaming XR1000', 'Nighthawk Pro Gaming', 2020, 350, tg, s(RG, W6, 'AX5400 (4800 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('netgear-nighthawk-d7000', 'Netgear', 'Netgear Nighthawk D7000', 'Nighthawk DSL', 2015, 220, t, s('Modem-routeur VDSL/ADSL', W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),

  // ─── Linksys ────────────────────────────────────────────────────────────────
  p('linksys-wrt1900ac', 'Linksys', 'Linksys WRT1900AC', 'WRT', 2014, 250, th, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-wrt1900acs', 'Linksys', 'Linksys WRT1900ACS', 'WRT', 2015, 200, th, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-wrt3200acm', 'Linksys', 'Linksys WRT3200ACM', 'WRT', 2016, 280, th, s(R, W5, 'AC3200 (2600 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-wrt32x', 'Linksys', 'Linksys WRT32X', 'WRT', 2017, 300, tg, s(RG, W5, 'AC3200 (2600 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-ea6350', 'Linksys', 'Linksys EA6350', 'EA', 2014, 90, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-ea7500', 'Linksys', 'Linksys EA7500', 'EA', 2016, 150, t, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-ea8300', 'Linksys', 'Linksys EA8300', 'EA', 2017, 200, t, s(R, W5, 'AC2200 (867 + 867 + 400 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B3)),
  p('linksys-e8450', 'Linksys', 'Linksys E8450', 'E', 2020, 150, th, s(R, W6, 'AX3200', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-mr7350', 'Linksys', 'Linksys MR7350', 'Max-Stream', 2020, 130, t, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-mr9600', 'Linksys', 'Linksys MR9600', 'Max-Stream', 2019, 350, t, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-hydra-pro-6', 'Linksys', 'Linksys Hydra Pro 6 (MR5500)', 'Hydra', 2022, 200, t, s(R, W6, 'AX5400', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-hydra-pro-6e', 'Linksys', 'Linksys Hydra Pro 6E (MR7500)', 'Hydra', 2022, 400, t, s(R, W6E, 'AXE6600', '1 x 5 GbE WAN + 4 x 1 GbE LAN', B3E)),

  // ─── AVM FRITZ!Box ──────────────────────────────────────────────────────────
  p('avm-fritzbox-3490', 'AVM', 'AVM FRITZ!Box 3490', 'FRITZ!Box DSL', 2014, 150, t, s('Modem-routeur VDSL/ADSL', W5, 'AC1300 + N450', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7430', 'AVM', 'AVM FRITZ!Box 7430', 'FRITZ!Box DSL', 2015, 130, t, s('Modem-routeur VDSL/ADSL avec DECT', W4, 'N450', '4 x 100 Mbit/s LAN', B1)),
  p('avm-fritzbox-7490', 'AVM', 'AVM FRITZ!Box 7490', 'FRITZ!Box DSL', 2013, 250, t, s('Modem-routeur VDSL/ADSL avec DECT', W5, 'AC1300 + N450', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7560', 'AVM', 'AVM FRITZ!Box 7560', 'FRITZ!Box DSL', 2016, 180, t, s('Modem-routeur VDSL/ADSL avec DECT', W5, 'AC866 + N450', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7520', 'AVM', 'AVM FRITZ!Box 7520', 'FRITZ!Box DSL', 2019, undefined, t, s('Modem-routeur VDSL/ADSL avec DECT', W5, 'AC866 + N400', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7530', 'AVM', 'AVM FRITZ!Box 7530', 'FRITZ!Box DSL', 2018, 170, t, s('Modem-routeur VDSL/ADSL avec DECT', W5, 'AC866 + N400', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7530-ax', 'AVM', 'AVM FRITZ!Box 7530 AX', 'FRITZ!Box DSL', 2021, 170, t, s('Modem-routeur VDSL/ADSL avec DECT', W6, 'AX2400 + AX600', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7510', 'AVM', 'AVM FRITZ!Box 7510', 'FRITZ!Box DSL', 2022, 120, tb, s('Modem-routeur VDSL/ADSL avec DECT', W6, undefined, '1 x 1 GbE LAN')),
  p('avm-fritzbox-7583', 'AVM', 'AVM FRITZ!Box 7583', 'FRITZ!Box DSL', 2017, undefined, t, s('Modem-routeur VDSL bonding avec DECT', W5, 'AC1733 + N800', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-7590', 'AVM', 'AVM FRITZ!Box 7590', 'FRITZ!Box DSL', 2017, 270, t, s('Modem-routeur VDSL/ADSL avec DECT', W5, 'AC1733 + N800', '4 x 1 GbE LAN + 1 x 1 GbE WAN', B2)),
  p('avm-fritzbox-7590-ax', 'AVM', 'AVM FRITZ!Box 7590 AX', 'FRITZ!Box DSL', 2021, 290, t, s('Modem-routeur VDSL/ADSL avec DECT', W6, 'AX2400 + AX1200', '4 x 1 GbE LAN + 1 x 1 GbE WAN', B2)),
  p('avm-fritzbox-7690', 'AVM', 'AVM FRITZ!Box 7690', 'FRITZ!Box DSL', 2024, 300, t, s('Modem-routeur VDSL/ADSL avec DECT', W7, undefined, undefined, B2)),
  p('avm-fritzbox-5530-fiber', 'AVM', 'AVM FRITZ!Box 5530 Fiber', 'FRITZ!Box Fiber', 2021, 250, t, s('Routeur fibre (ONT intégré) avec DECT', W6, 'AX2400 + AX600', undefined, B2)),
  p('avm-fritzbox-5590-fiber', 'AVM', 'AVM FRITZ!Box 5590 Fiber', 'FRITZ!Box Fiber', 2021, 330, t, s('Routeur fibre (module SFP) avec DECT', W6, 'AX2400 + AX1200', '1 x 2,5 GbE WAN/LAN + 4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-5690-pro', 'AVM', 'AVM FRITZ!Box 5690 Pro', 'FRITZ!Box Fiber', 2024, 400, t, s('Routeur fibre et DSL avec DECT', W7, undefined, undefined, B3E)),
  p('avm-fritzbox-6490-cable', 'AVM', 'AVM FRITZ!Box 6490 Cable', 'FRITZ!Box Cable', 2014, undefined, t, s('Modem-routeur câble DOCSIS 3.0', W5, 'AC1300 + N450', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-6590-cable', 'AVM', 'AVM FRITZ!Box 6590 Cable', 'FRITZ!Box Cable', 2016, undefined, t, s('Modem-routeur câble DOCSIS 3.0', W5, 'AC1733 + N800', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-6591-cable', 'AVM', 'AVM FRITZ!Box 6591 Cable', 'FRITZ!Box Cable', 2019, 300, t, s('Modem-routeur câble DOCSIS 3.1', W5, 'AC1733 + N800', '4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-6660-cable', 'AVM', 'AVM FRITZ!Box 6660 Cable', 'FRITZ!Box Cable', 2021, 250, t, s('Modem-routeur câble DOCSIS 3.1', W6, 'AX2400 + AX600', '1 x 2,5 GbE LAN + 4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-6690-cable', 'AVM', 'AVM FRITZ!Box 6690 Cable', 'FRITZ!Box Cable', 2021, 330, t, s('Modem-routeur câble DOCSIS 3.1', W6, 'AX2400 + AX1200', '1 x 2,5 GbE LAN + 4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-6670-cable', 'AVM', 'AVM FRITZ!Box 6670 Cable', 'FRITZ!Box Cable', 2024, 350, t, s('Modem-routeur câble DOCSIS 3.1', W7, undefined, undefined, B2)),
  p('avm-fritzbox-4020', 'AVM', 'AVM FRITZ!Box 4020', 'FRITZ!Box Router', 2016, 60, tb, s(R, W4, 'N450', '1 x WAN + 4 x LAN 100 Mbit/s', B1)),
  p('avm-fritzbox-4040', 'AVM', 'AVM FRITZ!Box 4040', 'FRITZ!Box Router', 2016, 100, t, s(R, W5, 'AC866 + N400', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('avm-fritzbox-4060', 'AVM', 'AVM FRITZ!Box 4060', 'FRITZ!Box Router', 2022, 250, t, s('Routeur Wi-Fi avec DECT', W6, 'AX6000', '1 x 2,5 GbE WAN/LAN + 3 x 1 GbE LAN', B3)),

  // ─── D-Link ─────────────────────────────────────────────────────────────────
  p('d-link-dir-842', 'D-Link', 'D-Link DIR-842', 'DIR', 2016, 60, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-867', 'D-Link', 'D-Link DIR-867', 'DIR', 2017, 90, t, s(R, W5, 'AC1750', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-878', 'D-Link', 'D-Link DIR-878', 'DIR', 2017, 110, t, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-882', 'D-Link', 'D-Link DIR-882', 'DIR', 2017, 150, t, s(R, W5, 'AC2600 (1733 + 800 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-x1560', 'D-Link', 'D-Link DIR-X1560', 'DIR-X', 2019, 90, tb, s(R, W6, 'AX1500 (1201 + 300 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-x1860', 'D-Link', 'D-Link DIR-X1860', 'DIR-X', 2019, 110, t, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-x3260', 'D-Link', 'D-Link DIR-X3260', 'DIR-X', 2020, 150, t, s(R, W6, 'AX3200', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-dir-x5460', 'D-Link', 'D-Link DIR-X5460', 'DIR-X', 2020, 220, t, s(R, W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('d-link-eagle-pro-ai-r15', 'D-Link', 'D-Link EAGLE PRO AI R15', 'EAGLE PRO AI', 2021, 80, tb, s(R, W6, 'AX1500 (1201 + 300 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('d-link-eagle-pro-ai-r32', 'D-Link', 'D-Link EAGLE PRO AI R32', 'EAGLE PRO AI', 2021, 130, t, s(R, W6, 'AX3200', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),

  // ─── Synology ───────────────────────────────────────────────────────────────
  p('synology-rt1900ac', 'Synology', 'Synology RT1900ac', 'Synology Router', 2016, 150, th, s(R, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('synology-rt2600ac', 'Synology', 'Synology RT2600ac', 'Synology Router', 2017, 250, th, s(R, W5, 'AC2600 (1733 + 800 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('synology-mr2200ac', 'Synology', 'Synology MR2200ac', 'Synology Router', 2018, 150, th, s('Routeur Wi-Fi mesh', W5, 'AC2200 (867 + 867 + 400 Mbit/s)', '1 x 1 GbE WAN + 1 x 1 GbE LAN', B3)),
  p('synology-rt6600ax', 'Synology', 'Synology RT6600ax', 'Synology Router', 2022, 330, th, s(R, W6, 'AX6600 (4804 + 1201 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 4 x 1 GbE', B3)),
  p('synology-wrx560', 'Synology', 'Synology WRX560', 'Synology Router', 2022, 230, th, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 2,5 GbE WAN/LAN + 4 x 1 GbE', B2)),

  // ─── GL.iNet (routeurs de voyage / OpenWrt) ─────────────────────────────────
  p('gl-inet-gl-mt300n-v2-mango', 'GL.iNet', 'GL.iNet GL-MT300N-V2 (Mango)', 'GL.iNet Travel', 2018, 25, ['reseau', 'mobile', 'budget'], s(RT, W4, 'N300', '1 x WAN + 1 x LAN 100 Mbit/s', B1)),
  p('gl-inet-gl-ar300m-shadow', 'GL.iNet', 'GL.iNet GL-AR300M (Shadow)', 'GL.iNet Travel', 2016, 35, ['reseau', 'mobile', 'homelab'], s(RT, W4, 'N300', '1 x WAN + 1 x LAN 100 Mbit/s', B1)),
  p('gl-inet-gl-ar750s-slate', 'GL.iNet', 'GL.iNet GL-AR750S (Slate)', 'GL.iNet Travel', 2019, 70, tm, s(RT, W5, 'AC750 (433 + 300 Mbit/s)', '1 x 1 GbE WAN + 2 x 1 GbE LAN', B2)),
  p('gl-inet-gl-mt1300-beryl', 'GL.iNet', 'GL.iNet GL-MT1300 (Beryl)', 'GL.iNet Travel', 2020, 70, tm, s(RT, W5, 'AC1300 (867 + 400 Mbit/s)', '1 x 1 GbE WAN + 2 x 1 GbE LAN', B2)),
  p('gl-inet-gl-sft1200-opal', 'GL.iNet', 'GL.iNet GL-SFT1200 (Opal)', 'GL.iNet Travel', 2021, 45, ['reseau', 'mobile', 'budget'], s(RT, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 1 GbE WAN + 2 x 1 GbE LAN', B2)),
  p('gl-inet-gl-a1300-slate-plus', 'GL.iNet', 'GL.iNet GL-A1300 (Slate Plus)', 'GL.iNet Travel', 2022, 80, tm, s(RT, W5, 'AC1300 (867 + 400 Mbit/s)', '1 x 1 GbE WAN + 2 x 1 GbE LAN', B2)),
  p('gl-inet-gl-axt1800-slate-ax', 'GL.iNet', 'GL.iNet GL-AXT1800 (Slate AX)', 'GL.iNet Travel', 2022, 130, tm, s(RT, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 2 x 1 GbE LAN', B2)),
  p('gl-inet-gl-mt3000-beryl-ax', 'GL.iNet', 'GL.iNet GL-MT3000 (Beryl AX)', 'GL.iNet Travel', 2023, 90, tm, s(RT, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 2,5 GbE WAN + 1 x 1 GbE LAN', B2)),
  p('gl-inet-gl-be3600-slate-7', 'GL.iNet', 'GL.iNet GL-BE3600 (Slate 7)', 'GL.iNet Travel', 2024, 150, tm, s(RT, W7, 'BE3600 (2882 + 688 Mbit/s)', '2 x 2,5 GbE', B2)),
  p('gl-inet-gl-ax1800-flint', 'GL.iNet', 'GL.iNet GL-AX1800 (Flint)', 'GL.iNet Flint', 2021, 130, th, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('gl-inet-gl-mt6000-flint-2', 'GL.iNet', 'GL.iNet GL-MT6000 (Flint 2)', 'GL.iNet Flint', 2023, 160, th, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '2 x 2,5 GbE + 4 x 1 GbE', B2)),
  p('gl-inet-gl-be9300-flint-3', 'GL.iNet', 'GL.iNet GL-BE9300 (Flint 3)', 'GL.iNet Flint', 2025, 190, th, s(R, W7, 'BE9300')),
  p('gl-inet-gl-mt2500-brume-2', 'GL.iNet', 'GL.iNet GL-MT2500 (Brume 2)', 'GL.iNet Brume', 2022, 80, th, s('Passerelle VPN / sécurité', undefined, undefined, '1 x 2,5 GbE WAN + 1 x 1 GbE LAN')),

  // ─── MikroTik (routeurs) ────────────────────────────────────────────────────
  p('mikrotik-hap-lite', 'MikroTik', 'MikroTik hAP lite (RB941-2nD)', 'hAP', 2014, 25, ['reseau', 'budget', 'homelab'], s(R, W4, 'N300', '4 x 100 Mbit/s', B1)),
  p('mikrotik-hap-ac-lite', 'MikroTik', 'MikroTik hAP ac lite (RB952Ui-5ac2nD)', 'hAP', 2015, 50, ['reseau', 'budget', 'homelab'], s(R, W5, 'AC750', '5 x 100 Mbit/s', B2)),
  p('mikrotik-hap-ac2', 'MikroTik', 'MikroTik hAP ac² (RBD52G-5HacD2HnD)', 'hAP', 2018, 70, th, s(R, W5, 'AC1200', '5 x 1 GbE', B2)),
  p('mikrotik-hap-ac3', 'MikroTik', 'MikroTik hAP ac³ (RBD53iG-5HacD2HnD)', 'hAP', 2020, 100, th, s(R, W5, 'AC1200', '5 x 1 GbE', B2)),
  p('mikrotik-hap-ax-lite', 'MikroTik', 'MikroTik hAP ax lite (L41G-2axD)', 'hAP', 2023, 45, ['reseau', 'budget', 'homelab'], s(R, W6, undefined, '4 x 1 GbE', B1)),
  p('mikrotik-hap-ax3', 'MikroTik', 'MikroTik hAP ax³ (C53UiG+5HPaxD2HPaxD)', 'hAP', 2022, 140, th, s(R, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 2,5 GbE + 4 x 1 GbE', B2, 'Sortie PoE sur port 1')),
  p('mikrotik-hex-rb750gr3', 'MikroTik', 'MikroTik hEX (RB750Gr3)', 'hEX', 2016, 60, ['reseau', 'budget', 'homelab'], s('Routeur filaire', undefined, undefined, '5 x 1 GbE')),
  p('mikrotik-hex-s-rb760igs', 'MikroTik', 'MikroTik hEX S (RB760iGS)', 'hEX', 2019, 75, th, s('Routeur filaire', undefined, undefined, '5 x 1 GbE + 1 x SFP 1G', undefined, 'Sortie PoE sur port 5')),
  p('mikrotik-hex-refresh-e50ug', 'MikroTik', 'MikroTik hEX refresh (E50UG)', 'hEX', 2024, 60, ['reseau', 'budget', 'homelab'], s('Routeur filaire', undefined, undefined, '5 x 1 GbE')),
  p('mikrotik-hex-poe-rb960pgs', 'MikroTik', 'MikroTik hEX PoE (RB960PGS)', 'hEX', 2015, 90, th, s('Routeur filaire', undefined, undefined, '5 x 1 GbE + 1 x SFP 1G', undefined, 'Sortie PoE sur 4 ports')),
  p('mikrotik-l009uigs-rm', 'MikroTik', 'MikroTik L009UiGS-RM', 'RouterBOARD', 2022, 130, th, s('Routeur filaire (rack)', undefined, undefined, '8 x 1 GbE + 1 x 2,5 GbE SFP', undefined, 'Sortie PoE sur port 8')),
  p('mikrotik-rb2011uias-rm', 'MikroTik', 'MikroTik RB2011UiAS-RM', 'RouterBOARD', 2012, 110, th, s('Routeur filaire (rack 1U)', undefined, undefined, '5 x 1 GbE + 5 x 100 Mbit/s + 1 x SFP')),
  p('mikrotik-rb3011uias-rm', 'MikroTik', 'MikroTik RB3011UiAS-RM', 'RouterBOARD', 2015, 150, th, s('Routeur filaire (rack 1U)', undefined, undefined, '10 x 1 GbE + 1 x SFP 1G')),
  p('mikrotik-rb4011igs-rm', 'MikroTik', 'MikroTik RB4011iGS+RM', 'RouterBOARD', 2018, 200, th, s('Routeur filaire (rack 1U)', undefined, undefined, '10 x 1 GbE + 1 x SFP+ 10G')),
  p('mikrotik-ccr1009-7g-1c-1s', 'MikroTik', 'MikroTik CCR1009-7G-1C-1S+', 'Cloud Core Router', 2014, 450, ['reseau', 'homelab', 'pro'], s('Routeur filaire (rack 1U)', undefined, undefined, '7 x 1 GbE + 1 x combo + 1 x SFP+ 10G')),
  p('mikrotik-ccr1036-8g-2s', 'MikroTik', 'MikroTik CCR1036-8G-2S+', 'Cloud Core Router', 2013, 1000, ['reseau', 'pro'], s('Routeur filaire (rack 1U)', undefined, undefined, '8 x 1 GbE + 2 x SFP+ 10G')),
  p('mikrotik-ccr2116-12g-4s', 'MikroTik', 'MikroTik CCR2116-12G-4S+', 'Cloud Core Router', 2021, 1000, ['reseau', 'pro'], s('Routeur filaire (rack 1U)', undefined, undefined, '13 x 1 GbE + 4 x SFP+ 10G')),
  p('mikrotik-ccr2216-1g-12xs-2xq', 'MikroTik', 'MikroTik CCR2216-1G-12XS-2XQ', 'Cloud Core Router', 2021, 2500, ['reseau', 'pro'], s('Routeur filaire (rack 1U)', undefined, undefined, '12 x SFP28 25G + 2 x QSFP28 100G + 1 x 1 GbE')),

  // ─── Xiaomi / Huawei / Tenda / Keenetic / DrayTek ───────────────────────────
  p('xiaomi-mi-router-4a', 'Xiaomi', 'Xiaomi Mi Router 4A', 'Mi Router', 2018, 30, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x WAN + 2 x LAN 100 Mbit/s', B2)),
  p('xiaomi-router-ax3000t', 'Xiaomi', 'Xiaomi Router AX3000T', 'Xiaomi Router', 2023, 50, tb, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('xiaomi-mi-router-ax3000', 'Xiaomi', 'Xiaomi Mi Router AX3000', 'Xiaomi Router', 2021, 70, tb, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('xiaomi-router-ax6000', 'Xiaomi', 'Xiaomi Router AX6000', 'Xiaomi Router', 2022, 150, t, s(R, W6, 'AX6000 (4804 + 1148 Mbit/s)', '1 x 2,5 GbE + 3 x 1 GbE', B2)),
  p('xiaomi-router-ax9000', 'Xiaomi', 'Xiaomi Router AX9000', 'Xiaomi Router', 2021, 300, tg, s(RG, W6, 'AX9000', '1 x 2,5 GbE + 4 x 1 GbE', B3)),
  p('huawei-wifi-ax3', 'Huawei', 'Huawei WiFi AX3', 'WiFi AX', 2020, 70, tb, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('huawei-wifi-ax3-pro', 'Huawei', 'Huawei WiFi AX3 Pro', 'WiFi AX', 2020, 90, t, s(R, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('tenda-ac10', 'Tenda', 'Tenda AC10', 'Tenda AC', 2018, 35, tb, s(R, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('tenda-ac23', 'Tenda', 'Tenda AC23', 'Tenda AC', 2020, 50, tb, s(R, W5, 'AC2100 (1733 + 300 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('keenetic-giga', 'Keenetic', 'Keenetic Giga (KN-1011)', 'Keenetic', 2020, 150, th, s(R, W6, undefined, '5 x 1 GbE + 1 x SFP', B2)),
  p('keenetic-viva', 'Keenetic', 'Keenetic Viva (KN-1912)', 'Keenetic', undefined, undefined, t, s(R, W6, undefined, undefined, B2)),
  p('keenetic-hopper', 'Keenetic', 'Keenetic Hopper (KN-3810)', 'Keenetic', undefined, undefined, t, s(R, W6, undefined, undefined, B2)),
  p('draytek-vigor-130', 'DrayTek', 'DrayTek Vigor 130', 'Vigor', 2014, 120, ['reseau', 'pro'], s('Modem VDSL/ADSL (bridge)', undefined, undefined, '1 x 1 GbE LAN')),
  p('draytek-vigor-167', 'DrayTek', 'DrayTek Vigor 167', 'Vigor', 2019, 160, ['reseau', 'pro'], s('Modem VDSL2 35b/ADSL (bridge)', undefined, undefined, '1 x 1 GbE LAN')),
  p('draytek-vigor-2862', 'DrayTek', 'DrayTek Vigor 2862', 'Vigor', 2016, 300, ['reseau', 'pro'], s('Routeur VPN VDSL/ADSL', undefined, undefined, '1 x 1 GbE WAN + 6 x 1 GbE LAN')),
  p('draytek-vigor-2865', 'DrayTek', 'DrayTek Vigor 2865', 'Vigor', 2019, 350, ['reseau', 'pro'], s('Routeur VPN VDSL/ADSL (35b)', undefined, undefined, '1 x 1 GbE WAN + 5 x 1 GbE LAN')),
  p('draytek-vigor-2927', 'DrayTek', 'DrayTek Vigor 2927', 'Vigor', 2020, 330, ['reseau', 'pro'], s('Routeur VPN double WAN', undefined, undefined, '2 x 1 GbE WAN + 5 x 1 GbE LAN')),
];
