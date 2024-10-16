import { Request, Response } from "express";
import ExamResult from "../models/ExamResult";
import mongoose from "mongoose";
import User from "../models/User";
import ClassroomEtudiant from "../models/ClassroomEtudiant"; // Assurez-vous de mettre le bon chemin d'importation
import Course from "../models/Course";

// Créer un nouveau résultat d'examen
export const createExamResult = async (req: Request, res: Response) => {
  try {
    const { exam_id, student_id, course_id, grade, comments, status } =
      req.body;

    const newExamResult = new ExamResult({
      exam_id,
      student_id,
      course_id,
      grade,
      comments,
      status,
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
    const updatedExamResult = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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

export const getClassRoomResult = async (req: Request, res: Response) => {
  const { classId } = req.params; // Récupérer l'ID de la classe depuis les paramètres de la requête

  try {
    // Récupérer tous les enregistrements ClassroomEtudiant correspondant à la classe
    const classroomEtudiants = await ClassroomEtudiant.find({ classroom_id: classId });

    if (!classroomEtudiants.length) {
      return res.status(404).json({ error: 'Aucun étudiant trouvé pour cette classe.' });
    }

    console.log(classroomEtudiants);
    

    // Extraire tous les IDs des étudiants de la classe
    const studentIds = classroomEtudiants.map((ce) => ce.student_id);

    // Récupérer les cours associés à cette classe via l'ID du ClassroomEtudiant (id_classroom_etudiant)
    const courses = await Course.find({ id_classroom_etudiant: { $in: classroomEtudiants.map(ce => ce._id) } });

    console.log(courses);
    

    if (!courses.length) {
      return res.status(404).json({ error: 'Aucun cours trouvé pour cette classe.' });
    }

    const courseIds = courses.map((course) => course._id);

    // Récupérer les résultats d'examen pour les cours de cette classe et peupler les informations sur les étudiants et les cours
    const examResults = await ExamResult.find({ course_id: { $in: courseIds }, student_id: { $in: studentIds } })
      .populate('student_id', 'firstname') // Peupler le champ 'firstname' du modèle 'User'
      .populate('course_id', 'name'); // Peupler le champ 'name' du modèle 'Course'

      console.log(examResults);
      

    res.json(examResults);
  } catch (err) {
    res.status(500).json({ error: 'Échec de la récupération des résultats d\'examen.' });
  }
};
