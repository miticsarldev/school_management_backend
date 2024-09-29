import { Router } from 'express';
import { addHomework, updateHomework, deleteHomework, getHomeworks, getHomeworkById } from '../controllers/homeworkController';

const router = Router();
// Route pour créer un Homework
router.post('/homework', addHomework);
router.get('/homework/:id', getHomeworkById);
router.get('/homework', getHomeworks);
router.put('/homework/:id', updateHomework);
router.delete('/homework/:id', deleteHomework);

export default router;
