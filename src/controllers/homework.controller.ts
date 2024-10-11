// controllers/homework.controller.ts
import { Request, Response } from "express";
import { HomeworkModel } from "../models/Homework";

export const addHomework = async (req: Request, res: Response) => {
  try {
    const newHomework = new HomeworkModel(req.body);
    await newHomework.save();
    res.status(201).json(newHomework);
  } catch (error) {
    res.status(500).json({ message: "Error adding homework", error });
  }
};

export const updateHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedHomework = await HomeworkModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedHomework)
      return res.status(404).json({ message: "Homework not found" });
    res.status(200).json(updatedHomework);
  } catch (error) {
    res.status(500).json({ message: "Error updating homework", error });
  }
};

export const deleteHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedHomework = await HomeworkModel.findByIdAndDelete(id);
    if (!deletedHomework)
      return res.status(404).json({ message: "Homework not found" });
    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting homework", error });
  }
};

// Récupérer un devoir par son ID
export const getHomeworkById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est bien fourni
    if (!id) {
      return res.status(400).json({ message: "ID du devoir manquant" });
    }

    const homework = await HomeworkModel.findById(id);

    if (!homework) {
      return res.status(404).json({ message: "Devoir non trouvé" });
    }
    res.status(200).json(homework);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du devoir", error });
  }
};

export const getHomeworks = async (req: Request, res: Response) => {
  try {
    const homeworks = await HomeworkModel.find()
    .populate("cours_id", "course_name")  
      .populate("classroom_id", "classroom_name");
    res.status(200).json(homeworks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching homework", error });
  }
};
