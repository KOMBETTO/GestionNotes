# 🔧 Documentation Technique - GestionNotes Frontend

## Architecture et Patterns

### Contexte d'Authentification (AuthContext)

**Fichier**: `src/contexts/AuthContext.js`

**Responsabilités**:
- Gérer l'état global du token JWT
- Gérer les données utilisateur (nom, email, rôle)
- Persister l'authentification via localStorage
- Fournir des fonctions login, register, logout

**State**:
```javascript
{
  user: {
    id: string,
    nom: string,
    email: string,
    role: 'parent' | 'enseignant' | 'admin'
  },
  token: string,
  loading: boolean,
  isAuthenticated: boolean
}
```

**Hooks disponibles**:
```javascript
const { user, token, loading, isAuthenticated, login, register, logout } = useAuth();
```

**Flow Cycle de Vie**:
```
1. Composant monte
2. useEffect relit localStorage
3. État local mis à jour
4. Composants consommateurs re-rendus
```

### Service API (api.js)

**Fichier**: `src/services/api.js`

**Instances Axios**:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});
```

**Intercepteurs implémentés**:

1. **Request Interceptor**: 
   - Ajoute le Bearer token automatiquement
   - Extrait le token de localStorage
   - Format: `Authorization: Bearer {token}`

2. **Response Interceptor**:
   - Détecte les erreurs 401
   - Nettoie localStorage
   - Redirige vers login
   - Laisse passer les autres erreurs

**Utilisation**:
```javascript
import api from '../services/api';

// GET
const response = await api.get('/notes');

// POST
const response = await api.post('/notes', { valeur, appreciation, ... });

// PUT
const response = await api.put(`/notes/${id}`, { valeur, ... });

// DELETE
await api.delete(`/notes/${id}`);
```

### Composant PrivateRoute

**Fichier**: `src/components/PrivateRoute.js`

**Logique**:
```
1. Vérifie isAuthenticated
2. Si loading: affiche spinner
3. Si non authentifié: redirige vers /login
4. Si requiredRole + role mismatch: redirige vers /dashboard
5. Sinon: render children
```

**Utilisation**:
```javascript
<PrivateRoute requiredRole="enseignant">
  <TeacherDashboard />
</PrivateRoute>
```

### Composant Layout

**Fichier**: `src/components/Layout.js`

**Composants enfants**:
- AppBar (header avec gradient)
- Container (contenu principal)
- Footer (copyright)

**Données affichées**:
- Nom utilisateur (user.nom || user.email)
- Badge rôle (user.role en minuscule)
- Bouton déconnexion avec icône

### Flux de Routage (App.js)

```
App
├── Router (BrowserRouter)
│   ├── AuthProvider
│   │   ├── AppRoutes
│   │   │   ├── /login → LoginPage (public)
│   │   │   ├── /dashboard → PrivateRoute → Layout → Dashboard
│   │   │   ├── / → Navigate to /dashboard
│   │   │   └── * → Navigate to /dashboard
```

---

## Gestion d'État

### AuthContext vs localStorage

**localStorage**:
- ✅ Persiste au refresh
- ❌ Non accessible côté serveur
- Utilisé pour: Token, user data

**AuthContext**:
- ✅ Accessible dans tous les composants
- ✅ Force re-render automatique
- Utilisé pour: User object, logique auth

### Pattern d'Initialisation

```javascript
// Au montage du provider:
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
  setLoading(false);
}, []);
```

---

## Gestion des Erreurs

### Niveaux d'erreur

**1. Erreur API**:
```javascript
try {
  const response = await api.post('/notes', data);
} catch (err) {
  const message = err.response?.data?.message || 'Erreur générique';
  setError(message);
}
```

**2. Erreur 401 (Non autorisé)**:
- Intercepteur Axios nettoie localStorage
- Redirige automatiquement vers /login

**3. Erreur réseau**:
```javascript
catch (err) {
  if (err.message === 'Network Error') {
    setError('Impossible de contacter le serveur');
  }
}
```

### Affichage des erreurs

```javascript
{error && <Alert severity="error">{error}</Alert>}
```

### Messages de succès

```javascript
{success && <Alert severity="success">{success}</Alert>}
```

---

## Composants Réutilisables

### TeacherDashboard

**État local**:
```javascript
const [notes, setNotes] = useState([]);
const [formData, setFormData] = useState({ valeur, appreciation, ... });
const [editingNoteId, setEditingNoteId] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**Fonctions clés**:
- `fetchNotes()`: GET /api/notes
- `handleOpenDialog()`: Ouvrir dialog (add ou edit)
- `handleSubmit()`: POST ou PUT selon editingNoteId
- `handleDeleteNote()`: DELETE avec confirmation

**Structure Dialog**:
- DialogTitle
- DialogContent (inputs)
- DialogActions (boutons)

### ParentDashboard

**Readonly**: Pas de formulaires

**Affichages**:
1. Cartes statistiques (moyenne, nombre, dernière)
2. Tableau récapitulatif
3. Cartes détaillées par matière

**Fonctions**:
- `calculateAverage()`: Moyenne des notes
- `getNoteColor()`: Code couleur selon valeur
- `getAverageColor()`: Code couleur de fond

---

## Styles Material UI

### Thème personnalisé (App.js)

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
    background: { default: '#f5f7fa' }
  },
  typography: {
    fontFamily: '...',
    h4: { fontWeight: 600 }
  },
  components: {
    MuiButton: { ... },
    MuiCard: { ... }
  }
});
```

### Props sx (inline styles)

```javascript
<Box sx={{
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  py: 4,
  backgroundColor: '#f5f5f5'
}}>
```

### Breakpoints responsifs

```javascript
sx={{
  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
  px: { xs: 1, sm: 2, md: 4 }
}}
```

---

## Performance et Optimisations

### Lazy Loading (à implémenter)

```javascript
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage'));

<Suspense fallback={<Loading />}>
  <LoginPage />
</Suspense>
```

### Memoization (à implémenter)

```javascript
const TeacherDashboard = React.memo(({ notes }) => {
  // Composant ne re-render que si notes change
});
```

### useCallback (à implémenter)

```javascript
const fetchNotes = useCallback(async () => {
  // Fonction mémorisée pour éviter re-créations
}, []);
```

---

## Sécurité

### Token JWT

- ✅ Stocké en localStorage (simple)
- ⚠️ Vulnérable à XSS si le site contient du script injecté
- ✅ Automatiquement envoyé dans Authorization header
- ✅ Automatiquement supprimé si 401

### CORS

Le frontend appelle le backend via Axios. Le backend doit autoriser:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Variables sensibles

❌ Ne JAMAIS mettre de secrets dans le code
✅ Utiliser des variables d'environnement (.env)
✅ Ne committer que .env.example

---

## Tests (À implémenter)

### Exemple test d'authentification

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './pages/LoginPage';

test('should login successfully', async () => {
  render(<LoginPage />);
  
  const emailInput = screen.getByLabelText('Email');
  await userEvent.type(emailInput, 'test@example.com');
  
  const submitButton = screen.getByText('Se connecter');
  await userEvent.click(submitButton);
  
  await waitFor(() => {
    expect(window.location.pathname).toBe('/dashboard');
  });
});
```

---

## Debugging

### Console logs structurés

```javascript
console.log('🔵 AuthContext: User loaded', user);
console.error('❌ API Error:', err.response?.data);
console.warn('⚠️ Token expiring soon');
```

### DevTools

- **React DevTools**: Inspecter les props et state
- **Redux DevTools**: (si Redux est ajouté)
- **Network Tab**: Voir les requêtes HTTP
- **Application Tab**: Vérifier localStorage

### Debugging contexte

```javascript
const { user } = useAuth();
console.log('Current user:', user);
console.log('Is authenticated:', !!user?.id);
```

---

## Évolutions futures

### Phase 2: Améliorations
- [ ] Pagination des notes
- [ ] Filtrage par matière/élève
- [ ] Export PDF des notes
- [ ] Notifications temps réel (WebSocket)

### Phase 3: Nouvelles features
- [ ] Gestion des élèves
- [ ] Gestion des matières
- [ ] Historique des modifications
- [ ] Analytics/statistiques

### Améliorations technique
- [ ] Migration vers TypeScript
- [ ] Ajout de tests (Jest, React Testing Library)
- [ ] State management avancé (Redux/Zustand)
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Dark mode

---

## Commandes utiles

```bash
# Lancer en mode développement
npm start

# Build pour production
npm run build

# Lancer les tests
npm test

# Analyser les dépendances
npm list

# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit

# Nettoyer le cache
npm cache clean --force
```

---

## Références

- [React Hooks](https://react.dev/reference/react/hooks)
- [React Router](https://reactrouter.com)
- [Material UI Components](https://mui.com/material-ui/react-dialog/)
- [Axios Request/Response Interceptors](https://axios-http.com/docs/interceptors)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Dernière mise à jour**: Juin 2024
