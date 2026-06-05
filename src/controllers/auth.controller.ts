import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { genererToken } from '../middleware/auth.utils.js';

const prisma = new PrismaClient();

export const inscription = async (req: Request, res: Response) => {
    try {
        const { nom, email, mot_de_passe, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existe = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (existe) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hachage du mot de passe
        const passwordHache = await bcrypt.hash(mot_de_passe, 10);

        // Créer l'utilisateur dans la base de données
        const nouvelUtilisateur = await prisma.utilisateur.create({
            data: {
                nom,
                email,
                mot_de_passe: passwordHache,
                role: role || 'PARENT'
            },
            select: { id: true, nom: true, email: true, role: true }
        });

        res.status(201).json({ 
            message: "Utilisateur créé avec succès !",
            utilisateur: nouvelUtilisateur
        });
    } catch (error) {
        console.error("Erreur inscription:", error);
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};

export const connexion = async (req: Request, res: Response) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Récupérer l'utilisateur depuis la base de données
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!utilisateur) {
            return res.status(400).json({ message: "Identifiants incorrects." });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(400).json({ message: "Identifiants incorrects." });
        }

        // Générer le token
        const token = genererToken(utilisateur.id, utilisateur.role, '24h');

        res.json({
            message: "Connexion réussie !",
            token,
            utilisateur: { 
                id: utilisateur.id, 
                nom: utilisateur.nom, 
                email: utilisateur.email,
                role: utilisateur.role 
            }
        });
    } catch (error) {
        console.error("Erreur connexion:", error);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};