import { Request, Response } from "express";
import { CourClasse } from "../models/CourClasse";

// Créer une nouvelle relation cours-classe
export const createCourClasse = async (req: Request, res: Response) => {
  try {
    const { id_cours, id_classe } = req.body;
    const newCourClasse = new CourClasse({ id_cours, id_classe });
    await newCourClasse.save();
    res.status(201).json(newCourClasse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    }
  }
};

// Obtenir toutes les relations cours-classe
export const getAllCourClasses = async (req: Request, res: Response) => {
  try {
    const courClasses = await CourClasse.find()
    .populate({
      path: "id_cours",
      populate: {
        path: "id_user", 
      },
    })
      .populate("id_classe"); // Remplit les données de la classe
    res.status(200).json(courClasses);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    }
  }
};
// Mettre à jour une relation cours-classe
export const updateCourClasse = async (req: Request, res: Response) => {
  try {
    const updatedCourClasse = await CourClasse.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("id_cours") // Remplit les données du cours
      .populate("id_classe"); // Remplit les données de la classe
    if (!updatedCourClasse) return res.status(404).send("Relation non trouvée.");
    res.status(200).json(updatedCourClasse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    }
  }
};

// Supprimer une relation cours-classe
export const deleteCourClasse = async (req: Request, res: Response) => {
  try {
    const deletedCourClasse = await CourClasse.findByIdAndDelete(req.params.id);
    if (!deletedCourClasse) return res.status(404).send("Relation non trouvée.");
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    }
  }
};
