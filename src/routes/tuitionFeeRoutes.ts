import { Router } from "express";
import {
  createTuitionFee,
  getAllTuitionFees,
  getTuitionFeeById,
  updateTuitionFee,
  deleteTuitionFee,
} from "../controllers/tuitionfeeController";

const router = Router();

// Route pour créer un paiement de frais de scolarité
router.post("/", createTuitionFee);

// Route pour obtenir tous les paiements de frais de scolarité
router.get("/", getAllTuitionFees);

// Route pour obtenir un paiement de frais de scolarité par ID
router.get("/:id", getTuitionFeeById);

// Route pour mettre à jour un paiement de frais de scolarité
router.put("/:id", updateTuitionFee);

// Route pour supprimer un paiement de frais de scolarité
router.delete("/:id", deleteTuitionFee);

export default router;
