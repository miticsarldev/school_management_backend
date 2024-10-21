import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  getCourseById,
  updateCourse,
  getCourseByStudentId
} from "../controllers/course.controller";

const router = Router();

// Créer un cours
router.post("/courses", createCourse);

// Afficher tous les cours
router.get("/courses", getCourses);

// Afficher un cours par ID
router.get("/courses/:id", getCourseById);
// Afficher un cours par StudentID
router.get("/courses-by-student/:student_id", getCourseByStudentId);
// Modifier un cours
router.put("/courses/:id", updateCourse);

// Supprimer un cours
router.delete("/courses/:id", deleteCourse);

export default router;
