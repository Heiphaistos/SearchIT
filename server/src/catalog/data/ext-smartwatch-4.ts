import type { CatalogProduct } from '../types.js';

type V = string | null;
/** Specs smartwatch : [Écran, Autonomie, GPS, Étanchéité, Compatibilité, Capteurs] — null = clé omise. */
function w(
  slug: string, brand: string, name: string, family: string, year: number, msrp: number | null,
  s: [V, V, V, V, V, V], tags: string[] = ['mobile', 'sport'], refurbishable = true,
): CatalogProduct {
  const keys = ['Écran', 'Autonomie', 'GPS', 'Étanchéité', 'Compatibilité', 'Capteurs'];
  const specs: Record<string, string> = {};
  s.forEach((v, i) => { if (v !== null) specs[keys[i]] = v; });
  const p: CatalogProduct = { id: `smartwatch-${slug}`, category: 'smartwatch', brand, name, family, year, refurbishable, tags, specs };
  if (msrp !== null) p.msrp = msrp;
  return p;
}

const AI = 'Android, iOS';
const AN = 'Android';
const IO = 'iOS';
const R = ['mobile', 'sport', 'robuste'];

const B = ['mobile', 'sport', 'budget'];
const am = (slug: string, name: string, family: string, year: number, msrp: number | null, s: [V, V, V, V, V, V], tags: string[] = B) =>
  w(`amazfit-${slug}`, 'Amazfit', `Amazfit ${name}`, family, year, msrp, s, tags);
const hw = (slug: string, name: string, family: string, year: number, msrp: number | null, s: [V, V, V, V, V, V], tags?: string[]) =>
  w(`huawei-${slug}`, 'Huawei', `Huawei ${name}`, family, year, msrp, s, tags);
const xi = (slug: string, name: string, family: string, year: number, msrp: number | null, s: [V, V, V, V, V, V], tags: string[] = B) =>
  w(`xiaomi-${slug}`, 'Xiaomi', `Xiaomi ${name}`, family, year, msrp, s, tags);
const BIO = 'Cardio optique BioTracker, oxymètre (SpO2)';
const TS = 'Cardio optique TruSeen, oxymètre (SpO2)';
const TSP = 'Cardio optique TruSeen, ECG, oxymètre (SpO2), température cutanée, baromètre';
const M = ['mobile', 'sport'];

export const PRODUCTS: CatalogProduct[] = [
  // ─── Amazfit Bip ─────────────────────────────────────────────────────────
  am('bip', 'Bip', 'Amazfit Bip', 2018, 79, ['1,28 pouce couleur transflectif', "Jusqu'à 45 jours", 'Oui', 'IP68', AI, 'Cardio optique, boussole']),
  am('bip-lite', 'Bip Lite', 'Amazfit Bip', 2019, 49, ['1,28 pouce couleur transflectif', "Jusqu'à 45 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique']),
  am('bip-s', 'Bip S', 'Amazfit Bip', 2019, 69, ['1,28 pouce couleur transflectif', "Jusqu'à 40 jours", 'Oui', '5 ATM', AI, 'Cardio optique BioTracker']),
  am('bip-s-lite', 'Bip S Lite', 'Amazfit Bip', 2020, 49, ['1,28 pouce couleur transflectif', "Jusqu'à 30 jours", 'Non', '5 ATM', AI, 'Cardio optique BioTracker']),
  am('bip-u', 'Bip U', 'Amazfit Bip', 2020, 59, ['1,43 pouce TFT couleur', "Jusqu'à 9 jours", 'Connecté (via smartphone)', '5 ATM', AI, BIO]),
  am('bip-u-pro', 'Bip U Pro', 'Amazfit Bip', 2020, 69, ['1,43 pouce TFT couleur', "Jusqu'à 9 jours", 'Oui', '5 ATM', AI, BIO]),
  am('bip-3', 'Bip 3', 'Amazfit Bip', 2022, 59, ['1,69 pouce TFT couleur', "Jusqu'à 14 jours", 'Connecté (via smartphone)', '5 ATM', AI, BIO]),
  am('bip-3-pro', 'Bip 3 Pro', 'Amazfit Bip', 2022, 79, ['1,69 pouce TFT couleur', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO]),
  am('bip-5', 'Bip 5', 'Amazfit Bip', 2023, 89, ['1,91 pouce TFT couleur', "Jusqu'à 10 jours", 'Oui', 'IP68', AI, BIO]),
  am('bip-5-unity', 'Bip 5 Unity', 'Amazfit Bip', 2024, 79, ['1,91 pouce TFT couleur', "Jusqu'à 11 jours", 'Connecté (via smartphone)', '5 ATM', AI, BIO]),
  am('bip-6', 'Bip 6', 'Amazfit Bip', 2025, 89, ['1,97 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO]),

  // ─── Amazfit GTR / GTS ───────────────────────────────────────────────────
  am('gtr-42mm', 'GTR 42 mm', 'Amazfit GTR', 2019, 129, ['1,2 pouce AMOLED', "Jusqu'à 12 jours", 'Oui', '5 ATM', AI, 'Cardio optique BioTracker'], M),
  am('gtr-47mm', 'GTR 47 mm', 'Amazfit GTR', 2019, 149, ['1,39 pouce AMOLED', "Jusqu'à 24 jours", 'Oui', '5 ATM', AI, 'Cardio optique BioTracker'], M),
  am('gtr-2', 'GTR 2', 'Amazfit GTR', 2020, 179, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gtr-2e', 'GTR 2e', 'Amazfit GTR', 2021, 139, ['1,39 pouce AMOLED', "Jusqu'à 24 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gtr-3', 'GTR 3', 'Amazfit GTR', 2021, 179, ['1,39 pouce AMOLED', "Jusqu'à 21 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gtr-3-pro', 'GTR 3 Pro', 'Amazfit GTR', 2021, 229, ['1,45 pouce AMOLED', "Jusqu'à 12 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gtr-4', 'GTR 4', 'Amazfit GTR', 2022, 199, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, BIO], M),
  am('gtr-mini', 'GTR Mini', 'Amazfit GTR', 2023, 129, ['1,28 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO]),
  am('gts', 'GTS', 'Amazfit GTS', 2019, 129, ['1,65 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique BioTracker'], M),
  am('gts-2', 'GTS 2', 'Amazfit GTS', 2020, 179, ['1,65 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gts-2e', 'GTS 2e', 'Amazfit GTS', 2021, 139, ['1,65 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gts-2-mini', 'GTS 2 Mini', 'Amazfit GTS', 2020, 99, ['1,55 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO]),
  am('gts-3', 'GTS 3', 'Amazfit GTS', 2021, 179, ['1,75 pouce AMOLED', "Jusqu'à 12 jours", 'Oui', '5 ATM', AI, BIO], M),
  am('gts-4', 'GTS 4', 'Amazfit GTS', 2022, 199, ['1,75 pouce AMOLED', "Jusqu'à 8 jours", 'Oui (bifréquence)', '5 ATM', AI, BIO], M),
  am('gts-4-mini', 'GTS 4 Mini', 'Amazfit GTS', 2022, 119, ['1,65 pouce AMOLED', "Jusqu'à 15 jours", 'Oui', '5 ATM', AI, BIO]),

  // ─── Amazfit T-Rex, Balance, Active, Cheetah, Falcon ─────────────────────
  am('t-rex', 'T-Rex', 'Amazfit T-Rex', 2020, 139, ['1,3 pouce AMOLED', "Jusqu'à 20 jours", 'Oui', '5 ATM, MIL-STD-810G', AI, 'Cardio optique BioTracker, boussole'], R),
  am('t-rex-pro', 'T-Rex Pro', 'Amazfit T-Rex', 2021, 179, ['1,3 pouce AMOLED', "Jusqu'à 18 jours", 'Oui', '10 ATM, MIL-STD-810G', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('t-rex-2', 'T-Rex 2', 'Amazfit T-Rex', 2022, 229, ['1,39 pouce AMOLED', "Jusqu'à 24 jours", 'Oui (bifréquence)', '10 ATM, MIL-STD-810G', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('t-rex-ultra', 'T-Rex Ultra', 'Amazfit T-Rex', 2023, 399, ['1,39 pouce AMOLED', "Jusqu'à 20 jours", 'Oui (bifréquence)', '10 ATM, MIL-STD-810G', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('t-rex-3', 'T-Rex 3', 'Amazfit T-Rex', 2024, 279, ['1,5 pouce AMOLED', "Jusqu'à 27 jours", 'Oui (bifréquence)', '10 ATM, MIL-STD-810H', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('t-rex-3-pro-44mm', 'T-Rex 3 Pro 44 mm', 'Amazfit T-Rex', 2025, 399, ['1,32 pouce AMOLED', null, 'Oui (bifréquence)', '10 ATM, MIL-STD-810H', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('t-rex-3-pro-48mm', 'T-Rex 3 Pro 48 mm', 'Amazfit T-Rex', 2025, 399, ['1,5 pouce AMOLED', null, 'Oui (bifréquence)', '10 ATM, MIL-STD-810H', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('balance', 'Balance', 'Amazfit Balance', 2023, 249, ['1,5 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique BioTracker, SpO2, bio-impédance'], M),
  am('balance-2', 'Balance 2', 'Amazfit Balance', 2025, 299, ['1,5 pouce AMOLED', "Jusqu'à 21 jours", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique BioTracker, SpO2, bio-impédance'], M),
  am('active', 'Active', 'Amazfit Active', 2023, 139, ['1,75 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, BIO]),
  am('active-edge', 'Active Edge', 'Amazfit Active', 2023, 169, ['1,32 pouce TFT couleur', "Jusqu'à 16 jours", 'Oui', '10 ATM', AI, BIO], R),
  am('active-2', 'Active 2', 'Amazfit Active', 2025, 99, ['1,32 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, BIO]),
  am('cheetah', 'Cheetah', 'Amazfit Cheetah', 2023, 229, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, BIO], M),
  am('cheetah-pro', 'Cheetah Pro', 'Amazfit Cheetah', 2023, 299, ['1,45 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, BIO], M),
  am('cheetah-square', 'Cheetah Square', 'Amazfit Cheetah', 2023, 229, ['1,75 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, BIO], M),
  am('falcon', 'Falcon', 'Amazfit Falcon', 2022, 499, ['1,28 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '20 ATM', AI, 'Cardio optique BioTracker, SpO2, baromètre, boussole'], R),
  am('stratos', 'Stratos', 'Amazfit Stratos', 2018, 199, ['1,34 pouce couleur transflectif', "Jusqu'à 5 jours", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre, boussole'], M),
  am('stratos-3', 'Stratos 3', 'Amazfit Stratos', 2019, 199, ['1,34 pouce couleur transflectif', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre, boussole'], M),
  am('pace', 'Pace', 'Amazfit Pace', 2016, 179, ['1,34 pouce couleur transflectif', "Jusqu'à 5 jours", 'Oui', 'IP67', AI, 'Cardio optique, baromètre'], M),
  am('verge', 'Verge', 'Amazfit Verge', 2018, 149, ['1,3 pouce AMOLED', "Jusqu'à 5 jours", 'Oui', 'IP68', AI, 'Cardio optique, baromètre, boussole']),
  am('neo', 'Neo', 'Amazfit Neo', 2020, 39, ['1,2 pouce STN monochrome', "Jusqu'à 28 jours", 'Non', '5 ATM', AI, 'Cardio optique']),
  am('band-5', 'Band 5', 'Amazfit Band', 2020, 44, ['1,1 pouce AMOLED', "Jusqu'à 15 jours", 'Non', '5 ATM', AI, BIO]),
  am('band-7', 'Band 7', 'Amazfit Band', 2022, 49, ['1,47 pouce AMOLED', "Jusqu'à 18 jours", 'Non', '5 ATM', AI, BIO]),
  am('helio-strap', 'Helio Strap', 'Amazfit Helio', 2025, 99, ['Sans écran', "Jusqu'à 10 jours", 'Non', '10 ATM', AI, BIO], M),

  // ─── Huawei Watch GT ─────────────────────────────────────────────────────
  hw('watch-gt', 'Watch GT', 'Watch GT', 2018, 199, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, baromètre']),
  hw('watch-gt-2-42mm', 'Watch GT 2 42 mm', 'Watch GT', 2019, 229, ['1,2 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, baromètre']),
  hw('watch-gt-2-46mm', 'Watch GT 2 46 mm', 'Watch GT', 2019, 249, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, baromètre']),
  hw('watch-gt-2e', 'Watch GT 2e', 'Watch GT', 2020, 179, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-2-pro', 'Watch GT 2 Pro', 'Watch GT', 2020, 329, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-3-42mm', 'Watch GT 3 42 mm', 'Watch GT', 2021, 229, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-3-46mm', 'Watch GT 3 46 mm', 'Watch GT', 2021, 249, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-3-pro-43mm', 'Watch GT 3 Pro 43 mm', 'Watch GT', 2022, 369, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, ECG, oxymètre (SpO2)']),
  hw('watch-gt-3-pro-46mm', 'Watch GT 3 Pro 46 mm', 'Watch GT', 2022, 349, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, ECG, oxymètre (SpO2)']),
  hw('watch-gt-runner', 'Watch GT Runner', 'Watch GT', 2022, 299, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, TS]),
  hw('watch-gt-3-se', 'Watch GT 3 SE', 'Watch GT', 2022, 199, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-cyber', 'Watch GT Cyber', 'Watch GT', 2022, 249, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, TS]),
  hw('watch-gt-4-41mm', 'Watch GT 4 41 mm', 'Watch GT', 2023, 249, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui (bifréquence)', '5 ATM', AI, TS]),
  hw('watch-gt-5-41mm', 'Watch GT 5 41 mm', 'Watch GT', 2024, 249, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui (bifréquence)', '5 ATM', AI, TS]),
  hw('watch-gt-5-pro-42mm', 'Watch GT 5 Pro 42 mm', 'Watch GT', 2024, 449, ['1,32 pouce AMOLED', "Jusqu'à 7 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-gt-5-pro-46mm', 'Watch GT 5 Pro 46 mm', 'Watch GT', 2024, 399, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-gt-6-41mm', 'Watch GT 6 41 mm', 'Watch GT', 2025, 249, ['1,32 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, TS]),
  hw('watch-gt-6-46mm', 'Watch GT 6 46 mm', 'Watch GT', 2025, 279, ['1,47 pouce AMOLED', "Jusqu'à 21 jours", 'Oui (bifréquence)', '5 ATM', AI, TS]),
  hw('watch-gt-6-pro-46mm', 'Watch GT 6 Pro 46 mm', 'Watch GT', 2025, 399, ['1,47 pouce AMOLED', "Jusqu'à 21 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),

  // ─── Huawei Watch (premium, eSIM) ────────────────────────────────────────
  hw('watch-1st-gen', 'Watch (1re génération)', 'Huawei Watch', 2015, 399, ['1,4 pouce AMOLED', "Jusqu'à 1,5 jour", 'Non', 'IP67', AI, 'Cardio optique']),
  hw('watch-2', 'Watch 2', 'Huawei Watch', 2017, 329, ['1,2 pouce AMOLED', "Jusqu'à 2 jours", 'Oui', 'IP68', AI, 'Cardio optique, baromètre']),
  hw('watch-2-classic', 'Watch 2 Classic', 'Huawei Watch', 2017, 379, ['1,2 pouce AMOLED', "Jusqu'à 2 jours", 'Oui', 'IP68', AI, 'Cardio optique, baromètre']),
  hw('watch-3', 'Watch 3', 'Huawei Watch', 2021, 399, ['1,43 pouce AMOLED', "Jusqu'à 3 jours", 'Oui', '5 ATM', AI, 'Cardio optique TruSeen, oxymètre (SpO2), température cutanée']),
  hw('watch-3-pro', 'Watch 3 Pro', 'Huawei Watch', 2021, 499, ['1,43 pouce AMOLED', "Jusqu'à 5 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique TruSeen, oxymètre (SpO2), température cutanée']),
  hw('watch-4', 'Watch 4', 'Huawei Watch', 2023, 449, ['1,5 pouce AMOLED', "Jusqu'à 3 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-4-pro', 'Watch 4 Pro', 'Huawei Watch', 2023, 549, ['1,5 pouce AMOLED', "Jusqu'à 4,5 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-5-42mm', 'Watch 5 42 mm', 'Huawei Watch', 2025, 549, ['1,38 pouce LTPO AMOLED', "Jusqu'à 3 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-5-46mm', 'Watch 5 46 mm', 'Huawei Watch', 2025, 599, ['1,5 pouce LTPO AMOLED', "Jusqu'à 4,5 jours", 'Oui (bifréquence)', '5 ATM', AI, TSP]),
  hw('watch-ultimate', 'Watch Ultimate', 'Huawei Watch', 2023, 799, ['1,5 pouce LTPO AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '10 ATM (plongée 100 m)', AI, TSP], R),
  hw('watch-buds', 'Watch Buds', 'Huawei Watch', 2022, 499, ['1,43 pouce AMOLED', "Jusqu'à 3 jours", 'Oui', '3 ATM', AI, TS]),
  hw('watch-d', 'Watch D', 'Huawei Watch', 2022, 399, ['1,64 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', 'IP68', AI, 'Tensiomètre, ECG, oxymètre (SpO2), température cutanée']),
  hw('watch-d2', 'Watch D2', 'Huawei Watch', 2024, 399, ['1,82 pouce AMOLED', "Jusqu'à 6 jours", 'Oui', 'IP68', AI, 'Tensiomètre, ECG, oxymètre (SpO2), température cutanée']),

  // ─── Huawei Watch Fit, Band ──────────────────────────────────────────────
  hw('watch-fit', 'Watch Fit', 'Watch Fit', 2020, 129, ['1,64 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('watch-fit-new', 'Watch Fit New', 'Watch Fit', 2021, 129, ['1,64 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('watch-fit-2', 'Watch Fit 2', 'Watch Fit', 2022, 149, ['1,74 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('watch-fit-3', 'Watch Fit 3', 'Watch Fit', 2024, 159, ['1,82 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('watch-fit-4', 'Watch Fit 4', 'Watch Fit', 2025, 149, ['1,82 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('watch-fit-4-pro', 'Watch Fit 4 Pro', 'Watch Fit', 2025, 229, ['1,82 pouce AMOLED', "Jusqu'à 10 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique TruSeen, ECG, oxymètre (SpO2)'], B),
  hw('band-4', 'Band 4', 'Huawei Band', 2019, 39, ['0,96 pouce TFT couleur', "Jusqu'à 9 jours", 'Non', '5 ATM', AI, 'Cardio optique'], B),
  hw('band-4-pro', 'Band 4 Pro', 'Huawei Band', 2019, 69, ['0,95 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, TS], B),
  hw('band-6', 'Band 6', 'Huawei Band', 2021, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, TS], B),
  hw('band-7', 'Band 7', 'Huawei Band', 2022, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, TS], B),
  hw('band-8', 'Band 8', 'Huawei Band', 2023, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, TS], B),
  hw('band-9', 'Band 9', 'Huawei Band', 2024, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, TS], B),
  hw('band-10', 'Band 10', 'Huawei Band', 2025, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, TS], B),

  // ─── Xiaomi Mi Band / Smart Band ─────────────────────────────────────────
  xi('mi-band-3', 'Mi Band 3', 'Mi Band', 2018, 29, ['0,78 pouce OLED monochrome', "Jusqu'à 20 jours", 'Non', '5 ATM', AI, 'Cardio optique']),
  xi('mi-band-4', 'Mi Smart Band 4', 'Mi Band', 2019, 35, ['0,95 pouce AMOLED', "Jusqu'à 20 jours", 'Non', '5 ATM', AI, 'Cardio optique']),
  xi('mi-band-5', 'Mi Smart Band 5', 'Mi Band', 2020, 39, ['1,1 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique']),
  xi('mi-band-6', 'Mi Smart Band 6', 'Mi Band', 2021, 44, ['1,56 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-7', 'Smart Band 7', 'Smart Band', 2022, 59, ['1,62 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-7-pro', 'Smart Band 7 Pro', 'Smart Band', 2022, 99, ['1,64 pouce AMOLED', "Jusqu'à 12 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-8', 'Smart Band 8', 'Smart Band', 2023, 39, ['1,62 pouce AMOLED', "Jusqu'à 16 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-8-active', 'Smart Band 8 Active', 'Smart Band', 2023, 25, ['1,47 pouce LCD', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-8-pro', 'Smart Band 8 Pro', 'Smart Band', 2024, 69, ['1,74 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-9', 'Smart Band 9', 'Smart Band', 2024, 39, ['1,62 pouce AMOLED', "Jusqu'à 21 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-9-active', 'Smart Band 9 Active', 'Smart Band', 2024, 25, ['1,47 pouce LCD', "Jusqu'à 18 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-9-pro', 'Smart Band 9 Pro', 'Smart Band', 2024, 79, ['1,74 pouce AMOLED', "Jusqu'à 21 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  xi('smart-band-10', 'Smart Band 10', 'Smart Band', 2025, 49, ['1,72 pouce AMOLED', "Jusqu'à 21 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),

  // ─── Xiaomi Watch ────────────────────────────────────────────────────────
  xi('mi-watch', 'Mi Watch', 'Xiaomi Watch', 2020, 129, ['1,39 pouce AMOLED', "Jusqu'à 16 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2), baromètre, boussole']),
  xi('mi-watch-lite', 'Mi Watch Lite', 'Xiaomi Watch', 2020, 59, ['1,4 pouce TFT couleur', "Jusqu'à 9 jours", 'Oui', '5 ATM', AI, 'Cardio optique']),
  xi('watch-s1', 'Watch S1', 'Xiaomi Watch', 2022, 269, ['1,43 pouce AMOLED', "Jusqu'à 12 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], M),
  xi('watch-s1-active', 'Watch S1 Active', 'Xiaomi Watch', 2022, 199, ['1,43 pouce AMOLED', "Jusqu'à 12 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], M),
  xi('watch-s1-pro', 'Watch S1 Pro', 'Xiaomi Watch', 2022, 299, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AN, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], M),
  xi('watch-2-pro', 'Watch 2 Pro', 'Xiaomi Watch', 2023, 269, ['1,43 pouce AMOLED', "Jusqu'à 65 h", 'Oui (bifréquence)', '5 ATM', AN, 'Cardio optique, oxymètre (SpO2), bio-impédance'], M),
  xi('watch-2', 'Watch 2', 'Xiaomi Watch', 2024, 199, ['1,43 pouce AMOLED', "Jusqu'à 65 h", 'Oui (bifréquence)', '5 ATM', AN, 'Cardio optique, oxymètre (SpO2)'], M),
  xi('watch-s3', 'Watch S3', 'Xiaomi Watch', 2024, 149, ['1,43 pouce AMOLED', "Jusqu'à 15 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], M),
  xi('watch-s4', 'Watch S4', 'Xiaomi Watch', 2025, 199, ['1,43 pouce AMOLED', "Jusqu'à 15 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], M),
  xi('watch-s4-41mm', 'Watch S4 41 mm', 'Xiaomi Watch', 2025, 199, ['1,32 pouce AMOLED', "Jusqu'à 8 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], M),

  // ─── Redmi (Xiaomi) ──────────────────────────────────────────────────────
  w('xiaomi-redmi-smart-band-2', 'Xiaomi', 'Xiaomi Redmi Smart Band 2', 'Redmi Smart Band', 2023, 29, ['1,47 pouce TFT couleur', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-smart-band-pro', 'Xiaomi', 'Xiaomi Redmi Smart Band Pro', 'Redmi Smart Band', 2021, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-2-lite', 'Xiaomi', 'Xiaomi Redmi Watch 2 Lite', 'Redmi Watch', 2021, 69, ['1,55 pouce TFT couleur', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-3', 'Xiaomi', 'Xiaomi Redmi Watch 3', 'Redmi Watch', 2023, 119, ['1,75 pouce AMOLED', "Jusqu'à 12 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-3-active', 'Xiaomi', 'Xiaomi Redmi Watch 3 Active', 'Redmi Watch', 2023, 49, ['1,83 pouce LCD', "Jusqu'à 12 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-4', 'Xiaomi', 'Xiaomi Redmi Watch 4', 'Redmi Watch', 2024, 99, ['1,97 pouce AMOLED', "Jusqu'à 20 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-5', 'Xiaomi', 'Xiaomi Redmi Watch 5', 'Redmi Watch', 2025, 99, ['2,07 pouces AMOLED', "Jusqu'à 24 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-5-active', 'Xiaomi', 'Xiaomi Redmi Watch 5 Active', 'Redmi Watch', 2024, 39, ['2 pouces LCD', "Jusqu'à 18 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('xiaomi-redmi-watch-5-lite', 'Xiaomi', 'Xiaomi Redmi Watch 5 Lite', 'Redmi Watch', 2024, 59, ['1,96 pouce AMOLED', "Jusqu'à 18 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [IO];
