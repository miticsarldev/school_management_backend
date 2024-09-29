import { Request, Response } from "express";
import Event from "../models/Event";

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

// Mettre à jour un événement
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
