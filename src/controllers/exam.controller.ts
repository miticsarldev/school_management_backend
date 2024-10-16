import { Request, Response } from "express";
import Exam from "../models/Exam";
import mongoose from "mongoose";
import User from "../models/User";

export const addExam = async (req: Request, res: Response) => {
  try {
    const newExam = new Exam(req.body);
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'examen", error });
  }
};

// Récupérer tous les examens
export const getExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find().populate("exam_type_id");
    res.status(200).json(exams);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des examens", error });
  }
};

// Modifier un examen
export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedExam)
      return res.status(404).json({ message: "Examen non trouvé" });
    res.json(updatedExam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la modification del'examen", error });
  }
};

// Supprimer un examen
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(id);
    if (!deletedExam)
      return res.status(404).json({ message: "Examen non trouvé" });
    res.json({ message: "Examen supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'examen", error });
  }
};

// Récupérer un examen par ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate("exam_type_id");
    if (!exam) return res.status(404).json({ message: "Examen non trouvé" });
    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'examen", error });
  }
};
export const getAllExamsParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.student_id; // On suppose que l'ID du parent est passé dans les paramètres de la requête
    
    // Convertir parentId en ObjectId si nécessaire
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Récupérer tous les enfants associés au parent
    const students = await User.find({ parent: parentObjectId, role: "etudiant" });

    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
    }

    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map(student => student._id);

    // Récupérer les événements associés aux étudiants
    const exams = await Exam.find({ student_id: { $in: studentIds } });

    if (exams.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour les étudiants de ce parent.", parentId });
    }

    // Retourner la liste des événements
    res.status(200).json(exams);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};