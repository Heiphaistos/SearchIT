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
- **API publique `/api/v1`**, prévue pour le configurateur de PC (voir plus bas).
- Interface moderne en français, thème clair/sombre, adaptée au mobile.

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
