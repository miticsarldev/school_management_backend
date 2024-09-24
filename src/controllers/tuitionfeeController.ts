import { Request, Response } from "express";
import TuitionFee from "../models/TuitionFee";
import { ITuitionFee } from "../types/model.tuitionfee.type";

// Créer un nouveau paiement de frais de scolarité
export const createTuitionFee = async (req: Request, res: Response) => {
  try {
    const tuitionFee: ITuitionFee = new TuitionFee(req.body);
    await tuitionFee.save();
    res.status(201).json(tuitionFee);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Une erreur inconnue est survenue" });
    }
  }
};

// Obtenir tous les paiements de frais de scolarité
export const getAllTuitionFees = async (req: Request, res: Response) => {
  try {
    const tuitionFees = await TuitionFee.find().populate("student_id classroom_id");
    res.status(200).json(tuitionFees);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Une erreur inconnue est survenue" });
    }
  }
};

// Obtenir un paiement de frais de scolarité par ID
export const getTuitionFeeById = async (req: Request, res: Response) => {
  try {
    const tuitionFee = await TuitionFee.findById(req.params.id).populate("student_id classroom_id");
    if (!tuitionFee) {
      return res.status(404).json({ message: "Tuition fee not found" });
    }
    res.status(200).json(tuitionFee);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Une erreur inconnue est survenue" });
    }
  }
};

// Mettre à jour un paiement de frais de scolarité
export const updateTuitionFee = async (req: Request, res: Response) => {
  try {
    const tuitionFee = await TuitionFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tuitionFee) {
      return res.status(404).json({ message: "Tuition fee not found" });
    }
    res.status(200).json(tuitionFee);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Une erreur inconnue est survenue" });
    }
  }
};

// Supprimer un paiement de frais de scolarité
export const deleteTuitionFee = async (req: Request, res: Response) => {
  try {
    const tuitionFee = await TuitionFee.findByIdAndDelete(req.params.id);
    if (!tuitionFee) {
      return res.status(404).json({ message: "Tuition fee not found" });
    }
    res.status(204).send(); // No Content
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Une erreur inconnue est survenue" });
    }
  }
};
