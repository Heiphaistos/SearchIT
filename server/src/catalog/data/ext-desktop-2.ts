import type { CatalogProduct } from '../types.js';

const KEYS = ['Processeur', 'RAM', 'Stockage', 'Carte graphique', 'Format', 'Système'] as const;

/** Construit une entrée « desktop » ; specs dans l'ordre de KEYS, valeurs vides ignorées ; msrp 0 = inconnu. */
function d(slug: string, brand: string, name: string, family: string, year: number, msrp: number, tags: string[], s: string[], refurbishable = true): CatalogProduct {
  const specs: Record<string, string> = {};
  KEYS.forEach((k, i) => {
    if (s[i]) specs[k] = s[i];
  });
  const p: CatalogProduct = { id: `desktop-${slug}`, category: 'desktop', brand, name, family, year, refurbishable, tags, specs };
  if (msrp > 0) p.msrp = msrp;
  return p;
}
const W7 = 'Windows 7 / 8.1';
const W10 = 'Windows 10';
const W10P = 'Windows 10 Pro';
const W11 = 'Windows 11';
const W11P = 'Windows 11 Pro';
const T = 'Tout-en-un';
const MINI = 'Mini PC';
const SFF = 'SFF (petit format)';
const TOUR = 'Tour';
const WS = 'Tour (station de travail)';
const BARE = 'Barebone (RAM et stockage non inclus)';

/**
 * Catalogue de référence : Dell (Precision, XPS, Alienware, Inspiron, Vostro, G5), ASUS, MSI, Acer,
 * ASRock, Zotac, Microsoft Surface Studio et Corsair One.
 */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Dell Precision (stations de travail) ─────────────────────────────────
  d('dell-precision-t1700-mt', 'Dell', 'Dell Precision T1700 MT', 'Precision Tower', 2013, 0, ['pro', 'creation'], ['Intel Xeon E3-1200 v3 ou Core i3 / i5 / i7 4e gén.', 'DDR3 (ECC possible), jusqu’à 32 Go', 'Disque dur ou SSD', 'NVIDIA Quadro ou AMD FirePro (selon config)', WS, W7]),
  d('dell-precision-t1700-sff', 'Dell', 'Dell Precision T1700 SFF', 'Precision Tower', 2013, 0, ['pro'], ['Intel Xeon E3-1200 v3 ou Core i3 / i5 / i7 4e gén.', 'DDR3 (ECC possible), jusqu’à 32 Go', 'Disque dur ou SSD', 'NVIDIA Quadro profil bas (selon config)', SFF, W7]),
  d('dell-precision-t3610', 'Dell', 'Dell Precision T3610', 'Precision Tower', 2013, 0, ['pro', 'creation', 'homelab'], ['Intel Xeon E5-1600 v2 ou E5-2600 v2 (1 socket)', 'DDR3 ECC, jusqu’à 128 Go', 'Disque dur ou SSD', 'NVIDIA Quadro ou AMD FirePro (selon config)', WS, W7]),
  d('dell-precision-t5610', 'Dell', 'Dell Precision T5610', 'Precision Tower', 2013, 0, ['pro', 'creation', 'homelab'], ['1 ou 2 × Intel Xeon E5-2600 v2', 'DDR3 ECC, jusqu’à 128 Go', 'Disque dur ou SSD', 'NVIDIA Quadro ou AMD FirePro (selon config)', WS, W7]),
  d('dell-precision-t5810', 'Dell', 'Dell Precision T5810', 'Precision Tower', 2014, 0, ['pro', 'creation', 'homelab'], ['Intel Xeon E5-1600 / E5-2600 v3 ou v4 (1 socket)', 'DDR4 ECC, jusqu’à 256 Go', 'Disque dur ou SSD', 'NVIDIA Quadro ou AMD FirePro (selon config)', WS, W7]),
  d('dell-precision-t7810', 'Dell', 'Dell Precision T7810', 'Precision Tower', 2014, 0, ['pro', 'creation', 'homelab'], ['1 ou 2 × Intel Xeon E5-2600 v3 ou v4', 'DDR4 ECC, jusqu’à 256 Go', 'Disque dur ou SSD', 'NVIDIA Quadro ou AMD FirePro (selon config)', WS, W7]),
  d('dell-precision-t3620', 'Dell', 'Dell Precision T3620', 'Precision Tower', 2016, 0, ['pro', 'creation'], ['Intel Xeon E3-1200 v5 / v6 ou Core 6e / 7e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 ou disque dur', 'NVIDIA Quadro ou AMD Radeon Pro (selon config)', WS, W10P]),
  d('dell-precision-3420-sff', 'Dell', 'Dell Precision 3420 SFF', 'Precision Tower', 2016, 0, ['pro'], ['Intel Xeon E3-1200 v5 / v6 ou Core 6e / 7e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 ou disque dur', 'NVIDIA Quadro profil bas (selon config)', SFF, W10P]),
  d('dell-precision-t5820', 'Dell', 'Dell Precision T5820', 'Precision Tower', 2017, 0, ['pro', 'creation', 'homelab'], ['Intel Xeon W-2100 / W-2200 ou Core X', 'DDR4 ECC (8 emplacements)', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro / RTX ou AMD Radeon Pro (selon config)', WS, W10P]),
  d('dell-precision-t7820', 'Dell', 'Dell Precision T7820', 'Precision Tower', 2017, 0, ['pro', 'creation', 'homelab'], ['1 ou 2 × Intel Xeon Scalable (1re / 2e gén.)', 'DDR4 ECC', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro / RTX (selon config)', WS, W10P]),
  d('dell-precision-t7920', 'Dell', 'Dell Precision T7920', 'Precision Tower', 2017, 0, ['pro', 'creation', 'ia'], ['1 ou 2 × Intel Xeon Scalable (1re / 2e gén.)', 'DDR4 ECC, jusqu’à 3 To', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro / RTX (selon config)', WS, W10P]),
  d('dell-precision-3430-sff', 'Dell', 'Dell Precision 3430 SFF', 'Precision Tower', 2018, 0, ['pro'], ['Intel Xeon E-2100 ou Core 8e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro profil bas (selon config)', SFF, W10P]),
  d('dell-precision-3630-tower', 'Dell', 'Dell Precision 3630 Tower', 'Precision Tower', 2018, 0, ['pro', 'creation'], ['Intel Xeon E-2100 / E-2200 ou Core 8e / 9e gén.', 'DDR4 (4 emplacements)', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro ou AMD Radeon Pro (selon config)', WS, W10P]),
  d('dell-precision-3640-tower', 'Dell', 'Dell Precision 3640 Tower', 'Precision Tower', 2020, 0, ['pro', 'creation'], ['Intel Xeon W-1200 ou Core 10e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'NVIDIA Quadro / RTX ou AMD Radeon Pro (selon config)', WS, W10P]),
  d('dell-precision-3650-tower', 'Dell', 'Dell Precision 3650 Tower', 'Precision Tower', 2021, 0, ['pro', 'creation'], ['Intel Xeon W-1300 ou Core 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'NVIDIA RTX ou AMD Radeon Pro (selon config)', WS, W10P]),
  d('dell-precision-3660-tower', 'Dell', 'Dell Precision 3660 Tower', 'Precision Tower', 2022, 0, ['pro', 'creation'], ['Intel Core 12e / 13e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'NVIDIA RTX professionnelle (selon config)', WS, W11P]),
  d('dell-precision-3680-tower', 'Dell', 'Dell Precision 3680 Tower', 'Precision Tower', 2024, 0, ['pro', 'creation', 'ia'], ['Intel Core 14e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'NVIDIA RTX professionnelle (selon config)', WS, W11P]),
  d('dell-precision-3240-compact', 'Dell', 'Dell Precision 3240 Compact', 'Precision Compact', 2020, 0, ['pro'], ['Intel Xeon W-1200 ou Core 10e gén.', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'NVIDIA Quadro (selon config)', 'Compact (station de travail)', W10P]),
  d('dell-precision-3260-compact', 'Dell', 'Dell Precision 3260 Compact', 'Precision Compact', 2022, 0, ['pro'], ['Intel Core 12e gén.', 'DDR5 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'NVIDIA T1000 / RTX A2000 (selon config)', 'Compact (station de travail)', W11P]),
  d('dell-precision-3460-sff', 'Dell', 'Dell Precision 3460 SFF', 'Precision Tower', 2022, 0, ['pro'], ['Intel Core 12e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA RTX profil bas (selon config)', SFF, W11P]),
  d('dell-precision-5860-tower', 'Dell', 'Dell Precision 5860 Tower', 'Precision Tower', 2023, 0, ['pro', 'creation', 'ia'], ['Intel Xeon W-2400', 'DDR5 ECC, jusqu’à 2 To', 'SSD M.2 NVMe', 'NVIDIA RTX professionnelle (jusqu’à RTX 6000 Ada)', WS, W11P]),
  d('dell-precision-7960-tower', 'Dell', 'Dell Precision 7960 Tower', 'Precision Tower', 2023, 0, ['pro', 'creation', 'ia'], ['Intel Xeon W-3400', 'DDR5 ECC, jusqu’à 4 To', 'SSD M.2 NVMe', 'Jusqu’à 4 × NVIDIA RTX 6000 Ada', WS, W11P]),
  d('dell-precision-7865-tower', 'Dell', 'Dell Precision 7865 Tower', 'Precision Tower', 2022, 0, ['pro', 'creation', 'ia'], ['AMD Ryzen Threadripper PRO 5000 WX', 'DDR4 ECC, jusqu’à 1 To', 'SSD M.2 NVMe', 'NVIDIA RTX professionnelle (selon config)', WS, W11P]),

  // ─── Dell XPS Desktop ──────────────────────────────────────────────────────
  d('dell-xps-8700', 'Dell', 'Dell XPS 8700', 'XPS Desktop', 2013, 0, ['bureautique', 'gaming'], ['Intel Core i5 / i7 4e gén.', 'DDR3, jusqu’à 32 Go', 'Disque dur 1 ou 2 To', 'NVIDIA GeForce ou AMD Radeon (selon config)', TOUR, W7]),
  d('dell-xps-8900', 'Dell', 'Dell XPS 8900', 'XPS Desktop', 2015, 0, ['bureautique', 'gaming'], ['Intel Core i5 / i7 6e gén.', 'DDR4, jusqu’à 64 Go', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX ou AMD Radeon (selon config)', TOUR, W10]),
  d('dell-xps-8920', 'Dell', 'Dell XPS 8920', 'XPS Desktop', 2017, 0, ['gaming', 'creation'], ['Intel Core i5 / i7 7e gén.', 'DDR4, jusqu’à 64 Go', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX 10 ou AMD Radeon RX (selon config)', TOUR, W10]),
  d('dell-xps-8930', 'Dell', 'Dell XPS 8930', 'XPS Desktop', 2018, 0, ['gaming', 'creation'], ['Intel Core i5 / i7 / i9 8e ou 9e gén.', 'DDR4, jusqu’à 64 Go', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX 10 / RTX 20 (selon config)', TOUR, W10]),
  d('dell-xps-8940', 'Dell', 'Dell XPS 8940', 'XPS Desktop', 2020, 0, ['gaming', 'creation'], ['Intel Core i5 / i7 / i9 10e ou 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce GTX 16 / RTX 30 (selon config)', TOUR, W10]),
  d('dell-xps-8950', 'Dell', 'Dell XPS Desktop 8950', 'XPS Desktop', 2022, 0, ['gaming', 'creation'], ['Intel Core i5 / i7 / i9 12e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'Jusqu’à NVIDIA GeForce RTX 3080 Ti', TOUR, W11]),
  d('dell-xps-8960', 'Dell', 'Dell XPS Desktop 8960', 'XPS Desktop', 2023, 0, ['gaming', 'creation', 'ia'], ['Intel Core i5 / i7 / i9 13e ou 14e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'Jusqu’à NVIDIA GeForce RTX 4090', TOUR, W11]),

  // ─── Alienware ─────────────────────────────────────────────────────────────
  d('alienware-alpha', 'Alienware', 'Alienware Alpha', 'Alienware Alpha', 2014, 549, ['gaming'], ['Intel Core i3 / i5 / i7 4e gén.', '4 ou 8 Go DDR3L', 'Disque dur 500 Go à 2 To', 'NVIDIA GeForce GTX 860M (2 Go)', 'Mini PC (format console)', 'Windows 8.1 / SteamOS']),
  d('alienware-aurora-r5', 'Alienware', 'Alienware Aurora R5', 'Alienware Aurora', 2016, 0, ['gaming'], ['Intel Core i5 / i7 6e gén.', 'DDR4, jusqu’à 32 Go', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX 10 ou AMD Radeon RX (selon config)', TOUR, W10]),
  d('alienware-aurora-r7', 'Alienware', 'Alienware Aurora R7', 'Alienware Aurora', 2018, 0, ['gaming'], ['Intel Core i5 / i7 8e gén.', 'DDR4, jusqu’à 64 Go', 'SSD et / ou disque dur', 'Jusqu’à NVIDIA GeForce GTX 1080 Ti (RTX 20 ensuite)', TOUR, W10]),
  d('alienware-aurora-r8', 'Alienware', 'Alienware Aurora R8', 'Alienware Aurora', 2019, 0, ['gaming'], ['Intel Core i5 / i7 / i9 9e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe et / ou disque dur', 'Jusqu’à NVIDIA GeForce RTX 2080 Ti', TOUR, W10]),
  d('alienware-aurora-r10-ryzen', 'Alienware', 'Alienware Aurora R10 Ryzen Edition', 'Alienware Aurora', 2020, 0, ['gaming'], ['AMD Ryzen 3000 / 5000', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce RTX 30 ou AMD Radeon RX 6000 (selon config)', TOUR, W10]),
  d('alienware-aurora-r11', 'Alienware', 'Alienware Aurora R11', 'Alienware Aurora', 2020, 0, ['gaming'], ['Intel Core i5 / i7 / i9 10e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce RTX 20 / 30 (selon config)', TOUR, W10]),
  d('alienware-aurora-r12', 'Alienware', 'Alienware Aurora R12', 'Alienware Aurora', 2021, 0, ['gaming'], ['Intel Core i5 / i7 / i9 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce RTX 30 (selon config)', TOUR, W10]),
  d('alienware-aurora-r13', 'Alienware', 'Alienware Aurora R13', 'Alienware Aurora', 2021, 0, ['gaming'], ['Intel Core i5 / i7 / i9 12e gén.', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce RTX 30 (selon config)', TOUR, W11]),
  d('alienware-aurora-r14', 'Alienware', 'Alienware Aurora R14', 'Alienware Aurora', 2022, 0, ['gaming'], ['AMD Ryzen 5000 (dont Ryzen 7 5800X3D)', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe et / ou disque dur', 'NVIDIA GeForce RTX 30 ou AMD Radeon RX 6000 (selon config)', TOUR, W11]),
  d('alienware-aurora-r15', 'Alienware', 'Alienware Aurora R15', 'Alienware Aurora', 2022, 0, ['gaming', 'ia'], ['Intel Core i5 / i7 / i9 13e gén.', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Jusqu’à NVIDIA GeForce RTX 4090', TOUR, W11]),
  d('alienware-aurora-r15-amd', 'Alienware', 'Alienware Aurora R15 AMD', 'Alienware Aurora', 2023, 0, ['gaming', 'ia'], ['AMD Ryzen 7000', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Jusqu’à NVIDIA GeForce RTX 4090 ou AMD Radeon RX 7900 XTX', TOUR, W11]),
  d('alienware-aurora-r16', 'Alienware', 'Alienware Aurora R16', 'Alienware Aurora', 2023, 0, ['gaming', 'ia'], ['Intel Core i5 / i7 / i9 13e ou 14e gén.', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Jusqu’à NVIDIA GeForce RTX 4090', TOUR, W11]),
  d('alienware-aurora-2025', 'Alienware', 'Alienware Aurora (2025)', 'Alienware Aurora', 2025, 0, ['gaming', 'ia'], ['Intel Core Ultra 7 / Ultra 9 (série 200)', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 50 (selon config)', TOUR, W11], false),
  d('alienware-area-51-r2', 'Alienware', 'Alienware Area-51 R2', 'Alienware Area-51', 2017, 0, ['gaming', 'creation'], ['Intel Core i7 / i9 X-series', 'DDR4, jusqu’à 64 Go', 'SSD et / ou disque dur', 'Jusqu’à 2 × NVIDIA GeForce GTX 1080 Ti (SLI)', TOUR, W10]),
  d('alienware-area-51-2025', 'Alienware', 'Alienware Area-51 (2025)', 'Alienware Area-51', 2025, 0, ['gaming', 'ia', 'creation'], ['Intel Core Ultra 7 265K / Ultra 9 285K', 'DDR5', 'SSD M.2 NVMe', 'Jusqu’à NVIDIA GeForce RTX 5090', TOUR, W11], false),

  // ─── Dell Inspiron, Vostro et G5 ───────────────────────────────────────────
  d('dell-inspiron-3880', 'Dell', 'Dell Inspiron 3880', 'Inspiron Desktop', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 630 (GPU dédié en option)', TOUR, W10]),
  d('dell-inspiron-3891', 'Dell', 'Dell Inspiron 3891', 'Inspiron Desktop', 2021, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 10e ou 11e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics (GPU dédié en option)', TOUR, W10]),
  d('dell-inspiron-3910', 'Dell', 'Dell Inspiron 3910', 'Inspiron Desktop', 2022, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 730 / 770 (GPU dédié en option)', TOUR, W11]),
  d('dell-inspiron-3020-desktop', 'Dell', 'Dell Inspiron 3020 Desktop', 'Inspiron Desktop', 2023, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 13e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics (GPU dédié en option)', TOUR, W11]),
  d('dell-inspiron-24-5490-aio', 'Dell', 'Dell Inspiron 24 5490 All-in-One', 'Inspiron AIO', 2019, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics (GeForce MX en option)', `${T} 23,8 pouces`, W10]),
  d('dell-inspiron-27-7790-aio', 'Dell', 'Dell Inspiron 27 7790 All-in-One', 'Inspiron AIO', 2019, 0, ['bureautique', 'creation'], ['Intel Core i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics (GeForce MX en option)', `${T} 27 pouces`, W10]),
  d('dell-inspiron-24-5410-aio', 'Dell', 'Dell Inspiron 24 5410 All-in-One', 'Inspiron AIO', 2021, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 11e gén.', 'DDR4', 'SSD M.2', 'Intel UHD / Iris Xe (GeForce MX en option)', `${T} 23,8 pouces`, W10]),
  d('dell-inspiron-24-5420-aio', 'Dell', 'Dell Inspiron 24 5420 All-in-One', 'Inspiron AIO', 2022, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4', 'SSD M.2', 'Intel UHD / Iris Xe (GeForce MX en option)', `${T} 23,8 pouces`, W11]),
  d('dell-inspiron-27-7710-aio', 'Dell', 'Dell Inspiron 27 7710 All-in-One', 'Inspiron AIO', 2021, 0, ['bureautique', 'creation'], ['Intel Core i5 / i7 11e gén.', 'DDR4', 'SSD M.2', 'Intel Iris Xe (GeForce MX en option)', `${T} 27 pouces`, W10]),
  d('dell-vostro-3470-sff', 'Dell', 'Dell Vostro 3470 SFF', 'Vostro Desktop', 2018, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 8e ou 9e gén.', 'DDR4', 'SSD et / ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-vostro-3888', 'Dell', 'Dell Vostro 3888', 'Vostro Desktop', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 630', TOUR, W10P]),
  d('dell-vostro-3910', 'Dell', 'Dell Vostro 3910', 'Vostro Desktop', 2022, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 730 / 770', TOUR, W11P]),
  d('dell-vostro-3020-tower', 'Dell', 'Dell Vostro 3020 Tower', 'Vostro Desktop', 2023, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 13e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 730 / 770', TOUR, W11P]),
  d('dell-g5-5090', 'Dell', 'Dell G5 5090', 'Dell G5 Desktop', 2019, 0, ['gaming', 'budget'], ['Intel Core i5 / i7 9e gén.', 'DDR4', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX 16 / RTX 20 (selon config)', TOUR, W10]),
  d('dell-g5-5000', 'Dell', 'Dell G5 5000', 'Dell G5 Desktop', 2020, 0, ['gaming', 'budget'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'NVIDIA GeForce GTX 16 / RTX 20 / RTX 30 (selon config)', TOUR, W10]),

  // ─── ASUS ──────────────────────────────────────────────────────────────────
  d('asus-rog-strix-g10dk', 'ASUS', 'ASUS ROG Strix G10DK', 'ROG Strix Desktop', 2020, 0, ['gaming', 'budget'], ['AMD Ryzen 5 3600 / Ryzen 7 3700X', 'DDR4', 'SSD M.2 et / ou disque dur', 'NVIDIA GeForce GTX 16 / RTX 20 (selon config)', TOUR, W10]),
  d('asus-rog-strix-g15dk', 'ASUS', 'ASUS ROG Strix G15DK', 'ROG Strix Desktop', 2020, 0, ['gaming'], ['AMD Ryzen 7 / Ryzen 9 (3000 ou 5000)', 'DDR4', 'SSD M.2 et / ou disque dur', 'NVIDIA GeForce RTX 20 / RTX 30 (selon config)', TOUR, W10]),
  d('asus-rog-strix-gt15', 'ASUS', 'ASUS ROG Strix GT15', 'ROG Strix Desktop', 2019, 0, ['gaming'], ['Intel Core i7 / i9 9e ou 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'NVIDIA GeForce RTX 20 (selon config)', TOUR, W10]),
  d('asus-rog-strix-g15cf', 'ASUS', 'ASUS ROG Strix G15CF', 'ROG Strix Desktop', 2022, 0, ['gaming'], ['Intel Core i5 / i7 12e gén.', 'DDR4', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 (selon config)', TOUR, W11]),
  d('asus-rog-strix-g35cz', 'ASUS', 'ASUS ROG Strix G35CZ', 'ROG Strix Desktop', 2022, 0, ['gaming'], ['Intel Core i7 / i9 12e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 (selon config)', TOUR, W11]),
  d('asus-rog-strix-g16ch', 'ASUS', 'ASUS ROG Strix G16CH', 'ROG Strix Desktop', 2023, 0, ['gaming'], ['Intel Core i5 / i7 / i9 13e ou 14e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 40 (selon config)', TOUR, W11]),
  d('asus-rog-strix-g22ch', 'ASUS', 'ASUS ROG Strix G22CH', 'ROG Strix Desktop', 2023, 0, ['gaming'], ['Intel Core i5 / i7 / i9 13e ou 14e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 40 (selon config)', 'Compact', W11]),
  d('asus-rog-nuc-2024', 'ASUS', 'ASUS ROG NUC (2024)', 'ROG NUC', 2024, 0, ['gaming'], ['Intel Core Ultra 7 155H / Ultra 9 185H', 'DDR5 SO-DIMM', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 4060 / 4070 Laptop', MINI, W11]),
  d('asus-expertcenter-pn41', 'ASUS', 'ASUS ExpertCenter PN41', 'ExpertCenter PN', 2021, 0, ['bureautique', 'budget'], ['Intel Celeron N4500 / N5100 ou Pentium Silver N6000', 'DDR4 SO-DIMM', 'SSD M.2 ou 2,5 pouces', 'Intel UHD Graphics', MINI, '']),
  d('asus-mini-pc-pn50', 'ASUS', 'ASUS Mini PC PN50', 'ExpertCenter PN', 2020, 0, ['bureautique', 'homelab'], ['AMD Ryzen 4000U (Ryzen 3 à Ryzen 7)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe + 2,5 pouces', 'AMD Radeon Graphics', MINI, '']),
  d('asus-expertcenter-pn51', 'ASUS', 'ASUS ExpertCenter PN51', 'ExpertCenter PN', 2021, 0, ['bureautique', 'homelab'], ['AMD Ryzen 5000U (Ryzen 3 à Ryzen 7)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe + 2,5 pouces', 'AMD Radeon Graphics', MINI, '']),
  d('asus-expertcenter-pn64', 'ASUS', 'ASUS ExpertCenter PN64', 'ExpertCenter PN', 2022, 0, ['bureautique', 'homelab'], ['Intel Core i3 / i5 / i7 12e gén. (H)', 'DDR5 SO-DIMM', 'SSD M.2 NVMe + 2,5 pouces', 'Intel Iris Xe / UHD Graphics', MINI, '']),

  // ─── MSI ───────────────────────────────────────────────────────────────────
  d('msi-trident-3', 'MSI', 'MSI Trident 3', 'MSI Trident', 2017, 0, ['gaming'], ['Intel Core i5 / i7 7e gén.', 'DDR4 SO-DIMM', 'SSD M.2 + disque dur', 'NVIDIA GeForce GTX 1060 / 1070', 'Compact (format console)', W10]),
  d('msi-trident-x', 'MSI', 'MSI Trident X', 'MSI Trident', 2019, 0, ['gaming'], ['Intel Core i7-9700K / i9-9900K', 'DDR4', 'SSD M.2 + disque dur', 'Jusqu’à NVIDIA GeForce RTX 2080 Ti', 'Compact', W10]),
  d('msi-mpg-trident-as-11th', 'MSI', 'MSI MPG Trident AS 11th', 'MSI Trident', 2021, 0, ['gaming'], ['Intel Core i5 / i7 11e gén.', 'DDR4', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 (selon config)', 'Compact', W10]),
  d('msi-meg-trident-x2', 'MSI', 'MSI MEG Trident X2', 'MSI Trident', 2023, 0, ['gaming', 'ia'], ['Intel Core i9 13e ou 14e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 4080 / 4090', 'Compact', W11]),
  d('msi-infinite-x', 'MSI', 'MSI Infinite X', 'MSI Infinite', 2018, 0, ['gaming'], ['Intel Core i7 8e gén.', 'DDR4', 'SSD M.2 + disque dur', 'NVIDIA GeForce GTX 1070 / 1080 / 1080 Ti', TOUR, W10]),
  d('msi-mag-infinite-s3', 'MSI', 'MSI MAG Infinite S3', 'MSI Infinite', 2023, 0, ['gaming', 'budget'], ['Intel Core i5 / i7 13e ou 14e gén.', 'DDR4 / DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 / 40 (selon config)', TOUR, W11]),
  d('msi-meg-aegis-ti5', 'MSI', 'MSI MEG Aegis Ti5', 'MSI Aegis', 2021, 0, ['gaming'], ['Intel Core i9-10900K / i9-11900K', 'DDR4', 'SSD M.2 NVMe + disque dur', 'NVIDIA GeForce RTX 3080 / 3090', TOUR, W10]),
  d('msi-cubi-5-10m', 'MSI', 'MSI Cubi 5 10M', 'MSI Cubi', 2020, 0, ['bureautique', 'homelab'], ['Intel Core i3 / i5 / i7 10e gén. (U)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 + 2,5 pouces', 'Intel UHD Graphics', MINI, '']),
  d('msi-cubi-n-jsl', 'MSI', 'MSI Cubi N JSL', 'MSI Cubi', 2021, 0, ['bureautique', 'budget'], ['Intel Celeron N4500 ou Pentium Silver N6000', 'DDR4 SO-DIMM', 'SSD M.2 ou 2,5 pouces', 'Intel UHD Graphics', 'Mini PC fanless', '']),
  d('msi-pro-dp21-12m', 'MSI', 'MSI PRO DP21 12M', 'MSI PRO', 2022, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4 SO-DIMM', 'SSD M.2 NVMe + 2,5 pouces', 'Intel UHD Graphics 730 / 770', MINI, W11P]),

  // ─── Acer ──────────────────────────────────────────────────────────────────
  d('acer-predator-orion-9000', 'Acer', 'Acer Predator Orion 9000', 'Predator Orion', 2017, 0, ['gaming', 'creation'], ['Intel Core i7 / i9 X-series (jusqu’à 18 cœurs)', 'DDR4, jusqu’à 128 Go', 'SSD + disques durs', 'Jusqu’à 2 × NVIDIA GeForce GTX 1080 Ti', TOUR, W10]),
  d('acer-predator-orion-3000-po3-620', 'Acer', 'Acer Predator Orion 3000 PO3-620', 'Predator Orion', 2020, 0, ['gaming'], ['Intel Core i5 / i7 10e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'NVIDIA GeForce GTX 16 / RTX 20 / RTX 30 (selon config)', TOUR, W10]),
  d('acer-predator-orion-3000-po3-640', 'Acer', 'Acer Predator Orion 3000 PO3-640', 'Predator Orion', 2022, 0, ['gaming'], ['Intel Core i5 / i7 12e gén.', 'DDR4 / DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 (selon config)', TOUR, W11]),
  d('acer-predator-orion-7000-po7-640', 'Acer', 'Acer Predator Orion 7000 PO7-640', 'Predator Orion', 2022, 0, ['gaming', 'ia'], ['Intel Core i7 / i9 12e gén.', 'DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 30 / 40 (selon config)', TOUR, W11]),
  d('acer-nitro-n50-600', 'Acer', 'Acer Nitro N50-600', 'Nitro Desktop', 2019, 0, ['gaming', 'budget'], ['Intel Core i5 / i7 8e ou 9e gén.', 'DDR4', 'SSD et / ou disque dur', 'NVIDIA GeForce GTX (selon config)', TOUR, W10]),
  d('acer-nitro-n50-640', 'Acer', 'Acer Nitro N50-640', 'Nitro Desktop', 2022, 0, ['gaming', 'budget'], ['Intel Core i5 / i7 12e gén.', 'DDR4', 'SSD M.2 NVMe', 'NVIDIA GeForce GTX 16 / RTX 30 (selon config)', TOUR, W11]),
  d('acer-aspire-tc-1760', 'Acer', 'Acer Aspire TC-1760', 'Aspire Desktop', 2022, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4', 'SSD M.2 et / ou disque dur', 'Intel UHD Graphics 730 / 770', TOUR, W11]),
  d('acer-aspire-c24-1700', 'Acer', 'Acer Aspire C24-1700', 'Aspire AIO', 2022, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 12e gén. (U)', 'DDR4', 'SSD M.2', 'Intel UHD / Iris Xe Graphics', `${T} 23,8 pouces`, W11]),

  // ─── ASRock (barebones compacts) ───────────────────────────────────────────
  d('asrock-deskmini-310', 'ASRock', 'ASRock DeskMini 310', 'DeskMini', 2018, 0, ['homelab', 'bureautique'], ['Socket Intel LGA1151 (Core 8e / 9e gén., chipset H310)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'M.2 NVMe + 2 × 2,5 pouces', 'Graphiques intégrés Intel', BARE, '']),
  d('asrock-deskmini-a300', 'ASRock', 'ASRock DeskMini A300', 'DeskMini', 2019, 0, ['homelab', 'bureautique'], ['Socket AMD AM4 (APU Ryzen 2000G / 3000G / 4000G / 5000G)', 'DDR4 SO-DIMM, jusqu’à 32 Go', '2 × M.2 NVMe + 2 × 2,5 pouces', 'Graphiques intégrés de l’APU', BARE, '']),
  d('asrock-deskmini-x300', 'ASRock', 'ASRock DeskMini X300', 'DeskMini', 2021, 0, ['homelab', 'bureautique'], ['Socket AMD AM4 (APU Ryzen jusqu’à 5000G)', 'DDR4 SO-DIMM, jusqu’à 64 Go', '2 × M.2 NVMe + 2 × 2,5 pouces', 'Graphiques intégrés de l’APU', BARE, '']),
  d('asrock-deskmini-b660', 'ASRock', 'ASRock DeskMini B660', 'DeskMini', 2022, 0, ['homelab', 'bureautique'], ['Socket Intel LGA1700 (Core 12e à 14e gén.)', 'DDR4 SO-DIMM, jusqu’à 64 Go', '2 × M.2 NVMe + 2 × 2,5 pouces', 'Graphiques intégrés Intel', BARE, '']),
  d('asrock-deskmeet-x300', 'ASRock', 'ASRock DeskMeet X300', 'DeskMeet', 2022, 0, ['homelab', 'gaming'], ['Socket AMD AM4 (Ryzen 5000 / APU 5000G)', 'DDR4, 4 emplacements, jusqu’à 128 Go', 'M.2 NVMe + baies 3,5 / 2,5 pouces', 'Emplacement PCIe x16 pour carte graphique', 'Barebone compact (8 L)', '']),

  // ─── Zotac ─────────────────────────────────────────────────────────────────
  d('zotac-zbox-ci329-nano', 'Zotac', 'Zotac ZBOX CI329 nano', 'ZBOX nano', 2019, 0, ['bureautique', 'budget'], ['Intel Celeron N4100', 'DDR4 SO-DIMM', 'SSD / disque 2,5 pouces', 'Intel UHD Graphics 600', 'Mini PC fanless', '']),
  d('zotac-zbox-ci331-nano', 'Zotac', 'Zotac ZBOX CI331 nano', 'ZBOX nano', 2021, 0, ['bureautique', 'budget'], ['Intel Celeron N5100', 'DDR4 SO-DIMM', 'SSD / disque 2,5 pouces', 'Intel UHD Graphics', 'Mini PC fanless', '']),
  d('zotac-zbox-magnus-one-ecm73070c', 'Zotac', 'Zotac ZBOX MAGNUS ONE ECM73070C', 'ZBOX MAGNUS', 2020, 0, ['gaming'], ['Intel Core i7-10700', 'DDR4 SO-DIMM', 'SSD M.2 + 2,5 pouces', 'NVIDIA GeForce RTX 3070', 'Compact', '']),
  d('zotac-zbox-magnus-en173070c', 'Zotac', 'Zotac ZBOX MAGNUS EN173070C', 'ZBOX MAGNUS', 2021, 0, ['gaming'], ['Intel Core i7-11800H', 'DDR4 SO-DIMM', 'SSD M.2 + 2,5 pouces', 'NVIDIA GeForce RTX 3070 Laptop', MINI, '']),

  // ─── Microsoft Surface Studio ──────────────────────────────────────────────
  d('microsoft-surface-studio', 'Microsoft', 'Microsoft Surface Studio', 'Surface Studio', 2016, 0, ['creation', 'pro'], ['Intel Core i5-6440HQ / i7-6820HQ', '8 à 32 Go DDR4', 'Disque hybride 1 ou 2 To', 'NVIDIA GeForce GTX 965M / 980M', `${T} 28 pouces tactile`, W10P]),
  d('microsoft-surface-studio-2', 'Microsoft', 'Microsoft Surface Studio 2', 'Surface Studio', 2018, 0, ['creation', 'pro'], ['Intel Core i7-7820HQ', '16 ou 32 Go DDR4', 'SSD 1 ou 2 To', 'NVIDIA GeForce GTX 1060 / 1070', `${T} 28 pouces tactile`, W10P]),
  d('microsoft-surface-studio-2-plus', 'Microsoft', 'Microsoft Surface Studio 2+', 'Surface Studio', 2022, 0, ['creation', 'pro'], ['Intel Core i7-11370H', '32 Go LPDDR4x', 'SSD 1 To', 'NVIDIA GeForce RTX 3060 Laptop', `${T} 28 pouces tactile`, W11P]),

  // ─── Corsair One ───────────────────────────────────────────────────────────
  d('corsair-one-i160', 'Corsair', 'Corsair One i160', 'Corsair One', 2019, 0, ['gaming', 'creation'], ['Intel Core i9-9900K', '32 Go DDR4', 'SSD M.2 NVMe + disque dur', 'NVIDIA GeForce RTX 2080 Ti', 'Compact (refroidissement liquide)', W10]),
  d('corsair-one-i300', 'Corsair', 'Corsair One i300', 'Corsair One', 2022, 0, ['gaming', 'creation'], ['Intel Core i9-12900K', '64 Go DDR5', 'SSD M.2 NVMe', 'NVIDIA GeForce RTX 3080 Ti', 'Compact (refroidissement liquide)', W11]),
];
