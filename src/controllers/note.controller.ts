import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequeteAuthentifiee } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

// 1. CRÉER une note (Enseignant uniquement)
export const creerNote = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { valeur, appreciation, eleveId, matiereId } = req.body;
        const enseignantId = req.utilisateur?.id;

        if (!enseignantId) {
            return res.status(401).json({ message: "Action non autorisée." });
        }

        const nouvelleNote = await prisma.note.create({
            data: {
                valeur: parseFloat(valeur),
                appreciation,
                eleveId: parseInt(eleveId),
                matiereId: parseInt(matiereId),
                enseignantId: enseignantId
            }
        });

        res.status(201).json({ message: "Note enregistrée avec succès !", data: nouvelleNote });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la note.", error });
    }
};

// 2. LIRE les notes (Filtré selon le rôle connecté : Enseignant tout, Parent uniquement ses enfants)
export const obtenirNotes = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const utilisateurId = req.utilisateur?.id;
        const role = req.utilisateur?.role;

        if (!utilisateurId) return res.status(401).json({ message: "Non authentifié." });

        let notes;

        if (role === 'ADMIN' || role === 'ENSEIGNANT') {
            // Un enseignant voit toutes les notes enregistrées
            notes = await prisma.note.findMany({
                include: { eleve: true, matiere: true }
            });
        } else if (role === 'PARENT') {
            // Un parent voit uniquement les notes des élèves dont il est le parent
            notes = await prisma.note.findMany({
                where: {
                    eleve: {
                        parentId: utilisateurId
                    }
                },
                include: { eleve: true, matiere: true }
            });
        }

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notes.", error });
    }
};

// 3. MODIFIER une note (Enseignant uniquement, propriétaire de la note)
export const modifierNote = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { id } = req.params;
        const { valeur, appreciation } = req.body;
        const enseignantId = req.utilisateur?.id;

        // Vérifier si la note existe et appartient à cet enseignant
        const noteExistante = await prisma.note.findUnique({ where: { id: parseInt(id) } });
        
        if (!noteExistante) return res.status(404).json({ message: "Note introuvable." });
        if (noteExistante.enseignantId !== enseignantId && req.utilisateur?.role !== 'ADMIN') {
            return res.status(403).json({ message: "Vous n'êtes pas l'auteur de cette note." });
        }

        const noteMiseAJour = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                valeur: valeur ? parseFloat(valeur) : noteExistante.valeur,
                appreciation: appreciation || noteExistante.appreciation
            }
        });

        res.json({ message: "Note mise à jour avec succès !", data: noteMiseAJour });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification.", error });
    }
};

// 4. SUPPRIMER une note
export const supprimerNote = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { id } = req.params;
        const enseignantId = req.utilisateur?.id;

        const noteExistante = await prisma.note.findUnique({ where: { id: parseInt(id) } });
        if (!noteExistante) return res.status(404).json({ message: "Note introuvable." });
        
        if (noteExistante.enseignantId !== enseignantId && req.utilisateur?.role !== 'ADMIN') {
            return res.status(403).json({ message: "Action interdite." });
        }

        await prisma.note.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Note supprimée avec succès de la base de données." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression.", error });
    }
};