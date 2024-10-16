// controllers/homework.controller.ts
import { Request, Response } from "express";
import { Homework } from "../models/Homework";
import mongoose from "mongoose";
import ExamResult from "../models/ExamResult";
import User from "../models/User";

export const addHomework = async (req: Request, res: Response) => {
  try {
    const newHomework = new Homework(req.body);
    await newHomework.save();
    res.status(201).json(newHomework);
  } catch (error) {
    res.status(500).json({ message: "Error adding homework", error });
  }
};

export const updateHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedHomework = await Homework.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedHomework)
      return res.status(404).json({ message: "Homework not found" });
    res.status(200).json(updatedHomework);
  } catch (error) {
    res.status(500).json({ message: "Error updating homework", error });
  }
};

export const deleteHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedHomework = await Homework.findByIdAndDelete(id);
    if (!deletedHomework)
      return res.status(404).json({ message: "Homework not found" });
    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting homework", error });
  }
};
// // Récupérer un devoir par l'ID du parent
// export const getAllHomeworksParentId = async (req: Request, res: Response) => {
//   try {
//     const parentId = req.params.classroom_id; // On suppose que l'ID du parent est passé dans les paramètres de la requête

//     // Vérifier si l'ID passé est un ObjectId valide
//     if (!mongoose.Types.ObjectId.isValid(parentId)) {
//       return res.status(400).json({ message: "ID du parent invalide." });
//     }

//     const parentObjectId = new mongoose.Types.ObjectId(parentId);

//     // Récupérer tous les étudiants associés au parent
//     const students = await User.find({ parent: parentObjectId, role: "etudiant" });

//     if (students.length === 0) {
//       return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
//     }

//     // Récupérer les IDs des étudiants (enfants)
//     const studentIds = students.map(student => student._id);

//     // Récupérer les devoirs associés aux étudiants
//     const homeworks = await Homework.find({ student_id: { $in: studentIds } })
//       .populate('course_id') // Peupler les informations sur le cours
//       .populate('Classroom_id'); // Peupler les informations sur la classe

//     if (homeworks.length === 0) {
//       return res.status(404).json({ message: "Aucun devoir trouvé pour les étudiants de ce parent.", parentId });
//     }

//     // Retourner la liste des devoirs
//     res.status(200).json(homeworks);
//   } catch (error) {
//     console.error(error); // Pour mieux diagnostiquer l'erreur
//     res.status(500).json({ message: "Erreur serveur." });
//   }
// };
// Récupérer un devoir par son ID
export const getHomeworkById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est bien fourni
    if (!id) {
      return res.status(400).json({ message: "ID du devoir manquant" });
    }

    const homework = await Homework.findById(id);

    if (!homework) {
      return res.status(404).json({ message: "Devoir non trouvé" });
    }
    res.status(200).json(homework);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du devoir", error });
  }
};

export const getHomeworks = async (req: Request, res: Response) => {
  try {
    const homeworks = await Homework.find()
      .populate("classroom_id")
      .populate({
        path: "course_id",
        populate: {
          path: "id_user", // Peupler l'utilisateur (le professeur) associé au cours
          select: "firstname lastname" // Sélectionner uniquement les champs nécessaires (nom et prénom du professeur)
        }
      });
    res.status(200).json(homeworks);
  } catch (error) {
    console.error("Error fetching homework results:", error);
    res.status(500).json({
      message: "Error fetching homework results",
      error: error,
    });
  }
};

