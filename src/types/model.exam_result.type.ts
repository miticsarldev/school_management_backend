import { Document, Schema } from 'mongoose';
import { IUser } from './model.user.type';
import { ICourse } from './model.course.type';

// Interface pour le modèle Exam_Result
export interface IExam_Result extends Document {
    exam_id: Schema.Types.ObjectId;    // Liaison avec l'examen
    student_id: IUser; // Liaison avec l'étudiant
    course_id: ICourse;  // Liaison avec le cours
    grade: number;                     // Note obtenue
    comments?: string;                 // Commentaires du professeur
    status?: string;                   // Statut (Réussi, Échoué, etc.)
}
