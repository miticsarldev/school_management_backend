import { Request, Response } from "express";
import Event from "../models/Event";
import mongoose from "mongoose";
import User from "../models/User";

// Créer un événement
export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création de l'événement." });
  }
};

// Lister tous les événements
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération des événements." });
  }
};
// Lister tous les événements selon un utilisateur
export const getAllEventsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.student_id; // On suppose que l'ID de l'utilisateur est passé dans les paramètres de la requête
    
    // Convertir userId en ObjectId si nécessaire
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Récupérer les événements associés à l'utilisateur
    const events = await Event.find({ student_id: userObjectId }); // Assurez-vous que `student_id` fait référence à l'utilisateur

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour cet utilisateur.", userId });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Lister tous les événements selon un parent
export const getAllEventsParentId = async (req: Request, res: Response) => {
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
    const events = await Event.find({ student_id: { $in: studentIds } });

    if (events.length === 0) {
      return res.status(404).json({ message: "Aucun événement trouvé pour les étudiants de ce parent.", parentId });
    }

    // Retourner la liste des événements
    res.status(200).json(events);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: "Événement non trouvé." });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour de l'événement." });
  }
};

// Supprimer un événement
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Événement non trouvé." });
    res.status(200).json({ message: "Événement supprimé avec succès." });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la suppression de l'événement." });
  }
};
