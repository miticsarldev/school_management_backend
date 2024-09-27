import { Router } from 'express';
import { addHomework, updateHomework, deleteHomework, getHomeworks } from '../controllers/homeworkController';

const router = Router();

router.post('/homework', addHomework);
router.get('/homework', getHomeworks);
router.put('/homework/:id', updateHomework);
router.delete('/homework/:id', deleteHomework);

export default router;
