import { Router } from "express";
import {
  addHomework,
  updateHomework,
  deleteHomework,
  getHomeworks,
  getHomeworkById,
  getAllHomeworksParentId,
} from "../controllers/homework.controller";

const router = Router();
// Route pour créer un Homework
router.post("/homeworks", addHomework);
router.get("/homeworks/:id", getHomeworkById);
router.get("/homeworks", getHomeworks);
// Route pour lister tous les devoirs par parent
router.get("/homeworks-by-parent/:parentId", getAllHomeworksParentId);
router.put("/homeworks/:id", updateHomework);
router.delete("/homeworks/:id", deleteHomework);

export default router;
