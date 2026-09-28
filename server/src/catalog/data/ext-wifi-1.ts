import type { CatalogProduct } from '../types.js';

/**
 * Extension du catalogue « network » : cartes Wi-Fi PCIe, modules M.2, adaptateurs USB Wi-Fi
 * et antennes. Prix de lancement indicatifs arrondis ; specs omises quand la valeur n'est pas certaine.
 */

type Spec = Record<string, string | number>;

const W5 = 'Wi-Fi 5 (802.11ac)';
const W6 = 'Wi-Fi 6 (802.11ax)';
const W6E = 'Wi-Fi 6E (802.11ax)';
const W7 = 'Wi-Fi 7 (802.11be)';
const B2 = 'Bi-bande 2,4 / 5 GHz';
const B3E = 'Tri-bande 2,4 / 5 / 6 GHz';

const PCIE = 'Carte Wi-Fi PCIe';
const M2 = 'Module Wi-Fi M.2';
const USB = 'Adaptateur Wi-Fi USB';
const ANT = 'Antenne Wi-Fi';

function card(type: string, norme: string, debit: string, bandes: string, iface: string, bluetooth?: string, extra: Spec = {}): Spec {
  const o: Spec = { 'Type': type, 'Norme': norme, 'Débit': debit, 'Bandes': bandes, 'Interface': iface };
  if (bluetooth) o['Bluetooth'] = bluetooth;
  return { ...o, ...extra };
}

function antenna(bandes: string, gain: string, usage: string, connecteur: string, extra: Spec = {}): Spec {
  return { 'Type': ANT, 'Bandes': bandes, 'Gain': gain, 'Usage': usage, 'Connecteur': connecteur, ...extra };
}

function p(id: string, brand: string, name: string, family: string, year: number | undefined, msrp: number | undefined, tags: string[], specs: Spec): CatalogProduct {
  const o: CatalogProduct = { id: 'network-' + id, category: 'network', brand, name, family, specs, tags, refurbishable: false };
  if (year) o.year = year;
  if (msrp) o.msrp = msrp;
  return o;
}

const t = ['reseau', 'wifi'];
const tg = ['reseau', 'wifi', 'gaming'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Cartes PCIe ────────────────────────────────────────────────────────────
  p('tp-link-archer-tx3000e', 'TP-Link', 'TP-Link Archer TX3000E', 'Archer TX', 2019, 50, tg, card(PCIE, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'PCIe x1', '5.0', { 'Chipset': 'Intel AX200' })),
  p('tp-link-archer-tx50e', 'TP-Link', 'TP-Link Archer TX50E', 'Archer TX', 2021, 40, tg, card(PCIE, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'PCIe x1', '5.2')),
  p('tp-link-archer-tx55e', 'TP-Link', 'TP-Link Archer TX55E', 'Archer TX', 2022, 45, tg, card(PCIE, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'PCIe x1', '5.2', { 'Antennes': 'Base magnétique 2 antennes' })),
  p('tp-link-archer-txe72e', 'TP-Link', 'TP-Link Archer TXE72E', 'Archer TXE', 2023, 55, tg, card(PCIE, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', B3E, 'PCIe x1', '5.3')),
  p('tp-link-archer-txe75e', 'TP-Link', 'TP-Link Archer TXE75E', 'Archer TXE', 2022, 65, tg, card(PCIE, W6E, 'AXE5400 (2402 + 2402 + 574 Mbit/s)', B3E, 'PCIe x1', '5.2', { 'Antennes': 'Base magnétique 2 antennes' })),
  p('tp-link-archer-tbe400e', 'TP-Link', 'TP-Link Archer TBE400E', 'Archer TBE', 2024, 70, tg, card(PCIE, W7, 'BE5800', B3E, 'PCIe x1', '5.4', { 'Largeur de canal': '320 MHz' })),
  p('tp-link-archer-tbe550e', 'TP-Link', 'TP-Link Archer TBE550E', 'Archer TBE', 2023, 110, tg, card(PCIE, W7, 'BE9300 (5760 + 2880 + 574 Mbit/s)', B3E, 'PCIe x1', '5.4', { 'Largeur de canal': '320 MHz' })),
  p('asus-pce-ax3000', 'ASUS', 'ASUS PCE-AX3000', 'PCE-AX', 2019, 50, tg, card(PCIE, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'PCIe x1', '5.0')),
  p('asus-pce-ax58bt', 'ASUS', 'ASUS PCE-AX58BT', 'PCE-AX', 2019, 65, tg, card(PCIE, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'PCIe x1', '5.0', { 'Antennes': 'Base d’antennes déportée' })),
  p('asus-pce-axe59bt', 'ASUS', 'ASUS PCE-AXE59BT', 'PCE-AXE', 2022, 70, tg, card(PCIE, W6E, 'AXE5400', B3E, 'PCIe x1', '5.2')),
  p('asus-pce-axe5400', 'ASUS', 'ASUS PCE-AXE5400', 'PCE-AXE', 2022, 85, tg, card(PCIE, W6E, 'AXE5400', B3E, 'PCIe x1', '5.2', { 'Antennes': 'Base d’antennes déportée' })),
  p('asus-pce-be92bt', 'ASUS', 'ASUS PCE-BE92BT', 'PCE-BE', 2024, 100, tg, card(PCIE, W7, 'BE9200', B3E, 'PCIe x1', '5.4', { 'Largeur de canal': '320 MHz' })),
  p('gigabyte-gc-wbax210', 'Gigabyte', 'Gigabyte GC-WBAX210', 'GC-WB', 2021, 45, t, card(PCIE, W6E, 'AXE5400', B3E, 'PCIe x1', '5.2', { 'Chipset': 'Intel AX210' })),
  p('gigabyte-gc-wifi7', 'Gigabyte', 'Gigabyte GC-WIFI7', 'GC-WIFI', 2024, 70, tg, card(PCIE, W7, 'BE5800', B3E, 'PCIe x1', '5.4', { 'Chipset': 'Intel BE200' })),
  p('msi-herald-be', 'MSI', 'MSI Herald-BE', 'Herald', 2024, 75, tg, card(PCIE, W7, 'BE5800', B3E, 'PCIe x1', '5.4', { 'Chipset': 'Intel BE200' })),
  p('fenvi-fv-axe3000', 'Fenvi', 'Fenvi FV-AXE3000', 'FV', 2021, 35, t, card(PCIE, W6E, 'AXE5400', B3E, 'PCIe x1', '5.2', { 'Chipset': 'Intel AX210' })),

  // ─── Modules M.2 (portables, cartes mères avec slot M.2 Key E) ──────────────
  p('intel-wi-fi-6-ax200', 'Intel', 'Intel Wi-Fi 6 AX200', 'Intel Wi-Fi', 2019, 20, t, card(M2, W6, 'AX3000 (2402 + 574 Mbit/s)', B2, 'M.2 2230 Key E', '5.2')),
  p('intel-wi-fi-6e-ax210', 'Intel', 'Intel Wi-Fi 6E AX210', 'Intel Wi-Fi', 2020, 22, t, card(M2, W6E, 'AXE5400 (2402 Mbit/s par bande)', B3E, 'M.2 2230 Key E', '5.3')),
  p('intel-wi-fi-6e-ax211', 'Intel', 'Intel Wi-Fi 6E AX211', 'Intel Wi-Fi', 2021, 22, t, card(M2, W6E, 'AXE5400 (2402 Mbit/s par bande)', B3E, 'M.2 2230 Key E (CNVio2)', '5.3')),
  p('intel-wi-fi-7-be200', 'Intel', 'Intel Wi-Fi 7 BE200', 'Intel Wi-Fi', 2023, 30, t, card(M2, W7, 'BE5800 (5760 Mbit/s)', B3E, 'M.2 2230 Key E', '5.4', { 'Largeur de canal': '320 MHz' })),
  p('mediatek-mt7922', 'MediaTek', 'MediaTek MT7922 (AMD RZ616)', 'Filogic', 2021, 15, t, card(M2, W6E, 'AXE3000', B3E, 'M.2 2230 Key E', '5.2')),

  // ─── Adaptateurs USB ───────────────────────────────────────────────────────
  p('tp-link-archer-t3u-plus', 'TP-Link', 'TP-Link Archer T3U Plus', 'Archer T', 2019, 20, t, card(USB, W5, 'AC1300 (867 + 400 Mbit/s)', B2, 'USB 3.0', undefined, { 'Antennes': '1 antenne externe high-gain' })),
  p('tp-link-archer-t4u', 'TP-Link', 'TP-Link Archer T4U', 'Archer T', 2016, 25, t, card(USB, W5, 'AC1300 (867 + 400 Mbit/s)', B2, 'USB 3.0')),
  p('tp-link-archer-tx20u', 'TP-Link', 'TP-Link Archer TX20U', 'Archer TX', 2022, 35, t, card(USB, W6, 'AX1800 (1201 + 574 Mbit/s)', B2, 'USB 3.0')),
  p('tp-link-archer-tx20u-plus', 'TP-Link', 'TP-Link Archer TX20U Plus', 'Archer TX', 2022, 40, t, card(USB, W6, 'AX1800 (1201 + 574 Mbit/s)', B2, 'USB 3.0', undefined, { 'Antennes': '2 antennes externes high-gain' })),
  p('tp-link-archer-txe70uh', 'TP-Link', 'TP-Link Archer TXE70UH', 'Archer TXE', 2023, 60, tg, card(USB, W6E, 'AXE5400', B3E, 'USB 3.0', undefined, { 'Antennes': '2 antennes externes' })),
  p('asus-usb-ax56', 'ASUS', 'ASUS USB-AX56', 'USB-AX', 2020, 60, tg, card(USB, W6, 'AX1800 (1201 + 574 Mbit/s)', B2, 'USB 3.2 Gen 1', undefined, { 'Antennes': 'Base USB avec antennes' })),
  p('asus-usb-ac68', 'ASUS', 'ASUS USB-AC68', 'USB-AC', 2016, 60, t, card(USB, W5, 'AC1900 (1300 + 600 Mbit/s)', B2, 'USB 3.0')),
  p('netgear-nighthawk-a8000', 'Netgear', 'Netgear Nighthawk A8000', 'Nighthawk', 2022, 80, tg, card(USB, W6E, 'AXE3000', B3E, 'USB 3.0')),
  p('netgear-nighthawk-a7000', 'Netgear', 'Netgear Nighthawk A7000', 'Nighthawk', 2017, 50, t, card(USB, W5, 'AC1900 (1300 + 600 Mbit/s)', B2, 'USB 3.0')),
  p('d-link-dwa-x1850', 'D-Link', 'D-Link DWA-X1850', 'DWA', 2020, 40, t, card(USB, W6, 'AX1800 (1201 + 574 Mbit/s)', B2, 'USB 3.0')),
  p('avm-fritz-wlan-stick-ac-860', 'AVM', 'AVM FRITZ!WLAN Stick AC 860', 'FRITZ!WLAN', 2015, 30, t, card(USB, W5, 'AC1200 (866 + 300 Mbit/s)', B2, 'USB 3.0')),
  p('alfa-awus036acm', 'Alfa Network', 'Alfa Network AWUS036ACM', 'AWUS', 2017, 45, t, card(USB, W5, 'AC1200 (867 + 300 Mbit/s)', B2, 'USB 3.0', undefined, { 'Antennes': '2 antennes RP-SMA amovibles', 'Chipset': 'MediaTek MT7612U' })),
  p('alfa-awus036axml', 'Alfa Network', 'Alfa Network AWUS036AXML', 'AWUS', 2022, 60, t, card(USB, W6E, 'AXE3000', B3E, 'USB 3.0', '5.2', { 'Antennes': '2 antennes RP-SMA amovibles', 'Chipset': 'MediaTek MT7921AUN' })),

  // ─── Antennes ──────────────────────────────────────────────────────────────
  p('tp-link-tl-ant2405cl', 'TP-Link', 'TP-Link TL-ANT2405CL', 'TL-ANT', undefined, 8, t, antenna('2,4 GHz', '5 dBi', 'Intérieur, omnidirectionnelle', 'RP-SMA mâle')),
  p('tp-link-tl-ant2408cl', 'TP-Link', 'TP-Link TL-ANT2408CL', 'TL-ANT', undefined, 10, t, antenna('2,4 GHz', '8 dBi', 'Intérieur, omnidirectionnelle', 'RP-SMA mâle')),
  p('tp-link-tl-ant2415d', 'TP-Link', 'TP-Link TL-ANT2415D', 'TL-ANT', undefined, 40, t, antenna('2,4 GHz', '15 dBi', 'Extérieur, omnidirectionnelle', 'N femelle')),
  p('ubiquiti-amo-2g13', 'Ubiquiti', 'Ubiquiti airMAX Omni AMO-2G13', 'airMAX', undefined, 110, ['reseau', 'wifi', 'homelab'], antenna('2,4 GHz', '13 dBi', 'Extérieur, omnidirectionnelle (MIMO 2x2)', 'RP-SMA')),
  p('ubiquiti-amo-5g13', 'Ubiquiti', 'Ubiquiti airMAX Omni AMO-5G13', 'airMAX', undefined, 120, ['reseau', 'wifi', 'homelab'], antenna('5 GHz', '13 dBi', 'Extérieur, omnidirectionnelle (MIMO 2x2)', 'RP-SMA')),
  p('alfa-apa-m25', 'Alfa Network', 'Alfa Network APA-M25', 'APA', undefined, 30, t, antenna(B2, '8 dBi (2,4 GHz) / 10 dBi (5 GHz)', 'Intérieur, panneau directionnel', 'RP-SMA mâle')),
  p('alfa-ars-n19', 'Alfa Network', 'Alfa Network ARS-N19', 'ARS', undefined, 10, t, antenna('2,4 GHz', '9 dBi', 'Intérieur, omnidirectionnelle', 'RP-SMA mâle')),
];
