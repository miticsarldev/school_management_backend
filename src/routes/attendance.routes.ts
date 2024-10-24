import express from 'express';
import {
    createAttendance,
    updateAttendance,
    getAttendanceByTimeTable,
    exportAttendanceToCSV,
    getAttendanceByUser,
    getAllAttendancesParentId,
    getAllAttendances,
    deleteAttendance,
    getAttendanceStats,
    getAttendancesByUserId
} from '../controllers/attendance.controller';

const router = express.Router();

// Enregistrer une nouvelle présence
router.post('/attendances', createAttendance);

// Mettre à jour une présence existante
router.put('/attendances/:id', updateAttendance);
// Route pour lister tous les événements par parent
router.get("/attendances-by-parent/:parent_id", getAllAttendancesParentId);
// Récupérer les présences par emploi du temps
router.get('/attendances/timetable/:timetable_id', getAttendanceByTimeTable);

// Exporter les présences pour un emploi du temps spécifique au format CSV
router.get('/attendances/export/:timetable_id', exportAttendanceToCSV);

// Récupérer les présences pour un utilisateur spécifique (étudiant)

router.get('/attendances/user/:user_id', getAttendancesByUserId);
// Route pour obtenir toutes les attendances 
router.get("/attendances", getAllAttendances);
// Route pour supprimer une attendance 
router.delete("/attendances/:id", deleteAttendance);

router.get('/attendance/user/:user_id', getAttendanceByUser);

// Route pour obtenir les statistiques de présence
// router.get('/attendance/stats', getAttendanceStats);

// Route pour obtenir toutes les attendances 
router.get("/attendances", getAllAttendances);
export default router;
