import { Request, Response } from "express";
import { Payroll } from "../models/Payroll";

// Créer un nouveau paiement
export const createPayroll = async (req: Request, res: Response) => {
  try {
    const { id_users, montant, statut } = req.body;

    // Créer un nouveau paiement
    const payroll = new Payroll({ id_users, montant, statut });
    const savedPayroll = await payroll.save();
    res.status(201).json(savedPayroll);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Erreur lors de l'ajout du paiement", err });
  }
};

// Récupérer un paiement par son ID
export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID de paiement est fourni
    if (!id) {
      return res.status(400).json({ message: "ID de paiement manquant" });
    }

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du paiement", error });
  }
};

// Récupérer tous les paiements
export const getAllPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await Payroll.find();
    res.status(200).json(payrolls);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des paiements", error });
  }
};

// Mettre à jour un paiement
export const updatePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { montant, statut } = req.body;

    // Mettre à jour le paiement
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { montant, statut },
      { new: true }
    );
    if (!payroll) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du paiement", error });
  }
};

// Supprimer un paiement
export const deletePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Supprimer le paiement
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.status(200).json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du paiement", error });
  }
};
