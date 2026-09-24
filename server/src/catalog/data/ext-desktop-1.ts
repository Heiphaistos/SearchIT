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
const W10P = 'Windows 10 Pro';
const W11P = 'Windows 11 Pro';
const MAC = 'macOS';
const T = 'Tout-en-un';
const MINI = 'Mini PC';
const SFF = 'SFF (petit format)';
const MICRO = 'Micro (ultra-compact)';
const TOUR = 'Tour';

/**
 * Catalogue de référence : ordinateurs de bureau Apple (iMac, Mac mini, Mac Pro) et Dell OptiPlex.
 * Les variantes Apple correspondent aux configurations standard vendues en France.
 */
export const PRODUCTS: CatalogProduct[] = [
  // ─── Apple iMac Intel ──────────────────────────────────────────────────────
  d('apple-imac-21-5-fin-2012', 'Apple', 'Apple iMac 21,5 pouces (fin 2012)', 'iMac Intel', 2012, 1349, ['bureautique'], ['Intel Core i5 quadricœur 2,7 ou 2,9 GHz (Ivy Bridge)', '8 Go DDR3', 'Disque dur 1 To (Fusion Drive en option)', 'NVIDIA GeForce GT 640M / GT 650M', `${T} 21,5 pouces`, MAC]),
  d('apple-imac-27-fin-2012', 'Apple', 'Apple iMac 27 pouces (fin 2012)', 'iMac Intel', 2012, 1879, ['bureautique', 'creation'], ['Intel Core i5 quadricœur 2,9 ou 3,2 GHz (i7 3,4 GHz en option)', '8 Go DDR3 (jusqu’à 32 Go)', 'Disque dur 1 To (Fusion Drive en option)', 'NVIDIA GeForce GTX 660M / GTX 675MX', `${T} 27 pouces`, MAC]),
  d('apple-imac-21-5-fin-2013', 'Apple', 'Apple iMac 21,5 pouces (fin 2013)', 'iMac Intel', 2013, 1349, ['bureautique'], ['Intel Core i5 quadricœur 2,7 ou 2,9 GHz (Haswell)', '8 Go DDR3', 'Disque dur 1 To (Fusion Drive en option)', 'Intel Iris Pro 5200 / NVIDIA GeForce GT 750M', `${T} 21,5 pouces`, MAC]),
  d('apple-imac-27-fin-2013', 'Apple', 'Apple iMac 27 pouces (fin 2013)', 'iMac Intel', 2013, 1879, ['bureautique', 'creation'], ['Intel Core i5 quadricœur 3,2 ou 3,4 GHz (Haswell)', '8 Go DDR3 (jusqu’à 32 Go)', 'Disque dur 1 To (Fusion Drive en option)', 'NVIDIA GeForce GT 755M / GTX 775M', `${T} 27 pouces`, MAC]),
  d('apple-imac-21-5-mi-2014', 'Apple', 'Apple iMac 21,5 pouces (mi-2014)', 'iMac Intel', 2014, 1099, ['bureautique', 'budget'], ['Intel Core i5 double cœur 1,4 GHz', '8 Go LPDDR3', 'Disque dur 500 Go', 'Intel HD Graphics 5000', `${T} 21,5 pouces`, MAC]),
  d('apple-imac-27-retina-5k-fin-2014', 'Apple', 'Apple iMac 27 pouces Retina 5K (fin 2014)', 'iMac Intel', 2014, 2599, ['creation'], ['Intel Core i5 quadricœur 3,5 GHz (i7 4 GHz en option)', '8 Go DDR3 (jusqu’à 32 Go)', 'Fusion Drive 1 To', 'AMD Radeon R9 M290X (M295X en option)', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-27-retina-5k-mi-2015', 'Apple', 'Apple iMac 27 pouces Retina 5K (mi-2015)', 'iMac Intel', 2015, 0, ['creation'], ['Intel Core i5 quadricœur 3,3 GHz', '8 Go DDR3', 'Disque dur 1 To', 'AMD Radeon R9 M290', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-21-5-fin-2015', 'Apple', 'Apple iMac 21,5 pouces (fin 2015)', 'iMac Intel', 2015, 1249, ['bureautique'], ['Intel Core i5 1,6 GHz double cœur ou 2,8 GHz quadricœur', '8 Go LPDDR3', 'Disque dur 1 To', 'Intel HD Graphics 6000 / Iris Pro 6200', `${T} 21,5 pouces`, MAC]),
  d('apple-imac-21-5-retina-4k-fin-2015', 'Apple', 'Apple iMac 21,5 pouces Retina 4K (fin 2015)', 'iMac Intel', 2015, 1549, ['bureautique', 'creation'], ['Intel Core i5 quadricœur 3,1 GHz', '8 Go LPDDR3', 'Disque dur 1 To (Fusion Drive en option)', 'Intel Iris Pro 6200', `${T} 21,5 pouces 4K`, MAC]),
  d('apple-imac-27-retina-5k-fin-2015', 'Apple', 'Apple iMac 27 pouces Retina 5K (fin 2015)', 'iMac Intel', 2015, 2099, ['creation'], ['Intel Core i5 quadricœur 3,2 ou 3,3 GHz (Skylake, i7 4 GHz en option)', '8 Go DDR3L (jusqu’à 64 Go)', 'Disque dur 1 To ou Fusion Drive', 'AMD Radeon R9 M380 / M390 / M395', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-21-5-2017', 'Apple', 'Apple iMac 21,5 pouces (2017)', 'iMac Intel', 2017, 1299, ['bureautique', 'budget'], ['Intel Core i5 double cœur 2,3 GHz', '8 Go LPDDR3', 'Disque dur 1 To', 'Intel Iris Plus Graphics 640', `${T} 21,5 pouces`, MAC]),
  d('apple-imac-21-5-retina-4k-2017', 'Apple', 'Apple iMac 21,5 pouces Retina 4K (2017)', 'iMac Intel', 2017, 1499, ['bureautique', 'creation'], ['Intel Core i5 quadricœur 3,0 ou 3,4 GHz (Kaby Lake)', '8 Go DDR4', 'Disque dur 1 To ou Fusion Drive', 'AMD Radeon Pro 555 / 560', `${T} 21,5 pouces 4K`, MAC]),
  d('apple-imac-27-retina-5k-2017', 'Apple', 'Apple iMac 27 pouces Retina 5K (2017)', 'iMac Intel', 2017, 2199, ['creation'], ['Intel Core i5 quadricœur 3,4 / 3,5 / 3,8 GHz (i7 4,2 GHz en option)', '8 Go DDR4 (jusqu’à 64 Go)', 'Fusion Drive 1 ou 2 To', 'AMD Radeon Pro 570 / 575 / 580', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-pro-2017', 'Apple', 'Apple iMac Pro (2017)', 'iMac Pro', 2017, 5499, ['creation', 'pro'], ['Intel Xeon W 8 cœurs 3,2 GHz (10, 14 ou 18 cœurs en option)', '32 Go DDR4 ECC (jusqu’à 256 Go)', 'SSD 1 à 4 To', 'AMD Radeon Pro Vega 56 / Vega 64', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-21-5-retina-4k-2019', 'Apple', 'Apple iMac 21,5 pouces Retina 4K (2019)', 'iMac Intel', 2019, 1499, ['bureautique', 'creation'], ['Intel Core i3 quadricœur 3,6 GHz ou Core i5 6 cœurs 3,0 GHz', '8 Go DDR4', 'Disque dur 1 To ou Fusion Drive', 'AMD Radeon Pro 555X / 560X', `${T} 21,5 pouces 4K`, MAC]),
  d('apple-imac-27-retina-5k-2019', 'Apple', 'Apple iMac 27 pouces Retina 5K (2019)', 'iMac Intel', 2019, 2099, ['creation'], ['Intel Core i5 6 cœurs 3,0 / 3,1 / 3,7 GHz (i9 8 cœurs en option)', '8 Go DDR4 (jusqu’à 64 Go)', 'Fusion Drive 1 ou 2 To', 'AMD Radeon Pro 570X / 575X / 580X (Vega 48 en option)', `${T} 27 pouces 5K`, MAC]),
  d('apple-imac-27-retina-5k-2020', 'Apple', 'Apple iMac 27 pouces Retina 5K (2020)', 'iMac Intel', 2020, 2099, ['creation', 'pro'], ['Intel Core i5 6 cœurs 3,1 / 3,3 GHz ou i7 8 cœurs 3,8 GHz (i9 10 cœurs en option)', '8 Go DDR4 (jusqu’à 128 Go)', 'SSD 256 Go à 8 To', 'AMD Radeon Pro 5300 / 5500 XT (5700 / 5700 XT en option)', `${T} 27 pouces 5K`, MAC]),

  // ─── Apple iMac 24 pouces : configurations standard ───────────────────────
  d('apple-imac-24-m1-7-gpu-8-256', 'Apple', 'Apple iMac 24" M1 (2021) GPU 7 cœurs 8 Go 256 Go', 'iMac Apple Silicon', 2021, 1449, ['bureautique', 'etudiant'], ['Apple M1 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M1 GPU 7 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m1-8-gpu-8-256', 'Apple', 'Apple iMac 24" M1 (2021) GPU 8 cœurs 8 Go 256 Go', 'iMac Apple Silicon', 2021, 1699, ['bureautique', 'creation'], ['Apple M1 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M1 GPU 8 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m1-8-gpu-8-512', 'Apple', 'Apple iMac 24" M1 (2021) GPU 8 cœurs 8 Go 512 Go', 'iMac Apple Silicon', 2021, 1929, ['bureautique', 'creation'], ['Apple M1 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 512 Go', 'Apple M1 GPU 8 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m3-8-gpu-8-256', 'Apple', 'Apple iMac 24" M3 (2023) GPU 8 cœurs 8 Go 256 Go', 'iMac Apple Silicon', 2023, 1599, ['bureautique', 'etudiant'], ['Apple M3 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M3 GPU 8 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m3-10-gpu-8-256', 'Apple', 'Apple iMac 24" M3 (2023) GPU 10 cœurs 8 Go 256 Go', 'iMac Apple Silicon', 2023, 1829, ['bureautique', 'creation'], ['Apple M3 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M3 GPU 10 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m3-10-gpu-8-512', 'Apple', 'Apple iMac 24" M3 (2023) GPU 10 cœurs 8 Go 512 Go', 'iMac Apple Silicon', 2023, 2059, ['bureautique', 'creation'], ['Apple M3 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 512 Go', 'Apple M3 GPU 10 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m4-8-gpu-16-256', 'Apple', 'Apple iMac 24" M4 (2024) CPU 8 cœurs 16 Go 256 Go', 'iMac Apple Silicon', 2024, 1529, ['bureautique', 'etudiant'], ['Apple M4 (CPU 8 cœurs)', '16 Go unifiée', 'SSD 256 Go', 'Apple M4 GPU 8 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m4-10-gpu-16-256', 'Apple', 'Apple iMac 24" M4 (2024) CPU 10 cœurs 16 Go 256 Go', 'iMac Apple Silicon', 2024, 1759, ['bureautique', 'creation'], ['Apple M4 (CPU 10 cœurs)', '16 Go unifiée', 'SSD 256 Go', 'Apple M4 GPU 10 cœurs', `${T} 24 pouces 4,5K`, MAC]),
  d('apple-imac-24-m4-10-gpu-16-512', 'Apple', 'Apple iMac 24" M4 (2024) CPU 10 cœurs 16 Go 512 Go', 'iMac Apple Silicon', 2024, 1989, ['bureautique', 'creation'], ['Apple M4 (CPU 10 cœurs)', '16 Go unifiée', 'SSD 512 Go', 'Apple M4 GPU 10 cœurs', `${T} 24 pouces 4,5K`, MAC]),

  // ─── Apple Mac mini ────────────────────────────────────────────────────────
  d('apple-mac-mini-fin-2012-i5', 'Apple', 'Apple Mac mini (fin 2012) Core i5 2,5 GHz', 'Mac mini Intel', 2012, 629, ['bureautique', 'homelab'], ['Intel Core i5 double cœur 2,5 GHz', '4 Go DDR3 (jusqu’à 16 Go)', 'Disque dur 500 Go', 'Intel HD Graphics 4000', MINI, MAC]),
  d('apple-mac-mini-fin-2012-i7', 'Apple', 'Apple Mac mini (fin 2012) Core i7 2,3 GHz', 'Mac mini Intel', 2012, 0, ['bureautique', 'homelab'], ['Intel Core i7 quadricœur 2,3 GHz', '4 Go DDR3 (jusqu’à 16 Go)', 'Disque dur 1 To', 'Intel HD Graphics 4000', MINI, MAC]),
  d('apple-mac-mini-fin-2014-1-4', 'Apple', 'Apple Mac mini (fin 2014) Core i5 1,4 GHz', 'Mac mini Intel', 2014, 529, ['bureautique', 'budget'], ['Intel Core i5 double cœur 1,4 GHz', '4 Go LPDDR3 soudée', 'Disque dur 500 Go', 'Intel HD Graphics 5000', MINI, MAC]),
  d('apple-mac-mini-fin-2014-2-6', 'Apple', 'Apple Mac mini (fin 2014) Core i5 2,6 GHz', 'Mac mini Intel', 2014, 729, ['bureautique'], ['Intel Core i5 double cœur 2,6 GHz', '8 Go LPDDR3 soudée', 'Disque dur 1 To', 'Intel Iris Graphics 5100', MINI, MAC]),
  d('apple-mac-mini-fin-2014-2-8', 'Apple', 'Apple Mac mini (fin 2014) Core i5 2,8 GHz', 'Mac mini Intel', 2014, 1029, ['bureautique'], ['Intel Core i5 double cœur 2,8 GHz', '8 Go LPDDR3 soudée', 'Fusion Drive 1 To', 'Intel Iris Graphics 5100', MINI, MAC]),
  d('apple-mac-mini-2018-i3', 'Apple', 'Apple Mac mini (2018) Core i3 3,6 GHz', 'Mac mini Intel', 2018, 899, ['bureautique', 'homelab'], ['Intel Core i3 quadricœur 3,6 GHz', '8 Go DDR4 (jusqu’à 64 Go)', 'SSD 128 Go', 'Intel UHD Graphics 630', MINI, MAC]),
  d('apple-mac-mini-2018-i5', 'Apple', 'Apple Mac mini (2018) Core i5 3,0 GHz', 'Mac mini Intel', 2018, 1249, ['bureautique', 'creation'], ['Intel Core i5 6 cœurs 3,0 GHz (i7 3,2 GHz en option)', '8 Go DDR4 (jusqu’à 64 Go)', 'SSD 256 Go', 'Intel UHD Graphics 630', MINI, MAC]),
  d('apple-mac-mini-m1-8-256', 'Apple', 'Apple Mac mini M1 (2020) 8 Go 256 Go', 'Mac mini', 2020, 799, ['bureautique', 'etudiant'], ['Apple M1 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M1 GPU 8 cœurs', MINI, MAC]),
  d('apple-mac-mini-m2-8-256', 'Apple', 'Apple Mac mini M2 (2023) 8 Go 256 Go', 'Mac mini', 2023, 699, ['bureautique', 'etudiant'], ['Apple M2 (CPU 8 cœurs)', '8 Go unifiée', 'SSD 256 Go', 'Apple M2 GPU 10 cœurs', MINI, MAC]),
  d('apple-mac-mini-m4-16-256', 'Apple', 'Apple Mac mini M4 (2024) 16 Go 256 Go', 'Mac mini', 2024, 699, ['bureautique', 'etudiant'], ['Apple M4 (CPU 10 cœurs)', '16 Go unifiée', 'SSD 256 Go', 'Apple M4 GPU 10 cœurs', MINI, MAC]),
  d('apple-mac-mini-m4-16-512', 'Apple', 'Apple Mac mini M4 (2024) 16 Go 512 Go', 'Mac mini', 2024, 929, ['bureautique', 'creation'], ['Apple M4 (CPU 10 cœurs)', '16 Go unifiée', 'SSD 512 Go', 'Apple M4 GPU 10 cœurs', MINI, MAC]),
  d('apple-mac-mini-m4-24-512', 'Apple', 'Apple Mac mini M4 (2024) 24 Go 512 Go', 'Mac mini', 2024, 1159, ['creation', 'ia'], ['Apple M4 (CPU 10 cœurs)', '24 Go unifiée', 'SSD 512 Go', 'Apple M4 GPU 10 cœurs', MINI, MAC]),

  // ─── Apple Mac Pro ─────────────────────────────────────────────────────────
  d('apple-mac-pro-mi-2012', 'Apple', 'Apple Mac Pro (mi-2012)', 'Mac Pro', 2012, 0, ['creation', 'pro'], ['Intel Xeon quadricœur 3,2 GHz ou 2 × Xeon 6 cœurs 2,4 GHz', '6 à 12 Go DDR3 ECC', 'Disque dur 1 To', 'AMD Radeon HD 5770', `${TOUR} (station de travail)`, MAC]),
  d('apple-mac-pro-fin-2013', 'Apple', 'Apple Mac Pro (fin 2013)', 'Mac Pro', 2013, 0, ['creation', 'pro'], ['Intel Xeon E5 4 cœurs 3,7 GHz ou 6 cœurs 3,5 GHz (8 ou 12 cœurs en option)', '12 ou 16 Go DDR3 ECC (jusqu’à 64 Go)', 'SSD 256 Go à 1 To', '2 × AMD FirePro D300 / D500 / D700', 'Cylindre compact (station de travail)', MAC]),
  d('apple-mac-pro-2019-tour', 'Apple', 'Apple Mac Pro (2019) Tour', 'Mac Pro', 2019, 6499, ['creation', 'pro'], ['Intel Xeon W 8 cœurs 3,5 GHz (jusqu’à 28 cœurs)', '32 Go DDR4 ECC (jusqu’à 1,5 To)', 'SSD 256 Go à 8 To', 'AMD Radeon Pro 580X (W5700X, Vega II en option)', `${TOUR} (station de travail)`, MAC]),
  d('apple-mac-pro-2019-rack', 'Apple', 'Apple Mac Pro (2019) Rack', 'Mac Pro', 2019, 0, ['creation', 'pro', 'serveur'], ['Intel Xeon W 8 cœurs 3,5 GHz (jusqu’à 28 cœurs)', '32 Go DDR4 ECC (jusqu’à 1,5 To)', 'SSD 1 à 8 To', 'AMD Radeon Pro 580X (W5700X, Vega II en option)', 'Rack', MAC]),
  d('apple-mac-pro-m2-ultra-tour', 'Apple', 'Apple Mac Pro M2 Ultra (2023) Tour', 'Mac Pro', 2023, 8299, ['creation', 'pro', 'ia'], ['Apple M2 Ultra (CPU 24 cœurs)', '64 Go unifiée (jusqu’à 192 Go)', 'SSD 1 à 8 To', 'Apple M2 Ultra GPU 60 ou 76 cœurs', `${TOUR} (station de travail)`, MAC]),
  d('apple-mac-pro-m2-ultra-rack', 'Apple', 'Apple Mac Pro M2 Ultra (2023) Rack', 'Mac Pro', 2023, 8899, ['creation', 'pro', 'serveur'], ['Apple M2 Ultra (CPU 24 cœurs)', '64 Go unifiée (jusqu’à 192 Go)', 'SSD 1 à 8 To', 'Apple M2 Ultra GPU 60 ou 76 cœurs', 'Rack', MAC]),

  // ─── Dell OptiPlex 2012-2014 (Ivy Bridge / Haswell) ────────────────────────
  d('dell-optiplex-3010-sff', 'Dell', 'Dell OptiPlex 3010 SFF', 'OptiPlex 3000', 2012, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 3e gén. (Ivy Bridge)', 'DDR3, jusqu’à 16 Go', 'Disque dur 250 à 500 Go', 'Intel HD Graphics 2500 / 4000', SFF, W7]),
  d('dell-optiplex-7010-sff-2012', 'Dell', 'Dell OptiPlex 7010 SFF (2012)', 'OptiPlex 7000', 2012, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 3e gén. (Ivy Bridge)', 'DDR3, jusqu’à 16 Go', 'Disque dur 250 à 500 Go', 'Intel HD Graphics 2500 / 4000', SFF, W7]),
  d('dell-optiplex-7010-mt-2012', 'Dell', 'Dell OptiPlex 7010 MT (2012)', 'OptiPlex 7000', 2012, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 3e gén. (Ivy Bridge)', 'DDR3, jusqu’à 32 Go', 'Disque dur 250 à 500 Go', 'Intel HD Graphics 2500 / 4000', `${TOUR} (MT)`, W7]),
  d('dell-optiplex-9010-sff', 'Dell', 'Dell OptiPlex 9010 SFF', 'OptiPlex 9000', 2012, 0, ['bureautique', 'budget'], ['Intel Core i5 / i7 3e gén. (Ivy Bridge)', 'DDR3, jusqu’à 32 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 2500 / 4000', SFF, W7]),
  d('dell-optiplex-3020-sff', 'Dell', 'Dell OptiPlex 3020 SFF', 'OptiPlex 3000', 2014, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 4e gén. (Haswell)', 'DDR3, jusqu’à 16 Go', 'Disque dur 500 Go', 'Intel HD Graphics 4400 / 4600', SFF, W7]),
  d('dell-optiplex-7020-sff-2014', 'Dell', 'Dell OptiPlex 7020 SFF (2014)', 'OptiPlex 7000', 2014, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 4e gén. (Haswell)', 'DDR3, jusqu’à 32 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 4600', SFF, W7]),
  d('dell-optiplex-9020-sff', 'Dell', 'Dell OptiPlex 9020 SFF', 'OptiPlex 9000', 2013, 0, ['bureautique', 'budget'], ['Intel Core i5 / i7 4e gén. (Haswell)', 'DDR3, jusqu’à 32 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 4600', SFF, W7]),
  d('dell-optiplex-9020-micro', 'Dell', 'Dell OptiPlex 9020 Micro', 'OptiPlex 9000', 2014, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 4e gén. (Haswell, T)', 'DDR3L SO-DIMM, jusqu’à 16 Go', 'Disque dur 2,5 pouces ou SSD', 'Intel HD Graphics 4400 / 4600', MICRO, W7]),

  // ─── Dell OptiPlex 2016 (Skylake) ──────────────────────────────────────────
  d('dell-optiplex-3040-micro', 'Dell', 'Dell OptiPlex 3040 Micro', 'OptiPlex 3000', 2016, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 6e gén. (Skylake, T)', 'DDR3L SO-DIMM, jusqu’à 16 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 530', MICRO, W10P]),
  d('dell-optiplex-5040-sff', 'Dell', 'Dell OptiPlex 5040 SFF', 'OptiPlex 5000', 2016, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 6e gén. (Skylake)', 'DDR3L, jusqu’à 32 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 530', SFF, W10P]),
  d('dell-optiplex-7040-sff', 'Dell', 'Dell OptiPlex 7040 SFF', 'OptiPlex 7000', 2016, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 6e gén. (Skylake)', 'DDR4, jusqu’à 64 Go', 'Disque dur 500 Go ou SSD M.2', 'Intel HD Graphics 530', SFF, W10P]),
  d('dell-optiplex-7040-micro', 'Dell', 'Dell OptiPlex 7040 Micro', 'OptiPlex 7000', 2016, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 6e gén. (Skylake, T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque 2,5 pouces', 'Intel HD Graphics 530', MICRO, W10P]),
  d('dell-optiplex-7040-mt', 'Dell', 'Dell OptiPlex 7040 MT', 'OptiPlex 7000', 2016, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 6e gén. (Skylake)', 'DDR4, jusqu’à 64 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 530', `${TOUR} (MT)`, W10P]),

  // ─── Dell OptiPlex 2017 (Kaby Lake) ────────────────────────────────────────
  d('dell-optiplex-3050-micro', 'Dell', 'Dell OptiPlex 3050 Micro', 'OptiPlex 3000', 2017, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake, T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque 2,5 pouces', 'Intel HD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-3050-sff', 'Dell', 'Dell OptiPlex 3050 SFF', 'OptiPlex 3000', 2017, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake)', 'DDR4, jusqu’à 32 Go', 'Disque dur 500 Go ou SSD', 'Intel HD Graphics 630', SFF, W10P]),
  d('dell-optiplex-5050-sff', 'Dell', 'Dell OptiPlex 5050 SFF', 'OptiPlex 5000', 2017, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake)', 'DDR4, jusqu’à 64 Go', 'Disque dur 500 Go ou SSD M.2', 'Intel HD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7050-sff', 'Dell', 'Dell OptiPlex 7050 SFF', 'OptiPlex 7000', 2017, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake)', 'DDR4, jusqu’à 64 Go', 'SSD M.2 ou disque dur', 'Intel HD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7050-micro', 'Dell', 'Dell OptiPlex 7050 Micro', 'OptiPlex 7000', 2017, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake, T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 NVMe ou disque 2,5 pouces', 'Intel HD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-7050-mt', 'Dell', 'Dell OptiPlex 7050 MT', 'OptiPlex 7000', 2017, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 7e gén. (Kaby Lake)', 'DDR4, jusqu’à 64 Go', 'SSD M.2 ou disque dur', 'Intel HD Graphics 630', `${TOUR} (MT)`, W10P]),

  // ─── Dell OptiPlex 2018 (Coffee Lake) ──────────────────────────────────────
  d('dell-optiplex-3060-micro', 'Dell', 'Dell OptiPlex 3060 Micro', 'OptiPlex 3000', 2018, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 8e gén. (Coffee Lake, T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque 2,5 pouces', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-3060-sff', 'Dell', 'Dell OptiPlex 3060 SFF', 'OptiPlex 3000', 2018, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 8e gén. (Coffee Lake)', 'DDR4, jusqu’à 32 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-5060-sff', 'Dell', 'Dell OptiPlex 5060 SFF', 'OptiPlex 5000', 2018, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 8e gén. (Coffee Lake)', 'DDR4, jusqu’à 64 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7060-sff', 'Dell', 'Dell OptiPlex 7060 SFF', 'OptiPlex 7000', 2018, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 8e gén. (Coffee Lake)', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7060-micro', 'Dell', 'Dell OptiPlex 7060 Micro', 'OptiPlex 7000', 2018, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 8e gén. (Coffee Lake, T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 NVMe ou disque 2,5 pouces', 'Intel UHD Graphics 630', MICRO, W10P]),

  // ─── Dell OptiPlex 2019 (Coffee Lake Refresh) ──────────────────────────────
  d('dell-optiplex-3070-micro', 'Dell', 'Dell OptiPlex 3070 Micro', 'OptiPlex 3000', 2019, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 9e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque 2,5 pouces', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-3070-sff', 'Dell', 'Dell OptiPlex 3070 SFF', 'OptiPlex 3000', 2019, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 9e gén.', 'DDR4, jusqu’à 32 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-5070-sff', 'Dell', 'Dell OptiPlex 5070 SFF', 'OptiPlex 5000', 2019, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 9e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7070-sff', 'Dell', 'Dell OptiPlex 7070 SFF', 'OptiPlex 7000', 2019, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 / i9 9e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7070-micro', 'Dell', 'Dell OptiPlex 7070 Micro', 'OptiPlex 7000', 2019, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 9e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque 2,5 pouces', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-7070-ultra', 'Dell', 'Dell OptiPlex 7070 Ultra', 'OptiPlex 7000', 2019, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 8e gén. (U, Whiskey Lake)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 620', 'Ultra-compact (intégré au pied d’écran)', W10P]),

  // ─── Dell OptiPlex 2020 (Comet Lake) ───────────────────────────────────────
  d('dell-optiplex-3080-sff', 'Dell', 'Dell OptiPlex 3080 SFF', 'OptiPlex 3000', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-5080-sff', 'Dell', 'Dell OptiPlex 5080 SFF', 'OptiPlex 5000', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 10e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-5080-micro', 'Dell', 'Dell OptiPlex 5080 Micro', 'OptiPlex 5000', 2020, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 10e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-7080-sff', 'Dell', 'Dell OptiPlex 7080 SFF', 'OptiPlex 7000', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 / i7 / i9 10e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', SFF, W10P]),
  d('dell-optiplex-7080-micro', 'Dell', 'Dell OptiPlex 7080 Micro', 'OptiPlex 7000', 2020, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 / i9 10e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-7080-tower', 'Dell', 'Dell OptiPlex 7080 Tower', 'OptiPlex 7000', 2020, 0, ['bureautique', 'pro'], ['Intel Core i5 / i7 / i9 10e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630 (GPU dédié en option)', TOUR, W10P]),

  // ─── Dell OptiPlex 2021 (Comet Lake / Rocket Lake) ─────────────────────────
  d('dell-optiplex-3090-micro', 'Dell', 'Dell OptiPlex 3090 Micro', 'OptiPlex 3000', 2021, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 10e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 630', MICRO, W10P]),
  d('dell-optiplex-5090-micro', 'Dell', 'Dell OptiPlex 5090 Micro', 'OptiPlex 5000', 2021, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 / i7 10e ou 11e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics', MICRO, W10P]),
  d('dell-optiplex-5090-tower', 'Dell', 'Dell OptiPlex 5090 Tower', 'OptiPlex 5000', 2021, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 10e ou 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics (GPU dédié en option)', TOUR, W10P]),
  d('dell-optiplex-7090-sff', 'Dell', 'Dell OptiPlex 7090 SFF', 'OptiPlex 7000', 2021, 0, ['bureautique', 'budget'], ['Intel Core i5 / i7 / i9 10e ou 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 750', SFF, W10P]),
  d('dell-optiplex-7090-tower', 'Dell', 'Dell OptiPlex 7090 Tower', 'OptiPlex 7000', 2021, 0, ['bureautique', 'pro'], ['Intel Core i5 / i7 / i9 10e ou 11e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 750 (GPU dédié en option)', TOUR, W10P]),
  d('dell-optiplex-7090-ultra', 'Dell', 'Dell OptiPlex 7090 Ultra', 'OptiPlex 7000', 2021, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 11e gén. (U)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel Iris Xe / UHD Graphics', 'Ultra-compact (intégré au pied d’écran)', W10P]),

  // ─── Dell OptiPlex 2022 (Alder Lake) ───────────────────────────────────────
  d('dell-optiplex-3000-micro', 'Dell', 'Dell OptiPlex 3000 Micro', 'OptiPlex 3000', 2022, 0, ['bureautique', 'homelab', 'budget'], ['Intel Core i3 / i5 12e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730', MICRO, W11P]),
  d('dell-optiplex-3000-sff', 'Dell', 'Dell OptiPlex 3000 SFF', 'OptiPlex 3000', 2022, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 12e gén.', 'DDR4, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 730', SFF, W11P]),
  d('dell-optiplex-5000-micro', 'Dell', 'Dell OptiPlex 5000 Micro', 'OptiPlex 5000', 2022, 0, ['bureautique', 'homelab'], ['Intel Core i3 / i5 / i7 12e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', MICRO, W11P]),
  d('dell-optiplex-5000-sff', 'Dell', 'Dell OptiPlex 5000 SFF', 'OptiPlex 5000', 2022, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 12e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 730 / 770', SFF, W11P]),
  d('dell-optiplex-7000-micro', 'Dell', 'Dell OptiPlex 7000 Micro', 'OptiPlex 7000', 2022, 0, ['bureautique', 'homelab', 'pro'], ['Intel Core i3 / i5 / i7 / i9 12e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 770', MICRO, W11P]),
  d('dell-optiplex-7000-sff', 'Dell', 'Dell OptiPlex 7000 SFF', 'OptiPlex 7000', 2022, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 / i9 12e gén.', 'DDR4 ou DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 770', SFF, W11P]),
  d('dell-optiplex-7000-tower', 'Dell', 'Dell OptiPlex 7000 Tower', 'OptiPlex 7000', 2022, 0, ['bureautique', 'pro'], ['Intel Core i5 / i7 / i9 12e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 770 (GPU dédié en option)', TOUR, W11P]),

  // ─── Dell OptiPlex 2023-2024 (Raptor Lake) ─────────────────────────────────
  d('dell-optiplex-7010-micro-2023', 'Dell', 'Dell OptiPlex 7010 Micro (2023)', 'OptiPlex 7000', 2023, 0, ['bureautique', 'homelab', 'pro'], ['Intel Core i3 / i5 / i7 13e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', MICRO, W11P]),
  d('dell-optiplex-7010-tower-2023', 'Dell', 'Dell OptiPlex 7010 Tower (2023)', 'OptiPlex 7000', 2023, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 13e gén.', 'DDR4, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 730 / 770 (GPU dédié en option)', TOUR, W11P]),
  d('dell-optiplex-micro-plus-7010', 'Dell', 'Dell OptiPlex Micro Plus 7010', 'OptiPlex 7000', 2023, 0, ['bureautique', 'homelab', 'pro'], ['Intel Core i5 / i7 / i9 13e gén. (T)', 'DDR5 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 770', MICRO, W11P]),
  d('dell-optiplex-sff-plus-7010', 'Dell', 'Dell OptiPlex Small Form Factor Plus 7010', 'OptiPlex 7000', 2023, 0, ['bureautique', 'pro'], ['Intel Core i5 / i7 / i9 13e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 770 (GPU dédié en option)', SFF, W11P]),
  d('dell-optiplex-tower-plus-7010', 'Dell', 'Dell OptiPlex Tower Plus 7010', 'OptiPlex 7000', 2023, 0, ['bureautique', 'pro'], ['Intel Core i5 / i7 / i9 13e gén.', 'DDR5, jusqu’à 128 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 770 (GPU dédié en option)', TOUR, W11P]),
  d('dell-optiplex-7020-micro-2024', 'Dell', 'Dell OptiPlex 7020 Micro (2024)', 'OptiPlex 7000', 2024, 0, ['bureautique', 'homelab', 'pro'], ['Intel Core i3 / i5 / i7 14e gén. (T)', 'DDR5 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', MICRO, W11P]),
  d('dell-optiplex-7020-sff-2024', 'Dell', 'Dell OptiPlex 7020 SFF (2024)', 'OptiPlex 7000', 2024, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 14e gén.', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', SFF, W11P]),
  d('dell-optiplex-7020-tower-2024', 'Dell', 'Dell OptiPlex 7020 Tower (2024)', 'OptiPlex 7000', 2024, 0, ['bureautique', 'pro'], ['Intel Core i3 / i5 / i7 14e gén.', 'DDR5, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 730 / 770', TOUR, W11P]),

  // ─── Dell Pro (successeurs des OptiPlex, 2025) ─────────────────────────────
  d('dell-pro-micro', 'Dell', 'Dell Pro Micro', 'Dell Pro', 2025, 0, ['bureautique', 'pro'], ['Intel Core Ultra 5 / 7 (série 200)', 'DDR5 SO-DIMM', 'SSD M.2 NVMe', 'Intel Graphics', MICRO, W11P], false),
  d('dell-pro-slim', 'Dell', 'Dell Pro Slim', 'Dell Pro', 2025, 0, ['bureautique', 'pro'], ['Intel Core Ultra 5 / 7 (série 200)', 'DDR5', 'SSD M.2 NVMe', 'Intel Graphics', SFF, W11P], false),
  d('dell-pro-tower', 'Dell', 'Dell Pro Tower', 'Dell Pro', 2025, 0, ['bureautique', 'pro'], ['Intel Core Ultra 5 / 7 (série 200)', 'DDR5', 'SSD M.2 NVMe', 'Intel Graphics (GPU dédié en option)', TOUR, W11P], false),
  d('dell-pro-max-tower-t2', 'Dell', 'Dell Pro Max Tower T2', 'Dell Pro Max', 2025, 0, ['pro', 'creation', 'ia'], ['Intel Core Ultra 7 / 9 (série 200K)', 'DDR5, jusqu’à 256 Go', 'SSD M.2 NVMe', 'NVIDIA RTX professionnelle en option', `${TOUR} (station de travail)`, W11P], false),

  // ─── Dell OptiPlex tout-en-un ──────────────────────────────────────────────
  d('dell-optiplex-7460-aio', 'Dell', 'Dell OptiPlex 7460 All-in-One', 'OptiPlex AIO', 2018, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 8e gén.', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630 (GTX 1050 en option)', `${T} 23,8 pouces`, W10P]),
  d('dell-optiplex-7470-aio', 'Dell', 'Dell OptiPlex 7470 All-in-One', 'OptiPlex AIO', 2019, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 / i9 9e gén.', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630', `${T} 23,8 pouces`, W10P]),
  d('dell-optiplex-7480-aio', 'Dell', 'Dell OptiPlex 7480 All-in-One', 'OptiPlex AIO', 2020, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 / i9 10e gén.', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe ou disque dur', 'Intel UHD Graphics 630', `${T} 23,8 pouces`, W10P]),
  d('dell-optiplex-3280-aio', 'Dell', 'Dell OptiPlex 3280 All-in-One', 'OptiPlex AIO', 2020, 0, ['bureautique', 'budget'], ['Intel Core i3 / i5 10e gén. (T)', 'DDR4 SO-DIMM, jusqu’à 32 Go', 'SSD M.2 ou disque dur', 'Intel UHD Graphics 630', `${T} 21,5 pouces`, W10P]),
  d('dell-optiplex-7400-aio', 'Dell', 'Dell OptiPlex 7400 All-in-One', 'OptiPlex AIO', 2022, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 / i9 12e gén.', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', `${T} 23,8 pouces`, W11P]),
  d('dell-optiplex-7410-aio', 'Dell', 'Dell OptiPlex 7410 All-in-One', 'OptiPlex AIO', 2023, 0, ['bureautique'], ['Intel Core i3 / i5 / i7 13e gén.', 'DDR4 SO-DIMM, jusqu’à 64 Go', 'SSD M.2 NVMe', 'Intel UHD Graphics 730 / 770', `${T} 23,8 pouces`, W11P]),
];
