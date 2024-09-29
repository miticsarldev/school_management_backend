import { Schema, model } from 'mongoose';
import { IExam } from '../types/model.exam.type';

// Schéma pour le modèle Exam
const ExamSchema = new Schema<IExam>({
    exam_type_id: {
        type: Schema.Types.ObjectId,
        ref: 'ExamType', // Référence au modèle ExamType
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    start_time: {
        type: String,
        required: true, // ou type: Date, selon le format souhaité
    },
    end_time: {
        type: String,
        required: true, // ou type: Date, selon le format souhaité
    },
});

// Modèle Mongoose pour l'examen
const Exam = model<IExam>('Exam', ExamSchema);

export default Exam;
