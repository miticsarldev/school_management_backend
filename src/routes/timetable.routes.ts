import { Router } from "express";
import {
  addTimetable,
  getTimetables,
  updateTimetable,
  deleteTimetable,
  getTimetableById,
} from "../controllers/timetable.controller";

const router = Router();

// Route pour ajouter un emploi du temps
router.post("/timetables", addTimetable);

// Route pour récupérer tous les emplois du temps
router.get("/timetables", getTimetables);

// Route pour récupérer un emplois du temps
router.get("timetable/:id", getTimetableById);

// Route pour mettre à jour un emploi du temps
router.put("/timetables/:id", updateTimetable);

// Route pour supprimer un emploi du temps
router.delete("/timetables/:id", deleteTimetable);

export default router;
