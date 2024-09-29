import { Request, Response } from "express";
import Grade from "../models/Grade";

// Ajouter une note
export const createGrade = async (req: Request, res: Response) => {
    try {
      const { value, appreciation, statuses } = req.body;
  
      // Vérifiez si une note avec la même valeur existe déjà
      const existingGrade = await Grade.findOne({ value });
      if (existingGrade) {
        return res.status(400).json({ message: "Une note avec cette valeur existe déjà" });
      }
  
      // Créer une nouvelle note
      const grade = new Grade({
        value,
        appreciation,
        statuses,
      });
  
      await grade.save();
      res.status(201).json({ message: "Note ajoutée avec succès", grade });
    } catch (error) {
      res.status(500).json({ message: "Erreur de serveur" });
    }
  };  

// Afficher toutes les notes
export const getGrades = async (req: Request, res: Response) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Modifier un note
export const updateGrade = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { value, appreciation, statuses } = req.body;
  
      // Vérifiez si une autre note avec la même valeur existe déjà
      const existingGrade = await Grade.findOne({ value });
      if (existingGrade && existingGrade._id.toString() !== id) {
        return res.status(400).json({ message: "Une note avec cette valeur existe déjà" });
      }
  
      // Trouver la note par ID
      const grade = await Grade.findById(id);
      if (!grade) {
        return res.status(404).json({ message: "Note introuvable" });
      }
  
      // Mise à jour des champs
      grade.value = value;
      grade.appreciation = appreciation;
      grade.statuses = statuses;
  
      await grade.save();
      res.json({ message: "Note modifiée avec succès", grade });
    } catch (error) {
      res.status(500).json({ message: "Erreur de serveur" });
    }
  };
  

// Spprimer une note
export const deleteGrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByIdAndDelete(id);
    if (!grade) {
      return res.status(404).json({ message: "Note intouvable" });
    }

    res.json({ message: "Note supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Afficher une note par ID
export const getGradeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ message: "Note intouvable" });
    }

    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
