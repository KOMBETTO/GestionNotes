import { Request, Response, NextFunction } from 'express';
import { extraireTokenDuHeader, verifierToken } from './auth.utils.js';

/* =========================
   TYPE REQUEST AUTHENTIFIÉE
========================= */
export interface RequeteAuthentifiee extends Request {
    utilisateur?: {
        id: number;
        role: string;
    };
}

/* =========================
   1. MIDDLEWARE JWT
========================= */
export const authentifierToken = (
    req: RequeteAuthentifiee,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = extraireTokenDuHeader(req.headers.authorization);
        const decoded = verifierToken(token);

        req.utilisateur = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur d\'authentification';
        const statusCode = message.includes('manquant') || message.includes('invalide') ? 401 : 403;

        return res.status(statusCode).json({
            message: `Accès refusé. ${message}`
        });
    }
};

/* =========================
   2. MIDDLEWARE RBAC
========================= */
export const autoriserRoles = (...rolesAutorises: string[]) => {
    return (req: RequeteAuthentifiee, res: Response, next: NextFunction) => {

        if (!req.utilisateur) {
            return res.status(401).json({
                message: "Non authentifié."
            });
        }

        if (!rolesAutorises.includes(req.utilisateur.role)) {
            return res.status(403).json({
                message: "Accès interdit : privilèges insuffisants."
            });
        }

        next();
    };
};