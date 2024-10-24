import { Router } from "express";
import {
  createLeave,
  getAllLeaves,
  updateLeave,
  deleteLeave,
  getAllLeavesParentId,
  getLeavesByUserId,
} from "../controllers/leave.controller";

const router = Router();

// Route pour créer une nouvelle demande de congé ou absence
router.post("/leaves", createLeave);

// Route pour récupérer toutes les demandes de congé ou absence
router.get("/leaves", getAllLeaves);

// Route pour lister tous les demandes de congé par parent
router.get("/leaves-by-user/:user_id", getAllLeavesParentId);

// Route pour mettre à jour une demande de congé ou absence existante
router.put("/leaves/:id", updateLeave);

// Route pour supprimer une demande de congé ou absence
router.delete("/leaves/:id", deleteLeave);

// Route pour lister tous les demandes de congé par user
router.get("/leaves-user/:user_id", getLeavesByUserId);

export default router;
