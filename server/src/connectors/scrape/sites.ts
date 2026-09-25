import type { ScrapeState } from '../../shared/types.js';
import { alternate, cybertek, topachat, type Extractor } from './extractors.js';

// Pages de recherche publiques des enseignes high-tech françaises. Chaque enseigne a été
// testée à la main le 2026-09-25 (une requête « rtx 5070 », User-Agent SearchIT) ;
// seules celles qui acceptent la lecture ET exposent des données exploitables sont actives.
// Les autres restent listées avec la raison, affichée sur la page « Marchands ».

export interface ScrapeSite {
  merchantId: string;
  /** Page de recherche, `{q}` = requête encodée. */
  searchUrl: string;
  extract?: Extractor;
  /** Source écartée et pourquoi. */
  disabled?: ScrapeState;
}

const robots = (path: string): ScrapeState => ({ status: 'robots', detail: `robots.txt interdit ${path}` });
const antiBot = (detail: string): ScrapeState => ({ status: 'blocked', detail });

export const SCRAPE_SITES: ScrapeSite[] = [
  { merchantId: 'topachat', searchUrl: 'https://www.topachat.com/search/{q}', extract: topachat },
  { merchantId: 'cybertek', searchUrl: 'https://www.cybertek.fr/boutique/produit.aspx?q={q}', extract: cybertek },
  { merchantId: 'alternate', searchUrl: 'https://www.alternate.fr/listing.xhtml?q={q}', extract: alternate },
  {
    merchantId: 'amazon',
    searchUrl: 'https://www.amazon.fr/s?k={q}',
    disabled: { status: 'unavailable', detail: 'robots.txt autorise /s, mais les conditions d’utilisation d’Amazon interdisent la collecte automatisée' },
  },
  { merchantId: 'ldlc', searchUrl: 'https://www.ldlc.com/recherche/{q}/', disabled: robots('/recherche/') },
  { merchantId: 'materielnet', searchUrl: 'https://www.materiel.net/recherche/{q}/', disabled: robots('/recherche/') },
  { merchantId: 'grosbill', searchUrl: 'https://www.grosbill.com/produit.aspx?q={q}', disabled: robots('*/produit.aspx?q=*') },
  { merchantId: 'rueducommerce', searchUrl: 'https://www.rueducommerce.fr/recherche/{q}/', disabled: robots('/recherche/') },
  { merchantId: 'infomaxparis', searchUrl: 'https://infomaxparis.com/fr/recherche?search_query={q}', disabled: robots('/fr/recherche') },
  { merchantId: 'cdiscount', searchUrl: 'https://www.cdiscount.com/search/10/{q}.html', disabled: robots('/search/') },
  { merchantId: 'boulanger', searchUrl: 'https://www.boulanger.com/resultats?tr={q}', disabled: robots('/resultats') },
  { merchantId: 'backmarket', searchUrl: 'https://www.backmarket.fr/fr-fr/search?q={q}', disabled: robots('*/search') },
  { merchantId: 'leclerc', searchUrl: 'https://www.e.leclerc/recherche?q={q}', disabled: robots('/recherche') },
  { merchantId: 'auchan', searchUrl: 'https://www.auchan.fr/recherche?text={q}', disabled: robots('/recherche*') },
  { merchantId: 'cultura', searchUrl: 'https://www.cultura.com/search/results?search_query={q}', disabled: robots('/search/results') },
  { merchantId: 'achatmoinscher', searchUrl: 'https://www.achatmoinscher.com/recherche.php?q={q}', disabled: robots('/recherche.php') },
  { merchantId: 'bixoto', searchUrl: 'https://www.bixoto.com/fr/?search={q}', disabled: robots('/*?*search=') },
  { merchantId: 'fnac', searchUrl: 'https://www.fnac.com/SearchResult/ResultList.aspx?Search={q}', disabled: antiBot('HTTP 403 dès robots.txt : protection anti-robot') },
  { merchantId: 'darty', searchUrl: 'https://www.darty.com/nav/recherche?text={q}', disabled: antiBot('HTTP 403 dès robots.txt : protection anti-robot') },
  { merchantId: 'rakuten', searchUrl: 'https://fr.shopping.rakuten.com/search/{q}', disabled: antiBot('HTTP 403 dès robots.txt : protection anti-robot') },
  { merchantId: 'pccomponentes', searchUrl: 'https://www.pccomponentes.fr/search/?query={q}', disabled: antiBot('HTTP 403 sur la page de recherche') },
  { merchantId: 'caseking', searchUrl: 'https://www.caseking.de/fr/search?search={q}', disabled: antiBot('HTTP 403 sur la page de recherche') },
  { merchantId: 'carrefour', searchUrl: 'https://www.carrefour.fr/s?q={q}', disabled: antiBot('HTTP 403 sur la page de recherche') },
  { merchantId: 'galaxus', searchUrl: 'https://www.galaxus.fr/fr/search?q={q}', disabled: antiBot('Aucune réponse en 8 s (connexion ignorée)') },
  { merchantId: 'joybuy', searchUrl: 'https://www.joybuy.fr/search?keyword={q}', disabled: antiBot('Page de contrôle anti-robot dès l’accueil') },
];
