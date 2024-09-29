import { Document, Schema } from 'mongoose';

// Interface pour le modèle Exam_Schedule
export interface IExam_Schedule extends Document {
    exam_id: Schema.Types.ObjectId;  // Référence à l'examen
    classroom_id: Schema.Types.ObjectId; // Référence à la classe
}
