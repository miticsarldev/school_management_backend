import { Request, Response } from "express"; // Importation des types Request et Response d'Express
import Attendance from "../models/Attendance"; // Importation du modèle Attendance
import { createObjectCsvWriter } from "csv-writer"; // Importation de la fonction pour écrire des fichiers CSV
import User from "../models/User";
import mongoose from "mongoose";
import ClassroomEtudiant from "../models/ClassroomEtudiant";

// Contrôleur pour enregistrer une nouvelle présence
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const attendance = new Attendance(req.body); // Création d'une nouvelle instance de présence avec les données du corps de la requête
    await attendance.save(); // Sauvegarde de la présence dans la base de données
    res
      .status(201)
      .json({ message: "Présence enregistrée avec succès", attendance }); // Réponse avec succès
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de l'enregistrement de la présence",
        error,
      }); // Gestion des erreurs
  }
};

// Contrôleur pour mettre à jour une présence existante
export const updateAttendance = async (req: Request, res: Response) => {
  const { id } = req.params; // Récupération de l'identifiant de la présence à mettre à jour à partir des paramètres de la requête
  try {
    const attendance = await Attendance.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Mise à jour de la présence
    if (!attendance) {
      return res.status(404).json({ message: "Présence non trouvée" }); // Gestion de l'présence de la présence
    }
    res.json({ message: "Présence mise à jour avec succès", attendance }); // Réponse avec succès
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la présence", error }); // Gestion des erreurs
  }
};

// Contrôleur pour consulter toutes les présences par emploi du temps
export const getAttendanceByTimeTable = async (req: Request, res: Response) => {
  const { timetable_id } = req.params; // Récupération de l'identifiant de l'emploi du temps à partir des paramètres
  try {
    const attendances = await Attendance.find({ timetable_id }); // Récupération des présences liées à cet emploi du temps
    res.json(attendances); // Réponse avec la liste des présences
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des présences", error }); // Gestion des erreurs
  }
};
export const getAllAttendancesParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.parent_id; // On suppose que l'ID du parent est passé dans les paramètres de la requête

    // Convertir parentId en ObjectId si nécessaire
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Récupérer tous les enfants associés au parent
    const students = await User.find({ parent: parentObjectId, role: "etudiant" });

    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
    }

    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map(student => student._id);
    console.log(studentIds); // Bon pour le débogage

    // Récupérer les présences associées aux étudiants
    const attendances = await Attendance.find({ student_id: { $in: studentIds } })
      .populate('student_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur étudiant
      .populate('teacher_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur enseignant
      .populate('timetable_id'); // Peupler toutes les informations de l'emploi du temps

    if (attendances.length === 0) {
      return res.status(404).json({ message: "Aucune présence trouvée pour les étudiants de ce parent.", parentId });
    }

    // Retourner la liste des présences
    res.status(200).json(attendances);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Contrôleur pour exporter les présences au format CSV
export const exportAttendanceToCSV = async (req: Request, res: Response) => {
  const { timetable_id } = req.params; // Récupération de l'identifiant de l'emploi du temps à partir des paramètres

  try {
    // Récupération des présences pour cet emploi du temps
    const attendances = await Attendance.find({ timetable_id });

    // Création d'un tableau pour stocker les données du CSV
    const records = await Promise.all(
      attendances.map(async (attendance) => {
        // Récupération des détails de l'étudiant
        const student = await User.findById(attendance.student_id);
        // Récupération des détails de l'enseignant
        const teacher = await User.findById(attendance.teacher_id);

        return {
          student_name: student
            ? `${student.firstname} ${student.lastname}`
            : "Inconnu", // Récupération du nom complet de l'étudiant
          teacher_name: teacher
            ? `${teacher.firstname} ${teacher.lastname}`
            : "Inconnu", // Récupération du nom complet de l'enseignant
          status: attendance.status,
          desc: attendance.desc,
          date: attendance.date,
        };
      })
    );

    // Création d'un écrivain CSV
    const csvWriter = createObjectCsvWriter({
      path: "attendance.csv", // Chemin du fichier CSV à écrire
      header: [
        { id: "student_name", title: "Nom de l'étudiant" }, // Changer l'en-tête pour afficher le nom de l'étudiant
        { id: "teacher_name", title: "Nom de l'enseignant" }, // Changer l'en-tête pour afficher le nom de l'enseignant
        { id: "status", title: "Statut" },
        { id: "desc", title: "Description" },
        { id: "date", title: "Date" },
      ],
    });

    await csvWriter.writeRecords(records); // Écriture des enregistrements dans le fichier CSV
    res.download("attendance.csv", "attendance.csv", (err) => {
      // Téléchargement du fichier CSV
      if (err) {
        res
          .status(500)
          .json({
            message: "Erreur lors du téléchargement du fichier CSV",
            err,
          }); // Gestion des erreurs de téléchargement
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'exportation des présences", error }); // Gestion des erreurs
  }
};
    console.log("Présences récupérées:", attendances);
    res.json(attendances); // Réponse avec la liste des présences peuplées
  } catch (error) {
    console.error("Erreur dans getAllAttendances:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de toutes les présences",
      error,
    }); // Gestion des erreurs
  }
};
// Contrôleur pour récupérer les présences d'un utilisateur spécifique par role
export const getAttendancesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

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
        // Logique pour récupérer les présences pour un parent
        const students = await User.find({ parent: userObjectId, role: "etudiant" });
        if (students.length === 0) {
          return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", userId });
        }

        const studentIds = students.map((student) => student._id);

        const attendances = await Attendance.find({ student_id: { $in: studentIds } })
          .populate("teacher_id")
          .populate("student_id")
          .populate('timetable_id');

        if (attendances.length === 0) {
          return res.status(404).json({ message: "Aucune présence trouvée pour ces classes.", userId });
        }

        return res.status(200).json(attendances);

      case 'enseignant':
        // Logique pour récupérer les présences pour un enseignant
        const teacherAttendances = await Attendance.find({ teacher_id: userObjectId })
        .populate("teacher_id")
        .populate("student_id")
        .populate('timetable_id');

        if (teacherAttendances.length === 0) {
          return res.status(404).json({ message: "Aucune présence trouvée pour cet enseignant.", userObjectId });
        }

        return res.status(200).json(teacherAttendances);

        case 'etudiant':
          // Logique pour récupérer les présences pour un étudiant
          const studentAttendances = await Attendance.find({ student_id: userObjectId })
          .populate("teacher_id")
          .populate("student_id")
          .populate('timetable_id');
        
          if (studentAttendances.length === 0) {
            return res.status(404).json({ message: "Aucune présence trouvée pour cet étudiant.", userObjectId });
          }
        
          return res.status(200).json(studentAttendances);
        

      case 'administrateur':
        // Logique pour récupérer tous les présences pour un administrateur
        const allAttendances = await Attendance.find()
        .populate("teacher_id")
        .populate("student_id")
        .populate('timetable_id');

        return res.status(200).json(allAttendances);

      default:
        return res.status(403).json({ message: "Rôle non reconnu." });
    }
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Contrôleur pour récupérer les présences d'un utilisateur spécifique
export const getAttendanceByUser = async (req: Request, res: Response) => {
  const { user_id } = req.params; // Récupération de l'identifiant de l'utilisateur à partir des paramètres
  try {
    // Récupération de l'utilisateur pour déterminer son rôle
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" }); // Gestion des erreurs si l'utilisateur n'existe pas
    }

    let attendances;
    // Vérifiez le rôle de l'utilisateur et récupérez les présences en conséquence
    if (user.role === "etudiant") {
      attendances = await Attendance.find({ student_id: user_id })
        .populate('student_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur étudiant
        .populate('teacher_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur enseignant
        .populate('timetable_id'); // Peupler toutes les informations de l'emploi du temps; // Récupération des présences de l'étudiant
    } else if (user.role === "enseignant") {
      attendances = await Attendance.find({ teacher_id: user_id })
        .populate('student_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur étudiant
        .populate('teacher_id', 'firstname lastname') // Peupler avec les champs firstname et lastname de l'utilisateur enseignant
        .populate('timetable_id'); // Peupler toutes les informations de l'emploi du temps; // Récupération des présences de l'enseignant
    } else {
      return res
        .status(400)
        .json({ message: "Rôle d'utilisateur non supporté" }); // Gestion des erreurs pour les rôles non supportés
    }

    res.json(attendances); // Réponse avec la liste des présences
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des présences de l'utilisateur",
        error,
      }); // Gestion des erreurs
  }
};

// Supprimer une attendance
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ message: "Présence introuvable" });
    }

    res.json({ message: "Présence de l'etudiant supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Contrôleur pour récupérer les statistiques de présence des étudiants et des enseignants
export const getAttendanceStats = async (req: Request, res: Response) => {
  try {
    const studentAttendances = await Attendance.aggregate([
      { $match: { student_id: { $ne: null } } }, // Filtrer les présences des étudiants
      {
        $group: {
          _id: "$status", // Regrouper par statut (présent ou absent)
          count: { $sum: 1 }, // Compter le nombre de présences
        },
      },
    ]);

    const teacherAttendances = await Attendance.aggregate([
      { $match: { teacher_id: { $ne: null } } }, // Filtrer les présences des enseignants
      {
        $group: {
          _id: "$status", // Regrouper par statut (présent ou absent)
          count: { $sum: 1 }, // Compter le nombre de présences
        },
      },
    ]);

    const studentStats = {
      present: studentAttendances.find(stat => stat._id === true)?.count || 0,
      absent: studentAttendances.find(stat => stat._id === false)?.count || 0,
    };

    const teacherStats = {
      present: teacherAttendances.find(stat => stat._id === true)?.count || 0,
      absent: teacherAttendances.find(stat => stat._id === false)?.count || 0,
    };

    res.json({ studentStats, teacherStats }); // Répondre avec les statistiques
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques de présence",
      error,
    }); // Gestion des erreurs
  }
};