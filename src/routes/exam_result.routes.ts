import { Router } from 'express';
import {
    createExamResult,
    getAllExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    getAllExam_resultsParentId,
    getAllExam_resultsStudentId
} from '../controllers/exam_result.controller';

const router = Router();

// Route pour créer un nouveau résultat d'examen
router.post('/exam-results', createExamResult);

// Route pour obtenir tous les résultats d'examen
router.get('/exam-results', getAllExamResults);

// Route pour obtenir un résultat d'examen par ID
router.get('/exam-results/:id', getExamResultById);

// Route pour lister tous les événements par parent
router.get("/exam_results-by-user/:student_id", getAllExam_resultsParentId);
// Route pour lister tous les événements par Etudiant
router.get("/exam_results-by-student/:student_id", getAllExam_resultsStudentId);
// Route pour mettre à jour un résultat d'examen
router.put('/exam-results/:id', updateExamResult);

// Route pour supprimer un résultat d'examen
router.delete('/exam-results/:id', deleteExamResult);

export default router;
