import { Router } from "express";
import {
  createClassroom,
  deleteClassroom,
  getClassrooms,
  getClassroomById,
  updateClassroom
} from "../controllers/classroom.controller";

const router = Router();

// Ajouter une classroom
router.post("/classrooms", createClassroom);

// Afficher toutes les classrooms
router.get("/classrooms", getClassrooms);

// Afficher une classroom par ID
router.get("/classrooms/:id", getClassroomById);

// Modifier une classroom
router.put("/classrooms/:id", updateClassroom);

// Supprimer une classroom
router.delete("/classrooms/:id", deleteClassroom);

export default router;
