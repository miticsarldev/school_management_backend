import { Schema, model } from 'mongoose';
import { IExam_Schedule } from '../types/model.exam_schedule.type';

// Schéma pour le modèle Exam_Schedule
const ExamScheduleSchema = new Schema<IExam_Schedule>({
    exam_id: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',  // Référence au modèle Exam
        required: true
    },
    classroom_id: {
        type: Schema.Types.ObjectId,
        ref: 'Classroom', // Référence au modèle Classe
        required: true
    }
}, {
    timestamps: true  // Ajoute createdAt et updatedAt automatiquement
});

// Modèle Mongoose pour l'emploi du temps d'examen
const ExamSchedule = model<IExam_Schedule>('ExamSchedule', ExamScheduleSchema);

export default ExamSchedule;
