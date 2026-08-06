# ⚔️ VOLTA — Contexte complet (site + bot Discord)

> À coller en début de nouvelle conversation pour ne pas tout réexpliquer.

## INFORMATIONS GÉNÉRALES
- **Nom du groupe** : Volta
- **Devise** : Honneur · Loyauté · Silence
- **Type** : Faction FiveM / GTA RP, Los Santos
- **Fondateur** : Tony Diaz (membre `tony_diaz`, grade "Fondateur", role admin, protégé — non supprimable)
- **Site web** : https://antho6262.github.io/klan-nostrad-site/
- **Repo GitHub (site)** : https://github.com/Antho6262/klan-nostrad-site — dossier local : `C:\Users\amalh\Desktop\Klan Nostrad\klan-nostrad-site`
- **Repo GitHub (bot Discord)** : https://github.com/Antho6262/volta-bot (privé, **pas de git local, édition directe sur GitHub.com**)

## ⚠️ ATTENTION — RISQUE DE MÉLANGE AVEC "KRONEN KRIEG"
L'utilisateur gère un **autre projet en parallèle**, "Kronen Krieg" (autre site, autre repo, autre Discord/bot). Plusieurs bugs réels ont déjà été causés par du code/texte copié depuis Kronen Krieg et jamais adapté (titres de page, logo Discord, couleurs d'embed, texte "— Kronen Krieg" en dur). **Toujours vérifier qu'un fichier/ID/texte fourni concerne bien Volta.**

## ⚠️ SERVEUR DISCORD — CHANGEMENT RÉCENT
Le bot a été **déplacé vers un nouveau serveur Discord** (le nom affiché est "VOLTA π | FLASHBACK FA", ID serveur `1521529278364389587`) — retiré de l'ancien serveur Volta. Salons connus sur ce nouveau serveur :
- **Salon absences** : `1521529291257675991`
- **Salon garages** : à confirmer si pas encore communiqué (l'ancien ID `1501354760442347600` était sur l'ancien serveur, probablement invalide maintenant)

---

## 🌐 LE SITE (klan-nostrad-site)

### Stack
- Frontend HTML/CSS/JS vanilla, hébergé sur GitHub Pages (statique)
- Base de données : Firebase Realtime Database (europe-west1)
- **Presque toutes les pages sont en écoute Firebase temps réel** (`.on("value")`) — toute donnée modifiée par un membre apparaît instantanément chez tous les autres, sans rafraîchir

### Fichiers clés
```
klan-nostrad-site/
├── index.html
├── css/style.css
├── img/{background.png, logo.png}
├── img/armes/ (photos d'armes détourées : m9a3, vortex_full, micro_smg, sns, sns_pico, glock, glock17)
├── js/app.js              ← NAV_ITEMS (sidebar) + initShell + indicateur temps réel 🟢/🔴
├── js/firebase-config.js  ← FIREBASE_CONFIG, db, authReady, requireSession, canAccess, pathToRoot,
│                             PAGES_DISPO, et TOUS les utilitaires (entries, toast, uid, formatMoney,
│                             todayISO, logout). Fichier propre, correctement "Volta" (vérifié).
└── pages/ (dashboard, tracker, armurerie, fourriere, stats, stock, quotas, blanchiment,
            paye, transactions, taxes, admin, profil, labo, objectifs, sanctions)
```

### Palette
Rouge `#c41e22` + gris/noir + blanc. Danger = rouge foncé `#8b1518`.

### Pages temps réel — état
**OK (temps réel complet)** : dashboard, stock, tracker, armurerie, quotas, transactions, taxes, sanctions, profil, objectifs, stats, paye, labo, blanchiment, fourriere.
**Partiellement fait** : admin.html → uniquement l'onglet **Semaines** est en temps réel ; les autres onglets (Membres, Stock, Actions, Quotas, Grades, Visibilité, Permissions, Config, Audit) rechargent encore classiquement après action.

### 🐛 Bug majeur trouvé et corrigé dans admin.html
Les fonctions `logAudit`, `prochainesBornes`, `nomAutoSemaine`, `creerSemaineSuivante`, `majStatsEtBadges`, `envoyerWebhookEmbed` étaient **appelées mais jamais définies nulle part** → chaque action admin (créer/bloquer semaine, modifier membre/stock/etc.) plantait juste après l'écriture Firebase, empêchant tout rafraîchissement automatique. **Corrigé** : toutes ces fonctions sont maintenant définies localement dans `admin.html`, avec les vraies constantes Volta (`VOLTA_LOGO_URL`, `VOLTA_COLOR_STEEL`) à la place d'anciennes constantes `KK_LOGO_URL`/`KK_COLOR_STEEL` qui pointaient vers Kronen Krieg.

### Armurerie
Type d'arme = texte libre (codes internes B1, B10, MSGS2...). Champ séparé "Modèle (photo)" = catalogue prédéfini avec aperçu auto (M9A3, Vortex Full, Micro SMG, SNS, SNS Pico, Glock, Glock 17). Bouton "+ Importer" pour upload manuel si pas dans le catalogue.

### Fourrière (nouvel onglet)
Sorties/rangements de véhicules, score = sorties − rangements, actif = semaine active (comme Tracker/Quotas). Import par copier-coller des messages Discord en filet de secours, mais **l'essentiel se fait automatiquement via le bot** (voir plus bas). Ajoutée à `NAV_ITEMS` (app.js) et `PAGES_DISPO` (firebase-config.js).

### Quotas
Catégorie "Labo" explicitement exclue des quotas par produit (fix appliqué dans `quotas.html` ET `admin.html`).

### Tracker
Historique en temps réel, + sélecteur de semaine (consulter n'importe quelle semaine, pas juste l'active).

### Blanchiment
Bug corrigé : les 3 écritures (blanchiments/argent sale/argent propre) utilisent maintenant **un seul ID partagé** (avant : 3 ID différents, rollback "Annuler" pas fiable).

### Transactions
Export CSV disponible (bouton dans Historique).

### Firebase — nœuds clés
`sessions`, `membres`, `grades`, `visibilite_grades`, `actions/{semaineId}/{id}` (argent_sale, argent_propre, gains_totaux, produit_drogue, quantite, resultat), `stock`, `labo_stock`, `labo_stock_commun`, `armurerie/{id}`, `fourriere/{semaineId}/{id}`, `semaines/{id}` (nom, bloquee, createdAt, closedAt, resume, **debut, fin, verrouAt**), `config` (blanchiment_taux, taux_paye_drogue, taux_paye_autres, **discord_webhook_semaine**), `permissions`, `audit`.

---

## 🤖 LE BOT DISCORD (volta-bot)

### Hébergement
- Repo GitHub `Antho6262/volta-bot` — **édition directe sur GitHub.com** (pas de git local pour ce repo)
- Déployé sur **Render.com** (Web Service, plan Free), redéploie automatiquement à chaque push
- URL du service : `https://volta-bot-xclj.onrender.com`
- **UptimeRobot** configuré (ping /5min) pour empêcher la mise en veille du plan gratuit Render
- Nom du bot sur Discord : **Volta Secrétaire**
- Variables d'environnement Render : `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID_GARAGES`, `FIREBASE_SERVICE_ACCOUNT` (JSON complet), `FIREBASE_DB_URL`
- Historique d'hébergement : bot-hosting.net (abandonné, système de pièces contraignant) → ecloudserv.fr (abandonné, pannes de plateforme répétées) → **Render.com (actuel, stable)**

### Fonctionnalités (`index.js`)
1. **Connexion permanente** (discord.js) — point vert visible en continu.
2. **Import automatique Fourrière** : écoute `CHANNEL_ID_GARAGES` en temps réel, parse "X a sorti/rangé un(e) Y ... : PLAQUE" (nettoie les `**` Markdown Discord des noms/plaques capturés — bug corrigé), fait correspondre au membre Firebase, écrit dans `fourriere/{semaineActive}`.
   - ⚠️ Piège corrigé : le filtre anti-bot (`if (message.author.bot) return`) doit être vérifié **après** le traitement du salon garages, car le bot qui poste les mouvements de véhicules est lui-même un compte "bot" Discord — sinon ses messages sont ignorés silencieusement.
3. **Gestion automatique des semaines** (remplace l'ancien système GitHub Actions, abandonné) :
   - Vérifie chaque minute.
   - Dates ancrées Europe/Paris (`getParisParts`, `limitesSemaine`, `prochainesBornes`) — logique reprise de Kronen Krieg mais avec l'authentification Firebase Admin de Volta.
   - Chaque semaine a `debut`, `fin`, `verrouAt` (timestamp exact de clôture).
   - Compare `now >= verrouAt` (pas juste "sommes-nous dimanche 19h") → **rattrapage fiable** même après une panne d'hébergeur prolongée, sans dérive.
   - Transaction atomique Firebase → jamais de doublon même en cas d'exécutions concurrentes.
   - Format de nom : `"Semaine du JJ/MM au JJ/MM"`.
   - Envoie le résumé sur le webhook `config/discord_webhook_semaine` à la clôture.
   - ⚠️ Les semaines créées avant cette mise à jour n'ont pas de `verrouAt` — leur toute première clôture doit se faire manuellement une fois (bouton Admin), ensuite tout s'enchaîne seul.
4. **Résumé de semaine enrichi** (bot ET bouton manuel "Bloquer + Résumé" dans admin.html, les deux alignés) : actions, gains sale/propre, classement par nombre d'actions, **+ détail des ventes de drogue par produit ("Ventes (X au total — Y$)")**, **+ détail "Qui a vendu quoi" par membre**.
5. **Salon absences** (`CHANNEL_ID_ABSENCES = "1521529291257675991"`) : format attendu —
   ```
   Prénom :
   Date de départ :
   Date de retour :
   Raison (facultatif) :
   ```
   Si respecté → embed rouge Volta stylé (logo en vignette), message brut supprimé. Sinon → rappel du format (auto-supprimé après 15s).
   **Un message-modèle est publié et épinglé automatiquement** au démarrage du bot (une seule fois, jamais en double) pour que tout le monde voie le format à suivre sans avoir à se tromper d'abord.
6. **Commandes texte manuelles** (tapées dans un salon, message brut supprimé après traitement) :
   - `!histoire <titre>\n<texte>` → embed stylé rouge Volta + logo (lore du Klan).
   - `!avertissement` / `!warn` → embed rouge alerte ; les lignes de mention (`@role`) sont extraites et envoyées en texte brut séparé (un ping dans un embed ne notifie personne sur Discord).
   - `!radio` → embed "terminal de décryptage" (bloc ```ansi``` rouge, bordures ▓, met en évidence un numéro détecté).
   - `!numero` / `!numéro` → carte de contact stylée (nom + téléphone en bloc code).
7. Petit serveur HTTP (`express`) sur `/` uniquement pour les pings Render/UptimeRobot.

### Fichiers du bot
- `index.js` — tout le code
- `package.json` — dépendances : `discord.js`, `express`, `firebase-admin`, **`@firebase/app`** (à installer explicitement en plus de `firebase-admin`, sinon `Cannot find module '@firebase/app'` au démarrage)

### Config Discord bot (portail développeur)
- **Message Content Intent** activé (obligatoire pour lire le contenu/embeds des messages).
- **"Requires OAuth2 Code Grant"** doit être **désactivé** (sinon erreur "Integration requires code grant" lors de l'invitation sur un nouveau serveur).
- Permissions d'invitation utilisées : Administrateur (permissions=8) pour simplifier, ou a minima View Channels / Send Messages / Read Message History / Embed Links / Manage Messages (pour épingler).

---

## POINTS D'ATTENTION GÉNÉRAUX
1. Toujours trier en JS, jamais via `orderByChild` Firebase.
2. Solde = cumul depuis le début, pas par semaine.
3. Après un push du **site** : Ctrl+F5 une fois, puis plus besoin de rafraîchir (temps réel) sauf sur les onglets Admin non convertis.
4. Après une modif du **bot** : juste éditer `index.js` sur GitHub.com → commit → Render redéploie seul (~30-60s), rien d'autre à faire.
5. Ne jamais coller de token/clé privée en clair dans le chat — si ça arrive, la considérer comme compromise et la régénérer.
6. Toujours vérifier qu'un fichier/ID/texte concerne bien Volta et pas Kronen Krieg avant de le réutiliser.
