import { Router } from "express";
import {
  createClassroomEtudiant,
  deleteClassroomEtudiant,
  getClassroomEtudiants,
  getClassroomEtudiantById,
  updateClassroomEtudiant
} from "../controllers/classroom_etudiant.controller";

const router = Router();

// Ajouter une classroomEtudiant
router.post("/classroom_etudiants", createClassroomEtudiant);

// Afficher toutes les classroomEtudiants
router.get("/classroom_etudiants", getClassroomEtudiants);

// Afficher une classroomEtudiant par ID
router.get("/classroom_etudiants/:id", getClassroomEtudiantById);

// Modifier une classroomEtudiant
router.put("/classroom_etudiants/:id", updateClassroomEtudiant);

// Supprimer une classroomEtudiant
router.delete("/classroom_etudiants/:id", deleteClassroomEtudiant);

export default router;