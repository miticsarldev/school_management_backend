import { Request, Response } from "express";
import ExamSchedule from "../models/ExamSchedule";

// Créer un nouvel emploi du temps d'examen
export const createExamSchedule = async (req: Request, res: Response) => {
  try {
    const { exam_id, classroom_id } = req.body;
    const newExamSchedule = new ExamSchedule({ exam_id, classroom_id });
    const savedExamSchedule = await newExamSchedule.save();
    res.status(201).json(savedExamSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error creating exam schedule", error });
  }
};

// Obtenir tous les emplois du temps d'examen
export const getAllExamSchedules = async (req: Request, res: Response) => {
  try {
    const examSchedules = await ExamSchedule.find()
      .populate("exam_id")
      .populate("classroom_id");
    res.status(200).json(examSchedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam schedules", error });
  }
};

// Obtenir un emploi du temps d'examen par ID
export const getExamScheduleById = async (req: Request, res: Response) => {
  try {
    const examSchedule = await ExamSchedule.findById(req.params.id)
      .populate("exam_id")
      .populate("classroom_id");
    if (!examSchedule)
      return res.status(404).json({ message: "Exam Schedule not found" });
    res.status(200).json(examSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam schedule", error });
  }
};

// Mettre à jour un emploi du temps d'examen
export const updateExamSchedule = async (req: Request, res: Response) => {
  try {
    const { exam_id, classe_id } = req.body;
    const updatedExamSchedule = await ExamSchedule.findByIdAndUpdate(
      req.params.id,
      { exam_id, classe_id },
      { new: true }
    );
    if (!updatedExamSchedule)
      return res.status(404).json({ message: "Exam Schedule not found" });
    res.status(200).json(updatedExamSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error updating exam schedule", error });
  }
};

// Supprimer un emploi du temps d'examen
export const deleteExamSchedule = async (req: Request, res: Response) => {
  try {
    const deletedExamSchedule = await ExamSchedule.findByIdAndDelete(
      req.params.id
    );
    if (!deletedExamSchedule)
      return res.status(404).json({ message: "Exam Schedule not found" });
    res.status(200).json({ message: "Exam Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam schedule", error });
  }
};
