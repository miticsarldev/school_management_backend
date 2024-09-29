import { Router } from 'express';
import { createExamSchedule, getAllExamSchedules, getExamScheduleById, updateExamSchedule, deleteExamSchedule } from '../controllers/exam_schedule.controller';

const router = Router();

// Créer un emploi du temps d'examen
router.post('/exam-schedules', createExamSchedule);

// Obtenir tous les emplois du temps d'examen
router.get('/exam-schedules', getAllExamSchedules);

// Obtenir un emploi du temps d'examen par ID
router.get('/exam-schedules/:id', getExamScheduleById);

// Mettre à jour un emploi du temps d'examen
router.put('/exam-schedules/:id', updateExamSchedule);

// Supprimer un emploi du temps d'examen
router.delete('/exam-schedules/:id', deleteExamSchedule);

export default router;
