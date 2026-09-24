import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « network » : systèmes mesh Wi-Fi et répéteurs.
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
const tp = ['reseau', 'pro'];
const M = 'Système mesh Wi-Fi';
const X = 'Répéteur Wi-Fi';

export const PRODUCTS: CatalogProduct[] = [
  // ─── TP-Link Deco ───────────────────────────────────────────────────────────
  p('tp-link-deco-m4', 'TP-Link', 'TP-Link Deco M4', 'Deco', 2018, 70, tb, s(M, W5, 'AC1200 (867 + 300 Mbit/s)', '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-m5', 'TP-Link', 'TP-Link Deco M5', 'Deco', 2017, 100, t, s(M, W5, 'AC1300 (867 + 400 Mbit/s)', '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-m9-plus', 'TP-Link', 'TP-Link Deco M9 Plus', 'Deco', 2018, 150, t, s(M, W5, 'AC2200 (867 + 867 + 400 Mbit/s)', '2 x 1 GbE par unité', B3)),
  p('tp-link-deco-e4', 'TP-Link', 'TP-Link Deco E4', 'Deco', 2019, 50, tb, s(M, W5, 'AC1200 (867 + 300 Mbit/s)', '2 x 100 Mbit/s par unité', B2)),
  p('tp-link-deco-s4', 'TP-Link', 'TP-Link Deco S4', 'Deco', 2019, 60, tb, s(M, W5, 'AC1200 (867 + 300 Mbit/s)', '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-p9', 'TP-Link', 'TP-Link Deco P9', 'Deco', 2019, 150, t, s('Système mesh Wi-Fi hybride CPL', W5, 'AC1200 + CPL AV1000', '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-x10', 'TP-Link', 'TP-Link Deco X10', 'Deco', 2021, 80, tb, s(M, W6, 'AX1500 (1201 + 300 Mbit/s)', '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-x55', 'TP-Link', 'TP-Link Deco X55', 'Deco', 2022, 130, t, s(M, W6, 'AX3000 (2402 + 574 Mbit/s)', '3 x 1 GbE par unité', B2)),
  p('tp-link-deco-x60', 'TP-Link', 'TP-Link Deco X60', 'Deco', 2020, 150, t, s(M, W6, undefined, '2 x 1 GbE par unité', B2)),
  p('tp-link-deco-x68', 'TP-Link', 'TP-Link Deco X68', 'Deco', 2021, 170, t, s(M, W6, 'AX3600', '2 x 1 GbE par unité', B3)),
  p('tp-link-deco-x90', 'TP-Link', 'TP-Link Deco X90', 'Deco', 2021, 300, t, s(M, W6, 'AX6600 (4804 + 1201 + 574 Mbit/s)', '1 x 2,5 GbE + 1 x 1 GbE par unité', B3)),
  p('tp-link-deco-x95', 'TP-Link', 'TP-Link Deco X95', 'Deco', 2022, 400, t, s(M, W6, 'AX7800 (4804 + 2402 + 574 Mbit/s)', '1 x 2,5 GbE + 1 x 1 GbE par unité', B3)),
  p('tp-link-deco-xe75', 'TP-Link', 'TP-Link Deco XE75', 'Deco', 2022, 200, t, s(M, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', '3 x 1 GbE par unité', B3E)),
  p('tp-link-deco-xe75-pro', 'TP-Link', 'TP-Link Deco XE75 Pro', 'Deco', 2022, 250, t, s(M, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', '1 x 2,5 GbE + 2 x 1 GbE par unité', B3E)),
  p('tp-link-deco-xe200', 'TP-Link', 'TP-Link Deco XE200', 'Deco', 2022, 400, t, s(M, W6E, 'AXE11000 (4804 + 4804 + 1148 Mbit/s)', '1 x 10 GbE + 2 x 1 GbE par unité', B3E)),
  p('tp-link-deco-be25', 'TP-Link', 'TP-Link Deco BE25', 'Deco', 2024, 150, t, s(M, W7, 'BE5000', '2 x 2,5 GbE par unité', B2)),
  p('tp-link-deco-be63', 'TP-Link', 'TP-Link Deco BE63', 'Deco', 2023, 350, t, s(M, W7, 'BE10000', '4 x 2,5 GbE par unité', B3E)),
  p('tp-link-deco-be65', 'TP-Link', 'TP-Link Deco BE65', 'Deco', 2023, 400, t, s(M, W7, 'BE11000', '4 x 2,5 GbE par unité', B3E)),
  p('tp-link-deco-be95', 'TP-Link', 'TP-Link Deco BE95', 'Deco', 2024, 800, t, s(M, W7, 'BE33000', '2 x 10 GbE + 2 x 2,5 GbE par unité', 'Quad-bande 2,4 / 5 / 6 / 6 GHz')),

  // ─── Google / eero ──────────────────────────────────────────────────────────
  p('google-wifi', 'Google', 'Google Wifi', 'Google Wifi', 2016, 140, t, s(M, W5, 'AC1200', '2 x 1 GbE par unité', B2)),
  p('google-nest-wifi', 'Google', 'Google Nest Wifi', 'Nest Wifi', 2019, 160, t, s(M, W5, 'AC2200 (routeur)', '2 x 1 GbE (routeur)', B2)),
  p('google-nest-wifi-pro', 'Google', 'Google Nest Wifi Pro', 'Nest Wifi', 2022, 230, t, s(M, W6E, 'AXE5400', '2 x 1 GbE par unité', B3E)),
  p('eero-pro-2019', 'eero', 'eero Pro (3e génération)', 'eero', 2019, 200, t, s(M, W5, undefined, '2 x 1 GbE par unité', B3)),
  p('eero-6', 'eero', 'eero 6', 'eero 6', 2020, 130, t, s(M, W6, 'AX1800', '2 x 1 GbE (routeur)', B2)),
  p('eero-pro-6', 'eero', 'eero Pro 6', 'eero 6', 2020, 230, t, s(M, W6, 'AX4200', '2 x 1 GbE par unité', B3)),
  p('eero-max-7', 'eero', 'eero Max 7', 'eero 7', 2023, 600, t, s(M, W7, undefined, '2 x 10 GbE + 2 x 2,5 GbE par unité', B3E)),
  p('eero-pro-7', 'eero', 'eero Pro 7', 'eero 7', 2025, 300, t, s(M, W7, undefined, '2 x 5 GbE par unité', B3E)),
  p('eero-7', 'eero', 'eero 7', 'eero 7', 2025, 170, t, s(M, W7, undefined, '2 x 2,5 GbE par unité', B2)),

  // ─── Netgear Orbi ───────────────────────────────────────────────────────────
  p('netgear-orbi-rbk13', 'Netgear', 'Netgear Orbi RBK13', 'Orbi AC', 2019, 200, t, s(M, W5, 'AC1200', undefined, B2)),
  p('netgear-orbi-rbk20', 'Netgear', 'Netgear Orbi RBK20', 'Orbi AC', 2017, 250, t, s(M, W5, 'AC2200', undefined, B3)),
  p('netgear-orbi-rbk50', 'Netgear', 'Netgear Orbi RBK50', 'Orbi AC', 2016, 400, t, s(M, W5, 'AC3000', '1 x 1 GbE WAN + 3 x 1 GbE LAN (routeur)', B3)),
  p('netgear-orbi-rbk352', 'Netgear', 'Netgear Orbi RBK352', 'Orbi AX', 2021, 200, t, s(M, W6, 'AX1800', undefined, B2)),
  p('netgear-orbi-rbk852', 'Netgear', 'Netgear Orbi RBK852', 'Orbi AX', 2019, 700, t, s(M, W6, 'AX6000', '1 x 2,5 GbE WAN + 3 x 1 GbE LAN (routeur)', B3)),
  p('netgear-orbi-rbke963', 'Netgear', 'Netgear Orbi RBKE963', 'Orbi AXE', 2021, 1500, t, s(M, W6E, 'AXE11000', '1 x 10 GbE WAN + 3 x 1 GbE LAN (routeur)', B4)),
  p('netgear-orbi-770-rbe772', 'Netgear', 'Netgear Orbi 770 (RBE772)', 'Orbi BE', 2024, 900, t, s(M, W7, 'BE11000', '1 x 2,5 GbE WAN + 1 x 2,5 GbE LAN + 3 x 1 GbE LAN (routeur)', B3E)),

  // ─── Linksys Velop ──────────────────────────────────────────────────────────
  p('linksys-velop-whw0103', 'Linksys', 'Linksys Velop Dual-Band (WHW0103)', 'Velop', 2017, 250, t, s(M, W5, 'AC1300', '2 x 1 GbE par unité', B2)),
  p('linksys-velop-whw0303', 'Linksys', 'Linksys Velop Tri-Band (WHW0303)', 'Velop', 2016, 500, t, s(M, W5, 'AC2200 par unité', '2 x 1 GbE par unité', B3)),
  p('linksys-velop-mx4200', 'Linksys', 'Linksys Velop AX4200 (MX4200)', 'Velop AX', 2020, 300, t, s(M, W6, 'AX4200', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B3)),
  p('linksys-atlas-6-mx2000', 'Linksys', 'Linksys Atlas 6 (MX2000)', 'Velop AX', 2021, 150, t, s(M, W6, 'AX3000', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('linksys-atlas-pro-6-mx5500', 'Linksys', 'Linksys Atlas Pro 6 (MX5500)', 'Velop AX', 2021, 200, t, s(M, W6, 'AX5400', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('linksys-hydra-6-mr2000', 'Linksys', 'Linksys Hydra 6 (MR2000)', 'Hydra', 2022, 130, t, s('Routeur Wi-Fi mesh', W6, 'AX3000', '1 x 1 GbE WAN + 4 x 1 GbE LAN', B2)),
  p('linksys-velop-pro-6e-mx6200', 'Linksys', 'Linksys Velop Pro 6E (MX6200)', 'Velop Pro', 2022, 400, t, s(M, W6E, 'AXE5400', '1 x 5 GbE WAN + 3 x 1 GbE LAN', B3E)),
  p('linksys-velop-pro-7-mbe7000', 'Linksys', 'Linksys Velop Pro 7 (MBE7000)', 'Velop Pro', 2023, 500, t, s(M, W7, 'BE11000', '1 x 10 GbE WAN + 3 x 2,5 GbE LAN', B3E)),

  // ─── ASUS ZenWiFi ───────────────────────────────────────────────────────────
  p('asus-zenwifi-ac-ct8', 'ASUS', 'ASUS ZenWiFi AC (CT8)', 'ZenWiFi', 2019, 350, t, s(M, W5, 'AC3000', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B3)),
  p('asus-zenwifi-ax-mini-xd4', 'ASUS', 'ASUS ZenWiFi AX Mini (XD4)', 'ZenWiFi', 2020, 200, t, s(M, W6, 'AX1800 (1201 + 574 Mbit/s)', '2 x 1 GbE (routeur)', B2)),
  p('asus-zenwifi-xd5', 'ASUS', 'ASUS ZenWiFi XD5', 'ZenWiFi', 2022, 250, t, s(M, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 1 x 1 GbE LAN', B2)),
  p('asus-zenwifi-xd6', 'ASUS', 'ASUS ZenWiFi XD6', 'ZenWiFi', 2021, 300, t, s(M, W6, 'AX5400 (4804 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN', B2)),
  p('asus-zenwifi-xt9', 'ASUS', 'ASUS ZenWiFi XT9', 'ZenWiFi', 2022, 450, t, s(M, W6, 'AX7800 (4804 + 2402 + 574 Mbit/s)', '1 x 2,5 GbE WAN + 1 x 1 GbE WAN/LAN + 2 x 1 GbE LAN', B3)),
  p('asus-zenwifi-et8', 'ASUS', 'ASUS ZenWiFi ET8', 'ZenWiFi', 2021, 500, t, s(M, W6E, 'AXE6600 (4804 + 1201 + 574 Mbit/s)', '1 x 2,5 GbE WAN + 3 x 1 GbE LAN', B3E)),
  p('asus-zenwifi-pro-xt12', 'ASUS', 'ASUS ZenWiFi Pro XT12', 'ZenWiFi Pro', 2022, 800, t, s(M, W6, 'AX11000', '2 x 2,5 GbE + 2 x 1 GbE LAN', 'Quad-bande 2,4 / 5 / 5 / 5 GHz')),
  p('asus-zenwifi-pro-et12', 'ASUS', 'ASUS ZenWiFi Pro ET12', 'ZenWiFi Pro', 2022, 800, t, s(M, W6E, 'AXE11000', '2 x 2,5 GbE + 2 x 1 GbE LAN', B3E)),
  p('asus-zenwifi-bt10', 'ASUS', 'ASUS ZenWiFi BT10', 'ZenWiFi', 2024, 800, t, s(M, W7, 'BE18000', '1 x 10 GbE + 1 x SFP+ 10G + 1 x 10 GbE LAN + 3 x 1 GbE LAN', B3E)),
  p('asus-zenwifi-bq16-pro', 'ASUS', 'ASUS ZenWiFi BQ16 Pro', 'ZenWiFi', 2024, 1200, t, s(M, W7, 'BE30000', undefined, 'Quad-bande 2,4 / 5 / 5 / 6 GHz')),

  // ─── Autres mesh ────────────────────────────────────────────────────────────
  p('tenda-nova-mw3', 'Tenda', 'Tenda Nova MW3', 'Nova', 2017, 70, tb, s(M, W5, 'AC1200', '2 x 100 Mbit/s par unité', B2)),
  p('tenda-nova-mw6', 'Tenda', 'Tenda Nova MW6', 'Nova', 2017, 120, tb, s(M, W5, 'AC1200', '2 x 1 GbE par unité', B2)),
  p('xiaomi-mesh-system-ax3000', 'Xiaomi', 'Xiaomi Mesh System AX3000', 'Xiaomi Router', 2021, 150, t, s(M, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE WAN + 3 x 1 GbE LAN par unité', B2)),
  p('huawei-wifi-mesh-3', 'Huawei', 'Huawei WiFi Mesh 3', 'WiFi Mesh', 2021, 200, t, s(M, W6, 'AX3000', undefined, B2)),
  p('d-link-covr-1102', 'D-Link', 'D-Link COVR-1102', 'COVR', 2019, 100, tb, s(M, W5, 'AC1200', '2 x 1 GbE par unité', B2)),
  p('d-link-covr-x1862', 'D-Link', 'D-Link COVR-X1862', 'COVR', 2020, 180, t, s(M, W6, 'AX1800 (1201 + 574 Mbit/s)', '2 x 1 GbE par unité', B2)),
  p('d-link-eagle-pro-ai-m15', 'D-Link', 'D-Link EAGLE PRO AI M15', 'EAGLE PRO AI', 2021, 130, tb, s(M, W6, 'AX1500', '2 x 1 GbE par unité', B2)),
  p('d-link-eagle-pro-ai-m32', 'D-Link', 'D-Link EAGLE PRO AI M32', 'EAGLE PRO AI', 2021, 200, t, s(M, W6, 'AX3200', '2 x 1 GbE par unité', B2)),
  p('mikrotik-audience', 'MikroTik', 'MikroTik Audience (RBD25G-5HPacQD2HPnD)', 'MikroTik Wireless', 2019, 170, th, s(M, W5, undefined, '2 x 1 GbE', B3)),

  // ─── Répéteurs AVM FRITZ! ───────────────────────────────────────────────────
  p('avm-fritzrepeater-310', 'AVM', 'AVM FRITZ!Repeater 310', 'FRITZ!Repeater', 2017, 40, tb, s(X, W4, 'N300', undefined, B1)),
  p('avm-fritzrepeater-600', 'AVM', 'AVM FRITZ!Repeater 600', 'FRITZ!Repeater', 2019, 50, tb, s(X, W4, 'N600', undefined, B1)),
  p('avm-fritzrepeater-1200', 'AVM', 'AVM FRITZ!Repeater 1200', 'FRITZ!Repeater', 2019, 80, t, s(X, W5, 'AC866 + N400', '1 x 1 GbE', B2)),
  p('avm-fritzrepeater-1200-ax', 'AVM', 'AVM FRITZ!Repeater 1200 AX', 'FRITZ!Repeater', 2021, 90, t, s(X, W6, 'AX2400 + AX600', '1 x 1 GbE', B2)),
  p('avm-fritzwlan-repeater-1750e', 'AVM', 'AVM FRITZ!WLAN Repeater 1750E', 'FRITZ!Repeater', 2015, 80, t, s(X, W5, 'AC1300 + N450', '1 x 1 GbE', B2)),
  p('avm-fritzrepeater-2400', 'AVM', 'AVM FRITZ!Repeater 2400', 'FRITZ!Repeater', 2019, 110, t, s(X, W5, 'AC1733 + N600', '1 x 1 GbE', B2)),
  p('avm-fritzrepeater-3000', 'AVM', 'AVM FRITZ!Repeater 3000', 'FRITZ!Repeater', 2019, 130, t, s(X, W5, 'AC1733 + AC866 + N400', '2 x 1 GbE', B3)),
  p('avm-fritzrepeater-3000-ax', 'AVM', 'AVM FRITZ!Repeater 3000 AX', 'FRITZ!Repeater', 2022, 150, t, s(X, W6, 'AX2400 + AX1200 + AX600', undefined, B3)),
  p('avm-fritzrepeater-6000', 'AVM', 'AVM FRITZ!Repeater 6000', 'FRITZ!Repeater', 2021, 230, t, s(X, W6, undefined, '1 x 2,5 GbE + 1 x 1 GbE', B3)),

  // ─── Répéteurs TP-Link / Netgear / ASUS / devolo / Xiaomi ───────────────────
  p('tp-link-re200', 'TP-Link', 'TP-Link RE200', 'RE', 2015, 30, tb, s(X, W5, 'AC750 (433 + 300 Mbit/s)', '1 x 100 Mbit/s', B2)),
  p('tp-link-re305', 'TP-Link', 'TP-Link RE305', 'RE', 2017, 40, tb, s(X, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 100 Mbit/s', B2)),
  p('tp-link-re330', 'TP-Link', 'TP-Link RE330', 'RE', 2019, 35, tb, s(X, W5, 'AC1200 (867 + 300 Mbit/s)', '1 x 100 Mbit/s', B2)),
  p('tp-link-re450', 'TP-Link', 'TP-Link RE450', 'RE', 2015, 70, t, s(X, W5, 'AC1750 (1300 + 450 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re550', 'TP-Link', 'TP-Link RE550', 'RE', 2018, 80, t, s(X, W5, 'AC1900 (1300 + 600 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re650', 'TP-Link', 'TP-Link RE650', 'RE', 2017, 100, t, s(X, W5, 'AC2600 (1733 + 800 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re505x', 'TP-Link', 'TP-Link RE505X', 'RE', 2020, 60, t, s(X, W6, 'AX1500 (1201 + 300 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re605x', 'TP-Link', 'TP-Link RE605X', 'RE', 2020, 80, t, s(X, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re700x', 'TP-Link', 'TP-Link RE700X', 'RE', 2021, 100, t, s(X, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE', B2)),
  p('tp-link-re815x', 'TP-Link', 'TP-Link RE815X', 'RE', 2022, 150, t, s(X, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', '1 x 1 GbE', B3E)),
  p('netgear-ex6120', 'Netgear', 'Netgear EX6120', 'Netgear EX', 2016, 60, tb, s(X, W5, 'AC1200', '1 x 100 Mbit/s', B2)),
  p('netgear-ex7300', 'Netgear', 'Netgear EX7300', 'Netgear EX', 2017, 120, t, s(X, W5, 'AC2200', '1 x 1 GbE', B2)),
  p('netgear-nighthawk-eax20', 'Netgear', 'Netgear Nighthawk EAX20', 'Nighthawk Mesh Extender', 2020, 180, t, s(X, W6, 'AX1800', '4 x 1 GbE', B2)),
  p('netgear-nighthawk-eax80', 'Netgear', 'Netgear Nighthawk EAX80', 'Nighthawk Mesh Extender', 2019, 300, t, s(X, W6, 'AX6000', '4 x 1 GbE', B2)),
  p('asus-rp-ax56', 'ASUS', 'ASUS RP-AX56', 'RP-AX', 2021, 90, t, s(X, W6, 'AX1800 (1201 + 574 Mbit/s)', '1 x 1 GbE', B2)),
  p('asus-rp-ax58', 'ASUS', 'ASUS RP-AX58', 'RP-AX', 2022, 110, t, s(X, W6, 'AX3000 (2402 + 574 Mbit/s)', '1 x 1 GbE', B2)),
  p('devolo-wifi-6-repeater-3000', 'devolo', 'devolo WiFi 6 Repeater 3000', 'devolo WiFi 6', 2021, 110, t, s(X, W6, 'AX3000', undefined, B2)),
  p('devolo-wifi-6-repeater-5400', 'devolo', 'devolo WiFi 6 Repeater 5400', 'devolo WiFi 6', 2021, 150, t, s(X, W6, 'AX5400', undefined, B2)),
  p('xiaomi-mi-wifi-range-extender-pro', 'Xiaomi', 'Xiaomi Mi WiFi Range Extender Pro', 'Mi WiFi', 2017, 15, tb, s(X, W4, 'N300', undefined, B1)),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [R, RG, RT, tg, tm, tp];
