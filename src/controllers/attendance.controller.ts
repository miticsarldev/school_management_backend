import { Request, Response } from "express"; // Importation des types Request et Response d'Express
import Attendance from "../models/Attendance"; // Importation du modèle Attendance
import { createObjectCsvWriter } from "csv-writer"; // Importation de la fonction pour écrire des fichiers CSV
import User from "../models/User";

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
      return res.status(404).json({ message: "Présence non trouvée" }); // Gestion de l'absence de la présence
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
    if (user.role === "student") {
      attendances = await Attendance.find({ student_id: user_id }); // Récupération des présences de l'étudiant
    } else if (user.role === "teacher") {
      attendances = await Attendance.find({ teacher_id: user_id }); // Récupération des présences de l'enseignant
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
