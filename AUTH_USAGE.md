# Guide d'Authentification - Backend Notes

## Flux d'Authentification

### 1️⃣ S'inscrire (Créer un compte)
```bash
curl -X POST http://localhost:3000/api/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "mot_de_passe": "SecurePass123!",
    "role": "PARENT"
  }'
```

**Réponse attendue:**
```json
{
  "message": "Utilisateur créé avec succès !",
  "id": 1
}
```

---

### 2️⃣ Se connecter (Obtenir un token)
```bash
curl -X POST http://localhost:3000/api/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "mot_de_passe": "SecurePass123!"
  }'
```

**Réponse attendue:**
```json
{
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilisateur": {
    "id": 1,
    "nom": "Jean Dupont",
    "role": "PARENT"
  }
}
```

✅ **Copier le token pour l'étape suivante**

---

### 3️⃣ Accéder aux Routes Protégées

Utilisez le token reçu en ajoutant l'en-tête `Authorization`:

```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Format obligatoire:
```
Authorization: Bearer <TOKEN>
```

⚠️ **Important:** 
- Toujours utiliser `Bearer ` (avec un espace) avant le token
- Ne pas inclure les crochets `<>`

---

## Rôles Disponibles et Permissions

| Route | Méthode | Rôles Autorisés |
|-------|---------|-----------------|
| `/api/notes` | POST | ADMIN, ENSEIGNANT |
| `/api/notes` | GET | ADMIN, ENSEIGNANT, PARENT |
| `/api/notes/:id` | PUT | ADMIN, ENSEIGNANT |
| `/api/notes/:id` | DELETE | ADMIN, ENSEIGNANT |

---

## Exemples Complets (JavaScript/Node.js)

### Avec Fetch API
```javascript
// 1. S'inscrire
const registerRes = await fetch('http://localhost:3000/api/auth/inscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nom: 'Jean Dupont',
    email: 'jean@example.com',
    mot_de_passe: 'SecurePass123!',
    role: 'PARENT'
  })
});

// 2. Se connecter et récupérer le token
const loginRes = await fetch('http://localhost:3000/api/auth/connexion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'jean@example.com',
    mot_de_passe: 'SecurePass123!'
  })
});

const { token } = await loginRes.json();

// 3. Utiliser le token pour accéder aux routes protégées
const notesRes = await fetch('http://localhost:3000/api/notes', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const notes = await notesRes.json();
console.log(notes);
```

### Avec Axios
```javascript
const axios = require('axios');

// 1. Se connecter
const loginRes = await axios.post('http://localhost:3000/api/auth/connexion', {
  email: 'jean@example.com',
  mot_de_passe: 'SecurePass123!'
});

const token = loginRes.data.token;

// 2. Utiliser le token
const notesRes = await axios.get('http://localhost:3000/api/notes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(notesRes.data);
```

---

## Messages d'Erreur Courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Authorization header manquant` | Pas d'en-tête Authorization | Ajouter l'en-tête `Authorization: Bearer <token>` |
| `Format du token invalide` | Mauvais format de token | Utiliser le format `Bearer <token>` exactement |
| `Token expiré` | Token valide pour 24h | Se reconnecter pour obtenir un nouveau token |
| `Token invalide` | Token corrompu ou faux | Vérifier que vous utilisez le bon token |
| `Non authentifié` | Utilisateur non décodé | Vérifier l'authentification du token |
| `Accès interdit : privilèges insuffisants` | Rôle insuffisant | Utiliser un compte avec un rôle supérieur |

---

## Structure du Token JWT

Les tokens contiennent:
- **id**: Identifiant unique de l'utilisateur
- **role**: Rôle de l'utilisateur (ADMIN, ENSEIGNANT, PARENT)
- **iat**: Timestamp de création
- **exp**: Timestamp d'expiration (24h après création)

---

## Durée de Validité

- **Token**: Valide pendant **24 heures**
- **Après expiration**: Se reconnecter pour obtenir un nouveau token
