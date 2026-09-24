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
const WO = 'Wear OS';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Withings ────────────────────────────────────────────────────────────
  w('withings-activite-pop', 'Withings', 'Withings Activité Pop', 'Activité', 2015, 149, ['Aiguilles analogiques', "Jusqu'à 8 mois (pile)", 'Non', '5 ATM', AI, 'Accéléromètre'], B),
  w('withings-steel', 'Withings', 'Withings Steel', 'Steel', 2016, 129, ['Aiguilles analogiques', "Jusqu'à 8 mois (pile)", 'Non', '5 ATM', AI, 'Accéléromètre'], B),
  w('withings-steel-hr-36mm', 'Withings', 'Withings Steel HR 36 mm', 'Steel HR', 2017, 179, ['Écran OLED + aiguilles analogiques', "Jusqu'à 25 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique']),
  w('withings-steel-hr-40mm', 'Withings', 'Withings Steel HR 40 mm', 'Steel HR', 2017, 199, ['Écran OLED + aiguilles analogiques', "Jusqu'à 25 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique']),
  w('withings-steel-hr-sport', 'Withings', 'Withings Steel HR Sport', 'Steel HR', 2018, 199, ['Écran OLED + aiguilles analogiques', "Jusqu'à 25 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique']),
  w('withings-pulse-hr', 'Withings', 'Withings Pulse HR', 'Pulse', 2018, 129, ['Écran OLED', "Jusqu'à 20 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique'], B),
  w('withings-move', 'Withings', 'Withings Move', 'Move', 2019, 69, ['Aiguilles analogiques', "Jusqu'à 18 mois (pile)", 'Connecté (via smartphone)', '5 ATM', AI, 'Accéléromètre, altimètre'], B),
  w('withings-move-ecg', 'Withings', 'Withings Move ECG', 'Move', 2019, 129, ['Aiguilles analogiques', "Jusqu'à 12 mois (pile)", 'Connecté (via smartphone)', '5 ATM', AI, 'ECG, altimètre']),
  w('withings-scanwatch-38mm', 'Withings', 'Withings ScanWatch 38 mm', 'ScanWatch', 2020, 249, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio, ECG, oxymètre (SpO2)']),
  w('withings-scanwatch-42mm', 'Withings', 'Withings ScanWatch 42 mm', 'ScanWatch', 2020, 299, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio, ECG, oxymètre (SpO2)']),
  w('withings-scanwatch-horizon', 'Withings', 'Withings ScanWatch Horizon', 'ScanWatch', 2021, 499, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '10 ATM', AI, 'Cardio, ECG, oxymètre (SpO2)']),
  w('withings-scanwatch-light', 'Withings', 'Withings ScanWatch Light', 'ScanWatch', 2023, 249, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, température']),
  w('withings-scanwatch-2-38mm', 'Withings', 'Withings ScanWatch 2 38 mm', 'ScanWatch', 2023, 349, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio, ECG, oxymètre (SpO2), température']),
  w('withings-scanwatch-nova', 'Withings', 'Withings ScanWatch Nova', 'ScanWatch', 2024, 599, ['Écran PMOLED + aiguilles analogiques', "Jusqu'à 30 jours", 'Connecté (via smartphone)', '10 ATM', AI, 'Cardio, ECG, oxymètre (SpO2), température']),

  // ─── Fossil (Wear OS) ────────────────────────────────────────────────────
  w('fossil-gen-4-explorist-hr', 'Fossil', 'Fossil Gen 4 Explorist HR', 'Fossil Gen 4', 2018, 279, ['1,19 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique'], ['mobile']),
  w('fossil-gen-4-venture-hr', 'Fossil', 'Fossil Gen 4 Venture HR', 'Fossil Gen 4', 2018, 279, ['1,19 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique'], ['mobile']),
  w('fossil-sport', 'Fossil', 'Fossil Sport', 'Fossil Sport', 2018, 279, ['1,19 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AI, 'Cardio optique']),
  w('fossil-gen-5-carlyle', 'Fossil', 'Fossil Gen 5 Carlyle HR', 'Fossil Gen 5', 2019, 299, ['1,28 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique'], ['mobile']),
  w('fossil-gen-5-julianna', 'Fossil', 'Fossil Gen 5 Julianna HR', 'Fossil Gen 5', 2019, 299, ['1,19 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique'], ['mobile']),
  w('fossil-gen-5e', 'Fossil', 'Fossil Gen 5E', 'Fossil Gen 5', 2020, 249, ['1,19 pouce AMOLED', "Jusqu'à 24 h", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique'], ['mobile']),
  w('fossil-gen-6-44mm', 'Fossil', 'Fossil Gen 6 44 mm', 'Fossil Gen 6', 2021, 299, ['1,28 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], ['mobile']),
  w('fossil-gen-6-42mm', 'Fossil', 'Fossil Gen 6 42 mm', 'Fossil Gen 6', 2021, 299, ['1,28 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], ['mobile']),
  w('fossil-gen-6-wellness-edition', 'Fossil', 'Fossil Gen 6 Wellness Edition', 'Fossil Gen 6', 2022, 329, ['1,28 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '3 ATM', AN, 'Cardio optique, oxymètre (SpO2)'], ['mobile']),
  w('fossil-hybrid-hr', 'Fossil', 'Fossil Hybrid HR', 'Fossil Hybrid', 2019, 199, ['E-ink + aiguilles analogiques', "Jusqu'à 14 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique'], ['mobile']),

  // ─── Mobvoi TicWatch ─────────────────────────────────────────────────────
  w('mobvoi-ticwatch-e', 'Mobvoi', 'Mobvoi TicWatch E', 'TicWatch E', 2017, 159, ['1,4 pouce OLED', "Jusqu'à 1,5 jour", 'Oui', 'IP67', AI, 'Cardio optique'], B),
  w('mobvoi-ticwatch-s', 'Mobvoi', 'Mobvoi TicWatch S', 'TicWatch S', 2017, 199, ['1,4 pouce OLED', "Jusqu'à 1,5 jour", 'Oui', 'IP67', AI, 'Cardio optique']),
  w('mobvoi-ticwatch-e2', 'Mobvoi', 'Mobvoi TicWatch E2', 'TicWatch E', 2019, 159, ['1,39 pouce AMOLED', "Jusqu'à 2 jours", 'Oui', '5 ATM', AI, 'Cardio optique'], B),
  w('mobvoi-ticwatch-s2', 'Mobvoi', 'Mobvoi TicWatch S2', 'TicWatch S', 2019, 179, ['1,39 pouce AMOLED', "Jusqu'à 2 jours", 'Oui', '5 ATM', AI, 'Cardio optique']),
  w('mobvoi-ticwatch-c2', 'Mobvoi', 'Mobvoi TicWatch C2', 'TicWatch C', 2018, 199, ['1,3 pouce AMOLED', "Jusqu'à 2 jours", 'Oui', 'IP68', AI, 'Cardio optique'], ['mobile']),
  w('mobvoi-ticwatch-pro', 'Mobvoi', 'Mobvoi TicWatch Pro', 'TicWatch Pro', 2018, 249, ['1,39 pouce AMOLED + LCD FSTN', "Jusqu'à 5 jours", 'Oui', 'IP68', AI, 'Cardio optique']),
  w('mobvoi-ticwatch-pro-2020', 'Mobvoi', 'Mobvoi TicWatch Pro 2020', 'TicWatch Pro', 2020, 259, ['1,39 pouce AMOLED + LCD FSTN', "Jusqu'à 5 jours", 'Oui', 'IP68', AI, 'Cardio optique']),
  w('mobvoi-ticwatch-pro-3-gps', 'Mobvoi', 'Mobvoi TicWatch Pro 3 GPS', 'TicWatch Pro', 2020, 299, ['1,4 pouce AMOLED + LCD FSTN', "Jusqu'à 3 jours", 'Oui', 'IP68', AI, 'Cardio optique, oxymètre (SpO2)']),
  w('mobvoi-ticwatch-pro-3-ultra-gps', 'Mobvoi', 'Mobvoi TicWatch Pro 3 Ultra GPS', 'TicWatch Pro', 2021, 329, ['1,4 pouce AMOLED + LCD FSTN', "Jusqu'à 3 jours", 'Oui', 'IP68, MIL-STD-810G', AI, 'Cardio optique, oxymètre (SpO2)'], R),
  w('mobvoi-ticwatch-pro-5', 'Mobvoi', 'Mobvoi TicWatch Pro 5', 'TicWatch Pro', 2023, 359, ['1,43 pouce AMOLED + LCD ULP', "Jusqu'à 80 h", 'Oui', '5 ATM, MIL-STD-810H', AN, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], R),
  w('mobvoi-ticwatch-pro-5-enduro', 'Mobvoi', 'Mobvoi TicWatch Pro 5 Enduro', 'TicWatch Pro', 2024, 379, ['1,43 pouce AMOLED + LCD ULP', "Jusqu'à 90 h", 'Oui', '5 ATM, MIL-STD-810H', AN, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], R),
  w('mobvoi-ticwatch-e3', 'Mobvoi', 'Mobvoi TicWatch E3', 'TicWatch E', 2021, 199, ['1,3 pouce LCD', "Jusqu'à 2 jours", 'Oui', 'IP68', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('mobvoi-ticwatch-gth', 'Mobvoi', 'Mobvoi TicWatch GTH', 'TicWatch GT', 2020, 79, ['1,55 pouce LCD tactile', "Jusqu'à 10 jours", 'Non', 'IP68', AI, 'Cardio optique, oxymètre (SpO2), température cutanée'], B),
  w('mobvoi-ticwatch-atlas', 'Mobvoi', 'Mobvoi TicWatch Atlas', 'TicWatch Atlas', 2024, 349, ['1,43 pouce AMOLED + LCD ULP', "Jusqu'à 90 h", 'Oui', '5 ATM, MIL-STD-810H', AN, 'Cardio optique, oxymètre (SpO2), baromètre, boussole'], R),

  // ─── OnePlus ─────────────────────────────────────────────────────────────
  w('oneplus-watch', 'OnePlus', 'OnePlus Watch', 'OnePlus Watch', 2021, 159, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AN, 'Cardio optique, oxymètre (SpO2)']),
  w('oneplus-watch-2', 'OnePlus', 'OnePlus Watch 2', 'OnePlus Watch', 2024, 329, ['1,43 pouce AMOLED', "Jusqu'à 100 h", 'Oui (bifréquence)', '5 ATM, IP68', AN, 'Cardio optique, oxymètre (SpO2), baromètre']),
  w('oneplus-watch-2r', 'OnePlus', 'OnePlus Watch 2R', 'OnePlus Watch', 2024, 279, ['1,43 pouce AMOLED', "Jusqu'à 100 h", 'Oui (bifréquence)', '5 ATM, IP68', AN, 'Cardio optique, oxymètre (SpO2), baromètre']),
  w('oneplus-watch-3-47mm', 'OnePlus', 'OnePlus Watch 3 47 mm', 'OnePlus Watch', 2025, 399, ['1,5 pouce LTPO AMOLED', "Jusqu'à 120 h", 'Oui (bifréquence)', '5 ATM, IP68', AN, 'Cardio optique, ECG, oxymètre (SpO2), température cutanée']),
  w('oneplus-watch-3-43mm', 'OnePlus', 'OnePlus Watch 3 43 mm', 'OnePlus Watch', 2025, 299, ['AMOLED', null, 'Oui (bifréquence)', '5 ATM, IP68', AN, 'Cardio optique, ECG, oxymètre (SpO2), température cutanée']),

  // ─── Honor ───────────────────────────────────────────────────────────────
  w('honor-band-5', 'Honor', 'Honor Band 5', 'Honor Band', 2019, 39, ['0,95 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('honor-band-6', 'Honor', 'Honor Band 6', 'Honor Band', 2021, 49, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('honor-band-7', 'Honor', 'Honor Band 7', 'Honor Band', 2022, 59, ['1,47 pouce AMOLED', "Jusqu'à 14 jours", 'Non', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('honor-magicwatch-2-42mm', 'Honor', 'Honor MagicWatch 2 42 mm', 'Honor MagicWatch', 2019, 179, ['1,2 pouce AMOLED', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre']),
  w('honor-magicwatch-2-46mm', 'Honor', 'Honor MagicWatch 2 46 mm', 'Honor MagicWatch', 2019, 179, ['1,39 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre']),
  w('honor-watch-gs-pro', 'Honor', 'Honor Watch GS Pro', 'Honor Watch', 2020, 249, ['1,39 pouce AMOLED', "Jusqu'à 25 jours", 'Oui', '5 ATM, MIL-STD-810G', AI, 'Cardio optique, oxymètre (SpO2), baromètre'], R),
  w('honor-watch-gs-3', 'Honor', 'Honor Watch GS 3', 'Honor Watch', 2021, 199, ['1,43 pouce AMOLED', "Jusqu'à 14 jours", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)']),
  w('honor-watch-4', 'Honor', 'Honor Watch 4', 'Honor Watch', 2023, 149, ['1,75 pouce AMOLED', "Jusqu'à 14 jours", 'Oui', '5 ATM', AI, 'Cardio optique, oxymètre (SpO2)'], B),

  // ─── Autres marques ──────────────────────────────────────────────────────
  w('cmf-watch-pro', 'CMF by Nothing', 'CMF by Nothing Watch Pro', 'CMF Watch', 2023, 69, ['1,96 pouce AMOLED', "Jusqu'à 13 jours", 'Oui', 'IP68', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('cmf-watch-pro-2', 'CMF by Nothing', 'CMF by Nothing Watch Pro 2', 'CMF Watch', 2024, 69, ['1,32 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', 'IP68', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('cmf-watch-3-pro', 'CMF by Nothing', 'CMF by Nothing Watch 3 Pro', 'CMF Watch', 2025, 99, ['1,43 pouce AMOLED', "Jusqu'à 13 jours", 'Oui (bifréquence)', 'IP68', AI, 'Cardio optique, oxymètre (SpO2)'], B),
  w('oppo-watch-41mm', 'Oppo', 'Oppo Watch 41 mm', 'Oppo Watch', 2020, 249, ['1,6 pouce AMOLED incurvé', "Jusqu'à 24 h", 'Oui', '3 ATM', AN, 'Cardio optique'], ['mobile']),
  w('oppo-watch-46mm', 'Oppo', 'Oppo Watch 46 mm', 'Oppo Watch', 2020, 349, ['1,91 pouce AMOLED incurvé', "Jusqu'à 36 h", 'Oui', '3 ATM', AN, 'Cardio optique'], ['mobile']),
  w('tag-heuer-connected-calibre-e4-42mm', 'TAG Heuer', 'TAG Heuer Connected Calibre E4 42 mm', 'TAG Heuer Connected', 2022, 1600, ['1,28 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AI, 'Cardio optique'], ['mobile', 'sport', 'pro']),
  w('tag-heuer-connected-calibre-e4-45mm', 'TAG Heuer', 'TAG Heuer Connected Calibre E4 45 mm', 'TAG Heuer Connected', 2022, 1800, ['1,39 pouce AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AI, 'Cardio optique'], ['mobile', 'sport', 'pro']),
  w('casio-g-shock-gsw-h1000', 'Casio', 'Casio G-Shock GSW-H1000', 'G-Shock', 2021, 699, ['1,2 pouce LCD couleur + monochrome', null, 'Oui', '20 ATM', `${AI} (${WO})`, 'Cardio optique, baromètre, boussole'], R),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [IO];
