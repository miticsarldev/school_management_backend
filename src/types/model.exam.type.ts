import { Document, Schema } from 'mongoose';

// Interface pour le modèle Exam
export interface IExam extends Document {
    exam_type_id: Schema.Types.ObjectId; // ID du type d'examen (référence à Exam_Type)
    name: string; // Nom de l'examen
    date: Date; // Date de l'examen
    start_time: string; // Heure de début de l'examen (format: HH:mm:ss)
    end_time: string; // Heure de fin de l'examen (format: HH:mm:ss)
}
