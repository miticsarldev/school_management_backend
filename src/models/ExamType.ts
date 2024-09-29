import { Schema, model } from 'mongoose';
import { IExam_Type } from '../types/model.exam_type.type';

// Schéma pour le modèle Exam_Type
const ExamTypeSchema = new Schema<IExam_Type>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true,
    },
});

// Modèle Mongoose pour le type d'examen
const ExamType = model<IExam_Type>('ExamType', ExamTypeSchema);

export default ExamType;
