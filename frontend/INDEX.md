# 📑 Index - GestionNotes Frontend

Bienvenue dans l'application React GestionNotes! Ce fichier vous guide vers tous les fichiers importants.

## 🚀 Commencer ici

- **[QUICKSTART.md](./QUICKSTART.md)** ⭐ **LIRE D'ABORD** - Lancer l'app en 30 secondes

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Installation, structure, features |
| [GUIDE.md](./GUIDE.md) | Guide d'utilisation complet |
| [TECHNICAL.md](./TECHNICAL.md) | Architecture technique détaillée |

## 📂 Fichiers source principaux

### Racine
```
frontend/
├── package.json                  Dépendances npm
├── .env                          Configuration API
├── .env.example                  Template config
└── public/
    └── index.html                Fichier HTML
```

### Contexte & État global
- **[src/contexts/AuthContext.js](./src/contexts/AuthContext.js)**
  - Gestion JWT token
  - État utilisateur global
  - Hook useAuth()

### Services
- **[src/services/api.js](./src/services/api.js)**
  - Configuration Axios
  - Intercepteurs Bearer token
  - Gestion erreur 401

### Composants réutilisables
- **[src/components/Layout.js](./src/components/Layout.js)**
  - Header avec navigation
  - Footer copyright
  - Layout wrapper
  
- **[src/components/PrivateRoute.js](./src/components/PrivateRoute.js)**
  - Protection des routes
  - Vérification authentification

### Pages/Vues
- **[src/pages/LoginPage.js](./src/pages/LoginPage.js)**
  - Connexion
  - Inscription
  - Validation formulaires

- **[src/pages/Dashboard.js](./src/pages/Dashboard.js)**
  - Router central
  - Redirection par rôle

- **[src/pages/TeacherDashboard.js](./src/pages/TeacherDashboard.js)**
  - Tableau notes
  - Créer note (Dialog)
  - Modifier note
  - Supprimer note

- **[src/pages/ParentDashboard.js](./src/pages/ParentDashboard.js)**
  - Statistiques
  - Tableau notes (lecture seule)
  - Cartes par matière
  - Code couleur

### Fichiers racine
- **[src/App.js](./src/App.js)**
  - Routing principal
  - ThemeProvider
  - Routes protégées

- **[src/index.js](./src/index.js)**
  - Point d'entrée React
  - Import CSS global

- **[src/index.css](./src/index.css)**
  - Styles globaux
  - Animations

## 🎯 Workflows rapides

### Ajouter une nouvelle page
1. Créer `src/pages/NewPage.js`
2. Importer dans `App.js`
3. Ajouter route dans `<Routes>`
4. Protéger si nécessaire avec `<PrivateRoute>`

### Appeler l'API
```javascript
import api from '../services/api';

// Token auto-injecté
const response = await api.get('/notes');
```

### Accéder à l'utilisateur connecté
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, token } = useAuth();
  // user = { nom, email, role, ... }
}
```

## 📊 Endpoints API

### Authentification
- `POST /api/auth/connexion` → Login
- `POST /api/auth/inscription` → Register

### Notes (Bearer token requis)
- `GET /api/notes` → Récupérer toutes
- `POST /api/notes` → Créer
- `PUT /api/notes/:id` → Modifier
- `DELETE /api/notes/:id` → Supprimer

## 🎨 Material UI

Les composants utilisés:
- **Button** - Boutons principaux
- **Dialog** - Modales (ajouter/modifier)
- **Table** - Affichage notes (enseignant)
- **Card** - Cartes statistiques & notes (parent)
- **TextField** - Formulaires
- **AppBar** - Header navigation
- **Alert** - Messages d'erreur/succès
- **CircularProgress** - Spinner loading

## 🔑 Concepts clés

### AuthContext
Gère l'état global:
- `user` - Données utilisateur connecté
- `token` - JWT token
- `isAuthenticated` - Boolean
- `login()` - Connexion
- `logout()` - Déconnexion

### API Interceptors
Chaque requête Axios:
1. ✅ Auto-ajoute `Authorization: Bearer {token}`
2. ❌ Erreur 401 = suppression token + redirection login

### PrivateRoute
Protège les routes:
- Vérifie `isAuthenticated`
- Redirection 401 vers login
- Optional: vérification rôle requis

## 📱 Responsive Design

Breakpoints Material UI:
- **xs** (0-600px) - Mobile
- **sm** (600-960px) - Tablet
- **md** (960-1280px) - Small desktop
- **lg** (1280+px) - Desktop

## 🧪 Tester l'app

```bash
# Installation
npm install

# Dev
npm start

# Build
npm run build

# Tests (si implémentés)
npm test
```

## 🔐 Sécurité à retenir

✅ Token JWT en localStorage
✅ Bearer token auto-injecté
✅ Erreur 401 = redirection auto login
✅ Variables sensibles dans .env
✅ Routes privées = PrivateRoute

## 📈 Améliorations futures

- [ ] Tests (Jest + React Testing Library)
- [ ] TypeScript
- [ ] Pagination
- [ ] Filtres avancés
- [ ] Export PDF
- [ ] Notifications temps réel
- [ ] Dark mode
- [ ] i18n (Internationalisation)

## ❓ FAQ

**Q: Où configurer l'URL API?**
A: Dans le fichier `.env` → `REACT_APP_API_URL`

**Q: Comment accéder au token?**
A: Via `useAuth()` → `const { token } = useAuth()`

**Q: Comment ajouter une page protégée?**
A: Wrapper avec `<PrivateRoute><MaPage /></PrivateRoute>`

**Q: Comment déboguer les requêtes?**
A: F12 → Network tab → voir requêtes HTTP

**Q: Où sont stockées les données?**
A: localStorage (token, user) + State local (notes, etc.)

## 🚀 Déploiement

```bash
# Build
npm run build

# Vercel
vercel deploy

# Netlify
netlify deploy --prod --dir=build

# Local
npx serve -s build
```

## 📞 Support

Lire la documentation:
1. [QUICKSTART.md](./QUICKSTART.md) - Démarrage
2. [GUIDE.md](./GUIDE.md) - Utilisation
3. [TECHNICAL.md](./TECHNICAL.md) - Technique

---

**Version**: 1.0.0
**Dernière mise à jour**: Juin 2024

Happy coding! 🚀
