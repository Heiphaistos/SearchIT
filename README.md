# SearchIT

Comparateur de prix high-tech **neuf, reconditionné et d'occasion** : composants PC, PC portables et fixes, smartphones, tablettes, serveurs, NAS, réseau, périphériques et accessoires (disques durs, pâte thermique, câbles, chargeurs…).

SearchIT interroge les marchands en parallèle, regroupe les offres d'un même produit (par EAN/GTIN ou titre), et affiche pour chacun le meilleur prix neuf, reconditionné et d'occasion, frais de port compris.

Production : **https://searchit.heiphaistos.org**

## Fonctionnalités

- Recherche multi-marchands avec détection automatique de la catégorie et de l'état (« iphone 15 reconditionné »).
- Regroupement des offres par produit, et tableau comparatif avec marchand, état/grade, stock, prix et frais de port.
- Filtres par état, catégorie, marchand, prix et stock. Les accessoires (coques, câbles…) sont masqués quand on cherche un appareil.
- Navigation par catégorie (35 catégories, des processeurs aux onduleurs).
- **Ma liste** : un panier de comparaison (par exemple tous les composants d'un PC). Il calcule le total optimal en achetant chez plusieurs marchands, et le total si tout est acheté chez un seul marchand.
- **Catalogue de référence** (1 193 produits réels, 32 catégories, 114 marques) : caractéristiques techniques, génération et prix de lancement indicatif. Il alimente la page « Catalogue », la fiche technique immédiate des résultats, le comparateur, l'autocomplétion et le mode démo. Données dans `server/src/catalog/data/*.ts` ; API `/api/v1/catalog`.
- **Suivis de prix** : prix cible par produit, revérification automatique et notification du navigateur quand la cible est atteinte (page « Suivis »).
- **Bons plans** : les plus fortes baisses par rapport à la moyenne des 30 derniers jours, calculées uniquement sur des prix réellement relevés.
- **Comparateur** : jusqu'à 4 produits côte à côte (prix neuf, reconditionné, occasion, prix au To, caractéristiques Icecat).
- **Tableau de bord `/admin`** (jeton `ADMIN_TOKEN`) : recherches, recherches populaires, quotas Google Shopping, état des sources et dernières erreurs.
- **Historique des prix** : mini-graphique et badge « prix le plus bas depuis N jours ». Seules les offres réelles sont enregistrées, jamais les prix de démo.
- **Prix au To ou au Go** pour les SSD, disques durs, cartes mémoire et la RAM, avec un tri associé.
- **Autocomplétion** : recherches populaires, titres de produits connus, catégories et recherches récentes.
- **Ma liste** : lien de partage (sans compte ni stockage serveur), import d'une liste partagée et export CSV compatible Excel.
- **Fiches techniques** (Open Icecat) et conversion automatique des devises (BCE).
- **Sécurité** : limite de débit par IP (protège aussi les crédits Google Shopping), en-têtes CSP et HSTS, validation de toutes les entrées.
- **Référencement et appli installable** : `sitemap.xml`, `robots.txt`, balises Open Graph, manifeste, recherche OpenSearch dans la barre d'adresse.
- **API publique `/api/v1`**, prévue pour le configurateur de PC (voir plus bas).
- Interface moderne en français, thème clair/sombre, adaptée au mobile.

## Sources gratuites

| Source | Clé | Coût | Ce que ça apporte |
| --- | --- | --- | --- |
| **Google Shopping** via [Serper.dev](https://serper.dev), [SearchApi.io](https://www.searchapi.io) ou [SerpApi](https://serpapi.com) | `SERPER_API_KEY` (ou `SEARCHAPI_API_KEY` / `SERPAPI_API_KEY`) | 2 500 requêtes offertes chez Serper | Prix de **centaines de marchands français** en une requête : Fnac, LDLC, Boulanger, Darty, Back Market, Leclerc, Cdiscount… C'est la source n°1 à activer. |
| [eBay Browse API](https://developer.ebay.com) | `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET` | Gratuit (5 000 appels/jour) | Neuf, reconditionné et occasion |
| [AliExpress Affiliate](https://portals.aliexpress.com) | `ALIEXPRESS_*` | Gratuit | Accessoires, câbles, chargeurs |
| Boutiques **Shopify / WooCommerce** | aucune | Gratuit | Catalogue public complet de chaque boutique (`SHOPIFY_STORES`, `WOOCOMMERCE_STORES`, `server/config/public-stores.json`) |
| [Open Icecat](https://icecat.biz) | aucune (`ICECAT_USERNAME` facultatif) | Gratuit | Fiches techniques et photos par EAN (bouton « Fiche technique ») |
| [Taux BCE](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.fr.html) | aucune | Gratuit | Conversion automatique en euros des prix en $ ou £ |

Les résultats Google Shopping sont mis en cache 24 h sur disque, et un quota journalier par fournisseur protège les crédits gratuits.

Ajouter une boutique Shopify ou WooCommerce :

```bash
SHOPIFY_STORES=nothing.tech|Nothing,boutique-recond.fr|Boutique Recond|refurb
WOOCOMMERCE_STORES=exemple-informatique.fr|Exemple Informatique
```

Le catalogue est lu via `/products.json` (Shopify) ou `/wp-json/wc/store/v1/products` (WooCommerce). Les produits non high-tech sont filtrés, et le catalogue est resynchronisé toutes les `FEED_REFRESH_MINUTES` minutes.

## Marchands et sources

| Type | Marchands | Variables |
| --- | --- | --- |
| API officielle | Amazon.fr (PA-API 5), eBay (Browse API), AliExpress (Affiliate API) | `AMAZON_*`, `EBAY_*`, `ALIEXPRESS_*` |
| Flux d'affiliation | Back Market, Fnac, LDLC, E.Leclerc, Cdiscount, Rakuten, Boulanger, Darty, Materiel.net, TopAchat, Rue du Commerce, Grosbill, Visiodirect, 1fotrade, Certideal, refurbed | `FEED_<ID>_URL` |

La plupart des enseignes françaises n'ont **pas d'API de recherche publique**. Elles diffusent leur catalogue sous forme de **flux produits** via leur programme d'affiliation (Awin, Effinity, Kwanko, Rakuten Advertising, ou leur propre plateforme). Voici comment récupérer un flux :

1. Inscris-toi au programme d'affiliation du marchand. En général, il faut un site en ligne : searchit.heiphaistos.org fera l'affaire.
2. Une fois accepté, récupère l'URL de téléchargement du flux (CSV, XML Google Shopping ou JSON, gzip accepté).
3. Renseigne-la dans `.env` (`FEED_LDLC_URL=…`), puis redémarre.

Le flux est téléchargé, filtré (seuls les produits high-tech sont gardés), indexé en mémoire, mis en cache sur disque et rafraîchi toutes les `FEED_REFRESH_MINUTES` minutes. Les colonnes Awin, Google Merchant et la plupart des formats FR/EN sont reconnues automatiquement.

**Ajouter un autre marchand** : copie `server/config/custom-merchants.example.json` en `custom-merchants.json`, puis ajoute une entrée avec l'URL de son flux.

**Mode démo** : tant qu'aucune source n'est configurée, un catalogue de démonstration s'affiche. Les produits sont réels, mais les **prix sont fictifs**, et un bandeau le signale clairement. Il se désactive automatiquement dès qu'une vraie source est active (`DEMO_MODE=auto`).

## Développement

```bash
npm install
cp .env.example .env
npm run dev          # API sur :8787 + interface sur :5173 (proxy /api)
npm test             # tests de l'API (vitest)
npm run typecheck
```

Structure :

```
server/src/
  connectors/     amazon (SigV4), ebay, aliexpress, feed (CSV/XML/JSON), demo
  search/         normalisation, pertinence, regroupement, moteur, cache
  shared/         types et catégories partagés avec le frontend et les clients de l'API
  app.ts          routes HTTP (Fastify)
web/src/          interface React + Tailwind
deploy/           Caddy, nginx, systemd
```

## Déploiement sur le VPS (searchit.heiphaistos.org)

Prérequis DNS : un enregistrement `A` (et `AAAA` si IPv6) `searchit.heiphaistos.org` qui pointe vers l'IP du VPS.

### Option 1 : Docker + Caddy (HTTPS automatique, recommandé)

```bash
git clone https://github.com/Heiphaistos/SearchIT.git /opt/searchit && cd /opt/searchit
cp .env.example .env && nano .env        # clés marchands, CORS_ORIGINS, API_KEYS
docker compose up -d --build
docker compose logs -f searchit
```

Caddy obtient et renouvelle automatiquement le certificat Let's Encrypt. Les ports 80 et 443 doivent être libres et ouverts.

Mise à jour : `git pull && docker compose up -d --build`.

### Déploiement automatique (GitHub Actions)

À chaque push, `.github/workflows/deploy.yml` lance les tests. S'ils passent, le workflow se connecte au VPS en SSH et exécute `docker compose up -d --build`.

Mise en place (une seule fois) :

1. Sur le VPS : installer Docker, puis `git clone https://github.com/Heiphaistos/SearchIT.git /opt/searchit`, et créer `/opt/searchit/.env`.
2. Créer une clé SSH dédiée (`ssh-keygen -t ed25519 -f searchit_deploy`) et ajouter `searchit_deploy.pub` à `~/.ssh/authorized_keys` de l'utilisateur de déploiement (membre du groupe `docker`).
3. Sur GitHub, dans *Settings → Secrets and variables → Actions*, créer `VPS_HOST`, `VPS_USER` et `VPS_SSH_KEY` (contenu de la clé privée), et au besoin `VPS_PORT` et `VPS_APP_DIR`.
4. Relancer le workflow depuis l'onglet *Actions* (*Run workflow*) ou pousser un commit.

### Option 2 : Node + systemd + nginx

```bash
sudo useradd -r -s /usr/sbin/nologin searchit
sudo git clone https://github.com/Heiphaistos/SearchIT.git /opt/searchit && cd /opt/searchit
sudo npm ci && sudo npm run build -w web
sudo cp .env.example .env && sudo nano .env
sudo mkdir -p server/.cache && sudo chown -R searchit: server/.cache
sudo cp deploy/searchit.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now searchit
sudo cp deploy/nginx-searchit.conf /etc/nginx/sites-available/searchit
sudo ln -s /etc/nginx/sites-available/searchit /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d searchit.heiphaistos.org
```

Node 22 ou plus récent est requis.

## Intégration avec le configurateur de PC

Le configurateur appelle `POST https://searchit.heiphaistos.org/api/v1/lookup` avec la liste des composants. Il reçoit pour chacun la meilleure offre (neuve et reconditionnée), des alternatives, le total optimal et le total par marchand. Par défaut, l'occasion est exclue.

```bash
curl -X POST https://searchit.heiphaistos.org/api/v1/lookup \
  -H 'content-type: application/json' -H 'x-api-key: VOTRE_CLE' \
  -d '{"items":[{"ref":"cpu","query":"Ryzen 7 7800X3D","category":"cpu"},{"ref":"gpu","query":"RTX 5070","category":"gpu"}]}'
```

- Spécification complète : `/api/v1/openapi.json`. Documentation lisible : page **API** du site.
- Types TypeScript du contrat : `server/src/shared/types.ts` (`LookupRequest`, `LookupResponse`, `Offer`…).
- Sécurité : définis `API_KEYS` pour exiger l'en-tête `x-api-key`, et `CORS_ORIGINS` avec le domaine du configurateur.

## Variables d'environnement

Voir `.env.example` pour la liste complète commentée.
