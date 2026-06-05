import express, { Request, Response } from 'express';
import cors from 'cors';

// Controllers
import { inscription, connexion } from './controllers/auth.controller.js';
import {
    creerNote,
    obtenirNotes,
    modifierNote,
    supprimerNote
} from './controllers/note.controller.js';
import {
    getDashboard,
    getNotesByEnseignant,
    getStatistiquesByMatiere
} from './controllers/enseignant.controller.js';
import {
    creerClasse,
    obtenirClasses,
    creerMatiere,
    obtenirMatieres,
    creerEleve,
    obtenirEleves,
    obtenirEleveParId
} from './controllers/setup.controller.js';

// Middleware de sécurité
import {
    authentifierToken,
    autoriserRoles
} from './middleware/auth.middleware.js';

const app = express();

/* =========================
   MIDDLEWARE GLOBAL
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ROUTES PUBLIQUES (AUTH)
========================= */
app.post('/api/auth/inscription', inscription);
app.post('/api/auth/connexion', connexion);

/* =========================
   ROUTES PROTÉGÉES - NOTES
========================= */

// ➤ Créer une note (ADMIN, ENSEIGNANT)
app.post(
    '/api/notes',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    creerNote
);

// ➤ Obtenir toutes les notes (ADMIN, ENSEIGNANT, PARENT)
app.get(
    '/api/notes',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT', 'PARENT'),
    obtenirNotes
);

// ➤ Modifier une note (ADMIN, ENSEIGNANT)
app.put(
    '/api/notes/:id',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    modifierNote
);

// ➤ Supprimer une note (ADMIN, ENSEIGNANT)
app.delete(
    '/api/notes/:id',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    supprimerNote
);

/* =========================
    ROUTES DASHBOARD ENSEIGNANT
========================= */

// ➤ Dashboard principal (GET ou POST)
app.get(
    '/api/enseignant/dashboard',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    getDashboard
);

app.post(
    '/api/enseignant/dashboard',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    getDashboard
);

// ➤ Notes filtrées par enseignant
app.get(
    '/api/enseignant/notes',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    getNotesByEnseignant
);

// ➤ Statistiques par matière
app.get(
    '/api/enseignant/statistiques',
    authentifierToken,
    autoriserRoles('ADMIN', 'ENSEIGNANT'),
    getStatistiquesByMatiere
);

/* =========================
    ROUTES SETUP - CLASSES, MATIÈRES, ÉLÈVES
========================= */

// ➤ Classes
app.post('/api/classes', authentifierToken, autoriserRoles('ADMIN'), creerClasse);
app.get('/api/classes', authentifierToken, obtenirClasses);

// ➤ Matières
app.post('/api/matieres', authentifierToken, autoriserRoles('ADMIN'), creerMatiere);
app.get('/api/matieres', authentifierToken, obtenirMatieres);

// ➤ Élèves
app.post('/api/eleves', authentifierToken, autoriserRoles('ADMIN', 'PARENT'), creerEleve);
app.get('/api/eleves', authentifierToken, obtenirEleves);
app.get('/api/eleves/:id', authentifierToken, obtenirEleveParId);

/* =========================
   ROUTE TEST (OPTIONNEL)
========================= */
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: 'Serveur NextGen fonctionne correctement 🚀'
    });
});

/* =========================
   LANCEMENT DU SERVEUR
========================= */
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur NextGen démarré sur : http://localhost:${PORT}`);
});