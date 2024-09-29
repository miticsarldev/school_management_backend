import { Router } from "express";
import { createLeave, getAllLeaves, updateLeave, deleteLeave } from "../controllers/leaveController";

const router = Router();

// Route pour créer une nouvelle demande de congé ou absence
router.post("/leaves", createLeave);

// Route pour récupérer toutes les demandes de congé ou absence
router.get("/leaves", getAllLeaves);

// Route pour mettre à jour une demande de congé ou absence existante
router.put("/leaves/:id", updateLeave);

// Route pour supprimer une demande de congé ou absence
router.delete("/leaves/:id", deleteLeave);

export default router;
