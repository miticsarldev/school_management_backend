import { Request, Response } from "express";
import TuitionFee from "../models/TuitionFee";
import { ITuitionFee } from "../types/model.tuitionfee.type";
import mongoose from "mongoose";
import ClassroomEtudiant from "../models/ClassroomEtudiant";
import User from "../models/User";

// Créer un nouveau paiement de frais de scolarité
export const createTuitionFee = async (req: Request, res: Response) => {
  try {
    const tuitionFee: ITuitionFee = new TuitionFee(req.body);

    // Calculer le solde initial à partir du montant et du discount
    tuitionFee.balance = tuitionFee.amount - tuitionFee.discount;

    // Si un montant payé (paidAmount) est présent, mettre à jour le statut et le solde
    if (req.body.paidAmount) {
      tuitionFee.updatePaymentStatus(req.body.paidAmount);
    }

    // Enregistrer le frais dans la base de données
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
    const tuitionFees = await TuitionFee.find().populate("student_id").populate("classroom_id");
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

export const getAllTuitionFeesParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.parentId; // Récupérer l'ID du parent à partir des paramètres de la requête

    // Vérifier si l'ID passé est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "ID du parent invalide." });
    }

    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Récupérer tous les étudiants associés au parent
    const students = await User.find({ parent: parentObjectId, role: "etudiant" });

    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent.", parentId });
    }

    // Récupérer les IDs des étudiants (enfants)
    const studentIds = students.map((student) => student._id);

    // Récupérer les frais associés aux classes des étudiants
    const tuitionFees = await TuitionFee.find({ student_id: { $in: studentIds } })
      .populate('student_id')// Peupler les informations sur l'etudiant
      .populate('classroom_id'); // Peupler les informations sur la classe

    if (tuitionFees.length === 0) {
      return res.status(404).json({ message: "Aucun frais trouvé pour ces etudiants.", parentId });
    }

    // Retourner la liste des frais
    res.status(200).json(tuitionFees);
  } catch (error) {
    console.error("Erreur serveur:", error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Mettre à jour un paiement de frais de scolarité
export const updateTuitionFee = async (req: Request, res: Response) => {
  try {
    // Trouver le frais de scolarité à mettre à jour
    const tuitionFee = await TuitionFee.findById(req.params.id);
    if (!tuitionFee) {
      return res.status(404).json({ message: "Tuition fee not found" });
    }

    // Mettre à jour les champs avec les nouvelles données de req.body
    Object.assign(tuitionFee, req.body);

    // Recalculer le solde si le montant ou le discount change
    tuitionFee.balance = tuitionFee.amount - tuitionFee.discount;

    // Si un montant payé est fourni, mettre à jour le statut et le solde
    if (req.body.paidAmount) {
      tuitionFee.updatePaymentStatus(req.body.paidAmount);
    }

    // Enregistrer les modifications dans la base de données
    await tuitionFee.save();

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

// Récupérer tous les frais de scolarité d'un étudiant spécifique par son ID
export const getTuitionFeesByStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId; // ID de l'étudiant

    // Vérifier si l'ID passé est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "ID de l'étudiant invalide." });
    }

    // Récupérer les frais de scolarité de l'étudiant
    const tuitionFees = await TuitionFee.find({ student_id: studentId })
      .populate("student_id") // Peupler les informations sur l'étudiant
      .populate("classroom_id"); // Peupler les informations sur la classe

    // Vérifier si des frais ont été trouvés pour cet étudiant
    if (tuitionFees.length === 0) {
      return res.status(404).json({ message: "Aucun frais trouvé pour cet étudiant." });
    }

    // Retourner la liste des frais
    res.status(200).json(tuitionFees);
  } catch (error: unknown) {
    console.error("Erreur serveur:", error); // Pour diagnostiquer les erreurs
    res.status(500).json({ message: "Erreur serveur." });
  }
};