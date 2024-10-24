import { Request, Response } from "express";
import Leave from "../models/Leave";
import User from "../models/User";
import mongoose from "mongoose";

// Créer une nouvelle demande de congé ou absence
export const createLeave = async (req: Request, res: Response) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création de la demande." });
  }
};

// Récupérer toutes les demandes de congés ou absences
export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find().populate("user_id").populate("timetable_id");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération des demandes." });
  }
};
// Lister tous les congés selon un parent
export const getAllLeavesParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.user_id; // On suppose que l'ID du parent est passé dans les paramètres de la requête
    
    // Convertir parentId en ObjectId si nécessaire
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Récupérer tous les enfants associés au parent
    const students = await User.find({ parent: parentObjectId, role: "etudiant" });

    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
    }

    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map(student => student._id);

    // Récupérer les congés associés aux étudiants
    const leaves = await Leave.find({ user_id: { $in: studentIds } });

    if (leaves.length === 0) {
      return res.status(404).json({ message: "Aucun congé trouvé pour les étudiants de ce parent.", parentId });
    }

    // Retourner la liste des congés
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const getAllLeavesByUserId = async (req: Request, res: Response) => {
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
        // Logique pour récupérer les absences pour un parent
        // Récupérer tous les enfants associés au parent
    const students = await User.find({ parent: userObjectId, role: "etudiant" });

    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", userId });
    }

    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map(student => student._id);

    // Récupérer les congés associés aux étudiants
    const leaves = await Leave.find({ user_id: { $in: studentIds } })
    .populate("user_id")
    .populate("timetable_id");

    if (leaves.length === 0) {
      return res.status(404).json({ message: "Aucun congé trouvé pour les étudiants de ce parent.", userId });
    }

        return res.status(200).json(leaves);

      case 'enseignant':
        // Logique pour récupérer les absences pour un enseignant
        const teacherLeaves = await Leave.find({ id_user: userObjectId }) 
        .populate("user_id")
        .populate("timetable_id");

        if (teacherLeaves.length === 0) {
          return res.status(404).json({ message: "Aucune absence trouvé pour cet enseignant.", userId });
        }

        return res.status(200).json(teacherLeaves);

        case 'etudiant':
          // Logique pour récupérer les absences pour un étudiant
          const studentLeaves = await Leave.find({ user_id: userObjectId })
          .populate("user_id")
          .populate("timetable_id");
        
          if (studentLeaves.length === 0) {
            return res.status(404).json({ message: "Aucune absence trouvé pour cet étudiant.", userId });
          }
        
          return res.status(200).json(studentLeaves);
        

      case 'administrateur':
        // Logique pour récupérer tous les absences pour un administrateur
        const allLeaves = await Leave.find()
        .populate("user_id")
        .populate("timetable_id");

        return res.status(200).json(allLeaves);

      default:
        return res.status(403).json({ message: "Rôle non reconnu." });
    }
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Mettre à jour une demande de congé ou absence
export const updateLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leave) return res.status(404).json({ error: "Demande non trouvée." });
    res.status(200).json(leave);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour de la demande." });
  }
};

// Supprimer une demande de congé ou absence
export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ error: "Demande non trouvée." });
    res.status(200).json({ message: "Demande supprimée avec succès." });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression de la demande." });
  }
};

// Récupérer les congés d'un utilisateur spécifique
export const getLeavesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id; // Récupère l'ID de l'utilisateur à partir des paramètres de la requête
    
    // Rechercher tous les congés associés à l'utilisateur
    const leaves = await Leave.find({ user_id: userId }).populate("timetable_id").populate("exam_id");
    
    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ message: "Aucun congé trouvé pour cet utilisateur." });
    }
    
    res.status(200).json(leaves); // Renvoie la liste des congés trouvés
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des congés de l'utilisateur." });
  }
};