// routes/exam.routes.ts
import express from 'express';
import { addExam, updateExam, deleteExam } from '../controllers/exam.controller';

const router = express.Router();

// Route pour ajouter un examen
router.post('/', addExam);

// Route pour modifier un examen
router.put('/:id', updateExam);

// Route pour supprimer un examen
router.delete('/:id', deleteExam);

export default router;
