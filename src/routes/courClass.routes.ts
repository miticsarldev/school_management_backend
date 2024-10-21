import express from "express";
import * as courClasseController from "../controllers/cour_classe.controller";

const router = express.Router();

router.post("/cour-classe", courClasseController.createCourClasse);
router.get("/cour-classe", courClasseController.getAllCourClasses);
router.put("/cour-classe/:id", courClasseController.updateCourClasse);
router.delete("/cour-classe/:id", courClasseController.deleteCourClasse);
export default router;
