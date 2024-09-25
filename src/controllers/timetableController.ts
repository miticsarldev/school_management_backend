import { Request, Response } from "express";
import Timetable from "../models/timetable.model";

// Ajouter un emploi du temps
export const addTimetable = async (req: Request, res: Response) => {
    try {
        const newTimetable = new Timetable(req.body);
        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'emploi du temps", error });
    }
};

// Consulter tous les emplois du temps
export const getTimetables = async (req: Request, res: Response) => {
    try {
        const timetables = await Timetable.find();
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des emplois du temps", error });
    }
};

// Mettre à jour un emploi du temps
export const updateTimetable = async (req: Request, res: Response) => {
    try {
        const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTimetable) {
            return res.status(404).json({ message: "Emploi du temps non trouvé" });
        }
        res.status(200).json(updatedTimetable);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'emploi du temps", error });
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
        res.status(500).json({ message: "Erreur lors de la suppression de l'emploi du temps", error });
    }
};
