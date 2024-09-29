import { Router } from "express";
import {
  createPayroll,
  getPayrollById,
  getAllPayrolls,
  updatePayroll,
  deletePayroll,
} from "../controllers/payroll.controller";

const router = Router();

// Route pour créer un paiement
router.post("/payrolls", createPayroll);

router.get("/payrolls/:id", getPayrollById); //récupérer un paiement par ID

// Route pour récupérer tous les paiements
router.get("/payrolls", getAllPayrolls);

// Route pour mettre à jour un paiement
router.put("/payrolls/:id", updatePayroll);

// Route pour supprimer un paiement
router.delete("/payrolls/:id", deletePayroll);

export default router;
