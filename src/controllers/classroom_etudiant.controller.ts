import { Request, Response } from "express";
import ClassroomEtudiant from "../models/ClassroomEtudiant";
import mongoose from "mongoose";

// Ajouter une classroomEtudiant
export const createClassroomEtudiant = async (req: Request, res: Response) => {
  try {
    const { student_id, classroom_id } = req.body;

    const classroomEtudiant = new ClassroomEtudiant({
      student_id,
      classroom_id,
    });

    await classroomEtudiant.save();
    res.status(201).json({ message: "Salle de classe de l'etudiant créée avec succès", classroomEtudiant });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Afficher toutes les classroomEtudiants
export const getClassroomEtudiants = async (req: Request, res: Response) => {
  try {
    const classroomEtudiants = await ClassroomEtudiant.find().find().populate("classroom_id").populate("student_id");
    res.json(classroomEtudiants);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

//  Modifier une classroomEtudiant
export const updateClassroomEtudiant = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { student_id, classroom_id } = req.body;
  
      // Trouver la salle de classe par ID
      const classroomEtudiant = await ClassroomEtudiant.findById(id);
      if (!classroomEtudiant) {
        return res.status(404).json({ message: "Salle de classe de l'etudiant introuvable" });
      }
  
      // Mise à jour des champs
      classroomEtudiant.student_id = student_id;
      classroomEtudiant.classroom_id = classroom_id;
  
      await classroomEtudiant.save();
      res.json({ message: "Salle de classe de l'etudiant mise à jour avec succès", classroomEtudiant });
    } catch (error) {
      res.status(500).json({ message: "Erreur de serveur" });
    }
  };
  

// Supprimer une classroomEtudiant
export const deleteClassroomEtudiant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classroomEtudiant = await ClassroomEtudiant.findByIdAndDelete(id);
    if (!classroomEtudiant) {
      return res.status(404).json({ message: "Salle de classe introuvable" });
    }

    res.json({ message: "Salle de classe de l'etudiant supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Afficher une classroomEtudiant par ID
export const getClassroomEtudiantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classroomEtudiant = await ClassroomEtudiant.findById(id).populate("classroom_id").populate("student_id");
    if (!classroomEtudiant) {
      return res.status(404).json({ message: "Salle de classe de l'etudiant introuvable" });
    }

    res.json(classroomEtudiant);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
// Afficher une classroomEtudiant par ID
export const getClassroomEtudiantByStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.student_id
// Convertir parentId en ObjectId si nécessaire
const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const classroomEtudiant = await ClassroomEtudiant.findOne({ student_id: studentObjectId })
    .populate("classroom_id").populate("student_id");
    if (!classroomEtudiant) {
      return res.status(404).json({ message: "Salle de classe de l'etudiant introuvable" });
    }

    res.json(classroomEtudiant);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};