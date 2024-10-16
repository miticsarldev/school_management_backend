import { Request, Response } from "express";
import Timetable from "../models/Timetable";

// Ajouter un emploi du temps
export const addTimetable = async (req: Request, res: Response) => {
  try {
    const newTimetable = new Timetable(req.body);
    await newTimetable.save();
    res.status(201).json(newTimetable);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'emploi du temps", error });
  }
};

// Consulter tous les emplois du temps

export const getTimetables = async (req: Request, res: Response) => {
  try {
    const timetables = await Timetable.find()
      .populate("cours_id", "name") 
      .populate("id_users", "name email")  
      .populate("classroom_id", "name"); // Champs de la salle de classe

    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des emplois du temps",
      error,
    });
  }
};

// Mettre à jour un emploi du temps
export const updateTimetable = async (req: Request, res: Response) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTimetable) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }
    res.status(200).json(updatedTimetable);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour de l'emploi du temps",
        error,
      });
  }
};

// Supprimer un emploi du temps
export const deleteTimetable = async (req: Request, res: Response) => {
  try {
    const deletedTimetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!deletedTimetable) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }
    res.status(200).json({ message: "Emploi du temps supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression de l'emploi du temps",
        error,
      });
  }
};
// Récupérer un emploi du temps par ID
export const getTimetableById = async (req: Request, res: Response) => {
  try {
    const timetableId = req.params.id;
    
    // Rechercher l'emploi du temps par ID et peupler les références
    const timetable = await Timetable.findById(timetableId)
      .populate("cours_id", "name") // Remplacez 'course_name' par les champs nécessaires
      .populate("id_users", "name email") // Remplacez 'name', 'email' par les champs nécessaires
      .populate("classroom_id", "name"); // Champs de la salle de classe

    if (!timetable) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'emploi du temps",
      error,
    });
  }
};