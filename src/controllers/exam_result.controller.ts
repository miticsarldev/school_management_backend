import { Request, Response } from "express";
import ExamResult from "../models/ExamResult";

// Créer un nouveau résultat d'examen
export const createExamResult = async (req: Request, res: Response) => {
  try {
    const { exam_id, student_id, course_id, grade, comments, status } =
      req.body;

    const newExamResult = new ExamResult({
      exam_id,
      student_id,
      course_id,
      grade,
      comments,
      status,
    });

    const savedExamResult = await newExamResult.save();
    res.status(201).json({
      message: "Exam result created successfully",
      exam_result: savedExamResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating exam result", error });
  }
};

// Obtenir tous les résultats d'examen
export const getAllExamResults = async (req: Request, res: Response) => {
  try {
    const examResults = await ExamResult.find()
      .populate("exam_id")
      .populate("student_id")
      .populate("course_id");
    res.status(200).json(examResults);
  } catch (error) {
    console.error("Error fetching exam results:", error);
    res.status(500).json({
      message: "Error fetching exam results",
      error: error, // Ajout de plus d'informations sur l'erreur
    });
  }
};

// Obtenir un résultat d'examen par ID
export const getExamResultById = async (req: Request, res: Response) => {
  try {
    const examResult = await ExamResult.findById(req.params.id).populate(
      "exam_id student_id course_id"
    );
    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    res.status(200).json(examResult);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam result", error });
  }
};

// Mettre à jour un résultat d'examen
export const updateExamResult = async (req: Request, res: Response) => {
  try {
    const updatedExamResult = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedExamResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    res.status(200).json({
      message: "Exam result updated successfully",
      exam_result: updatedExamResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating exam result", error });
  }
};

// Supprimer un résultat d'examen
export const deleteExamResult = async (req: Request, res: Response) => {
  try {
    const deletedExamResult = await ExamResult.findByIdAndDelete(req.params.id);
    if (!deletedExamResult) {
      return res.status(404).json({ message: "Exam result not found" });
    }
    res.status(200).json({ message: "Exam result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam result", error });
  }
};
