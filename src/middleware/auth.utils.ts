import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cle_securisee_resultats_scolaires_2026';

/* =========================
   TYPE PAYLOAD JWT
========================= */
export interface TokenPayload {
    id: number;
    role: string;
    iat?: number;
    exp?: number;
}

/* =========================
   GÉNÉRER UN JWT
========================= */
export const genererToken = (utilisateurId: number, role: string, expiresIn: string = '24h'): string => {
    return jwt.sign(
        { id: utilisateurId, role },
        JWT_SECRET,
        { expiresIn }
    );
};

/* =========================
   VÉRIFIER UN JWT
========================= */
export const verifierToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expiré');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Token invalide');
        }
        throw new Error('Erreur lors de la vérification du token');
    }
};

/* =========================
   EXTRAIRE LE TOKEN DU HEADER
========================= */
export const extraireTokenDuHeader = (authHeader?: string): string => {
    if (!authHeader) {
        throw new Error('Authorization header manquant');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        throw new Error('Format du token invalide');
    }

    if (parts[0] !== 'Bearer') {
        throw new Error('Type d\'authentification invalide. Utilisez Bearer');
    }

    return parts[1];
};

/* =========================
   VÉRIFIER LE RÔLE
========================= */
export const verifierRole = (roleUtilisateur: string, rolesAutorises: string[]): boolean => {
    return rolesAutorises.includes(roleUtilisateur);
};
