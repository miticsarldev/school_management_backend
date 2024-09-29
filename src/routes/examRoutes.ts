import express from 'express';
import { addExam, getExams, getExamById, updateExam, deleteExam } from '../controllers/exam.controller';

const router = express.Router();

// Route pour ajouter un examen
router.post('/', addExam);

// Route pour récupérer tous les examens
router.get('/', getExams);

// Route pour récupérer un examen par ID
router.get('/:id', getExamById);

// Route pour modifier un examen
router.put('/:id', updateExam);

// Route pour supprimer un examen
router.delete('/:id', deleteExam);

export default router;
