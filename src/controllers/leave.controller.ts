import { Request, Response } from "express";
import Leave from "../models/Leave";

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
// Trouver une demande de congé ou absence
export const showLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: "Demande non trouvée." });
    res.status(200).json(leave);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la recherche de la demande." });
  }
};
// Trouver toutes les demandes de congé ou absence liées à un étudiant
export const showStudentLeaves = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId; // ID de l'étudiant passé dans les paramètres de la requête
    const leaves = await Leave.find({ studentId }); // Recherche basée sur l'ID de l'étudiant
    if (leaves.length === 0) return res.status(404).json({ error: "Aucune demande trouvée pour cet étudiant." });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération des demandes." });
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
