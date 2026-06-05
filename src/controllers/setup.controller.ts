import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequeteAuthentifiee } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

/* =========================
   CLASSES
========================= */
export const creerClasse = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "Le nom de la classe est requis." });
        }

        const classe = await prisma.classe.create({
            data: { nom }
        });

        res.status(201).json({ message: "Classe créée avec succès !", data: classe });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la classe.", error });
    }
};

export const obtenirClasses = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const classes = await prisma.classe.findMany({
            include: { eleves: true }
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des classes.", error });
    }
};

/* =========================
   MATIÈRES
========================= */
export const creerMatiere = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "Le nom de la matière est requis." });
        }

        const matiere = await prisma.matiere.create({
            data: { nom }
        });

        res.status(201).json({ message: "Matière créée avec succès !", data: matiere });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la matière.", error });
    }
};

export const obtenirMatieres = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const matieres = await prisma.matiere.findMany({
            include: { notes: true }
        });
        res.json(matieres);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des matières.", error });
    }
};

/* =========================
   ÉLÈVES
========================= */
export const creerEleve = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { nom, dateNaissance, classeId, parentId } = req.body;

        if (!nom || !dateNaissance || !classeId || !parentId) {
            return res.status(400).json({ 
                message: "Les champs nom, dateNaissance, classeId et parentId sont requis." 
            });
        }

        const eleve = await prisma.eleve.create({
            data: {
                nom,
                dateNaissance: new Date(dateNaissance),
                classeId: parseInt(classeId),
                parentId: parseInt(parentId)
            },
            include: { classe: true, parent: true }
        });

        res.status(201).json({ message: "Élève créé avec succès !", data: eleve });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'élève.", error });
    }
};

export const obtenirEleves = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const eleves = await prisma.eleve.findMany({
            include: { classe: true, parent: true, notes: true }
        });
        res.json(eleves);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des élèves.", error });
    }
};

export const obtenirEleveParId = async (req: RequeteAuthentifiee, res: Response) => {
    try {
        const { id } = req.params;
        const eleve = await prisma.eleve.findUnique({
            where: { id: parseInt(id) },
            include: { classe: true, parent: true, notes: { include: { matiere: true } } }
        });

        if (!eleve) {
            return res.status(404).json({ message: "Élève introuvable." });
        }

        res.json(eleve);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'élève.", error });
    }
};
