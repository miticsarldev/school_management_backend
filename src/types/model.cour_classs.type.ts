import { Schema, Document } from "mongoose";

// Interface pour la table intermédiaire cour_classe
export interface ICourseClass extends Document {
  id_course: Schema.Types.ObjectId; // Référence à l'identifiant du cours
  id_class: Schema.Types.ObjectId; // Référence à l'identifiant de la classe
}

// Définition du schéma pour cour_classe
const CourseClassSchema = new Schema<ICourseClass>({
  id_course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  id_class: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
});
