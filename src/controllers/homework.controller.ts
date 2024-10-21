// controllers/homework.controller.ts
import { Request, Response } from "express";
import { Homework } from "../models/Homework";
import mongoose from "mongoose";
import ExamResult from "../models/ExamResult";
import User from "../models/User";
import ClassroomEtudiant from "../models/ClassroomEtudiant";
// // Récupérer un devoir par l'ID du parent

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
  try {
    const deletedHomework = await Homework.findByIdAndDelete(req.params.id);
    if (!deletedHomework)
      return res.status(404).json({ message: "Homework not found" });
    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting homework" });
  }
};

export const getHomeworksByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

    // Vérifier si l'ID passé est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Récupérer les informations de l'utilisateur
    const user = await User.findById(userObjectId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé.", userId });
    }

    // Vérifier le rôle de l'utilisateur
    switch (user.role) {
      case 'parent':
        // Logique pour récupérer les devoirs pour un parent
        const students = await User.find({ parent: userObjectId, role: "etudiant" });
        if (students.length === 0) {
          return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", userId });
        }

        const studentIds = students.map((student) => student._id);
        const classroomEtudiantEntries = await ClassroomEtudiant.find({ student_id: { $in: studentIds } });
        if (classroomEtudiantEntries.length === 0) {
          return res.status(404).json({ message: "Aucune classe trouvée pour ces étudiants.", userId });
        }

        const classroomIds = classroomEtudiantEntries.map((entry) => entry.classroom_id);
        const homeworks = await Homework.find({ classroom_id: { $in: classroomIds } })
          .populate({
            path: "course_id",
            populate: {
              path: "id_user",
              select: "firstname lastname",
            },
          })
          .populate('classroom_id');

        if (homeworks.length === 0) {
          return res.status(404).json({ message: "Aucun devoir trouvé pour ces classes.", userId });
        }

        return res.status(200).json(homeworks);

      case 'enseignant':
        // Logique pour récupérer les devoirs pour un enseignant
        const teacherHomeworks = await Homework.find({ id_user: userObjectId }) // Supposant que vous avez un champ `id_user` dans Homework
          .populate('classroom_id'); // Peupler les informations sur la classe

        if (teacherHomeworks.length === 0) {
          return res.status(404).json({ message: "Aucun devoir trouvé pour cet enseignant.", userId });
        }

        return res.status(200).json(teacherHomeworks);

        case 'etudiant':
          // Logique pour récupérer les devoirs pour un étudiant
          const classroomEtudiantEntrie = await ClassroomEtudiant.findOne({ student_id: userObjectId });
          if (!classroomEtudiantEntrie) { // Vérifie si l'entrée de la classe existe
            return res.status(404).json({ message: "Aucune classe trouvée pour cet étudiant.", userId });
          }
        
          const studentHomeworks = await Homework.find({ classroom_id: classroomEtudiantEntrie.classroom_id })
            .populate({
              path: "course_id",
              populate: {
                path: "id_user",
                select: "firstname lastname",
              },
            })
            .populate('classroom_id');
        
          if (studentHomeworks.length === 0) {
            return res.status(404).json({ message: "Aucun devoir trouvé pour cet étudiant.", userId });
          }
        
          return res.status(200).json(studentHomeworks);
        

      case 'administrateur':
        // Logique pour récupérer tous les devoirs pour un administrateur
        const allHomeworks = await Homework.find()
          .populate('classroom_id');

        return res.status(200).json(allHomeworks);

      default:
        return res.status(403).json({ message: "Rôle non reconnu." });
    }
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



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

