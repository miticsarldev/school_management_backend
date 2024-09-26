import { Document, Schema } from 'mongoose';

// Interface pour le modèle Exam_Result
export interface IExam_Result extends Document {
    exam_id: Schema.Types.ObjectId;    // Liaison avec l'examen
    student_id: Schema.Types.ObjectId; // Liaison avec l'étudiant
    course_id: Schema.Types.ObjectId;  // Liaison avec le cours
    grade: string;                     // Note obtenue
    comments?: string;                 // Commentaires du professeur
    status?: string;                   // Statut (Réussi, Échoué, etc.)
}
