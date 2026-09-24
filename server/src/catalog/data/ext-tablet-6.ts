import type { CatalogProduct } from '../types.js';

/**
 * Catalogue étendu : tablettes Amazon Fire, liseuses (Kindle, Kobo), tablettes E Ink (reMarkable, Boox)
 * et tablettes durcies Crosscall. Clé omise quand la valeur n'est pas certaine.
 */

interface Opts {
  family: string;
  year: number;
  msrp?: number;
  refurb?: boolean;
  tags: string[];
}

function t(id: string, brand: string, name: string, o: Opts, specs: Record<string, string>): CatalogProduct {
  const p: CatalogProduct = { id: `tablet-${id}`, category: 'tablet', brand, name, family: o.family, year: o.year, refurbishable: o.refurb ?? true, tags: o.tags, specs };
  if (o.msrp) p.msrp = o.msrp;
  return p;
}

const FIRE = ['budget', 'mobile'];
const READ = ['mobile', 'etudiant'];
const FO = 'Fire OS';

export const PRODUCTS: CatalogProduct[] = [
  // ─── Amazon Fire ──────────────────────────────────────────────────────────
  t('amazon-fire-7-2019-16go', 'Amazon', 'Amazon Fire 7 (2019) 16 Go', { family: 'Fire 7', year: 2019, tags: FIRE }, { 'Écran': '7 pouces IPS', 'Définition': '1024 x 600', 'RAM': '1 Go', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '286 g' }),
  t('amazon-fire-7-2019-32go', 'Amazon', 'Amazon Fire 7 (2019) 32 Go', { family: 'Fire 7', year: 2019, tags: FIRE }, { 'Écran': '7 pouces IPS', 'Définition': '1024 x 600', 'RAM': '1 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '286 g' }),
  t('amazon-fire-7-2022-16go', 'Amazon', 'Amazon Fire 7 (2022) 16 Go', { family: 'Fire 7', year: 2022, tags: FIRE }, { 'Écran': '7 pouces IPS', 'Définition': '1024 x 600', 'RAM': '2 Go', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '282 g' }),
  t('amazon-fire-7-2022-32go', 'Amazon', 'Amazon Fire 7 (2022) 32 Go', { family: 'Fire 7', year: 2022, tags: FIRE }, { 'Écran': '7 pouces IPS', 'Définition': '1024 x 600', 'RAM': '2 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '282 g' }),
  t('amazon-fire-7-kids-2022-16go', 'Amazon', 'Amazon Fire 7 Kids (2022) 16 Go', { family: 'Fire 7', year: 2022, tags: FIRE }, { 'Écran': '7 pouces IPS', 'Définition': '1024 x 600', 'RAM': '2 Go', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO }),
  t('amazon-fire-hd-8-2020-32go', 'Amazon', 'Amazon Fire HD 8 (2020) 32 Go', { family: 'Fire HD', year: 2020, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '2 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '355 g' }),
  t('amazon-fire-hd-8-2020-64go', 'Amazon', 'Amazon Fire HD 8 (2020) 64 Go', { family: 'Fire HD', year: 2020, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '2 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '355 g' }),
  t('amazon-fire-hd-8-plus-2020-32go', 'Amazon', 'Amazon Fire HD 8 Plus (2020) 32 Go', { family: 'Fire HD', year: 2020, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '3 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '355 g' }),
  t('amazon-fire-hd-8-plus-2020-64go', 'Amazon', 'Amazon Fire HD 8 Plus (2020) 64 Go', { family: 'Fire HD', year: 2020, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '3 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '355 g' }),
  t('amazon-fire-hd-8-2022-64go', 'Amazon', 'Amazon Fire HD 8 (2022) 64 Go', { family: 'Fire HD', year: 2022, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '2 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO }),
  t('amazon-fire-hd-8-plus-2022-32go', 'Amazon', 'Amazon Fire HD 8 Plus (2022) 32 Go', { family: 'Fire HD', year: 2022, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '3 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '342 g' }),
  t('amazon-fire-hd-8-plus-2022-64go', 'Amazon', 'Amazon Fire HD 8 Plus (2022) 64 Go', { family: 'Fire HD', year: 2022, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '3 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '342 g' }),
  t('amazon-fire-hd-8-kids-2022-32go', 'Amazon', 'Amazon Fire HD 8 Kids (2022) 32 Go', { family: 'Fire HD', year: 2022, tags: FIRE }, { 'Écran': '8 pouces IPS', 'Définition': '1280 x 800', 'RAM': '2 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO }),
  t('amazon-fire-hd-10-2019-32go', 'Amazon', 'Amazon Fire HD 10 (2019) 32 Go', { family: 'Fire HD', year: 2019, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '2 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '504 g' }),
  t('amazon-fire-hd-10-2019-64go', 'Amazon', 'Amazon Fire HD 10 (2019) 64 Go', { family: 'Fire HD', year: 2019, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '2 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '504 g' }),
  t('amazon-fire-hd-10-2021-32go', 'Amazon', 'Amazon Fire HD 10 (2021) 32 Go', { family: 'Fire HD', year: 2021, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '3 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '465 g' }),
  t('amazon-fire-hd-10-2021-64go', 'Amazon', 'Amazon Fire HD 10 (2021) 64 Go', { family: 'Fire HD', year: 2021, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '3 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '465 g' }),
  t('amazon-fire-hd-10-plus-2021-32go', 'Amazon', 'Amazon Fire HD 10 Plus (2021) 32 Go', { family: 'Fire HD', year: 2021, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '4 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '468 g' }),
  t('amazon-fire-hd-10-plus-2021-64go', 'Amazon', 'Amazon Fire HD 10 Plus (2021) 64 Go', { family: 'Fire HD', year: 2021, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '468 g' }),
  t('amazon-fire-hd-10-2023-64go', 'Amazon', 'Amazon Fire HD 10 (2023) 64 Go', { family: 'Fire HD', year: 2023, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '3 Go', 'Stockage': '64 Go', 'Stylet': 'Compatible stylet USI (en option)', 'Connectivité': 'Wi-Fi', 'Système': FO, 'Poids': '434 g' }),
  t('amazon-fire-hd-10-kids-2023-32go', 'Amazon', 'Amazon Fire HD 10 Kids (2023) 32 Go', { family: 'Fire HD', year: 2023, tags: FIRE }, { 'Écran': '10,1 pouces IPS', 'Définition': '1920 x 1200', 'RAM': '3 Go', 'Stockage': '32 Go', 'Connectivité': 'Wi-Fi', 'Système': FO }),
  t('amazon-fire-max-11-64go', 'Amazon', 'Amazon Fire Max 11 64 Go', { family: 'Fire Max', year: 2023, tags: FIRE }, { 'Écran': '11 pouces IPS', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek MT8188J', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Made for Amazon Stylus Pen (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': FO, 'Poids': '490 g' }),
  t('amazon-fire-max-11-128go', 'Amazon', 'Amazon Fire Max 11 128 Go', { family: 'Fire Max', year: 2023, tags: FIRE }, { 'Écran': '11 pouces IPS', 'Définition': '2000 x 1200', 'Processeur': 'MediaTek MT8188J', 'RAM': '4 Go', 'Stockage': '128 Go', 'Stylet': 'Made for Amazon Stylus Pen (en option)', 'Connectivité': 'Wi-Fi 6', 'Système': FO, 'Poids': '490 g' }),

  // ─── Amazon Kindle (liseuses) ─────────────────────────────────────────────
  t('amazon-kindle-2019-8go', 'Amazon', 'Amazon Kindle (2019) 8 Go', { family: 'Kindle', year: 2019, msrp: 80, tags: READ }, { 'Écran': '6 pouces E Ink, 167 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '174 g' }),
  t('amazon-kindle-2022-16go', 'Amazon', 'Amazon Kindle (2022) 16 Go', { family: 'Kindle', year: 2022, tags: READ }, { 'Écran': '6 pouces E Ink, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '158 g' }),
  t('amazon-kindle-2024-16go', 'Amazon', 'Amazon Kindle (2024) 16 Go', { family: 'Kindle', year: 2024, tags: READ }, { 'Écran': '6 pouces E Ink, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '158 g' }),
  t('amazon-kindle-paperwhite-2018-8go', 'Amazon', 'Amazon Kindle Paperwhite (2018) 8 Go', { family: 'Kindle Paperwhite', year: 2018, tags: READ }, { 'Écran': '6 pouces E Ink, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '182 g' }),
  t('amazon-kindle-paperwhite-2018-32go', 'Amazon', 'Amazon Kindle Paperwhite (2018) 32 Go', { family: 'Kindle Paperwhite', year: 2018, tags: READ }, { 'Écran': '6 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '182 g' }),
  t('amazon-kindle-paperwhite-2021-8go', 'Amazon', 'Amazon Kindle Paperwhite (2021) 8 Go', { family: 'Kindle Paperwhite', year: 2021, tags: READ }, { 'Écran': '6,8 pouces E Ink, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '205 g' }),
  t('amazon-kindle-paperwhite-signature-edition-2021-32go', 'Amazon', 'Amazon Kindle Paperwhite Signature Edition (2021) 32 Go', { family: 'Kindle Paperwhite', year: 2021, tags: READ }, { 'Écran': '6,8 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '207 g' }),
  t('amazon-kindle-paperwhite-2024-16go', 'Amazon', 'Amazon Kindle Paperwhite (2024) 16 Go', { family: 'Kindle Paperwhite', year: 2024, tags: READ }, { 'Écran': '7 pouces E Ink, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '211 g' }),
  t('amazon-kindle-paperwhite-signature-edition-2024-32go', 'Amazon', 'Amazon Kindle Paperwhite Signature Edition (2024) 32 Go', { family: 'Kindle Paperwhite', year: 2024, tags: READ }, { 'Écran': '7 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS' }),
  t('amazon-kindle-colorsoft-signature-edition-32go', 'Amazon', 'Amazon Kindle Colorsoft Signature Edition 32 Go', { family: 'Kindle Colorsoft', year: 2024, tags: READ }, { 'Écran': '7 pouces E Ink couleur, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '219 g' }),
  t('amazon-kindle-colorsoft-16go', 'Amazon', 'Amazon Kindle Colorsoft 16 Go', { family: 'Kindle Colorsoft', year: 2025, refurb: false, tags: READ }, { 'Écran': '7 pouces E Ink couleur, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS' }),
  t('amazon-kindle-oasis-2019-8go', 'Amazon', 'Amazon Kindle Oasis (2019) 8 Go', { family: 'Kindle Oasis', year: 2019, tags: READ }, { 'Écran': '7 pouces E Ink, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '188 g' }),
  t('amazon-kindle-oasis-2019-32go', 'Amazon', 'Amazon Kindle Oasis (2019) 32 Go', { family: 'Kindle Oasis', year: 2019, tags: READ }, { 'Écran': '7 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '188 g' }),
  t('amazon-kindle-scribe-2022-16go', 'Amazon', 'Amazon Kindle Scribe (2022) 16 Go', { family: 'Kindle Scribe', year: 2022, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Stylet basique inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),
  t('amazon-kindle-scribe-2022-32go', 'Amazon', 'Amazon Kindle Scribe (2022) 32 Go', { family: 'Kindle Scribe', year: 2022, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Stylet Premium inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),
  t('amazon-kindle-scribe-2022-64go', 'Amazon', 'Amazon Kindle Scribe (2022) 64 Go', { family: 'Kindle Scribe', year: 2022, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '64 Go', 'Stylet': 'Stylet Premium inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),
  t('amazon-kindle-scribe-2024-16go', 'Amazon', 'Amazon Kindle Scribe (2024) 16 Go', { family: 'Kindle Scribe', year: 2024, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Stylet Premium inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),
  t('amazon-kindle-scribe-2024-32go', 'Amazon', 'Amazon Kindle Scribe (2024) 32 Go', { family: 'Kindle Scribe', year: 2024, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Stylet Premium inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),
  t('amazon-kindle-scribe-2024-64go', 'Amazon', 'Amazon Kindle Scribe (2024) 64 Go', { family: 'Kindle Scribe', year: 2024, tags: [...READ, 'pro'] }, { 'Écran': '10,2 pouces E Ink, 300 ppp', 'Stockage': '64 Go', 'Stylet': 'Stylet Premium inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Kindle OS', 'Poids': '433 g' }),

  // ─── Kobo (liseuses) ──────────────────────────────────────────────────────
  t('kobo-clara-hd', 'Kobo', 'Kobo Clara HD', { family: 'Kobo Clara', year: 2018, msrp: 129, tags: READ }, { 'Écran': '6 pouces E Ink Carta, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '166 g' }),
  t('kobo-clara-2e', 'Kobo', 'Kobo Clara 2E', { family: 'Kobo Clara', year: 2022, msrp: 139, tags: READ }, { 'Écran': '6 pouces E Ink Carta 1200, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '171 g' }),
  t('kobo-clara-bw', 'Kobo', 'Kobo Clara BW', { family: 'Kobo Clara', year: 2024, msrp: 139, tags: READ }, { 'Écran': '6 pouces E Ink Carta 1300, 300 ppp', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '174 g' }),
  t('kobo-clara-colour', 'Kobo', 'Kobo Clara Colour', { family: 'Kobo Clara', year: 2024, msrp: 159, tags: READ }, { 'Écran': '6 pouces E Ink Kaleido 3 couleur', 'Stockage': '16 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '174 g' }),
  t('kobo-nia', 'Kobo', 'Kobo Nia', { family: 'Kobo Nia', year: 2020, msrp: 99, tags: ['budget', ...READ] }, { 'Écran': '6 pouces E Ink Carta, 212 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '172 g' }),
  t('kobo-libra-h2o', 'Kobo', 'Kobo Libra H2O', { family: 'Kobo Libra', year: 2019, msrp: 179, tags: READ }, { 'Écran': '7 pouces E Ink Carta, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '192 g' }),
  t('kobo-libra-2', 'Kobo', 'Kobo Libra 2', { family: 'Kobo Libra', year: 2021, msrp: 199, tags: READ }, { 'Écran': '7 pouces E Ink Carta 1200, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '215 g' }),
  t('kobo-libra-colour', 'Kobo', 'Kobo Libra Colour', { family: 'Kobo Libra', year: 2024, msrp: 229, tags: READ }, { 'Écran': '7 pouces E Ink Kaleido 3 couleur', 'Stockage': '32 Go', 'Stylet': 'Kobo Stylus 2 (en option)', 'Connectivité': 'Wi-Fi' }),
  t('kobo-forma-8go', 'Kobo', 'Kobo Forma 8 Go', { family: 'Kobo Forma', year: 2018, msrp: 279, tags: READ }, { 'Écran': '8 pouces E Ink Carta, 300 ppp', 'Stockage': '8 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '197 g' }),
  t('kobo-forma-32go', 'Kobo', 'Kobo Forma 32 Go', { family: 'Kobo Forma', year: 2019, tags: READ }, { 'Écran': '8 pouces E Ink Carta, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Poids': '197 g' }),
  t('kobo-sage', 'Kobo', 'Kobo Sage', { family: 'Kobo Sage', year: 2021, msrp: 279, tags: READ }, { 'Écran': '8 pouces E Ink Carta 1200, 300 ppp', 'Stockage': '32 Go', 'Stylet': 'Kobo Stylus (en option)', 'Connectivité': 'Wi-Fi', 'Poids': '240 g' }),
  t('kobo-elipsa', 'Kobo', 'Kobo Elipsa', { family: 'Kobo Elipsa', year: 2021, msrp: 399, tags: [...READ, 'pro'] }, { 'Écran': '10,3 pouces E Ink Carta 1200, 227 ppp', 'Stockage': '32 Go', 'Stylet': 'Kobo Stylus inclus', 'Connectivité': 'Wi-Fi', 'Poids': '383 g' }),
  t('kobo-elipsa-2e', 'Kobo', 'Kobo Elipsa 2E', { family: 'Kobo Elipsa', year: 2023, msrp: 399, tags: [...READ, 'pro'] }, { 'Écran': '10,3 pouces E Ink Carta 1200, 227 ppp', 'Stockage': '32 Go', 'Stylet': 'Kobo Stylus 2 inclus', 'Connectivité': 'Wi-Fi', 'Poids': '390 g' }),

  // ─── reMarkable ───────────────────────────────────────────────────────────
  t('remarkable-1', 'reMarkable', 'reMarkable (1re génération)', { family: 'reMarkable', year: 2017, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Carta monochrome', 'Définition': '1872 x 1404', 'RAM': '512 Mo', 'Stockage': '8 Go', 'Stylet': 'reMarkable Marker inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Codex (Linux)', 'Poids': '350 g' }),
  t('remarkable-paper-pro-move', 'reMarkable', 'reMarkable Paper Pro Move', { family: 'reMarkable', year: 2025, refurb: false, tags: ['pro', 'mobile'] }, { 'Écran': '7,3 pouces E Ink couleur', 'Stylet': 'reMarkable Marker', 'Connectivité': 'Wi-Fi', 'Système': 'Codex (Linux)' }),

  // ─── Onyx Boox (tablettes E Ink Android) ──────────────────────────────────
  t('boox-note-air-2-plus', 'Boox', 'Boox Note Air 2 Plus', { family: 'Boox Note Air', year: 2022, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Carta', 'Définition': '1872 x 1404', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Boox Pen Plus inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 11' }),
  t('boox-note-air-3', 'Boox', 'Boox Note Air 3', { family: 'Boox Note Air', year: 2023, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Carta 1200', 'Définition': '1872 x 1404', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Boox Pen Plus inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 12' }),
  t('boox-note-air-3-c', 'Boox', 'Boox Note Air 3 C', { family: 'Boox Note Air', year: 2023, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Kaleido 3 couleur', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Boox Pen Plus inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 12' }),
  t('boox-note-air-4-c', 'Boox', 'Boox Note Air 4 C', { family: 'Boox Note Air', year: 2024, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Kaleido 3 couleur', 'Stockage': '64 Go', 'Stylet': 'Boox Pen Plus inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 13' }),
  t('boox-tab-ultra-c-pro', 'Boox', 'Boox Tab Ultra C Pro', { family: 'Boox Tab', year: 2023, tags: ['pro', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Kaleido 3 couleur', 'RAM': '6 Go', 'Stockage': '128 Go', 'Stylet': 'Boox Pen2 Pro inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 12' }),
  t('boox-tab-mini-c', 'Boox', 'Boox Tab Mini C', { family: 'Boox Tab', year: 2023, tags: ['mobile'] }, { 'Écran': '7,8 pouces E Ink Kaleido 3 couleur', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Boox Pen2 Pro inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 11' }),
  t('boox-tab-x-c', 'Boox', 'Boox Tab X C', { family: 'Boox Tab', year: 2025, refurb: false, tags: ['pro', 'mobile'] }, { 'Écran': '13,3 pouces E Ink Kaleido 3 couleur', 'Connectivité': 'Wi-Fi', 'Système': 'Android 13' }),
  t('boox-note-max', 'Boox', 'Boox Note Max', { family: 'Boox Note', year: 2024, tags: ['pro', 'mobile'] }, { 'Écran': '13,3 pouces E Ink Carta 1300', 'RAM': '6 Go', 'Stockage': '128 Go', 'Stylet': 'Boox Pen Plus inclus', 'Connectivité': 'Wi-Fi', 'Système': 'Android 13' }),
  t('boox-go-10-3', 'Boox', 'Boox Go 10.3', { family: 'Boox Go', year: 2024, tags: ['pro', 'etudiant', 'mobile'] }, { 'Écran': '10,3 pouces E Ink Carta 1200', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Boox Pen Plus (en option)', 'Connectivité': 'Wi-Fi', 'Système': 'Android 12' }),
  t('boox-go-color-7', 'Boox', 'Boox Go Color 7', { family: 'Boox Go', year: 2024, tags: READ }, { 'Écran': '7 pouces E Ink Kaleido 3 couleur', 'RAM': '4 Go', 'Stockage': '64 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Android 12', 'Poids': '195 g' }),
  t('boox-palma', 'Boox', 'Boox Palma', { family: 'Boox Palma', year: 2023, tags: ['mobile'] }, { 'Écran': '6,13 pouces E Ink Carta 1200', 'RAM': '6 Go', 'Stockage': '128 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Android 11', 'Poids': '170 g' }),
  t('boox-page', 'Boox', 'Boox Page', { family: 'Boox Page', year: 2023, tags: READ }, { 'Écran': '7 pouces E Ink Carta 1200', 'RAM': '3 Go', 'Stockage': '32 Go', 'Stylet': 'Non', 'Connectivité': 'Wi-Fi', 'Système': 'Android 11' }),

  // ─── Crosscall (durcies) ──────────────────────────────────────────────────
  t('crosscall-core-t4', 'Crosscall', 'Crosscall Core-T4', { family: 'Crosscall Core', year: 2020, tags: ['robuste', 'pro', 'sport'] }, { 'Écran': '8 pouces', 'Connectivité': 'Wi-Fi + 4G', 'Système': 'Android' }),
  t('crosscall-core-t5', 'Crosscall', 'Crosscall Core-T5', { family: 'Crosscall Core', year: 2023, tags: ['robuste', 'pro', 'sport'] }, { 'Écran': '8 pouces', 'Connectivité': 'Wi-Fi + 5G', 'Système': 'Android' }),
];
