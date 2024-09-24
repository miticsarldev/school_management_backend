// routes/exam_type.routes.ts
import { Router } from "express";
import {
    createExamType,
    getAllExamTypes,
    getExamTypeById,
    updateExamType,
    deleteExamType,
} from "../controllers/exam_type.controller";

const router = Router();

// Route pour créer un type d'examen
router.post("/exam-types", createExamType);

// Route pour récupérer tous les types d'examen
router.get("/exam-types", getAllExamTypes);

// Route pour récupérer un type d'examen par ID
router.get("/exam-types/:id", getExamTypeById);

// Route pour mettre à jour un type d'examen par ID
router.put("/exam-types/:id", updateExamType);


// Route pour supprimer un type d'examen par ID
router.delete("/exam-types/:id", deleteExamType);

export default router;
