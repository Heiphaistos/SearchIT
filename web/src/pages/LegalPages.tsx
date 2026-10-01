import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/meta';

// Mentions légales, politique de confidentialité et CGU propres à searchit.heiphaistos.org.
const CONTACT = 'contact.forgeinformatique@heiphaistos.org';
const UPDATED = '1er octobre 2026';

function Mail() {
  return (
    <a href={`mailto:${CONTACT}`} className="break-all text-brand-600 underline dark:text-brand-400">
      {CONTACT}
    </a>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline dark:text-brand-400">
      {children}
    </a>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  );
}

function Shell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight break-words sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour : {UPDATED}</p>
      {intro && <div className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{intro}</div>}
      {children}
      <nav aria-label="Informations légales" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link to="/mentions-legales" className="text-slate-500 underline dark:text-slate-400">Mentions légales</Link>
        <Link to="/confidentialite" className="text-slate-500 underline dark:text-slate-400">Confidentialité</Link>
        <Link to="/cgu" className="text-slate-500 underline dark:text-slate-400">Conditions d’utilisation</Link>
      </nav>
    </div>
  );
}

export function MentionsLegalesPage() {
  usePageMeta('Mentions légales', 'Éditeur, hébergeur et propriété intellectuelle du site searchit.heiphaistos.org.');
  return (
    <Shell title="Mentions légales">
      <Block title="Éditeur du site">
        <p>
          Le site <strong>searchit.heiphaistos.org</strong> est édité à titre personnel et non professionnel par une personne physique publiant sous le
          pseudonyme <strong>Heiphaistos</strong>.
        </p>
        <p>
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN, article 6-III-2), l’éditeur, non
          professionnel, a choisi de préserver son anonymat. Ses éléments d’identification ont été communiqués à l’hébergeur, qui en garantit la
          confidentialité.
        </p>
        <p>
          Contact : <Mail />
        </p>
      </Block>
      <Block title="Directeur de la publication">
        <p>L’éditeur du site, tel que désigné ci-dessus.</p>
      </Block>
      <Block title="Hébergement">
        <p>
          <strong>IONOS SE</strong> — Elgendorfer Str. 57, 56410 Montabaur, Allemagne — Tél. : +49 721 170 555 —{' '}
          <Ext href="https://www.ionos.fr">ionos.fr</Ext>
        </p>
      </Block>
      <Block title="Propriété intellectuelle">
        <p>
          Les textes, visuels, logos et le code de ce site sont la propriété de leur éditeur. Toute reproduction sans autorisation écrite préalable est
          interdite. Les noms de produits, marques, photos de produits et prix affichés appartiennent à leurs propriétaires respectifs (fabricants et
          marchands) et ne sont reproduits que pour identifier les offres comparées.
        </p>
      </Block>
      <Block title="Prix et liens marchands">
        <p>
          SearchIT est un comparateur : il ne vend rien. Les prix et la disponibilité sont ceux communiqués ou publiés par les marchands au moment du relevé
          et peuvent avoir changé ; seule l’offre affichée sur le site du vendeur fait foi. Certains liens peuvent être affiliés : le marchand peut alors
          verser une commission à l’éditeur, sans surcoût pour vous. La liste des marchands et des sources figure sur la page{' '}
          <Link to="/sources" className="text-brand-600 underline dark:text-brand-400">Marchands &amp; sources</Link>.
        </p>
      </Block>
      <Block title="Responsabilité">
        <p>
          L’éditeur s’efforce de maintenir des informations exactes et à jour, sans pouvoir le garantir. Il ne peut être tenu responsable des erreurs,
          omissions ou dommages résultant de l’utilisation de ce site, ni du contenu des sites marchands vers lesquels il renvoie.
        </p>
      </Block>
      <Block title="Signaler un contenu">
        <p>
          Pour signaler un contenu illicite, une erreur de prix ou demander le retrait d’une offre : <Mail />.
        </p>
      </Block>
    </Shell>
  );
}

export function ConfidentialitePage() {
  usePageMeta('Confidentialité', 'Données traitées par searchit.heiphaistos.org, durées de conservation et droits RGPD.');
  return (
    <Shell
      title="Politique de confidentialité"
      intro={
        <p>
          En bref : SearchIT n’a <strong>ni compte, ni cookie, ni publicité, ni mesure d’audience</strong>. Vos listes, suivis de prix et préférences restent
          dans votre navigateur. Le serveur ne voit que vos recherches et les journaux techniques décrits ci-dessous.
        </p>
      }
    >
      <Block title="Responsable de traitement">
        <p>
          L’éditeur du site (voir les <Link to="/mentions-legales" className="text-brand-600 underline dark:text-brand-400">mentions légales</Link>),
          joignable à <Mail />.
        </p>
      </Block>
      <Block title="Journaux techniques du serveur">
        <p>
          Pour chaque requête, le serveur enregistre l’adresse IP, la date, l’adresse demandée (donc le texte d’une recherche) et le navigateur utilisé.
          L’adresse IP sert aussi, en mémoire uniquement, à limiter le nombre de requêtes par visiteur.
        </p>
        <p>Finalité : sécurité, prévention des abus et diagnostic technique. Base légale : intérêt légitime (article 6.1.f du RGPD). Conservation : 12 mois maximum.</p>
      </Block>
      <Block title="Recherches et historique des prix">
        <p>
          Les recherches qui donnent des résultats sont comptées pour proposer les « recherches populaires » (autocomplétion, plan du site). Pour qu’un texte
          ne soit montré aux autres qu’après avoir été cherché par au moins trois visiteurs différents, SearchIT conserve avec chaque recherche au plus trois
          empreintes courtes (12 caractères d’un hachage SHA-256) des adresses IP qui l’ont faite, jamais l’adresse elle-même. Une recherche reste dans cette
          liste tant qu’elle fait partie des 5 000 plus utilisées. Ne saisissez pas de données personnelles dans la barre de recherche.
        </p>
        <p>
          L’historique des prix (un prix par produit et par jour, 365 jours) ne contient que des données sur les produits et les marchands, aucune donnée
          sur les visiteurs.
        </p>
      </Block>
      <Block title="Services interrogés par le serveur">
        <p>
          Pour trouver les offres, le serveur de SearchIT transmet <strong>le texte de votre recherche</strong> (jamais votre adresse IP ni aucune autre
          donnée vous concernant) à : l’API Browse d’<strong>eBay</strong>, l’API Google Shopping de <strong>Serper</strong> (google.serper.dev), les sites
          des marchands consultés directement (TopAchat, Cybertek, Alternate et boutiques Shopify publiques de fabricants) et, le cas échéant, les flux
          d’affiliation configurés. Il récupère aussi les taux de change de la Banque centrale européenne et interroge l’API de Wikipédia pour trouver une
          photo aux produits du catalogue. Le détail est sur la page{' '}
          <Link to="/sources" className="text-brand-600 underline dark:text-brand-400">Marchands &amp; sources</Link>.
        </p>
      </Block>
      <Block title="Photos des produits et liens marchands">
        <p>
          Les photos des offres et du catalogue sont affichées directement depuis les serveurs qui les hébergent (marchands, eBay, Google, Wikimedia…) :
          votre navigateur les télécharge chez eux, qui reçoivent donc votre adresse IP et les informations techniques habituelles d’une requête web.
          Cliquer sur
          une offre vous emmène sur le site du marchand, soumis à sa propre politique de confidentialité.
        </p>
      </Block>
      <Block title="Stockage dans votre navigateur">
        <p>
          SearchIT ne dépose <strong>aucun cookie</strong>. Il utilise le stockage local de votre navigateur pour : le thème et la couleur d’accent, vos
          recherches récentes, votre liste, le comparateur, vos suivis de prix et une configuration importée depuis EnginePC. Ces données ne quittent pas
          votre appareil, sauf le titre d’un produit suivi, envoyé au serveur pour revérifier son prix (au plus toutes les 6 heures). Elles s’effacent avec
          les données du site dans votre navigateur. Les alertes de prix utilisent les notifications du navigateur, seulement si vous les autorisez.
        </p>
      </Block>
      <Block title="Polices">
        <p>Aucune police n’est chargée depuis un service tiers (pas de Google Fonts).</p>
      </Block>
      <Block title="Contact par e-mail">
        <p>
          Si vous écrivez à l’adresse de contact, votre message et votre adresse e-mail sont conservés le temps de traiter la demande, puis 3 ans au maximum.
          Base légale : intérêt légitime à répondre aux demandes.
        </p>
      </Block>
      <Block title="Destinataires">
        <p>
          Les données sont traitées sur un serveur hébergé par IONOS SE dans l’Union européenne. Elles ne sont ni vendues, ni cédées, ni utilisées pour du
          profilage ou de la publicité.
        </p>
      </Block>
      <Block title="Vos droits">
        <p>
          Vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité (articles 15 à 22 du RGPD). Pour
          les exercer : <Mail /> — réponse sous un mois.
        </p>
        <p>
          En cas de désaccord, vous pouvez saisir la CNIL : <Ext href="https://www.cnil.fr">cnil.fr</Ext>.
        </p>
      </Block>
    </Shell>
  );
}

export function CguPage() {
  usePageMeta('Conditions d’utilisation', 'Conditions générales d’utilisation du comparateur SearchIT et de son API.');
  return (
    <Shell
      title="Conditions d’utilisation"
      intro={
        <p>
          Les présentes conditions générales d’utilisation (CGU) s’appliquent au site <strong>searchit.heiphaistos.org</strong> et à son API publique.
        </p>
      }
    >
      <Block title="Objet">
        <p>
          SearchIT est un comparateur de prix gratuit pour le high-tech neuf, reconditionné et d’occasion. Il recherche des offres chez des marchands et
          renvoie vers leur site. Il ne vend aucun produit et n’intervient pas dans les achats.
        </p>
      </Block>
      <Block title="Acceptation">
        <p>Utiliser le site ou l’API vaut acceptation des présentes conditions. Si vous ne les acceptez pas, merci de ne pas les utiliser.</p>
      </Block>
      <Block title="Gratuité">
        <p>Le service est gratuit, sans compte ni abonnement. Certains liens marchands peuvent être affiliés, sans surcoût pour vous.</p>
      </Block>
      <Block title="Exactitude des prix">
        <p>
          Les prix, frais de port, disponibilités, états (neuf, reconditionné, occasion) et caractéristiques techniques sont indicatifs. Ils proviennent des
          marchands et de sources publiques et peuvent être erronés ou dépassés. Vérifiez toujours l’offre sur le site du vendeur avant d’acheter : le
          contrat de vente est conclu entre vous et le marchand, selon ses propres conditions.
        </p>
      </Block>
      <Block title="Suivis de prix et alertes">
        <p>
          Les suivis de prix sont stockés dans votre navigateur et vérifiés quand vous ouvrez le site. Une alerte peut ne pas se déclencher (offre retirée,
          navigateur fermé, données effacées) : elle ne constitue aucun engagement.
        </p>
      </Block>
      <Block title="API publique">
        <p>
          L’API décrite sur la page <Link to="/developpeurs" className="text-brand-600 underline dark:text-brand-400">API développeurs</Link> est fournie
          sans garantie de disponibilité et soumise à une limite de débit. Il est interdit de la contourner, de revendre les données obtenues ou de
          l’utiliser pour surcharger le service ou les marchands.
        </p>
      </Block>
      <Block title="Comportement">
        <p>
          Il est interdit de tenter de porter atteinte à la sécurité ou à la disponibilité du site (attaque, aspiration massive, contournement des limites
          de débit), ainsi que de saisir dans la recherche des contenus illicites ou des données personnelles de tiers.
        </p>
      </Block>
      <Block title="Disponibilité et responsabilité">
        <p>
          Le service est fourni « en l’état », sans garantie de disponibilité ni d’exactitude. L’éditeur peut le modifier, le suspendre ou l’arrêter à tout
          moment, et ne pourra être tenu responsable des dommages directs ou indirects résultant de son utilisation ou d’un achat effectué chez un
          marchand.
        </p>
      </Block>
      <Block title="Modification des conditions">
        <p>Ces conditions peuvent évoluer ; la date de dernière mise à jour figure en haut de page.</p>
      </Block>
      <Block title="Droit applicable">
        <p>Les présentes conditions sont régies par le droit français. En cas de litige, une solution amiable sera recherchée avant toute action.</p>
      </Block>
      <Block title="Contact">
        <p>
          <Mail />
        </p>
      </Block>
    </Shell>
  );
}
