import { Request, Response } from "express";
import Timetable from "../models/Timetable";
import mongoose from "mongoose";
import User from "../models/User";

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
export const getTimetableById = async (req: Request, res: Response) => {
  try {
    const timetableId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const timetable = await Timetable.findById("67105aba680af382564e8d2c")
      .populate("cours_id", "name")
      .populate("id_users", "name email")
      .populate("classroom_id", "name");

    if (!timetable) {
      return res.status(404).json({ message: "Emploi du temps non trouvé" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'emploi du temps",
      error,
    });
  }
};

export const getTimetableByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "user_id invalide" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé", userId });
    }

    if (user.role === 'enseignant') { // Utilisez '===' pour comparaison
      const timetableTeacher = await Timetable.find({ id_users: userObjectId })
        .populate("cours_id", "name")
        .populate("id_users", "name email")
        .populate("classroom_id", "name");

      if (!timetableTeacher) {
        return res.status(404).json({ message: "Emploi du temps non trouvé" });
      }

      res.status(200).json(timetableTeacher);
    } else {
      return res.status(400).json({ message: "Cet utilisateur n'est pas un enseignant" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération de l'emploi du temps",
      error,
    });
  }
};
