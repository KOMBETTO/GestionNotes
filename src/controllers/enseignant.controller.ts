import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequeteAuthentifiee } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

// Dashboard Enseignant - Récupère les infos principales
export const getDashboard = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const enseignantId = req.utilisateur?.id;

        if (!enseignantId) {
            return res.status(401).json({ message: "Non authentifié." });
        }

        // Récupérer les infos de l'enseignant
        const enseignant = await prisma.utilisateur.findUnique({
            where: { id: enseignantId },
            select: { id: true, nom: true, email: true, role: true }
        });

        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant introuvable." });
        }

        // Récupérer les classes enseignées
        const classes = await prisma.affectationClasseEnseignant.findMany({
            where: { enseignantId },
            include: { classe: true }
        });

        // Récupérer les matières enseignées
        const matieres = await prisma.affectationClasseEnseignant.findMany({
            where: { enseignantId },
            include: { matiere: true }
        });

        // Récupérer toutes les notes créées par cet enseignant
        const notes = await prisma.note.findMany({
            where: { enseignantId },
            include: {
                eleve: true,
                matiere: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10 // Les 10 dernières notes
        });

        // Statistiques
        const totalNotes = await prisma.note.count({
            where: { enseignantId }
        });

        const moyenneNotes = await prisma.note.aggregate({
            where: { enseignantId },
            _avg: { valeur: true }
        });

        res.json({
            enseignant,
            statistiques: {
                totalNotes,
                moyenneNotes: moyenneNotes._avg.valeur || 0,
                classesUniques: new Set(classes.map(c => c.classe.id)).size,
                matieresUniques: new Set(matieres.map(m => m.matiere.id)).size
            },
            derniereNotes: notes,
            classes: classes.map(c => c.classe),
            matieres: matieres.map(m => m.matiere)
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du chargement du dashboard.", error });
    }
};

// Obtenir toutes les notes d'un enseignant (avec filtres optionnels)
export const getNotesByEnseignant = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const enseignantId = req.utilisateur?.id;
        const { matiereId, classeId } = req.query;

        if (!enseignantId) {
            return res.status(401).json({ message: "Non authentifié." });
        }

        let where: any = { enseignantId };

        if (matiereId) {
            where.matiereId = parseInt(matiereId as string);
        }

        if (classeId) {
            where.eleve = {
                classeId: parseInt(classeId as string)
            };
        }

        const notes = await prisma.note.findMany({
            where,
            include: {
                eleve: true,
                matiere: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notes.", error });
    }
};

// Statistiques par matière
export const getStatistiquesByMatiere = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const enseignantId = req.utilisateur?.id;

        if (!enseignantId) {
            return res.status(401).json({ message: "Non authentifié." });
        }

        const notes = await prisma.note.findMany({
            where: { enseignantId },
            include: { matiere: true }
        });

        const stats = notes.reduce((acc: any, note: any) => {
            const matiereNom = note.matiere.nom;
            if (!acc[matiereNom]) {
                acc[matiereNom] = {
                    nom: matiereNom,
                    total: 0,
                    somme: 0,
                    moyenne: 0
                };
            }
            acc[matiereNom].total++;
            acc[matiereNom].somme += note.valeur;
            acc[matiereNom].moyenne = acc[matiereNom].somme / acc[matiereNom].total;
            return acc;
        }, {});

        res.json(Object.values(stats));
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul des statistiques.", error });
    }
};
