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
const E = 'Cardio optique Elevate';
const ES = 'Cardio optique Elevate, oxymètre (SpO2)';
const ESB = 'Cardio optique Elevate, oxymètre (SpO2), baromètre';
const OUT = 'Cardio optique Elevate, oxymètre (SpO2), altimètre barométrique, boussole';
const OUTE = 'Cardio optique Elevate, ECG, oxymètre (SpO2), altimètre barométrique, boussole';
const g = (slug: string, name: string, family: string, year: number, msrp: number | null, s: [V, V, V, V, V, V], tags?: string[]) =>
  w(`garmin-${slug}`, 'Garmin', `Garmin ${name}`, family, year, msrp, s, tags);

export const PRODUCTS: CatalogProduct[] = [
  // ─── Forerunner ──────────────────────────────────────────────────────────
  g('forerunner-15', 'Forerunner 15', 'Forerunner', 2014, 129, ['Écran monochrome', "Jusqu'à 8 h en GPS", 'Oui', '5 ATM', null, 'Accéléromètre (cardio via ceinture)'], B),
  g('forerunner-25', 'Forerunner 25', 'Forerunner', 2015, 169, ['Écran monochrome', "Jusqu'à 10 h en GPS", 'Oui', '5 ATM', AI, 'Accéléromètre (cardio via ceinture)'], B),
  g('forerunner-30', 'Forerunner 30', 'Forerunner', 2017, 179, ['Écran MIP', "Jusqu'à 8 h en GPS", 'Oui', '5 ATM', AI, E], B),
  g('forerunner-35', 'Forerunner 35', 'Forerunner', 2016, 199, ['Écran MIP monochrome', "Jusqu'à 13 h en GPS", 'Oui', '5 ATM', AI, E], B),
  g('forerunner-45', 'Forerunner 45', 'Forerunner', 2019, 199, ['1,04 pouce MIP couleur', "Jusqu'à 13 h en GPS", 'Oui', '5 ATM', AI, E], B),
  g('forerunner-45s', 'Forerunner 45S', 'Forerunner', 2019, 199, ['1,04 pouce MIP couleur', "Jusqu'à 13 h en GPS", 'Oui', '5 ATM', AI, E], B),
  g('forerunner-55', 'Forerunner 55', 'Forerunner', 2021, 199, ['1,04 pouce MIP couleur', "Jusqu'à 20 h en GPS", 'Oui', '5 ATM', AI, E], B),
  g('forerunner-165-music', 'Forerunner 165 Music', 'Forerunner', 2024, 330, ['1,2 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ESB]),
  g('forerunner-235', 'Forerunner 235', 'Forerunner', 2015, 299, ['1,23 pouce MIP couleur', "Jusqu'à 11 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique']),
  g('forerunner-245', 'Forerunner 245', 'Forerunner', 2019, 299, ['1,2 pouce MIP couleur', "Jusqu'à 24 h en GPS", 'Oui', '5 ATM', AI, ES]),
  g('forerunner-245-music', 'Forerunner 245 Music', 'Forerunner', 2019, 349, ['1,2 pouce MIP couleur', "Jusqu'à 24 h en GPS", 'Oui', '5 ATM', AI, ES]),
  g('forerunner-255', 'Forerunner 255', 'Forerunner', 2022, 349, ['1,3 pouce MIP couleur', "Jusqu'à 14 jours", 'Oui (multi-bandes)', '5 ATM', AI, ESB]),
  g('forerunner-255s', 'Forerunner 255S', 'Forerunner', 2022, 349, ['1,1 pouce MIP couleur', "Jusqu'à 12 jours", 'Oui (multi-bandes)', '5 ATM', AI, ESB]),
  g('forerunner-255-music', 'Forerunner 255 Music', 'Forerunner', 2022, 399, ['1,3 pouce MIP couleur', "Jusqu'à 14 jours", 'Oui (multi-bandes)', '5 ATM', AI, ESB]),
  g('forerunner-255s-music', 'Forerunner 255S Music', 'Forerunner', 2022, 399, ['1,1 pouce MIP couleur', "Jusqu'à 12 jours", 'Oui (multi-bandes)', '5 ATM', AI, ESB]),
  g('forerunner-265s', 'Forerunner 265S', 'Forerunner', 2023, 450, ['1,1 pouce AMOLED', "Jusqu'à 15 jours", 'Oui (multi-bandes)', '5 ATM', AI, ESB]),
  g('forerunner-570-42mm', 'Forerunner 570 42 mm', 'Forerunner', 2025, 549, ['1,2 pouce AMOLED', "Jusqu'à 10 jours", 'Oui (multi-bandes)', '5 ATM', AI, 'Cardio optique Elevate, ECG, oxymètre (SpO2), baromètre']),
  g('forerunner-570-47mm', 'Forerunner 570 47 mm', 'Forerunner', 2025, 549, ['1,4 pouce AMOLED', "Jusqu'à 11 jours", 'Oui (multi-bandes)', '5 ATM', AI, 'Cardio optique Elevate, ECG, oxymètre (SpO2), baromètre']),
  g('forerunner-645', 'Forerunner 645', 'Forerunner', 2018, 399, ['1,2 pouce MIP couleur', "Jusqu'à 12 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, baromètre']),
  g('forerunner-645-music', 'Forerunner 645 Music', 'Forerunner', 2018, 449, ['1,2 pouce MIP couleur', "Jusqu'à 5 h en GPS + musique", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, baromètre']),
  g('forerunner-735xt', 'Forerunner 735XT', 'Forerunner', 2016, 349, ['1,23 pouce MIP couleur', "Jusqu'à 14 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate']),
  g('forerunner-745', 'Forerunner 745', 'Forerunner', 2020, 499, ['1,2 pouce MIP couleur', "Jusqu'à 16 h en GPS", 'Oui', '5 ATM', AI, ESB]),
  g('forerunner-935', 'Forerunner 935', 'Forerunner', 2017, 499, ['1,2 pouce MIP couleur', "Jusqu'à 24 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole']),
  g('forerunner-945', 'Forerunner 945', 'Forerunner', 2019, 599, ['1,2 pouce MIP couleur', "Jusqu'à 36 h en GPS", 'Oui', '5 ATM', AI, OUT]),
  g('forerunner-945-lte', 'Forerunner 945 LTE', 'Forerunner', 2021, 649, ['1,2 pouce MIP couleur', "Jusqu'à 35 h en GPS", 'Oui', '5 ATM', AI, OUT]),
  g('forerunner-955', 'Forerunner 955', 'Forerunner', 2022, 549, ['1,3 pouce MIP couleur', "Jusqu'à 15 jours", 'Oui (multi-bandes)', '5 ATM', AI, OUT]),
  g('forerunner-955-solar', 'Forerunner 955 Solar', 'Forerunner', 2022, 649, ['1,3 pouce MIP couleur', "Jusqu'à 20 jours (solaire)", 'Oui (multi-bandes)', '5 ATM', AI, OUT]),
  g('forerunner-970', 'Forerunner 970', 'Forerunner', 2025, 749, ['1,4 pouce AMOLED', "Jusqu'à 15 jours", 'Oui (multi-bandes)', '5 ATM', AI, OUTE]),

  // ─── fēnix 3 → 6 ─────────────────────────────────────────────────────────
  g('fenix-3', 'Fenix 3', 'Fenix', 2015, 499, ['1,2 pouce couleur transflectif', "Jusqu'à 20 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole'], R),
  g('fenix-3-hr', 'Fenix 3 HR', 'Fenix', 2016, 599, ['1,2 pouce couleur transflectif', "Jusqu'à 16 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5s', 'Fenix 5S', 'Fenix', 2017, 599, ['1,1 pouce MIP couleur', "Jusqu'à 14 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5', 'Fenix 5', 'Fenix', 2017, 599, ['1,2 pouce MIP couleur', "Jusqu'à 24 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5x', 'Fenix 5X', 'Fenix', 2017, 749, ['1,2 pouce MIP couleur', "Jusqu'à 20 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5s-plus', 'Fenix 5S Plus', 'Fenix', 2018, 699, ['1,2 pouce MIP couleur', "Jusqu'à 11 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5-plus', 'Fenix 5 Plus', 'Fenix', 2018, 699, ['1,2 pouce MIP couleur', "Jusqu'à 18 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, altimètre barométrique, boussole'], R),
  g('fenix-5x-plus', 'Fenix 5X Plus', 'Fenix', 2018, 849, ['1,2 pouce MIP couleur', "Jusqu'à 32 h en GPS", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6s', 'Fenix 6S', 'Fenix', 2019, 549, ['1,2 pouce MIP couleur', "Jusqu'à 9 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6s-pro', 'Fenix 6S Pro', 'Fenix', 2019, 649, ['1,2 pouce MIP couleur', "Jusqu'à 9 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6', 'Fenix 6', 'Fenix', 2019, 599, ['1,3 pouce MIP couleur', "Jusqu'à 14 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6-pro', 'Fenix 6 Pro', 'Fenix', 2019, 699, ['1,3 pouce MIP couleur', "Jusqu'à 14 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6x-pro', 'Fenix 6X Pro', 'Fenix', 2019, 799, ['1,4 pouce MIP couleur', "Jusqu'à 21 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6s-pro-solar', 'Fenix 6S Pro Solar', 'Fenix', 2020, 749, ['1,2 pouce MIP couleur', "Jusqu'à 10,5 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6-pro-solar', 'Fenix 6 Pro Solar', 'Fenix', 2020, 799, ['1,3 pouce MIP couleur', "Jusqu'à 16 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-6x-pro-solar', 'Fenix 6X Pro Solar', 'Fenix', 2020, 949, ['1,4 pouce MIP couleur', "Jusqu'à 24 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),

  // ─── fēnix 7 / 7 Pro ─────────────────────────────────────────────────────
  g('fenix-7s', 'Fenix 7S', 'Fenix', 2022, 700, ['1,2 pouce MIP couleur', "Jusqu'à 11 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7s-solar', 'Fenix 7S Solar', 'Fenix', 2022, 800, ['1,2 pouce MIP couleur', "Jusqu'à 14 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7s-sapphire-solar', 'Fenix 7S Sapphire Solar', 'Fenix', 2022, 900, ['1,2 pouce MIP couleur', "Jusqu'à 14 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-7-solar', 'Fenix 7 Solar', 'Fenix', 2022, 800, ['1,3 pouce MIP couleur', "Jusqu'à 22 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7-sapphire-solar', 'Fenix 7 Sapphire Solar', 'Fenix', 2022, 900, ['1,3 pouce MIP couleur', "Jusqu'à 22 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-7x-solar', 'Fenix 7X Solar', 'Fenix', 2022, 900, ['1,4 pouce MIP couleur', "Jusqu'à 37 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7x-sapphire-solar', 'Fenix 7X Sapphire Solar', 'Fenix', 2022, 1000, ['1,4 pouce MIP couleur', "Jusqu'à 37 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-7s-pro-solar', 'Fenix 7S Pro Solar', 'Fenix', 2023, 800, ['1,2 pouce MIP couleur', "Jusqu'à 14 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7s-pro-sapphire-solar', 'Fenix 7S Pro Sapphire Solar', 'Fenix', 2023, 900, ['1,2 pouce MIP couleur', "Jusqu'à 14 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-7-pro-solar', 'Fenix 7 Pro Solar', 'Fenix', 2023, 800, ['1,3 pouce MIP couleur', "Jusqu'à 22 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7-pro-sapphire-solar', 'Fenix 7 Pro Sapphire Solar', 'Fenix', 2023, 900, ['1,3 pouce MIP couleur', "Jusqu'à 22 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-7x-pro-solar', 'Fenix 7X Pro Solar', 'Fenix', 2023, 900, ['1,4 pouce MIP couleur', "Jusqu'à 37 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('fenix-7x-pro-sapphire-solar', 'Fenix 7X Pro Sapphire Solar', 'Fenix', 2023, 1000, ['1,4 pouce MIP couleur', "Jusqu'à 37 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),

  // ─── fēnix 8 / E / 8 Pro ─────────────────────────────────────────────────
  g('fenix-8-43mm-amoled', 'Fenix 8 43 mm AMOLED', 'Fenix', 2024, 1000, ['1,3 pouce AMOLED', "Jusqu'à 10 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-8-51mm-amoled', 'Fenix 8 51 mm AMOLED', 'Fenix', 2024, 1100, ['1,4 pouce AMOLED', "Jusqu'à 29 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-8-47mm-solar', 'Fenix 8 47 mm Solar', 'Fenix', 2024, 1100, ['1,3 pouce MIP couleur', "Jusqu'à 28 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-8-51mm-solar', 'Fenix 8 51 mm Solar', 'Fenix', 2024, 1200, ['1,4 pouce MIP couleur', "Jusqu'à 48 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-e-47mm', 'Fenix E 47 mm', 'Fenix', 2024, 800, ['1,4 pouce AMOLED', "Jusqu'à 16 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('fenix-8-pro-47mm-amoled', 'Fenix 8 Pro 47 mm AMOLED', 'Fenix', 2025, 1200, ['1,4 pouce AMOLED', null, 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-8-pro-51mm-amoled', 'Fenix 8 Pro 51 mm AMOLED', 'Fenix', 2025, 1300, ['1,4 pouce AMOLED', null, 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),
  g('fenix-8-pro-51mm-microled', 'Fenix 8 Pro 51 mm MicroLED', 'Fenix', 2025, 2000, ['1,4 pouce MicroLED', null, 'Oui (multi-bandes)', '10 ATM', AI, OUTE], R),

  // ─── epix, Enduro ────────────────────────────────────────────────────────
  g('epix-gen-2', 'epix (Gen 2)', 'epix', 2022, 900, ['1,3 pouce AMOLED', "Jusqu'à 16 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('epix-pro-gen-2-42mm', 'epix Pro (Gen 2) 42 mm', 'epix', 2023, 900, ['1,2 pouce AMOLED', "Jusqu'à 10 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('epix-pro-gen-2-47mm', 'epix Pro (Gen 2) 47 mm', 'epix', 2023, 1000, ['1,3 pouce AMOLED', "Jusqu'à 16 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('epix-pro-gen-2-51mm', 'epix Pro (Gen 2) 51 mm', 'epix', 2023, 1100, ['1,4 pouce AMOLED', "Jusqu'à 31 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('enduro', 'Enduro', 'Enduro', 2021, 799, ['1,4 pouce MIP couleur', "Jusqu'à 65 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('enduro-2', 'Enduro 2', 'Enduro', 2022, 1099, ['1,4 pouce MIP couleur', "Jusqu'à 46 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('enduro-3', 'Enduro 3', 'Enduro', 2024, 900, ['1,4 pouce MIP couleur', "Jusqu'à 90 jours (solaire)", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),

  // ─── Instinct ────────────────────────────────────────────────────────────
  g('instinct', 'Instinct', 'Instinct', 2018, 299, ['0,9 pouce MIP monochrome', "Jusqu'à 14 jours", 'Oui', '10 ATM', AI, 'Cardio optique, altimètre barométrique, boussole'], R),
  g('instinct-solar', 'Instinct Solar', 'Instinct', 2020, 399, ['0,9 pouce MIP monochrome', "Jusqu'à 54 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-tactical', 'Instinct Tactical', 'Instinct', 2019, 349, ['0,9 pouce MIP monochrome', "Jusqu'à 14 jours", 'Oui', '10 ATM', AI, 'Cardio optique, altimètre barométrique, boussole'], R),
  g('instinct-2s', 'Instinct 2S', 'Instinct', 2022, 300, ['0,8 pouce MIP monochrome', "Jusqu'à 21 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-2s-solar', 'Instinct 2S Solar', 'Instinct', 2022, 400, ['0,8 pouce MIP monochrome', "Jusqu'à 51 jours (solaire)", 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-2-solar', 'Instinct 2 Solar 45 mm', 'Instinct', 2022, 450, ['0,9 pouce MIP monochrome', 'Illimitée (solaire, mode montre)', 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-2x-solar', 'Instinct 2X Solar', 'Instinct', 2023, 450, ['1,1 pouce MIP monochrome', 'Illimitée (solaire, mode montre)', 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('instinct-crossover', 'Instinct Crossover', 'Instinct', 2022, 500, ['0,9 pouce MIP + aiguilles', "Jusqu'à 28 jours", 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-crossover-solar', 'Instinct Crossover Solar', 'Instinct', 2022, 550, ['0,9 pouce MIP + aiguilles', 'Illimitée (solaire, mode montre)', 'Oui', '10 ATM', AI, OUT], R),
  g('instinct-crossover-amoled', 'Instinct Crossover AMOLED', 'Instinct', 2025, 600, ['1,3 pouce AMOLED + aiguilles', null, 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('instinct-3-50mm-amoled', 'Instinct 3 AMOLED 50 mm', 'Instinct', 2025, 500, ['1,3 pouce AMOLED', "Jusqu'à 24 jours", 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('instinct-3-45mm-solar', 'Instinct 3 Solar 45 mm', 'Instinct', 2025, 400, ['MIP monochrome', 'Illimitée (solaire, mode montre)', 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('instinct-3-50mm-solar', 'Instinct 3 Solar 50 mm', 'Instinct', 2025, 450, ['MIP monochrome', 'Illimitée (solaire, mode montre)', 'Oui (multi-bandes)', '10 ATM', AI, OUT], R),
  g('instinct-e-40mm', 'Instinct E 40 mm', 'Instinct', 2025, 300, ['MIP monochrome', "Jusqu'à 16 jours", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, boussole'], R),
  g('instinct-e-45mm', 'Instinct E 45 mm', 'Instinct', 2025, 300, ['MIP monochrome', "Jusqu'à 16 jours", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, boussole'], R),

  // ─── Venu ────────────────────────────────────────────────────────────────
  g('venu', 'Venu', 'Venu', 2019, 399, ['1,2 pouce AMOLED', "Jusqu'à 5 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-sq', 'Venu Sq', 'Venu', 2020, 199, ['1,3 pouce LCD couleur', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-sq-music', 'Venu Sq Music', 'Venu', 2020, 249, ['1,3 pouce LCD couleur', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-2', 'Venu 2', 'Venu', 2021, 399, ['1,3 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-2s', 'Venu 2S', 'Venu', 2021, 399, ['1,1 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-2-plus', 'Venu 2 Plus', 'Venu', 2022, 449, ['1,3 pouce AMOLED', "Jusqu'à 9 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-sq-2', 'Venu Sq 2', 'Venu', 2022, 249, ['1,4 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-sq-2-music', 'Venu Sq 2 Music', 'Venu', 2022, 299, ['1,4 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ES]),
  g('venu-3s-41mm', 'Venu 3S 41 mm', 'Venu', 2023, 450, ['1,2 pouce AMOLED', "Jusqu'à 10 jours", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, ECG, oxymètre (SpO2)']),
  g('venu-x1', 'Venu X1', 'Venu', 2025, 800, ['2 pouces AMOLED', "Jusqu'à 8 jours", 'Oui (multi-bandes)', '5 ATM', AI, OUTE]),
  g('venu-4-41mm', 'Venu 4 41 mm', 'Venu', 2025, 550, ['AMOLED', "Jusqu'à 10 jours", 'Oui (multi-bandes)', '5 ATM', AI, 'Cardio optique Elevate, ECG, oxymètre (SpO2), température cutanée']),
  g('venu-4-45mm', 'Venu 4 45 mm', 'Venu', 2025, 550, ['AMOLED', "Jusqu'à 12 jours", 'Oui (multi-bandes)', '5 ATM', AI, 'Cardio optique Elevate, ECG, oxymètre (SpO2), température cutanée']),

  // ─── vívoactive ──────────────────────────────────────────────────────────
  g('vivoactive-hr', 'vivoactive HR', 'vivoactive', 2016, 299, ['LCD couleur tactile', "Jusqu'à 8 jours", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, altimètre barométrique']),
  g('vivoactive-3', 'vivoactive 3', 'vivoactive', 2017, 299, ['1,2 pouce MIP couleur tactile', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, altimètre barométrique']),
  g('vivoactive-3-music', 'vivoactive 3 Music', 'vivoactive', 2018, 299, ['1,2 pouce MIP couleur tactile', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, altimètre barométrique']),
  g('vivoactive-4', 'vivoactive 4', 'vivoactive', 2019, 299, ['1,3 pouce MIP couleur tactile', "Jusqu'à 8 jours", 'Oui', '5 ATM', AI, ES]),
  g('vivoactive-4s', 'vivoactive 4S', 'vivoactive', 2019, 299, ['1,1 pouce MIP couleur tactile', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, ES]),
  g('vivoactive-5', 'vivoactive 5', 'vivoactive', 2023, 300, ['1,2 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ES]),
  g('vivoactive-6', 'vivoactive 6', 'vivoactive', 2025, 300, ['1,2 pouce AMOLED', "Jusqu'à 11 jours", 'Oui', '5 ATM', AI, ES]),

  // ─── vívomove, vívosmart, vívofit, Lily ──────────────────────────────────
  g('vivomove-hr', 'vivomove HR', 'vivomove', 2017, 199, ['OLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique Elevate']),
  g('vivomove-3', 'vivomove 3', 'vivomove', 2019, 249, ['OLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivomove-3s', 'vivomove 3S', 'vivomove', 2019, 249, ['OLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivomove-style', 'vivomove Style', 'vivomove', 2019, 299, ['AMOLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivomove-luxe', 'vivomove Luxe', 'vivomove', 2019, 499, ['AMOLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivomove-sport', 'vivomove Sport', 'vivomove', 2022, 179, ['OLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivomove-trend', 'vivomove Trend', 'vivomove', 2023, 299, ['OLED + aiguilles', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('vivosmart-3', 'vivosmart 3', 'vivosmart', 2017, 139, ['OLED monochrome', "Jusqu'à 5 jours", 'Non', '5 ATM', AI, 'Cardio optique Elevate'], B),
  g('vivosmart-4', 'vivosmart 4', 'vivosmart', 2018, 129, ['OLED monochrome', "Jusqu'à 7 jours", 'Non', '5 ATM', AI, ES], B),
  g('vivosmart-5', 'vivosmart 5', 'vivosmart', 2022, 149, ['OLED monochrome', "Jusqu'à 7 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES], B),
  g('vivofit-4', 'vivofit 4', 'vivofit', 2018, 79, ['MIP couleur', "Plus d'un an (pile)", 'Non', '5 ATM', AI, 'Accéléromètre'], B),
  g('vivofit-jr-3', 'vivofit jr. 3', 'vivofit', 2019, 79, ['MIP couleur', "Plus d'un an (pile)", 'Non', '5 ATM', AI, 'Accéléromètre (bracelet enfant)'], B),
  g('lily', 'Lily', 'Lily', 2021, 199, ['LCD tactile monochrome', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('lily-2', 'Lily 2', 'Lily', 2024, 249, ['LCD tactile monochrome', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, ES]),
  g('lily-2-active', 'Lily 2 Active', 'Lily', 2024, 299, ['LCD tactile monochrome', "Jusqu'à 9 jours", 'Oui', '5 ATM', AI, ES]),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [AN, IO];
