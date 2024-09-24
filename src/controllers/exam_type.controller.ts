// controllers/exam_type.controller.ts
import { Request, Response } from "express";
import ExamType from "../models/exam_type.model";

// Créer un nouveau type d'examen
export const createExamType = async (req: Request, res: Response) => {
    try {
        const newExamType = new ExamType(req.body);
        await newExamType.save();
        res.status(201).json({ message: "Type d'examen créé avec succès", newExamType });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du type d'examen", error });
    }
};

// Récupérer tous les types d'examen
export const getAllExamTypes = async (req: Request, res: Response) => {
    try {
        const examTypes = await ExamType.find();
        res.json(examTypes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des types d'examen", error });
    }
};

// Récupérer un type d'examen par ID
export const getExamTypeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const examType = await ExamType.findById(id);
        if (!examType) {
            return res.status(404).json({ message: "Type d'examen non trouvé" });
        }
        res.json(examType);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du type d'examen", error });
    }
};

// Mettre à jour un type d'examen
export const updateExamType = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedExamType = await ExamType.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedExamType) {
            return res.status(404).json({ message: "Type d'examen non trouvé" });
        }
        res.json({ message: "Type d'examen mis à jour avec succès", updatedExamType });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du type d'examen", error });
    }
};

// Supprimer un type d'examen
export const deleteExamType = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedExamType = await ExamType.findByIdAndDelete(id);
        if (!deletedExamType) {
            return res.status(404).json({ message: "Type d'examen non trouvé" });
        }
        res.json({ message: "Type d'examen supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du type d'examen", error });
    }
};
