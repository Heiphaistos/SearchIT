import { Check, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { usePageMeta } from '../lib/meta';

function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-100 ring-1 ring-slate-800 dark:bg-black/40">
        <code>{children}</code>
      </pre>
      <button
        onClick={() => {
          void navigator.clipboard?.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="absolute right-2 top-2 rounded-lg bg-white/10 p-1.5 text-slate-300 opacity-0 transition hover:bg-white/20 group-hover:opacity-100"
        aria-label="Copier"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="space-y-3 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

export function DevelopersPage() {
  usePageMeta('API pour développeurs', 'API publique SearchIT : meilleur prix d’une configuration de PC, recherche multi-marchands et contrat EnginePC.');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://searchit.heiphaistos.org';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API SearchIT</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        L’API publique <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">/api/v1</code> permet à d’autres applications (en particulier le
        configurateur de PC) d’obtenir les meilleurs prix. Spécification complète :{' '}
        <a href="/api/v1/openapi.json" className="font-medium text-brand-600 underline underline-offset-2 dark:text-brand-400">
          openapi.json
        </a>
        .
      </p>

      <Section title="Authentification">
        <p>
          Si le serveur définit <code>API_KEYS</code>, chaque appel à <code>/api/v1</code> doit porter la clé, au choix dans l’en-tête <code>x-api-key</code> ou
          dans <code>Authorization: Bearer &lt;clé&gt;</code>. Les domaines autorisés à appeler l’API depuis un navigateur se règlent avec{' '}
          <code>CORS_ORIGINS</code>. Le débit est limité par adresse IP (réponse <code>429</code> au-delà), plus strictement sur les lots.
        </p>
        <p>
          En mode démonstration (aucune source de prix connectée), les offres portent <code>isDemo: true</code> (ou <code>demo: true</code> sur le contrat
          EnginePC) : leurs prix sont fictifs.
        </p>
      </Section>

      <Section title="Meilleur prix d’une configuration — POST /api/v1/lookup">
        <p>
          Envoyez la liste des composants : SearchIT renvoie pour chacun la meilleure offre (neuve et reconditionnée), des alternatives, le total optimal
          multi-marchands et le total si tout est acheté chez un seul marchand. Par défaut, seules les offres neuves et reconditionnées sont retenues.
        </p>
        <Code>{`curl -X POST ${origin}/api/v1/lookup \\
  -H 'content-type: application/json' \\
  -H 'x-api-key: VOTRE_CLE' \\
  -d '{
    "items": [
      { "ref": "cpu",   "query": "AMD Ryzen 7 7800X3D", "category": "cpu" },
      { "ref": "gpu",   "query": "RTX 5070",            "category": "gpu" },
      { "ref": "ram",   "query": "DDR5 32 Go 6000",     "category": "ram" },
      { "ref": "ssd",   "query": "Samsung 990 Pro 2 To", "category": "ssd" },
      { "ref": "hdd",   "query": "IronWolf 8 To", "category": "hdd", "quantity": 2 },
      { "ref": "paste", "query": "Arctic MX-6", "category": "thermal-paste" }
    ],
    "conditions": ["new", "refurbished"],
    "alternatives": 3
  }'`}</Code>
        <p>Réponse (extrait) :</p>
        <Code>{`{
  "results": [
    {
      "ref": "cpu", "found": true, "quantity": 1, "lineTotal": 339.99,
      "best": { "merchantName": "LDLC", "title": "…7800X3D…", "price": 339.99,
                "shipping": 0, "totalPrice": 339.99, "condition": "new", "url": "https://…" },
      "bestNew": { … }, "bestRefurbished": { … }, "alternatives": [ … ]
    }
  ],
  "bestTotal": 1234.56,
  "byMerchant": [ { "merchantId": "amazon", "merchantName": "Amazon.fr", "covered": 6, "total": 1301.2 } ],
  "missing": []
}`}</Code>
      </Section>

      <Section title="Contrat EnginePC — POST /api/v1/prices/lookup">
        <p>
          Format attendu par le configurateur EnginePC. Les catégories EnginePC (<code>cpu</code>, <code>gpu</code>, <code>motherboard</code>, <code>ram</code>,{' '}
          <code>storage</code>, <code>psu</code>, <code>case</code>, <code>cooler</code>, <code>laptop</code>, <code>phone</code>, <code>tablet</code>,{' '}
          <code>nas</code>, <code>server</code>, <code>desktop</code>…) sont converties ; une catégorie inconnue est ignorée. 50 articles au plus, occasion
          exclue, produits introuvables omis de la réponse. Les prix sont en euros.
        </p>
        <Code>{`curl -X POST ${origin}/api/v1/prices/lookup \\
  -H 'content-type: application/json' \\
  -H 'Authorization: Bearer VOTRE_CLE' \\
  -d '{
    "currency": "EUR", "country": "FR",
    "items": [
      { "id": "amd-ryzen-7-9800x3d", "name": "AMD Ryzen 7 9800X3D", "category": "cpu" },
      { "id": "nvidia-rtx-5080", "name": "NVIDIA GeForce RTX 5080", "category": "gpu" }
    ]
  }'`}</Code>
        <Code>{`{
  "results": [
    {
      "id": "amd-ryzen-7-9800x3d",
      "best": { "merchant": "LDLC", "price": 469.99, "currency": "EUR", "url": "https://…",
                "inStock": true, "shipping": 0, "updatedAt": "2026-09-24T12:00:00.000Z" },
      "offers": [ … ]
    }
  ]
}`}</Code>
        <p>
          <code>GET /api/v1/catalog</code> (et <code>/api/v1/catalog/:id</code>) expose le catalogue de référence SearchIT : produits réels,
          caractéristiques et prix de lancement indicatif. Liens entrants côté site : <code>/recherche?q=…&amp;category=…&amp;ean=…</code> et{' '}
          <code>/configuration?data=&lt;base64url(JSON)&gt;&amp;source=enginepc</code> (import dans « Ma liste »).
        </p>
      </Section>

      <Section title="Recherche — GET /api/v1/search">
        <p>
          Paramètres : <code>q</code>, <code>category</code>, <code>conditions</code> (<code>new,refurbished,used</code>), <code>merchants</code>,{' '}
          <code>minPrice</code>, <code>maxPrice</code>, <code>inStock</code>, <code>hideAccessories</code>, <code>sort</code> (<code>relevance</code>,{' '}
          <code>price-asc</code>, <code>price-desc</code>, <code>savings</code>, <code>offers</code>), <code>page</code>, <code>pageSize</code>.
        </p>
        <Code>{`curl '${origin}/api/v1/search?q=nas+4+baies&conditions=new,refurbished&sort=price-asc'`}</Code>
      </Section>

      <Section title="Exemple côté configurateur (TypeScript)">
        <Code>{`const res = await fetch('${origin}/api/v1/lookup', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-api-key': import.meta.env.VITE_SEARCHIT_KEY },
  body: JSON.stringify({
    items: build.parts.map((p) => ({ ref: p.slot, query: p.name, category: p.category })),
  }),
});
const { results, bestTotal } = await res.json();
for (const r of results) {
  build.setPrice(r.ref, r.best?.totalPrice ?? null, r.best?.url);
}`}</Code>
        <p>
          Catégories reconnues : <code>cpu</code>, <code>gpu</code>, <code>motherboard</code>, <code>ram</code>, <code>ssd</code>, <code>hdd</code>,{' '}
          <code>psu</code>, <code>case</code>, <code>cooling</code>, <code>fan</code>, <code>thermal-paste</code>, <code>laptop</code>, <code>desktop</code>,{' '}
          <code>smartphone</code>, <code>tablet</code>, <code>server</code>, <code>nas</code>, <code>network</code>, <code>monitor</code>, <code>cable</code>,{' '}
          <code>charger</code>… (liste complète dans <code>openapi.json</code>).
        </p>
      </Section>
    </div>
  );
}
