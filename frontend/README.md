# 📚 GestionNotes - Application Frontend

Application frontend React complète pour la gestion des notes scolaires avec Material UI.

## 🚀 Démarrage rapide

### Prérequis
- Node.js v14+ et npm
- Backend GestionNotes tournant sur `http://localhost:3000`

### Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start
```

L'application s'ouvrira automatiquement sur `http://localhost:3000` (port par défaut Create React App).

### Build pour la production

```bash
npm run build
```

## 📁 Structure du projet

```
frontend/
├── public/
│   └── index.html              # Fichier HTML principal
├── src/
│   ├── components/
│   │   ├── Layout.js           # Layout principal avec header/footer
│   │   └── PrivateRoute.js     # Composant pour les routes protégées
│   ├── contexts/
│   │   └── AuthContext.js      # Context global pour l'authentification
│   ├── pages/
│   │   ├── LoginPage.js        # Page de login/inscription
│   │   ├── Dashboard.js        # Router central du dashboard
│   │   ├── TeacherDashboard.js # Dashboard enseignant (CRUD notes)
│   │   └── ParentDashboard.js  # Dashboard parent (consultation)
│   ├── services/
│   │   └── api.js              # Configuration Axios + intercepteurs
│   ├── App.js                  # Composant racine avec routing
│   └── index.js                # Point d'entrée React
├── .env                        # Configuration (API URL, etc.)
├── .gitignore                  # Fichiers à ignorer
└── package.json                # Dépendances et scripts
```

## 🔑 Fonctionnalités principales

### 🔐 Authentification
- **Page Login/Register** avec formulaire moderne
- Gestion du token JWT en localStorage
- Context global `AuthContext` pour l'état d'authentification
- Routes protégées avec `PrivateRoute`
- Intercepteurs Axios pour auto-injection du Bearer token

### 👨‍🏫 Dashboard Enseignant
- 📊 Tableau de toutes les notes
- ➕ Ajouter une nouvelle note via Dialog/Modal
- ✏️ Modifier une note existante
- 🗑️ Supprimer une note
- Messages d'erreur/succès
- Gestion du loading

### 👨‍👩‍👧 Dashboard Parent
- 👀 Consultation seule des notes de son enfant
- 📈 Affichage des statistiques (moyenne, nombre de notes, etc.)
- 🎯 Cartes détaillées par matière
- 📋 Tableau récapitulatif
- Code couleur pour les performances (vert: bon, orange: moyen, rouge: faible)

### 🎨 Design
- Material UI v5 pour tous les composants
- Thème personnalisé avec dégradés modernes
- Responsive design (mobile, tablet, desktop)
- Icons Material Icons pour une meilleure UX

## 🔌 Configuration API

La configuration Axios se trouve dans `src/services/api.js`:

```javascript
// URL de base
baseURL: 'http://localhost:3000/api'

// Intercepteurs:
// - Ajout automatique du Bearer token à chaque requête
// - Gestion des erreurs 401 (redirection vers login)
```

Vous pouvez modifier l'URL API en changeant la variable d'environnement `REACT_APP_API_URL` dans le fichier `.env`.

## 📝 Variables d'environnement

Créez un fichier `.env` à la racine du projet:

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

## 🔄 Flux d'authentification

1. **Login/Register**: L'utilisateur remplit le formulaire
2. **Appel API**: `POST /api/auth/connexion` ou `POST /api/auth/inscription`
3. **Stockage Token**: Sauvegardé dans localStorage
4. **Context Update**: `useAuth()` met à jour l'état global
5. **Redirection**: Navigation vers `/dashboard`
6. **Layout**: Affichage du nom d'utilisateur et rôle dans l'header

## 🛡️ Routes protégées

```javascript
// Route non protégée
/login

// Routes protégées (nécessitent authentification)
/dashboard
```

Les routes protégées sont gérées par le composant `PrivateRoute` qui:
- Vérifie si l'utilisateur est authentifié
- Affiche un spinner de chargement pendant la vérification
- Redirige vers `/login` si non authentifié

## 🎯 Appels API utilisés

### Authentification
```
POST /api/auth/connexion
POST /api/auth/inscription
```

### Notes (Dashboard Enseignant)
```
GET /api/notes                    // Récupérer toutes les notes
POST /api/notes                   // Créer une nouvelle note
PUT /api/notes/:id                // Modifier une note
DELETE /api/notes/:id             // Supprimer une note
```

Tous les appels de gestion des notes nécessitent un Bearer token.

## 🚨 Gestion des erreurs

Les erreurs sont affichées via des `Alert` Material UI avec:
- Message d'erreur depuis le backend ou message générique
- Code d'erreur HTTP capturé
- Redirection automatique vers login en cas de token expiré (401)

## 📦 Dépendances principales

- **React 18.2.0** - Framework UI
- **React Router 6.14.0** - Routage
- **Material UI 5.14.0** - Composants UI
- **Axios 1.4.0** - Client HTTP

## 🔧 Commandes disponibles

```bash
npm start       # Lance en mode développement
npm build       # Build pour la production
npm test        # Lance les tests
npm eject       # Expose la configuration (irreversible!)
```

## 💡 Utilisation du Context d'authentification

```javascript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  // user: { nom, email, role, ... }
  // token: JWT token string
  // isAuthenticated: boolean
  // login(userData, token): connecter un utilisateur
  // logout(): déconnecter
}
```

## 📱 Responsive Design

L'application est entièrement responsive:
- **Mobile** (<600px): Adaptations pour petit écran
- **Tablet** (600-1200px): Mise en page intermédiaire
- **Desktop** (>1200px): Affichage complet

## 🎓 Exemple d'utilisation complète

```
1. Ouvrir http://localhost:3000
2. Cliquer sur "Inscription"
3. Remplir le formulaire (email, mot de passe, sélectionner rôle)
4. Valider → Redirection vers dashboard
5. Selon le rôle:
   - Enseignant: CRUD des notes
   - Parent: Consultation des notes
```

## 🐛 Troubleshooting

### "Cannot find module '@mui/material'"
```bash
npm install
```

### "API request failed"
Vérifier que le backend tourne sur `http://localhost:3000`

### "Cannot GET /dashboard after login"
Vérifier que React Router est bien configuré dans `App.js`

## 📚 Documentation Material UI
https://mui.com/material-ui/getting-started/

## 📝 Licence
Propriétaire - GestionNotes 2024
