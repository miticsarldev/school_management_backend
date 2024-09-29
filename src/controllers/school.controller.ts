import { Request, Response } from 'express';
import School from '../models/school.model';

// Créer une nouvelle école
export const createSchool = async (req: Request, res: Response) => {
    try {
        const { name, adresse, phone, email, site, logo, statut, user_id } = req.body;

        const newSchool = new School({
            name,
            adresse,
            phone,
            email,
            site,
            logo,
            statut,
            user_id,
        });

        const savedSchool = await newSchool.save();
        res.status(201).json(savedSchool);
    } catch (error) {
        res.status(500).json({ message: "Error creating school", error });
    }
};

// Obtenir la liste de toutes les écoles
export const getAllSchools = async (req: Request, res: Response) => {
    try {
        const schools = await School.find().populate('user_id', 'name email'); // Populer avec les infos du directeur
        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schools", error });
    }
};

// Obtenir une école par ID
export const getSchoolById = async (req: Request, res: Response) => {
    try {
        const school = await School.findById(req.params.id).populate('user_id', 'name email');
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }
        res.status(200).json(school);
    } catch (error) {
        res.status(500).json({ message: "Error fetching school", error });
    }
};

// Mettre à jour une école
export const updateSchool = async (req: Request, res: Response) => {
    try {
        const updatedSchool = await School.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user_id', 'name email');
        
        if (!updatedSchool) {
            return res.status(404).json({ message: "School not found" });
        }

        res.status(200).json(updatedSchool);
    } catch (error) {
        res.status(500).json({ message: "Error updating school", error });
    }
};

// Supprimer une école
export const deleteSchool = async (req: Request, res: Response) => {
    try {
        const deletedSchool = await School.findByIdAndDelete(req.params.id);
        if (!deletedSchool) {
            return res.status(404).json({ message: "School not found" });
        }
        res.status(200).json({ message: "School deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting school", error });
    }
};
