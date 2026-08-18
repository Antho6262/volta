# ⚔️ VOLTA — Contexte complet (site + bot Discord)

> À coller en début de nouvelle conversation pour ne pas tout réexpliquer.

## INFORMATIONS GÉNÉRALES
- **Nom du groupe** : Volta
- **Devise** : Honneur · Loyauté · Silence
- **Type** : Faction FiveM / GTA RP, Los Santos
- **Fondateur** : Tony Diaz (membre `tony_diaz`, grade "Fondateur", role admin, protégé — non supprimable)
- **Site web** : https://antho6262.github.io/volta/ *(ancien nom `klan-nostrad-site`, repo renommé)*
- **Repo GitHub (site)** : https://github.com/Antho6262/volta
- **Repo GitHub (bot Discord)** : https://github.com/Antho6262/volta-bot (privé, **pas de git local, édition directe sur GitHub.com**)

## ⚠️ ATTENTION — RISQUE DE MÉLANGE AVEC "KRONEN KRIEG"
L'utilisateur gère un **autre projet en parallèle**, "Kronen Krieg" (autre site, autre repo, autre Discord/bot). Plusieurs bugs réels ont déjà été causés par du code/texte copié depuis Kronen Krieg et jamais adapté (titres de page, logo Discord, couleurs d'embed, texte "— Kronen Krieg" en dur). **Toujours vérifier qu'un fichier/ID/texte fourni concerne bien Volta.**

## ⚠️ SERVEUR DISCORD
Bot sur le serveur "VOLTA π | FLASHBACK FA", ID `1521529278364389587`. Salons connus :
- **Salon absences** : `1521529291257675991`
- **Salon tenue** : `1521756617991786516`

---

## 🌐 LE SITE (volta)

### Stack
- Frontend HTML/CSS/JS vanilla, hébergé sur GitHub Pages (statique)
- Base de données : Firebase Realtime Database (europe-west1)
- Presque toutes les pages en écoute Firebase temps réel (`.on("value")`)

### Fichiers clés
```
volta/
├── index.html             ← page de login (⚠️ a déjà été écrasée par erreur avec le code du bot lors d'un merge, restaurée depuis git log — toujours vérifier que ce fichier commence par <!DOCTYPE html>, pas par du JS de bot)
├── css/style.css
├── img/{background.png, logo.png}
├── js/app.js               ← NAV_ITEMS (5 pages fixes + sous-menu "Plus" repliable), initShell, toggleNavSubmenu
├── js/firebase-config.js   ← FIREBASE_CONFIG, db, authReady, requireSession, canAccess, PAGES_DISPO, utilitaires
└── pages/ (dashboard, tracker, stock, transactions, labo, four, fourriere, stats, quotas,
            blanchiment, paye, taxes, admin, profil — + armurerie/objectifs/sanctions : fichiers
            présents mais retirés volontairement du menu/permissions, à ne PAS réintégrer)
```

### Palette
Rouge `#c41e22` + gris/noir + blanc. Danger = rouge foncé `#8b1518`.

### Navigation (js/app.js)
Sidebar réorganisée en deux zones :
- **5 pages toujours visibles**, dans cet ordre : Dashboard, Tracker, Stock, Transactions, Labo
- **Sous-menu repliable "☰ Plus"** : Fourrière, Stats, Quotas, Blanchiment, Paye, Taxes, Admin, Profil — se déplie/replie au clic, s'ouvre automatiquement si la page active est dedans

### Système d'onglets par catégorie de stock (générique, réutilisé partout)
Les catégories de stock (Drogue, Matériel, Labo, etc.) sont **dynamiques**, définies dans Admin → Stock. Plusieurs pages génèrent automatiquement un onglet par catégorie existante — rien à coder pour en ajouter une nouvelle, il suffit de la créer dans Admin :
- **`stock.html`** : onglet "Argent" (mouvements + historique) + un onglet par catégorie de stock
- **`dashboard.html`** : mêmes onglets par catégorie sous les 4 cartes de stats générales

### Labo (`pages/labo.html`) — refonte complète
- **Un seul onglet en haut par produit fini** (ex: 🍄 SporeX, 💉 Héroïne — emoji auto-détecté selon le nom via `emojiProduit()`), qui pilote à la fois :
  - le formulaire "Nouvelle production" (plus de menu déroulant Produit, c'est l'onglet actif qui détermine ce qui est produit)
  - le tableau de stock affiché en dessous (structure identique à Stock : Produit/Prix/Stock/Seuil/Niveau, panel plein largeur)
  - les ingrédients affichés dans "Stock d'ingrédients (commun)" (filtrés à ceux de la recette de l'onglet actif uniquement)
- **Lien "Vend vers"** : chaque produit fini avec recette peut être lié à un produit d'une autre catégorie (ex: Drogue). Configuré dans Admin → Stock → Labo, colonne "Vend vers". Une fois lié :
  - la production crédite **uniquement** le stock lié (plus de double compteur séparé qui finit par diverger)
  - **partout où le stock Labo est affiché** (labo.html, stock.html, dashboard.html), il faut lire **en direct** le stock du produit lié (`p.venteCatId` / `p.venteProdId`) plutôt que le champ `stock` brut du produit Labo — sinon ça se désynchronise dès qu'une vente a lieu ailleurs. **Piège déjà rencontré deux fois**, bien vérifier à chaque nouvel affichage de stock Labo.
- Création de recette/ingrédients : **dans Admin → Stock → catégorie Labo uniquement**, plus dans labo.html (nettoyé pour éviter la redondance)

### Four (`pages/four.html`) — nouvelle page
- **Onglet par drogue** (tous les produits de la catégorie Stock Drogue, détectée par `nom === "Drogue"`)
- Pour **Mexicana, Cock, Cannabis uniquement** : tableau détaillé par **pureté** (50%/70%/90%/99%), stocké dans le nœud Firebase `four_purete/{produitId}/{purete}`. Chaque ajout/retrait met aussi à jour le stock global de la drogue dans Stock Drogue.
- Pour les autres drogues (SporeX, Ecstasy, Héroïne, Lean, etc.) : vue simple (stock global + ajout/retrait rapide), pas de détail pureté.
- **Formulaire de vente simplifié** en bas : Membre, Produit (liste complète de Stock Drogue, non filtrée), Quantité, Prix, Date, Notes. Toujours `type: "vente"` et `type_argent: "sale"` (pas de choix achat/groupe/téléphone/argent propre). Écrit dans le même nœud `transactions` que la page Transactions, avec `source: "four"` pour les distinguer.
- ⚠️ **Règles Firebase** : le nœud `four_purete` doit être explicitement autorisé dans les règles Realtime Database (même modèle que `stock`), sinon `permission_denied` silencieux sur les boutons Ajouter/Retirer.

### Quotas
- Catégorie "Labo" **réintégrée** dans les quotas (avait été exclue par erreur) : compte **1 par production** (une fournée, peu importe la quantité fabriquée), pas la quantité — logique différente des autres catégories qui comptent la quantité totale.
- Nécessite que `actions_dispo/labo` ait bien `cat_variable: "labo_cat"` — un ancien enregistrement pouvait en être dépourvu (retrofit géré dans `bootstrap()` de labo.html).

### Tracker
- **Fleeca ET Armurerie** ont la liste de coéquipiers à cocher (`equipeWrap`), enregistrés en `participants_ids`/`participants_noms` sur l'action (informationnel, pas de partage d'argent automatique).
- **Chacun peut supprimer/modifier ses propres actions** (plus réservé aux admins ; les admins gardent le droit sur toutes les actions).
- L'action "Labo" reste **volontairement exclue** du menu déroulant Action du tracker (`nom !== "Labo"`) — la production passe uniquement par la page Labo dédiée.

### Paye
- 🐛 **Bug corrigé** : le bouton "Payer" injectait le prénom du membre directement dans l'attribut HTML `onclick="..."`. Les surnoms entre guillemets doubles (`Luccio "Silver"`, `Diego "Glx"`, etc.) cassaient l'attribut HTML en plein milieu → bouton silencieusement inactif pour tout membre avec un surnom entre guillemets. Corrigé : `payer()` ne prend plus que l'id membre, récupère le prénom depuis `RAW.membres` au lieu du DOM.

### Armurerie / Objectifs / Sanctions
Ces 3 pages **existent toujours comme fichiers** dans `pages/` mais sont **volontairement absentes** de `NAV_ITEMS` et `PAGES_DISPO` (retrait confirmé par l'utilisateur) — ne pas les réintégrer sans demande explicite.

### Firebase — règles de sécurité
Chaque nœud racine doit être **explicitement listé** dans les règles Realtime Database (`.read`/`.write`), sinon refus silencieux (`permission_denied`) sans erreur visible côté UI — seule la console (F12) le révèle. **Toujours vérifier les règles en premier réflexe** si un bouton "ne fait rien" sans erreur JS visible.

### Firebase — nœuds clés
`sessions`, `membres`, `grades`, `visibilite_grades`, `actions/{semaineId}/{id}`, `stock` (catégories dynamiques avec `nom`, `emoji`, `produits{}` ; un produit peut avoir `recipe[]`, `venteCatId`, `venteProdId`), `four_purete/{produitId}/{purete}`, `labo_stock_commun` (ingrédients), `transactions` (avec `source: "four"` pour celles de la page Four), `semaines/{id}` (nom, bloquee, createdAt, closedAt, resume, debut, fin, verrouAt), `config` (blanchiment_taux, taux_paye_drogue, taux_paye_autres, taux_paye_grades, discord_webhook_semaine), `permissions`, `argent/{sale,propre}`, `payes/{semaineId}/{membreId}`.

---

## 🤖 LE BOT DISCORD (volta-bot)

### Hébergement
- Repo GitHub `Antho6262/volta-bot` — édition directe sur GitHub.com
- Déployé sur **Render.com** (Web Service, plan Free)
- ⚠️ **URL actuelle** : `https://volta-bot-l5r9.onrender.com` (a changé après suppression/recréation du service — si le bot est hors ligne après un long moment d'inactivité, vérifier qu'**UptimeRobot pointe bien vers cette URL à jour**, pas une ancienne)
- Nom du bot sur Discord : **Volta Secrétaire**
- Variables d'environnement Render : `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID_GARAGES`, `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_DB_URL`
- `package.json` dépendances : `discord.js`, `express`, `firebase-admin`, `@firebase/app`, **`@napi-rs/canvas`** (génération d'images, voir plus bas)
- Dossier `fonts/` à la racine du repo (5 fichiers `.ttf` : Anton-Regular, Poppins-Bold/ExtraBold/Regular/SemiBold) — nécessaire au rendu de la bannière image

### Fonctionnalités (`index.js`)
1. Connexion permanente Discord.js
2. Import automatique Fourrière (salon garages)
3. Gestion automatique des semaines (clôture dimanche 19h Paris, transaction atomique, rattrapage fiable via `verrouAt`)
4. **Résumé de semaine en image** (nouveau, remplace l'ancien embed texte — voir section dédiée)
5. Salon absences avec modèle épinglé auto
6. Commandes texte : `!histoire`, `!avertissement`/`!warn`, `!radio` (embed "terminal de décryptage" stylé ANSI), `!numero`/`!numéro`
7. Petit serveur HTTP Express pour les pings Render/UptimeRobot

### 🖼️ Bannière image du résumé de semaine
Remplace l'ancien embed Discord texte par une **image PNG générée** (fond dégradé rouge/noir, logo, gain total en grand, podium à médailles pour le top 3, classement, ventes par produit, qui a vendu quoi par membre). Résolution finale x2 (SCALE=2) pour rester nette une fois cliquée en plein écran sur Discord.

**Deux implémentations séparées, à garder synchronisées visuellement :**
1. **`index.js`** (bot, Node.js) : librairie `@napi-rs/canvas`, polices chargées via `GlobalFonts.registerFromPath()` depuis `fonts/`. Déclenché à la clôture automatique du dimanche.
2. **`pages/admin.html`** (site, navigateur) : Canvas API native du navigateur, polices via Google Fonts (lien injecté en JS + `document.fonts.load()`). Déclenché par le bouton manuel "Bloquer + Résumé".

Envoi Discord : image en pièce jointe via `FormData` multipart (`payload_json` + `files[0]`), embed avec juste `image: {url: "attachment://resume.png"}`. Repli automatique (try/catch) sur l'ancien embed texte si la génération échoue.

**Pièges déjà rencontrés :**
- Emojis dans le texte du canvas → ne s'affichent pas (tofu boxes) ; utiliser des formes dessinées (cercles + chiffres) à la place
- Hauteur de canvas fixe trop petite → contenu coupé en bas ; prévoir large (2600px) puis recadrer à la vraie hauteur du contenu
- `@napi-rs/canvas` nécessite d'être dans `package.json` **et** le dossier `fonts/` poussé, sinon `Cannot find module` ou police manquante au démarrage

### 🐛 Panne réseau résolue (IP Render bloquée)
Le bot restait bloqué indéfiniment à "Preparing to connect to the gateway..." (jamais d'erreur, jamais de succès) après l'ajout de `@napi-rs/canvas`. **Diagnostic confirmé : ce n'était PAS le code** (testé en désactivant temporairement canvas, même symptôme) — c'était l'**IP sortante partagée du plan gratuit Render, bloquée/rate-limitée par Discord** (problème connu, indépendant du code). Résolu en **supprimant et recréant le service Render** (nouvelle IP sortante). Every fois qu'on recrée le service : l'URL change, il faut mettre à jour UptimeRobot et re-remplir les 4 variables d'environnement.

### Config Discord bot (portail développeur)
- Message Content Intent activé
- "Requires OAuth2 Code Grant" désactivé

---

## POINTS D'ATTENTION GÉNÉRAUX
1. Toujours trier en JS, jamais via `orderByChild` Firebase.
2. Solde = cumul depuis le début, pas par semaine.
3. Après un push du **site** : Ctrl+F5 une fois (cache navigateur), puis temps réel automatique.
4. Après une modif du **bot** : éditer `index.js` sur GitHub.com → commit → Render redéploie seul (~30-60s).
5. Ne jamais coller de token/clé privée en clair — la considérer compromise si ça arrive, et la régénérer.
6. Toujours vérifier qu'un fichier/ID/texte concerne bien Volta et pas Kronen Krieg avant de le réutiliser.
7. **Onclick avec données dynamiques (prénoms, noms) : jamais d'injection directe en HTML.** Les surnoms/noms peuvent contenir des guillemets qui cassent l'attribut. Toujours ne passer que des IDs et relire les données depuis l'état JS (RAW.membres, etc.) à l'intérieur de la fonction appelée.
8. **Un bouton qui "ne fait rien" sans erreur visible** → vérifier dans l'ordre : (1) cache navigateur (Ctrl+F5), (2) règles Firebase (nœud manquant = `permission_denied` silencieux), (3) erreur JS dans la console F12 (souvent un souci de guillemets/apostrophes dans du texte injecté en HTML).
9. Deux stocks pour un même produit qui divergent dans le temps → toujours préférer la **lecture en direct** de la source de vérité plutôt qu'une copie/snapshot stockée séparément.
