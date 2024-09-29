import { Document } from 'mongoose';

// Interface pour le modèle Exam_Type
export interface IExam_Type extends Document {
    name: string; // Nom du type d'examen (ex: Examen final, Interrogation)
    desc?: string; // Description supplémentaire du type d'examen
}
