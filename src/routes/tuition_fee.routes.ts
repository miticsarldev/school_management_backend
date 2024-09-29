import { Router } from "express";
import {
  createTuitionFee,
  getAllTuitionFees,
  getTuitionFeeById,
  updateTuitionFee,
  deleteTuitionFee,
} from "../controllers/tuitionfee.controller";

const router = Router();

// Route pour créer un paiement de frais de scolarité
router.post("/tuition-fees", createTuitionFee);

// Route pour obtenir tous les paiements de frais de scolarité
router.get("/tuition-fees", getAllTuitionFees);

// Route pour obtenir un paiement de frais de scolarité par ID
router.get("/tuition-fees:id", getTuitionFeeById);

// Route pour mettre à jour un paiement de frais de scolarité
router.put("/tuition-fees:id", updateTuitionFee);

// Route pour supprimer un paiement de frais de scolarité
router.delete("/tuition-fees:id", deleteTuitionFee);

export default router;
