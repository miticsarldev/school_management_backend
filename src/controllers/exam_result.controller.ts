import { Request, Response } from "express";
import ExamResult from "../models/ExamResult";
import mongoose from "mongoose";
import User from "../models/User";

// Créer un nouveau résultat d'examen
export const createExamResult = async (req: Request, res: Response) => {
  try {
    const { exam_id, student_id, course_id, grade, comments } = req.body;

    // Définir le statut en fonction de la note (grade)
    let status = "Incomplet"; // Par défaut
    if (typeof grade === 'number') {
      if (grade < 10) {
        status = "Échoué";
      } else if (grade >= 10 && grade < 20) {
        status = "Réussi";
      } 
    }
    // if (typeof grade === 'number') {
    //   if (grade < 10) {
    //     status = "Échoué";
    //   } else if (grade >= 10 && grade < 12) {
    //     status = "Passable";
    //   } else if (grade >= 12 && grade < 14) {
    //     status = "Assez bien";
    //   } else if (grade >= 14 && grade < 16) {
    //     status = "Bien";
    //   } else if (grade >= 16 && grade < 18) {
    //     status = "Très bien";
    //   } else if (grade >= 18 && grade <= 20) {
    //     status = "Excellent";
    //   }
    // }
    
    const newExamResult = new ExamResult({
      exam_id,
      student_id,
      course_id,
      grade,
      comments,
      status, // Attribuer le status calculé
    });

    const savedExamResult = await newExamResult.save();
    res.status(201).json({
      message: "Exam result created successfully",
      exam_result: savedExamResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating exam result", error });
  }
};


// Obtenir tous les résultats d'examen
export const getAllExamResults = async (req: Request, res: Response) => {
  try {
    const examResults = await ExamResult.find()
      .populate("exam_id")
      .populate("student_id")
      .populate("course_id");
    res.status(200).json(examResults);
  } catch (error) {
    console.error("Error fetching exam results:", error);
    res.status(500).json({
      message: "Error fetching exam results",
      error: error, // Ajout de plus d'informations sur l'erreur
    });
  }
};
// Lister tous les resultats selon un parent
export const getAllExam_resultsParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.student_id; // On suppose que l'ID du parent est passé dans les paramètres de la requête
    // Vérifier si l'ID passé est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "ID du parent invalide." });
    }
    const parentObjectId = new mongoose.Types.ObjectId(parentId);
    // Récupérer tous les étudiants associés au parent
    const students = await User.find({ parent: parentObjectId, role: "etudiant" });
    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
    }
    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map(student => student._id);
    // Récupérer les résultats d'examens associés aux étudiants
    const exam_results = await ExamResult.find({ student_id: { $in: studentIds } })
      .populate('exam_id')    // Peupler les informations sur l'examen
      .populate('course_id') // Peupler les informations sur le cours
      .populate('student_id'); // Peupler les informations sur l'etudiant
    if (exam_results.length === 0) {
      return res.status(404).json({ message: "Aucun résultat trouvé pour les étudiants de ce parent.", parentId });
    }

    // Retourner la liste des résultats d'examens
    res.status(200).json(exam_results);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Obtenir un résultat d'examen par ID
export const getExamResultById = async (req: Request, res: Response) => {
  try {
    const examResult = await ExamResult.findById(req.params.id).populate(
      "exam_id student_id course_id"
    );
    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    res.status(200).json(examResult);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam result", error });
  }
};

// Mettre à jour un résultat d'examen
export const updateExamResult = async (req: Request, res: Response) => {
  try {
    const { grade, ...updateFields } = req.body;

    // Définir le statut en fonction de la note (grade)
    let status = "Incomplet"; // Par défaut
    if (typeof grade === 'number') {
      if (grade < 10) {
        status = "Échoué";
      } else if (grade >= 10 && grade < 20) {
        status = "Réussi";
      } 
    }

    // Ajouter le statut recalculé aux champs à mettre à jour
    const updateData = { ...updateFields, grade, status };

    // Mettre à jour le résultat d'examen
    const updatedExamResult = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedExamResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }

    res.status(200).json({
      message: "Exam result updated successfully",
      exam_result: updatedExamResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating exam result", error });
  }
};


// Supprimer un résultat d'examen
export const deleteExamResult = async (req: Request, res: Response) => {
  try {
    const deletedExamResult = await ExamResult.findByIdAndDelete(req.params.id);
    if (!deletedExamResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    res.status(200).json({ message: "Exam result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam result", error });
  }
};
