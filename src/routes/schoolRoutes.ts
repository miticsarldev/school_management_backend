import { Router } from 'express';
import {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
} from '../controllers/school.controller';

const router = Router();

// Route pour créer une école
router.post('/schools', createSchool);

// Route pour récupérer toutes les écoles
router.get('/schools', getAllSchools);

// Route pour récupérer une école par ID
router.get('/schools/:id', getSchoolById);

// Route pour mettre à jour une école
router.put('/schools/:id', updateSchool);

// Route pour supprimer une école
router.delete('/schools/:id', deleteSchool);

export default router;
