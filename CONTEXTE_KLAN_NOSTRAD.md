# 🪙 KLAN NOSTRAD — Contexte complet du projet

## INFORMATIONS GÉNÉRALES
- **Nom du groupe** : Klan Nostrad
- **Type** : Faction FiveM / GTA RP — thème "Prophetic Order", Los Santos
- **Fondateur** : Tony Diaz (seul membre créé par défaut, grade "Fondateur", role admin, accès total)
- **Site web** : https://antho6262.github.io/klan-nostrad-site/
- **Repo GitHub** : https://github.com/Antho6262/klan-nostrad-site
- **Dossier local** : `C:\Users\amalh\Desktop\Klan Nostrad\klan-nostrad-site`
- **Base de départ** : site cloné depuis le projet "La Sombra Del Jaguar" (même archi), rendu vierge et généralisé.

## STACK TECHNIQUE
- Frontend : HTML/CSS/JS vanilla — GitHub Pages (statique)
- Base de données : Firebase Realtime Database (région europe-west1)
- Hébergement : GitHub Pages (gratuit)

## FIREBASE CONFIG (déjà en place dans js/firebase-config.js)
```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCDJiMzRhILU2vs1OvUowFW00Fn-of6p_k",
  authDomain: "klan-nostrad.firebaseapp.com",
  databaseURL: "https://klan-nostrad-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "klan-nostrad",
  storageBucket: "klan-nostrad.firebasestorage.app",
  messagingSenderId: "745141888334",
  appId: "1:745141888334:web:de8e93ee0eb2ae39876a1f",
  measurementId: "G-PCJ6QGNDTE"
};
```

## STRUCTURE DU SITE
```
klan-nostrad-site/
├── index.html          ← Page de connexion (logo + sélection membre + mot de passe)
├── setup.html          ← Initialisation Firebase (usage unique, crée Tony Diaz)
├── css/style.css        ← CSS global — thème doré + gris + noir (PAS de rouge, retiré sur demande)
├── img/
│   ├── background.png   ← Sceau complet (fond du site, image envoyée par l'utilisateur)
│   └── logo.png          ← Médaillon recadré en cercle (logo sidebar + login)
├── js/
│   ├── firebase-config.js  ← Config Firebase + session + permissions + PAGES_DISPO
│   └── app.js                ← Sidebar (avec logo), nav (NAV_ITEMS), shell commun
└── pages/
    ├── dashboard.html, tracker.html, stats.html, stock.html, logs.html,
    ├── quotas.html, objectifs.html, blanchiment.html, sanctions.html,
    ├── admin.html, profil.html, tv.html, transactions.html, taxes.html
```

## PALETTE (demandes successives de l'utilisateur)
1. D'abord acier rgb(176,196,222) + or + noir.
2. Puis changé en rouge rgb(196,30,33) + gris + blanc.
3. Puis écritures passées en doré (#d4af37) — rouge gardé sur les bordures/boutons.
4. **Puis rouge totalement retiré** : tout est maintenant doré (`--steel` et `--gold` = `#d4af37`) + gris/noir (`--bg-0..3`) + blanc (`--text`). Le "danger" (suppression) utilise un bronze/ambre (`#b8731f`), plus de rouge nulle part.
5. Boutons primaires/gold : fond doré dégradé sombre + texte doré clair qui "ressort" (text-shadow).

## FIREBASE — STRUCTURE DES DONNÉES (vierge au départ, remplie via Admin)
```
membres/{id}        prenom, nom, grade, mot_de_passe, actif, role (admin/membre), quota
grades/{id}          nom, ordre
semaines/{id}        nom, bloquee, createdAt
actions_dispo/{id}   nom, montant_sale, montant_propre, recipe:[{catId,prodId,qty}], cat_variable (optionnel)
  → recipe = consommation fixe de stock (ex: ATM consomme toujours "Boîtier de piratage")
  → cat_variable = catégorie dont le PRODUIT EXACT est choisi par le membre au moment de l'action
    (ex: "Vente de Drogue" → cat_variable = id de la catégorie "Drogue" → le tracker demande "quelle drogue")
actions/{semaineId}/{id}  membre_id, prenom_membre, nom_membre, grade_membre, action, action_id,
                           quantite, date, heure, resultat, raison_echec,
                           argent_sale, argent_propre, gains_totaux, createdAt,
                           produit_drogue, produit_drogue_id (si action à cat_variable)
stock/{catId}        nom, emoji, produits/{id}: nom, prix, stock, seuil
argent/sale/{id}, argent/propre/{id}   date, description, type (Entrée/Sortie), montant, responsable
blanchiments/{id}    date, description, montant_sale, montant_propre, frais, responsable
sanctions/{id}       membre_id, prenom, nom, niveau, motif, par, date
journal_stock/{id}   date, membre, action, quantite, produit
objectifs_config/{id}: cible          objectifs_membres/{membreId}/{id}: cible
quotas_produits/{membreId}/{prodId}: quota   ← quota par produit (ex: par drogue), ajouté à la demande
transactions/{id}    type(achat/vente), groupe, telephone, produit_id, produit_nom, catId,
                      quantite, prix, type_argent, notes, date
taxes/{id}           groupe, telephone, membre_id, prenom_membre, taxe_id, taxe_nom,
                      montant, type_argent, notes, date
types_taxes/{id}     nom
permissions/{grade}/{page}   true/false (le Fondateur a toujours accès à tout)
config               blanchiment_taux, discord_webhook_semaine, nom_groupe
```

## ACTIONS IMPORTÉES (bouton "Importer les actions classiques" dans Admin → Actions)
Reproduit la logique de Sombra avec un système générique :
| Action | Effet stock | Type |
|---|---|---|
| Vente de Drogue | -1 du produit choisi (catégorie "Drogue" : Meth, Coke, Weed) | produit variable |
| ATM | -1 Boîtier de piratage | recette fixe |
| Cambu | -1 Outil de crochetage | recette fixe |
| Plantation | -1 Eau, -1 Fertilisant, -1 Graine, -1 Pot | recette fixe |
| Vente de Branches | -1 Branche de cannabis | recette fixe |

Catégories de stock créées par l'import : Drogue 💊, Matériel 🛠️, Plantation 🌱, Branches 🌿
(prix/stock à 0 par défaut sur la plupart — à ajuster dans Admin → Stock).

## MEMBRES (vus dans les captures d'écran — à vérifier dans Admin, peut avoir changé)
Tony Diaz (Fondateur), Silver, Baba, Amir, Rick, Sam, Michael, Robin, Jack — quota global 20/semaine chacun.

## PERMISSIONS
- Gérées depuis Admin → onglet Permissions.
- Le Fondateur (role = admin) a toujours accès à tout, même si rien n'est configuré.
- Suppression (tracker, transactions, taxes, sanctions) réservée aux membres `role = admin`.

## FONCTIONNALITÉS AJOUTÉES PAR RAPPORT À LA BASE VIERGE INITIALE
1. Système de "produit variable" (cat_variable) pour les actions type Vente de Drogue.
2. Bouton d'import rapide des 5 actions classiques + catégories de stock associées.
3. Édition des produits de stock directement dans Admin → Stock (nom/prix/stock/seuil + bouton Enregistrer), en plus de la suppression.
4. Quotas par produit (ex: par drogue) par membre, en plus du quota global d'actions.
5. Logo (médaillon doré recadré depuis le sceau) dans la sidebar et la page de connexion.
6. **Quotas (global + par produit) déplacés dans Admin → onglet Quotas — édition réservée aux admins.** La page "Quotas" du menu principal est désormais en lecture seule pour tout le monde (plus aucun champ modifiable).
7. **Nouvelle page "Consommation"** (menu principal, icône 💉) : permet de tracer quand un personnage consomme un produit du stock pour lui-même (ex: se pique) sans vente — retire le produit du stock, garde un historique par membre, suppression admin avec rollback du stock. Stocké dans `consommations/{id}`.

## AJOUTER UNE NOUVELLE PAGE — CHECKLIST
1. Créer `pages/ma-page.html` (copier structure existante, shell `initShell('ma-page', 'Titre')`).
2. `js/app.js` → ajouter dans `NAV_ITEMS`.
3. `js/firebase-config.js` → ajouter dans `PAGES_DISPO`.
4. Configurer les accès dans Admin → Permissions.

## BUGS / POINTS D'ATTENTION
1. `orderByChild` Firebase nécessite un index → toujours trier en JS (déjà fait partout).
2. `snap.forEach` ne retourne qu'un élément si index manquant → ce site utilise systématiquement `entries(snap.val())`.
3. Règles Firebase en mode test : expirent au bout de 30 jours → à restreindre/renouveler dans la console.
4. Emojis complexes dans la nav → préférer des emojis simples (déjà respecté).

## POUR REPRENDRE LA CONVERSATION
Colle ce fichier au début d'un nouveau chat avec Claude, en précisant ce que tu veux faire ensuite.
Si tu as toujours le fichier `klan-nostrad-site.zip` ou le repo GitHub à jour, tu peux aussi le repartager.
