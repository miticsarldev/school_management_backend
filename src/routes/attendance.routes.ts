import express from 'express';
import {
    createAttendance,
    updateAttendance,
    getAttendanceByTimeTable,
    exportAttendanceToCSV,
    getAttendanceByUser,
    getAttendanceStats,
    getAllAttendances
} from '../controllers/attendance.controller';

const router = express.Router();

// Enregistrer une nouvelle présence
router.post('/attendance', createAttendance);

// Mettre à jour une présence existante
router.put('/attendance/:id', updateAttendance);

// Récupérer les présences par emploi du temps
router.get('/attendance/timetable/:timetable_id', getAttendanceByTimeTable);

// Exporter les présences pour un emploi du temps spécifique au format CSV
router.get('/attendance/export/:timetable_id', exportAttendanceToCSV);

// Récupérer les présences pour un utilisateur spécifique (étudiant)
router.get('/attendance/user/:user_id', getAttendanceByUser);

// Route pour obtenir les statistiques de présence
router.get('/attendance/stats', getAttendanceStats);

// Route pour obtenir toutes les attendances 
router.get("/attendances", getAllAttendances);


export default router;
