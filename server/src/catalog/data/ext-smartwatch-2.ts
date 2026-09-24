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
const PW = 'Cardio multi-trajets, ECG, oxymètre (SpO2), température cutanée';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Google Pixel Watch ──────────────────────────────────────────────────
  w('google-pixel-watch-41mm-wifi', 'Google', 'Google Pixel Watch 41 mm Wi-Fi', 'Pixel Watch', 2022, 379, ['41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AN, 'Cardio optique, ECG, oxymètre (SpO2)']),
  w('google-pixel-watch-41mm-lte', 'Google', 'Google Pixel Watch 41 mm 4G LTE', 'Pixel Watch', 2022, 429, ['41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AN, 'Cardio optique, ECG, oxymètre (SpO2)']),
  w('google-pixel-watch-2-41mm-lte', 'Google', 'Google Pixel Watch 2 41 mm 4G LTE', 'Pixel Watch', 2023, 449, ['41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AN, PW]),
  w('google-pixel-watch-3-41mm-lte', 'Google', 'Google Pixel Watch 3 41 mm 4G LTE', 'Pixel Watch', 2024, 499, ['41 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AN, PW]),
  w('google-pixel-watch-3-45mm-lte', 'Google', 'Google Pixel Watch 3 45 mm 4G LTE', 'Pixel Watch', 2024, 549, ['45 mm AMOLED', "Jusqu'à 24 h", 'Oui', '5 ATM', AN, PW]),
  w('google-pixel-watch-4-41mm-lte', 'Google', 'Google Pixel Watch 4 41 mm 4G LTE', 'Pixel Watch', 2025, 499, ['41 mm AMOLED', "Jusqu'à 30 h", 'Oui (bifréquence)', '5 ATM', AN, PW]),
  w('google-pixel-watch-4-45mm-wifi', 'Google', 'Google Pixel Watch 4 45 mm Wi-Fi', 'Pixel Watch', 2025, 449, ['45 mm AMOLED', "Jusqu'à 40 h", 'Oui (bifréquence)', '5 ATM', AN, PW]),
  w('google-pixel-watch-4-45mm-lte', 'Google', 'Google Pixel Watch 4 45 mm 4G LTE', 'Pixel Watch', 2025, 549, ['45 mm AMOLED', "Jusqu'à 40 h", 'Oui (bifréquence)', '5 ATM', AN, PW]),

  // ─── Fitbit ──────────────────────────────────────────────────────────────
  w('fitbit-charge-hr', 'Fitbit', 'Fitbit Charge HR', 'Fitbit Charge', 2015, 149, ['OLED monochrome', "Jusqu'à 5 jours", 'Non', 'Résistant aux éclaboussures', AI, 'Cardio optique, altimètre'], B),
  w('fitbit-surge', 'Fitbit', 'Fitbit Surge', 'Fitbit Surge', 2015, 249, ['LCD monochrome tactile', "Jusqu'à 7 jours", 'Oui', 'Résistant aux éclaboussures', AI, 'Cardio optique, altimètre']),
  w('fitbit-blaze', 'Fitbit', 'Fitbit Blaze', 'Fitbit Blaze', 2016, 229, ['LCD couleur tactile', "Jusqu'à 5 jours", 'Connecté (via smartphone)', 'Résistant aux éclaboussures', AI, 'Cardio optique, altimètre']),
  w('fitbit-alta', 'Fitbit', 'Fitbit Alta', 'Fitbit Alta', 2016, 129, ['OLED monochrome', "Jusqu'à 5 jours", 'Non', 'Résistant aux éclaboussures', AI, 'Accéléromètre'], B),
  w('fitbit-alta-hr', 'Fitbit', 'Fitbit Alta HR', 'Fitbit Alta', 2017, 149, ['OLED monochrome', "Jusqu'à 7 jours", 'Non', 'Résistant aux éclaboussures', AI, 'Cardio optique'], B),
  w('fitbit-charge-2', 'Fitbit', 'Fitbit Charge 2', 'Fitbit Charge', 2016, 149, ['OLED monochrome', "Jusqu'à 5 jours", 'Connecté (via smartphone)', 'Résistant aux éclaboussures', AI, 'Cardio optique, altimètre'], B),
  w('fitbit-charge-3', 'Fitbit', 'Fitbit Charge 3', 'Fitbit Charge', 2018, 149, ['OLED monochrome tactile', "Jusqu'à 7 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, altimètre, SpO2'], B),
  w('fitbit-charge-4', 'Fitbit', 'Fitbit Charge 4', 'Fitbit Charge', 2020, 149, ['OLED monochrome tactile', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique, altimètre, SpO2'], B),
  w('fitbit-charge-5', 'Fitbit', 'Fitbit Charge 5', 'Fitbit Charge', 2021, 179, ['AMOLED couleur', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique, ECG, EDA, SpO2, température cutanée']),
  w('fitbit-charge-6', 'Fitbit', 'Fitbit Charge 6', 'Fitbit Charge', 2023, 159, ['AMOLED couleur', "Jusqu'à 7 jours", 'Oui', '5 ATM', AI, 'Cardio optique, ECG, EDA, SpO2, température cutanée']),
  w('fitbit-ionic', 'Fitbit', 'Fitbit Ionic', 'Fitbit Ionic', 2017, 329, ['LCD couleur tactile', "Jusqu'à 5 jours", 'Oui', '5 ATM', AI, 'Cardio optique, altimètre, SpO2']),
  w('fitbit-versa', 'Fitbit', 'Fitbit Versa', 'Fitbit Versa', 2018, 199, ['1,34 pouce LCD couleur tactile', "Jusqu'à 4 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, altimètre, SpO2']),
  w('fitbit-versa-lite', 'Fitbit', 'Fitbit Versa Lite', 'Fitbit Versa', 2019, 159, ['1,34 pouce LCD couleur tactile', "Jusqu'à 4 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique'], B),
  w('fitbit-versa-2', 'Fitbit', 'Fitbit Versa 2', 'Fitbit Versa', 2019, 199, ['1,4 pouce AMOLED', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, SpO2']),
  w('fitbit-versa-3', 'Fitbit', 'Fitbit Versa 3', 'Fitbit Versa', 2020, 229, ['1,58 pouce AMOLED', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, 'Cardio optique, SpO2, température cutanée']),
  w('fitbit-versa-4', 'Fitbit', 'Fitbit Versa 4', 'Fitbit Versa', 2022, 229, ['1,58 pouce AMOLED', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, 'Cardio optique, SpO2, température cutanée']),
  w('fitbit-sense', 'Fitbit', 'Fitbit Sense', 'Fitbit Sense', 2020, 329, ['1,58 pouce AMOLED', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, 'Cardio optique, ECG, EDA, SpO2, température cutanée']),
  w('fitbit-sense-2', 'Fitbit', 'Fitbit Sense 2', 'Fitbit Sense', 2022, 299, ['1,58 pouce AMOLED', "Jusqu'à 6 jours", 'Oui', '5 ATM', AI, 'Cardio optique, ECG, cEDA, SpO2, température cutanée']),
  w('fitbit-inspire', 'Fitbit', 'Fitbit Inspire', 'Fitbit Inspire', 2019, 69, ['OLED monochrome tactile', "Jusqu'à 5 jours", 'Non', '5 ATM', AI, 'Accéléromètre'], B),
  w('fitbit-inspire-hr', 'Fitbit', 'Fitbit Inspire HR', 'Fitbit Inspire', 2019, 99, ['OLED monochrome tactile', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique'], B),
  w('fitbit-inspire-2', 'Fitbit', 'Fitbit Inspire 2', 'Fitbit Inspire', 2020, 99, ['OLED monochrome tactile', "Jusqu'à 10 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique'], B),
  w('fitbit-inspire-3', 'Fitbit', 'Fitbit Inspire 3', 'Fitbit Inspire', 2022, 99, ['AMOLED couleur', "Jusqu'à 10 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, SpO2'], B),
  w('fitbit-luxe', 'Fitbit', 'Fitbit Luxe', 'Fitbit Luxe', 2021, 149, ['AMOLED couleur', "Jusqu'à 5 jours", 'Connecté (via smartphone)', '5 ATM', AI, 'Cardio optique, EDA']),
  w('fitbit-ace-3', 'Fitbit', 'Fitbit Ace 3', 'Fitbit Ace', 2021, 79, ['PMOLED monochrome', "Jusqu'à 8 jours", 'Non', '5 ATM', AI, 'Accéléromètre'], B),

  // ─── Polar ───────────────────────────────────────────────────────────────
  w('polar-v800', 'Polar', 'Polar V800', 'Polar V', 2014, 449, ['Écran monochrome', null, 'Oui', '3 ATM', AI, 'Altimètre barométrique (cardio via ceinture)']),
  w('polar-m400', 'Polar', 'Polar M400', 'Polar M', 2014, 179, ['Écran monochrome', null, 'Oui', '3 ATM', AI, 'Accéléromètre (cardio via ceinture)'], B),
  w('polar-m430', 'Polar', 'Polar M430', 'Polar M', 2017, 229, ['Écran monochrome', "Jusqu'à 8 h en GPS", 'Oui', '3 ATM', AI, 'Cardio optique']),
  w('polar-m600', 'Polar', 'Polar M600', 'Polar M', 2016, 329, ['1,3 pouce LCD transflectif', "Jusqu'à 2 jours", 'Oui', 'IPX8', AI, 'Cardio optique']),
  w('polar-a360', 'Polar', 'Polar A360', 'Polar A', 2016, 199, ['Écran couleur tactile', "Jusqu'à 2 semaines", 'Non', '3 ATM', AI, 'Cardio optique'], B),
  w('polar-a370', 'Polar', 'Polar A370', 'Polar A', 2017, 179, ['Écran couleur tactile', "Jusqu'à 4 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique'], B),
  w('polar-vantage-m', 'Polar', 'Polar Vantage M', 'Polar Vantage', 2018, 279, ['1,2 pouce couleur transflectif', "Jusqu'à 30 h en GPS", 'Oui', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-vantage-v', 'Polar', 'Polar Vantage V', 'Polar Vantage', 2018, 499, ['1,2 pouce couleur transflectif tactile', "Jusqu'à 40 h en GPS", 'Oui', '3 ATM', AI, 'Cardio optique Precision Prime, baromètre']),
  w('polar-vantage-m2', 'Polar', 'Polar Vantage M2', 'Polar Vantage', 2021, 299, ['1,2 pouce couleur transflectif', "Jusqu'à 30 h en GPS", 'Oui', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-vantage-v2', 'Polar', 'Polar Vantage V2', 'Polar Vantage', 2020, 499, ['1,2 pouce couleur transflectif tactile', "Jusqu'à 40 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Precision Prime, baromètre, boussole']),
  w('polar-vantage-v3', 'Polar', 'Polar Vantage V3', 'Polar Vantage', 2023, 599, ['1,39 pouce AMOLED', "Jusqu'à 61 h en GPS", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique Elixir, ECG, SpO2, température cutanée, baromètre']),
  w('polar-grit-x', 'Polar', 'Polar Grit X', 'Polar Grit X', 2020, 429, ['1,2 pouce couleur transflectif', "Jusqu'à 40 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Precision Prime, baromètre, boussole'], R),
  w('polar-grit-x-pro', 'Polar', 'Polar Grit X Pro', 'Polar Grit X', 2022, 699, ['1,2 pouce couleur transflectif tactile', "Jusqu'à 40 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique Precision Prime, baromètre, boussole'], R),
  w('polar-grit-x2-pro', 'Polar', 'Polar Grit X2 Pro', 'Polar Grit X', 2023, 749, ['1,39 pouce AMOLED', "Jusqu'à 43 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique Elixir, ECG, SpO2, température cutanée, baromètre'], R),
  w('polar-grit-x2', 'Polar', 'Polar Grit X2', 'Polar Grit X', 2025, 429, ['1,28 pouce AMOLED', null, 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique Elixir, ECG, SpO2, température cutanée, baromètre'], R),
  w('polar-ignite', 'Polar', 'Polar Ignite', 'Polar Ignite', 2019, 199, ['1,2 pouce IPS couleur tactile', "Jusqu'à 5 jours", 'Oui', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-ignite-2', 'Polar', 'Polar Ignite 2', 'Polar Ignite', 2021, 229, ['1,2 pouce IPS couleur tactile', "Jusqu'à 5 jours", 'Oui', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-ignite-3', 'Polar', 'Polar Ignite 3', 'Polar Ignite', 2022, 329, ['1,28 pouce AMOLED', "Jusqu'à 5 jours", 'Oui (bifréquence)', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-ignite-3-titanium', 'Polar', 'Polar Ignite 3 Titane', 'Polar Ignite', 2023, 399, ['1,28 pouce AMOLED', "Jusqu'à 5 jours", 'Oui (bifréquence)', '3 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-unite', 'Polar', 'Polar Unite', 'Polar Unite', 2020, 149, ['1,2 pouce IPS couleur tactile', "Jusqu'à 4 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique Precision Prime'], B),
  w('polar-pacer', 'Polar', 'Polar Pacer', 'Polar Pacer', 2022, 199, ['1,2 pouce MIP couleur', "Jusqu'à 35 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Precision Prime']),
  w('polar-pacer-pro', 'Polar', 'Polar Pacer Pro', 'Polar Pacer', 2022, 299, ['1,2 pouce MIP couleur', "Jusqu'à 35 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Precision Prime, baromètre, boussole']),
  w('polar-loop-2025', 'Polar', 'Polar Loop (2025)', 'Polar Loop', 2025, 199, ['Sans écran', "Jusqu'à 8 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique, température cutanée']),

  // ─── Suunto ──────────────────────────────────────────────────────────────
  w('suunto-ambit3-peak', 'Suunto', 'Suunto Ambit3 Peak', 'Suunto Ambit', 2014, 449, ['Écran matriciel monochrome', "Jusqu'à 200 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole (cardio via ceinture)'], R),
  w('suunto-ambit3-sport', 'Suunto', 'Suunto Ambit3 Sport', 'Suunto Ambit', 2014, 349, ['Écran matriciel monochrome', "Jusqu'à 100 h en GPS", 'Oui', '5 ATM', AI, 'Boussole (cardio via ceinture)']),
  w('suunto-ambit3-run', 'Suunto', 'Suunto Ambit3 Run', 'Suunto Ambit', 2015, 249, ['Écran matriciel monochrome', "Jusqu'à 100 h en GPS", 'Oui', '5 ATM', AI, 'Accéléromètre (cardio via ceinture)']),
  w('suunto-ambit3-vertical', 'Suunto', 'Suunto Ambit3 Vertical', 'Suunto Ambit', 2016, 399, ['Écran matriciel monochrome', "Jusqu'à 100 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole (cardio via ceinture)'], R),
  w('suunto-spartan-ultra', 'Suunto', 'Suunto Spartan Ultra', 'Suunto Spartan', 2016, 649, ['1,3 pouce couleur tactile', "Jusqu'à 26 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole'], R),
  w('suunto-spartan-sport', 'Suunto', 'Suunto Spartan Sport', 'Suunto Spartan', 2016, 449, ['1,3 pouce couleur tactile', "Jusqu'à 10 h en GPS", 'Oui', '10 ATM', AI, 'Boussole (cardio via ceinture)']),
  w('suunto-spartan-sport-wrist-hr', 'Suunto', 'Suunto Spartan Sport Wrist HR', 'Suunto Spartan', 2017, 499, ['1,3 pouce couleur tactile', "Jusqu'à 10 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, boussole']),
  w('suunto-spartan-trainer-wrist-hr', 'Suunto', 'Suunto Spartan Trainer Wrist HR', 'Suunto Spartan', 2017, 279, ['Écran matriciel couleur', "Jusqu'à 10 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique, boussole']),
  w('suunto-3-fitness', 'Suunto', 'Suunto 3 Fitness', 'Suunto 3', 2018, 199, ['Écran matriciel couleur', "Jusqu'à 10 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique'], B),
  w('suunto-3', 'Suunto', 'Suunto 3', 'Suunto 3', 2020, 199, ['Écran matriciel couleur', "Jusqu'à 10 jours", 'Connecté (via smartphone)', '3 ATM', AI, 'Cardio optique'], B),
  w('suunto-5', 'Suunto', 'Suunto 5', 'Suunto 5', 2019, 329, ['Écran matriciel couleur', "Jusqu'à 40 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique, boussole']),
  w('suunto-5-peak', 'Suunto', 'Suunto 5 Peak', 'Suunto 5', 2021, 299, ['1,1 pouce matriciel couleur', "Jusqu'à 100 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, boussole']),
  w('suunto-7', 'Suunto', 'Suunto 7', 'Suunto 7', 2020, 479, ['1,97 pouce AMOLED tactile', "Jusqu'à 12 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique, boussole, baromètre']),
  w('suunto-9', 'Suunto', 'Suunto 9', 'Suunto 9', 2018, 499, ['1,4 pouce couleur tactile', "Jusqu'à 120 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, boussole'], R),
  w('suunto-9-baro', 'Suunto', 'Suunto 9 Baro', 'Suunto 9', 2019, 549, ['1,4 pouce couleur tactile', "Jusqu'à 120 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, altimètre barométrique, boussole'], R),
  w('suunto-9-peak', 'Suunto', 'Suunto 9 Peak', 'Suunto 9', 2021, 549, ['1,2 pouce couleur tactile', "Jusqu'à 170 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole'], R),
  w('suunto-9-peak-pro', 'Suunto', 'Suunto 9 Peak Pro', 'Suunto 9', 2022, 549, ['1,2 pouce couleur tactile', "Jusqu'à 300 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole'], R),
  w('suunto-vertical', 'Suunto', 'Suunto Vertical', 'Suunto Vertical', 2022, 629, ['1,4 pouce MIP couleur', "Jusqu'à 140 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole'], R),
  w('suunto-vertical-titanium-solar', 'Suunto', 'Suunto Vertical Titanium Solar', 'Suunto Vertical', 2022, 839, ['1,4 pouce MIP couleur', "Jusqu'à 500 h en GPS (solaire)", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole'], R),
  w('suunto-vertical-2', 'Suunto', 'Suunto Vertical 2', 'Suunto Vertical', 2025, 629, ['1,5 pouce AMOLED', null, 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole'], R),
  w('suunto-race', 'Suunto', 'Suunto Race', 'Suunto Race', 2023, 449, ['1,43 pouce AMOLED', "Jusqu'à 40 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole']),
  w('suunto-race-titanium', 'Suunto', 'Suunto Race Titanium', 'Suunto Race', 2023, 549, ['1,43 pouce AMOLED', "Jusqu'à 40 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole']),
  w('suunto-race-s', 'Suunto', 'Suunto Race S', 'Suunto Race', 2024, 299, ['1,32 pouce AMOLED', "Jusqu'à 30 h en GPS", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole']),
  w('suunto-race-2', 'Suunto', 'Suunto Race 2', 'Suunto Race', 2025, 499, ['1,5 pouce AMOLED', null, 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, altimètre barométrique, boussole']),
  w('suunto-run', 'Suunto', 'Suunto Run', 'Suunto Run', 2025, 249, ['1,32 pouce AMOLED', null, 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, SpO2']),
  w('suunto-ocean', 'Suunto', 'Suunto Ocean', 'Suunto Ocean', 2024, 899, ['1,43 pouce AMOLED', null, 'Oui (bifréquence)', '100 m (plongée)', AI, 'Cardio optique, profondimètre, altimètre barométrique, boussole'], R),
  w('suunto-traverse', 'Suunto', 'Suunto Traverse', 'Suunto Traverse', 2015, 399, ['Écran matriciel monochrome', "Jusqu'à 100 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole'], R),
  w('suunto-traverse-alpha', 'Suunto', 'Suunto Traverse Alpha', 'Suunto Traverse', 2016, 499, ['Écran matriciel monochrome', "Jusqu'à 100 h en GPS", 'Oui', '10 ATM', AI, 'Altimètre barométrique, boussole'], R),

  // ─── Coros ───────────────────────────────────────────────────────────────
  w('coros-pace', 'Coros', 'Coros Pace', 'Coros Pace', 2018, 299, ['1,2 pouce MIP couleur', "Jusqu'à 25 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre']),
  w('coros-pace-2', 'Coros', 'Coros Pace 2', 'Coros Pace', 2020, 199, ['1,2 pouce MIP couleur', "Jusqu'à 30 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique, baromètre, boussole']),
  w('coros-pace-3', 'Coros', 'Coros Pace 3', 'Coros Pace', 2023, 229, ['1,2 pouce MIP couleur', "Jusqu'à 38 h en GPS", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole']),
  w('coros-pace-pro', 'Coros', 'Coros Pace Pro', 'Coros Pace', 2024, 349, ['1,3 pouce AMOLED', "Jusqu'à 31 h en GPS", 'Oui (bifréquence)', '5 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole']),
  w('coros-apex-42mm', 'Coros', 'Coros Apex 42 mm', 'Coros Apex', 2019, 299, ['1,1 pouce MIP couleur', "Jusqu'à 25 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, baromètre']),
  w('coros-apex-46mm', 'Coros', 'Coros Apex 46 mm', 'Coros Apex', 2019, 349, ['1,2 pouce MIP couleur', "Jusqu'à 35 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, baromètre']),
  w('coros-apex-pro', 'Coros', 'Coros Apex Pro', 'Coros Apex', 2019, 499, ['1,2 pouce MIP couleur', "Jusqu'à 40 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole'], R),
  w('coros-apex-2', 'Coros', 'Coros Apex 2', 'Coros Apex', 2022, 399, ['1,2 pouce MIP couleur', "Jusqu'à 45 h en GPS", 'Oui', '10 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole']),
  w('coros-apex-2-pro', 'Coros', 'Coros Apex 2 Pro', 'Coros Apex', 2022, 549, ['1,3 pouce MIP couleur', "Jusqu'à 75 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole'], R),
  w('coros-vertix', 'Coros', 'Coros Vertix', 'Coros Vertix', 2019, 599, ['1,2 pouce MIP couleur', "Jusqu'à 60 h en GPS", 'Oui', '15 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole'], R),
  w('coros-vertix-2', 'Coros', 'Coros Vertix 2', 'Coros Vertix', 2021, 699, ['1,4 pouce MIP couleur', "Jusqu'à 140 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, ECG, SpO2, baromètre, boussole'], R),
  w('coros-vertix-2s', 'Coros', 'Coros Vertix 2S', 'Coros Vertix', 2024, 699, ['1,4 pouce MIP couleur', "Jusqu'à 118 h en GPS", 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, ECG, SpO2, baromètre, boussole'], R),
  w('coros-nomad', 'Coros', 'Coros Nomad', 'Coros Nomad', 2025, 349, ['1,2 pouce MIP couleur', null, 'Oui (bifréquence)', '10 ATM', AI, 'Cardio optique, SpO2, baromètre, boussole'], R),

  // ─── Garmin golf, plongée, prestige, enfants ─────────────────────────────
  w('garmin-approach-s10', 'Garmin', 'Garmin Approach S10', 'Approach', 2018, 149, ['0,9 pouce MIP monochrome', "Jusqu'à 12 h en GPS", 'Oui', '5 ATM', AI, 'Accéléromètre'], B),
  w('garmin-approach-s12', 'Garmin', 'Garmin Approach S12', 'Approach', 2021, 199, ['1,3 pouce MIP', "Jusqu'à 30 h en GPS", 'Oui', '5 ATM', AI, 'Accéléromètre'], B),
  w('garmin-approach-s40', 'Garmin', 'Garmin Approach S40', 'Approach', 2019, 299, ['1,2 pouce couleur tactile', "Jusqu'à 15 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate']),
  w('garmin-approach-s42', 'Garmin', 'Garmin Approach S42', 'Approach', 2021, 299, ['1,2 pouce couleur tactile', "Jusqu'à 15 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate']),
  w('garmin-approach-s44', 'Garmin', 'Garmin Approach S44', 'Approach', 2024, 349, ['1,2 pouce couleur tactile', "Jusqu'à 15 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate']),
  w('garmin-approach-s50', 'Garmin', 'Garmin Approach S50', 'Approach', 2025, 349, [null, null, 'Oui', '5 ATM', AI, 'Cardio optique Elevate']),
  w('garmin-approach-s60', 'Garmin', 'Garmin Approach S60', 'Approach', 2017, 399, ['1,2 pouce couleur tactile', "Jusqu'à 10 h en GPS", 'Oui', '5 ATM', AI, 'Accéléromètre']),
  w('garmin-approach-s62', 'Garmin', 'Garmin Approach S62', 'Approach', 2020, 549, ['1,3 pouce couleur tactile', "Jusqu'à 20 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, SpO2']),
  w('garmin-approach-s70-42mm', 'Garmin', 'Garmin Approach S70 42 mm', 'Approach', 2023, 649, ['1,2 pouce AMOLED', "Jusqu'à 15 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, SpO2']),
  w('garmin-approach-s70-47mm', 'Garmin', 'Garmin Approach S70 47 mm', 'Approach', 2023, 699, ['1,4 pouce AMOLED', "Jusqu'à 20 h en GPS", 'Oui', '5 ATM', AI, 'Cardio optique Elevate, SpO2']),
  w('garmin-descent-mk2', 'Garmin', 'Garmin Descent Mk2', 'Descent', 2020, 1299, ['1,4 pouce MIP couleur', null, 'Oui', '10 ATM (plongée 200 m)', AI, 'Cardio optique, profondimètre, altimètre barométrique, boussole'], R),
  w('garmin-descent-mk2i', 'Garmin', 'Garmin Descent Mk2i', 'Descent', 2020, 1499, ['1,4 pouce MIP couleur', null, 'Oui', '10 ATM (plongée 200 m)', AI, 'Cardio optique, profondimètre, altimètre barométrique, boussole'], R),
  w('garmin-descent-mk3-43mm', 'Garmin', 'Garmin Descent Mk3 43 mm', 'Descent', 2023, 1299, ['1,2 pouce AMOLED', null, 'Oui (multi-bandes)', '10 ATM (plongée 200 m)', AI, 'Cardio optique, profondimètre, altimètre barométrique, boussole'], R),
  w('garmin-descent-mk3i-51mm', 'Garmin', 'Garmin Descent Mk3i 51 mm', 'Descent', 2023, 1599, ['1,4 pouce AMOLED', null, 'Oui (multi-bandes)', '10 ATM (plongée 200 m)', AI, 'Cardio optique, profondimètre, altimètre barométrique, boussole'], R),
  w('garmin-descent-g1', 'Garmin', 'Garmin Descent G1', 'Descent', 2022, 599, ['1,2 pouce MIP monochrome', null, 'Oui', '10 ATM (plongée 200 m)', AI, 'Cardio optique, profondimètre, boussole'], R),
  w('garmin-quatix-7', 'Garmin', 'Garmin quatix 7', 'quatix', 2022, 799, ['1,3 pouce MIP couleur', "Jusqu'à 18 jours", 'Oui', '10 ATM', AI, 'Cardio optique Elevate, SpO2, altimètre barométrique, boussole'], R),
  w('garmin-quatix-7-pro', 'Garmin', 'Garmin quatix 7 Pro', 'quatix', 2023, 1099, ['1,4 pouce AMOLED', "Jusqu'à 18 jours", 'Oui (multi-bandes)', '10 ATM', AI, 'Cardio optique Elevate, SpO2, altimètre barométrique, boussole'], R),
  w('garmin-marq-athlete-gen-2', 'Garmin', 'Garmin MARQ Athlete (Gen 2)', 'MARQ', 2022, 1999, ['1,2 pouce AMOLED', "Jusqu'à 16 jours", 'Oui (multi-bandes)', '10 ATM', AI, 'Cardio optique Elevate, SpO2, altimètre barométrique, boussole'], ['mobile', 'sport', 'pro']),
  w('garmin-marq-adventurer-gen-2', 'Garmin', 'Garmin MARQ Adventurer (Gen 2)', 'MARQ', 2022, 2499, ['1,2 pouce AMOLED', "Jusqu'à 16 jours", 'Oui (multi-bandes)', '10 ATM', AI, 'Cardio optique Elevate, SpO2, altimètre barométrique, boussole'], R),
  w('garmin-bounce', 'Garmin', 'Garmin Bounce', 'Bounce', 2022, 149, ['1 pouce MIP couleur', null, 'Oui', '5 ATM', AI, 'Accéléromètre (montre enfant 4G)'], B),
  w('garmin-bounce-2', 'Garmin', 'Garmin Bounce 2', 'Bounce', 2025, 199, ['AMOLED', null, 'Oui', '5 ATM', AI, 'Cardio optique (montre enfant 4G)'], B),
];

// Constantes utilitaires non utilisées dans ce fichier (conservées pour homogénéité).
void [IO];
