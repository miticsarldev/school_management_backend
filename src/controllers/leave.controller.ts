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
