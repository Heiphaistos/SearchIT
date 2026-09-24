import { CATEGORIES } from './shared/categories.js';

// Spécification OpenAPI de l'API publique (servie sur /api/v1/openapi.json).
// Contrat d'intégration pour le configurateur de PC et les autres clients.

const categoryEnum = CATEGORIES.map((c) => c.id);
const conditionEnum = ['new', 'refurbished', 'used'];

const Offer = {
  type: 'object',
  required: ['id', 'merchantId', 'merchantName', 'title', 'url', 'price', 'currency', 'totalPrice', 'condition', 'category'],
  properties: {
    id: { type: 'string' },
    merchantId: { type: 'string', example: 'ldlc' },
    merchantName: { type: 'string', example: 'LDLC' },
    title: { type: 'string' },
    url: { type: 'string', format: 'uri' },
    imageUrl: { type: 'string', format: 'uri' },
    price: { type: 'number', description: 'Prix TTC hors livraison' },
    currency: { type: 'string', example: 'EUR' },
    shipping: { type: 'number', nullable: true, description: 'Frais de port, null si inconnus' },
    totalPrice: { type: 'number', description: 'price + shipping' },
    condition: { type: 'string', enum: conditionEnum },
    conditionGrade: { type: 'string', example: 'Très bon état' },
    inStock: { type: 'boolean', nullable: true },
    brand: { type: 'string' },
    gtin: { type: 'string', description: 'GTIN normalisé sur 14 chiffres' },
    mpn: { type: 'string' },
    category: { type: 'string', enum: categoryEnum },
    rating: { type: 'number' },
    reviewCount: { type: 'integer' },
    seller: { type: 'string' },
    isDemo: { type: 'boolean', description: 'Offre fictive du catalogue de démonstration' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SearchIT API',
    version: '1.0.0',
    description:
      'Comparateur de prix high-tech multi-marchands (neuf, reconditionné, occasion). ' +
      "L'endpoint /lookup permet à un configurateur de PC d'obtenir en un appel le meilleur prix de chaque composant. " +
      'Si le serveur définit API_KEYS, envoyer la clé dans l’en-tête x-api-key.',
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } },
    schemas: {
      Offer,
      LookupItem: {
        type: 'object',
        required: ['ref', 'query'],
        properties: {
          ref: { type: 'string', description: 'Identifiant libre renvoyé tel quel', example: 'cpu' },
          query: { type: 'string', example: 'AMD Ryzen 7 7800X3D' },
          category: { type: 'string', enum: categoryEnum },
          gtin: { type: 'string' },
          mpn: { type: 'string' },
          quantity: { type: 'integer', minimum: 1, default: 1 },
          conditions: { type: 'array', items: { type: 'string', enum: conditionEnum } },
          maxPrice: { type: 'number' },
        },
      },
      LookupResult: {
        type: 'object',
        properties: {
          ref: { type: 'string' },
          query: { type: 'string' },
          quantity: { type: 'integer' },
          found: { type: 'boolean' },
          best: { $ref: '#/components/schemas/Offer' },
          bestNew: { $ref: '#/components/schemas/Offer' },
          bestRefurbished: { $ref: '#/components/schemas/Offer' },
          alternatives: { type: 'array', items: { $ref: '#/components/schemas/Offer' } },
          lineTotal: { type: 'number' },
        },
      },
    },
  },
  security: [{ apiKey: [] }],
  paths: {
    '/search': {
      get: {
        summary: 'Recherche multi-marchands, résultats regroupés par produit',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' }, example: 'rtx 5070' },
          { name: 'category', in: 'query', schema: { type: 'string', enum: categoryEnum } },
          { name: 'conditions', in: 'query', description: 'Liste séparée par des virgules', schema: { type: 'string' }, example: 'new,refurbished' },
          { name: 'merchants', in: 'query', description: 'Identifiants séparés par des virgules', schema: { type: 'string' }, example: 'ldlc,amazon' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
          { name: 'hideAccessories', in: 'query', schema: { type: 'boolean', default: true } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['relevance', 'price-asc', 'price-desc', 'savings', 'offers'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 24, maximum: 100 } },
        ],
        responses: { 200: { description: 'Résultats (voir SearchResponse dans server/src/shared/types.ts)' }, 400: { description: 'Paramètres invalides' } },
      },
    },
    '/lookup': {
      post: {
        summary: 'Meilleur prix pour une liste de composants (configurateur)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: { type: 'array', maxItems: 50, items: { $ref: '#/components/schemas/LookupItem' } },
                  conditions: { type: 'array', items: { type: 'string', enum: conditionEnum } },
                  merchants: { type: 'array', items: { type: 'string' } },
                  alternatives: { type: 'integer', default: 3, maximum: 20 },
                },
              },
              example: {
                items: [
                  { ref: 'cpu', query: 'AMD Ryzen 7 7800X3D', category: 'cpu' },
                  { ref: 'gpu', query: 'RTX 5070', category: 'gpu' },
                  { ref: 'ram', query: 'DDR5 32 Go 6000', category: 'ram' },
                  { ref: 'paste', query: 'Arctic MX-6', category: 'thermal-paste' },
                ],
                conditions: ['new', 'refurbished'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Meilleure offre par article, total optimal et total par marchand',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    results: { type: 'array', items: { $ref: '#/components/schemas/LookupResult' } },
                    bestTotal: { type: 'number' },
                    byMerchant: {
                      type: 'array',
                      items: { type: 'object', properties: { merchantId: { type: 'string' }, merchantName: { type: 'string' }, covered: { type: 'integer' }, total: { type: 'number' } } },
                    },
                    missing: { type: 'array', items: { type: 'string' } },
                    demo: { type: 'boolean' },
                    tookMs: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/merchants': { get: { summary: 'Marchands et état de leurs connecteurs', responses: { 200: { description: 'Liste des marchands' } } } },
  },
};
