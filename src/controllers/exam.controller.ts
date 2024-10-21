import { Request, Response } from "express";
import Exam from "../models/Exam";
import mongoose from "mongoose";
import User from "../models/User";
import ExamResult from "../models/ExamResult";
import Timetable from "../models/Timetable";

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
export const getExamsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id; // ID de l'utilisateur récupéré des paramètres de requête

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

    // Fonction pour récupérer les examens en fonction du rôle
    let examResults = [];

    if (user.role === 'parent') {
      // Récupérer les enfants de ce parent
      const students = await User.find({ parent: userObjectId, role: "etudiant" });

      if (students.length === 0) {
        return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent." });
      }

      const studentIds = students.map(student => student._id);

      // Récupérer les résultats d'examen des enfants
      examResults = await ExamResult.find({ student_id: { $in: studentIds } })
        .populate('course_id') // On récupère les détails du cours via course_id
        .populate('student_id'); // On récupère aussi les informations de l'étudiant

    } else if (user.role === 'etudiant') {
      // Récupérer les résultats d'examen de l'étudiant
      examResults = await ExamResult.find({ student_id: userObjectId })
        .populate('course_id') // Récupérer les informations du cours
        .populate('student_id');
    } else {
      return res.status(403).json({ message: "Rôle non autorisé pour cette action." });
    }

    if (examResults.length === 0) {
      return res.status(404).json({ message: "Aucun résultat d'examen trouvé." });
    }

    // Récupérer l'emploi du temps associé aux cours trouvés dans les résultats d'examen
    const courseIds = examResults.map(result => result.course_id);
    const timetables = await Timetable.find({ cours_id: { $in: courseIds } });

    // Structure de réponse combinant les résultats d'examen et les détails d'emploi du temps
    const examsWithTimetables = examResults.map(result => {
      const timetable = timetables.find(tt => String(tt.cours_id) === String(result.course_id));

      return {
        exam_result: result, // Les détails du résultat d'examen (note, commentaire, etc.)
        course: result.course_id, // Les détails du cours
        timetable: timetable || null // Les détails d'emploi du temps pour ce cours, si disponible
      };
    });

    return res.status(200).json(examsWithTimetables);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// export const getExamsByUserId = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.user_id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

//     // Vérifier si l'ID passé est un ObjectId valide
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "ID utilisateur invalide." });
//     }

//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Récupérer les informations de l'utilisateur
//     const user = await User.findById(userObjectId);
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé.", userId });
//     }

//     // Vérifier le rôle de l'utilisateur
//     switch (user.role) {
//       case 'parent':
//         // Logique pour récupérer les présences pour un parent
//         const students = await User.find({ parent: userObjectId, role: "etudiant" });
//         if (students.length === 0) {
//           return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", userId });
//         }

//         const studentIds = students.map((student) => student._id);

//         const exams = await Exam.find({ student_id: { $in: studentIds } })
//           .populate("teacher_id")
//           .populate("student_id")
//           .populate('timetable_id');

//         if (exams.length === 0) {
//           return res.status(404).json({ message: "Aucune présence trouvée pour ces classes.", userId });
//         }

//         return res.status(200).json(exams);

//       case 'enseignant':
//         // Logique pour récupérer les présences pour un enseignant
//         const teacherExams = await Exam.find({ teacher_id: userObjectId })
//         .populate("teacher_id")
//         .populate("student_id")
//         .populate('timetable_id');

//         if (teacherExams.length === 0) {
//           return res.status(404).json({ message: "Aucune présence trouvée pour cet enseignant.", userObjectId });
//         }

//         return res.status(200).json(teacherExams);

//         case 'etudiant':
//           // Logique pour récupérer les présences pour un étudiant
//           const studentExams = await Exam.find({ student_id: userObjectId })
//           .populate("teacher_id")
//           .populate("student_id")
//           .populate('timetable_id');
        
//           if (studentExams.length === 0) {
//             return res.status(404).json({ message: "Aucune présence trouvée pour cet étudiant.", userObjectId });
//           }
        
//           return res.status(200).json(studentExams);
        

//       case 'administrateur':
//         // Logique pour récupérer tous les présences pour un administrateur
//         const allExams = await Exam.find()
//         .populate("teacher_id")
//         .populate("student_id")
//         .populate('timetable_id');

//         return res.status(200).json(allExams);

//       default:
//         return res.status(403).json({ message: "Rôle non reconnu." });
//     }
//   } catch (error) {
//     console.error("Erreur serveur:", error);
//     res.status(500).json({ message: "Erreur serveur." });
//   }
// };
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