# 📘 Guide d'Utilisation - GestionNotes Frontend

## Table des matières
1. [Installation et configuration](#installation)
2. [Authentification](#authentification)
3. [Dashboard Enseignant](#dashboard-enseignant)
4. [Dashboard Parent](#dashboard-parent)
5. [Intégration avec l'API](#intégration-api)
6. [Déploiement](#déploiement)

---

## Installation et Configuration

### Étape 1: Cloner et installer

```bash
cd frontend
npm install
```

### Étape 2: Configuration de l'API

Éditer `.env` pour pointer vers votre backend:

```
REACT_APP_API_URL=http://localhost:3000/api
```

### Étape 3: Démarrer l'application

```bash
npm start
```

L'application ouvrira sur `http://localhost:3000`

---

## Authentification

### Connexion

1. Cliquer sur l'onglet **"Connexion"**
2. Entrer email et mot de passe
3. Cliquer sur "Se connecter"

**Résultat**: Redirection vers le dashboard approprié selon le rôle

### Inscription

1. Cliquer sur l'onglet **"Inscription"**
2. Remplir les champs:
   - Nom complet
   - Email
   - Mot de passe
   - Sélectionner le rôle (Parent, Enseignant, Administrateur)
3. Cliquer sur "S'inscrire"

**Résultat**: Création du compte et connexion automatique

### Déconnexion

Cliquer sur le bouton **"Déconnexion"** en haut à droite du header.

**Résultat**: Suppression du token, redirection vers login

---

## Dashboard Enseignant

### Accès

Les utilisateurs avec rôle **"enseignant"** ou **"admin"** voient ce dashboard.

### Affichage des notes

Un tableau complet affiche:
- **Élève**: Nom de l'élève
- **Matière**: Matière de la note
- **Note**: Valeur sur 20 (en vert)
- **Appréciation**: Commentaire de l'enseignant
- **Actions**: Boutons Modifier et Supprimer

### Ajouter une note

1. Cliquer sur le bouton **"➕ Ajouter une note"**
2. Remplir la dialog:
   - **ID Élève**: Identifiant numérique de l'élève
   - **ID Matière**: Identifiant numérique de la matière
   - **Note**: Valeur entre 0 et 20
   - **Appréciation**: Texte libre
3. Cliquer sur **"Ajouter"**

**Validation**: Tous les champs sont obligatoires

**Résultat**: Note créée, tableau mis à jour, message de succès

### Modifier une note

1. Cliquer sur le bouton **✏️ Modifier** sur la ligne de la note
2. Modifier les champs dans la dialog
3. Cliquer sur **"Modifier"**

**Résultat**: Note mise à jour, tableau rafraîchi

### Supprimer une note

1. Cliquer sur le bouton **🗑️ Supprimer** sur la ligne
2. Confirmer la suppression dans le popup
3. La note est supprimée

**Résultat**: Note supprimée, tableau mis à jour

### Gestion des erreurs

- **"Tous les champs sont obligatoires"**: Remplir tous les champs avant de soumettre
- **"Erreur lors du chargement"**: Vérifier la connexion au backend
- **"Erreur 401"**: Token expiré, veuillez vous reconnecter

---

## Dashboard Parent

### Accès

Les utilisateurs avec rôle **"parent"** voient ce dashboard.

### Informations affichées

#### Cartes statistiques (en haut):
- **Nombre de notes**: Total des notes de l'enfant
- **Moyenne générale**: Moyenne sur 20
- **Dernière note**: Dernière note reçue

#### Tableau historique:
Affiche toutes les notes avec:
- Matière
- Note /20
- Appréciation complète

#### Cartes détaillées par matière:
Affichage en cards avec:
- Nom de la matière
- Note (code couleur)
- Appréciation

### Code couleurs

- 🟢 **Vert** (16-20): Excellent
- 🟠 **Orange** (12-16): Correct
- 🔴 **Rouge** (0-12): À améliorer

### Fonctionnalités

- ✅ Consultation seule (pas de modification possible)
- ✅ Affichage des statistiques
- ✅ Historique complet
- ✅ Multiples vues (tableau + cards)

---

## Intégration API

### Endpoints utilisés

#### Authentification
```
POST /api/auth/connexion
Body: { email, mot_de_passe }
Response: { token, user: { id, nom, email, role } }

POST /api/auth/inscription
Body: { nom, email, mot_de_passe, role }
Response: { token, user: { id, nom, email, role } }
```

#### Gestion des notes
```
GET /api/notes
Headers: { Authorization: Bearer TOKEN }
Response: [{ id, valeur, appreciation, eleveId, eleveNom, matiereId, matiereNom }, ...]

POST /api/notes
Headers: { Authorization: Bearer TOKEN }
Body: { valeur, appreciation, eleveId, matiereId }
Response: { id, valeur, appreciation, eleveId, matiereId }

PUT /api/notes/:id
Headers: { Authorization: Bearer TOKEN }
Body: { valeur, appreciation, eleveId, matiereId }
Response: { id, valeur, appreciation, eleveId, matiereId }

DELETE /api/notes/:id
Headers: { Authorization: Bearer TOKEN }
Response: { message: "Note supprimée" }
```

### Gestion du token

Le token JWT est:
1. **Stocké** dans `localStorage` après connexion
2. **Auto-injecté** dans tous les appels API (header Authorization)
3. **Supprimé** lors de la déconnexion
4. **Automatiquement supprimé** si la réponse est 401 (non autorisé)

### Intercepteurs Axios

Fichier: `src/services/api.js`

```javascript
// Intercepteur Request: Ajoute le Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur Response: Gère les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Structure des fichiers

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js              # Header + Footer
│   │   └── PrivateRoute.js        # Protection des routes
│   ├── contexts/
│   │   └── AuthContext.js         # État global auth
│   ├── pages/
│   │   ├── LoginPage.js           # Connexion/Inscription
│   │   ├── Dashboard.js           # Router central
│   │   ├── TeacherDashboard.js    # CRUD notes
│   │   └── ParentDashboard.js     # Consultation notes
│   ├── services/
│   │   └── api.js                 # Configuration Axios
│   ├── App.js                     # App racine
│   ├── index.js                   # Point d'entrée
│   ├── index.css                  # Styles globaux
│   └── utils/                     # (futures utilités)
├── .env                           # Config
├── .gitignore
├── package.json
└── README.md
```

---

## Déploiement

### Build production

```bash
npm run build
```

Crée un dossier `build/` optimisé et prêt pour la production.

### Déployer sur Vercel

```bash
npm i -g vercel
vercel
```

### Déployer sur Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=build
```

### Déployer localement (avec un serveur)

```bash
# Avec serve (simple serveur HTTP)
npm i -g serve
serve -s build

# Avec nginx
cp -r build/* /var/www/html/
```

### Variables d'environnement en production

Créer les variables d'environnement dans votre plateforme de déploiement:

**Vercel**: Project Settings → Environment Variables
**Netlify**: Site settings → Environment
**Docker**: Passer via `docker build --build-arg REACT_APP_API_URL=...`

---

## Troubleshooting

### "Cannot connect to API"
- Vérifier que le backend tourne sur `http://localhost:3000`
- Vérifier l'URL dans `.env`
- Vérifier la CORS dans le backend

### "Token not persisting"
- Vérifier que localStorage est activé
- Vérifier qu'aucune extension ne le bloque

### "Page blanche après login"
- Ouvrir la console (F12) pour voir les erreurs
- Vérifier que React Router est bien configuré

### "Requête 401 non autorisée"
- Vérifier que le token est correct
- Vérifier que le backend valide le token correctement
- Se déconnecter et reconnecter

---

## Architecture Recommandée

Pour aller plus loin:

1. **Tests unitaires**: Ajouter Jest + React Testing Library
2. **État global avancé**: Redux ou Zustand
3. **TypeScript**: Migrer le projet en TypeScript
4. **Forms avancées**: React Hook Form + Zod
5. **Analytics**: Google Analytics ou Plausible
6. **Notifications**: Toast/Snackbar centralisée

---

## Support

Pour toute question ou bug, consulter:
- 📚 [React Docs](https://react.dev)
- 🎨 [Material UI Docs](https://mui.com)
- 📦 [Axios Docs](https://axios-http.com)
- 🛣️ [React Router Docs](https://reactrouter.com)

---

**Dernière mise à jour**: Juin 2024
