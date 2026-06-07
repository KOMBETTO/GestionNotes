# 🚀 DÉMARRAGE RAPIDE - GestionNotes Frontend

## 30 secondes pour lancer l'app

```bash
# 1. Aller au dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm start
```

✨ L'app s'ouvre sur `http://localhost:3000`

---

## ✅ Checklist avant le démarrage

- [ ] Backend Node.js tourne sur `http://localhost:3000`
- [ ] Fichier `.env` avec `REACT_APP_API_URL=http://localhost:3000/api`
- [ ] `npm install` complété (node_modules créé)

---

## 🎯 Premiers tests

### 1. Inscription
1. Cliquer sur l'onglet "Inscription"
2. Créer un compte:
   - Nom: "Jean Dupont"
   - Email: "jean@example.com"
   - Mot de passe: "password123"
   - Rôle: "enseignant"
3. Cliquer "S'inscrire"
4. ✅ Dashboard enseignant apparaît

### 2. Ajouter une note (si Enseignant)
1. Cliquer "➕ Ajouter une note"
2. Remplir:
   - ID Élève: 1
   - ID Matière: 1
   - Note: 16
   - Appréciation: "Très bon travail!"
3. Cliquer "Ajouter"
4. ✅ Note apparaît dans le tableau

### 3. Consulter notes (si Parent)
1. Se reconnecter avec rôle "parent"
2. ✅ Voir les notes en cartes colorées
3. ✅ Voir la moyenne générale

---

## 📁 Architecture en 30 secondes

```
src/
├── App.js                    ← Routing + ThemeProvider
├── contexts/AuthContext.js   ← État global auth
├── components/
│   ├── Layout.js             ← Header + Footer
│   └── PrivateRoute.js       ← Protection routes
├── pages/
│   ├── LoginPage.js          ← Connexion/Inscription
│   ├── Dashboard.js          ← Router par rôle
│   ├── TeacherDashboard.js   ← CRUD notes
│   └── ParentDashboard.js    ← Consultation
└── services/api.js           ← Axios config
```

---

## 🔧 Configuration

Éditer `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

---

## 📦 Dépendances principales

```json
{
  "react": "18.2.0",
  "react-router-dom": "6.14.0",
  "@mui/material": "5.14.0",
  "@mui/icons-material": "5.14.0",
  "axios": "1.4.0"
}
```

---

## 🎨 Login en 2 tabs

**Tab 1: Connexion**
```
Email: _______________
Mot de passe: _______________
[Se connecter]
```

**Tab 2: Inscription**
```
Nom: _______________
Email: _______________
Mot de passe: _______________
Rôle: [Parent ▼]
[S'inscrire]
```

---

## 📊 Dashboard Enseignant

**Tableau des notes:**
| Élève | Matière | Note | Appréciation | Actions |
|-------|---------|------|--------------|---------|
| Elève1| Math | 16/20 | Bon travail | ✏️ 🗑️ |

**Bouton**: ➕ Ajouter une note

---

## 👨‍👩‍👧 Dashboard Parent

**Cartes statistiques (top):**
- 📋 Nombre de notes: 5
- 📈 Moyenne: 14.5/20
- ⭐ Dernière: 16/20

**Tableau notes:**
| Matière | Note | Appréciation |
|---------|------|--------------|
| Math | 16/20 | Très bon |

**Cartes détaillées:**
[Math - 16/20] [Français - 14/20] [Histoire - 13/20]

---

## ⚡ Commandes npm

```bash
npm start       # Dev server sur :3000
npm run build   # Build production (dossier build/)
npm test        # Lancer les tests
npm run eject   # Expose configuration
```

---

## 🐛 Problèmes courants

**"Cannot GET /dashboard"**
→ Vérifier que React Router est bien configuré

**"Cannot connect to API"**
→ Vérifier que backend tourne sur `http://localhost:3000`

**"Token not working"**
→ Vérifier localStorage dans DevTools (F12)

---

## 📚 Fichiers importants à connaître

| Fichier | Responsabilité |
|---------|-----------------|
| `App.js` | Routing + Theme |
| `AuthContext.js` | État auth global |
| `api.js` | Config Axios |
| `Layout.js` | Header/Footer |
| `LoginPage.js` | Connexion |
| `TeacherDashboard.js` | CRUD notes |
| `ParentDashboard.js` | Consultation |

---

## 🔑 Clés à retenir

✅ **Token**: Auto-injecté dans Authorization header
✅ **Erreur 401**: Redirection auto vers login
✅ **Rôles**: parent | enseignant | admin
✅ **localStorage**: Persiste token + user
✅ **Context**: useAuth() = accès global
✅ **Routes**: PrivateRoute = protection

---

## 🚀 Déploiement rapide

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

---

## 💡 Tips Pro

- DevTools (F12) → Application → localStorage pour voir le token
- Network tab pour déboguer les requêtes API
- Console pour voir les logs d'erreur
- React DevTools extension pour inspecter les props

---

**Version**: 1.0.0
**Dernière mise à jour**: Juin 2024

Bon codage! 🎉
