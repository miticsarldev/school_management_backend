import { Router } from "express";
import {
  createGrade,
  deleteGrade,
  getGrades,
  getGradeById,
  updateGrade
} from "../controllers/grade.controller";

const router = Router();

// Ajouter une note
router.post("/grades", createGrade);

// Afficher toutes les notes
router.get("/grades", getGrades);

// Afficher une note par ID
router.get("/grades/:id", getGradeById);

// Modifier une note
router.put("/grades/:id", updateGrade);

// Supprimer une note
router.delete("/grades/:id", deleteGrade);

export default router;
