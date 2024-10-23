import { Router } from "express";
import {
  createTuitionFee,
  getAllTuitionFees,
  getTuitionFeeById,
  updateTuitionFee,
  deleteTuitionFee,
  getAllTuitionFeesParentId,
  getTuitionFeesByStudentId,
} from "../controllers/tuitionfee.controller";

const router = Router();

// Route pour créer un paiement de frais de scolarité
router.post("/tuition-fees", createTuitionFee);

// Route pour obtenir tous les paiements de frais de scolarité
router.get("/tuition-fees", getAllTuitionFees);

// Route pour obtenir un paiement de frais de scolarité par ID
router.get("/tuition-fees/:id", getTuitionFeeById);
// Route pour obtenir un paiement de frais de scolarité par ID
router.get("/tuition-fees-by-parent/:parentId", getAllTuitionFeesParentId);
// Route pour mettre à jour un paiement de frais de scolarité
router.put("/tuition-fees/:id", updateTuitionFee);

// Route pour supprimer un paiement de frais de scolarité
router.delete("/tuition-fees/:id", deleteTuitionFee);

// Route pour récupérer les frais d'un étudiant
router.get("/tuition-fees/student/:studentId", getTuitionFeesByStudentId);

export default router;
