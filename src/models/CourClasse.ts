import { Schema, model, Document } from "mongoose";

export interface ICourClasse extends Document {
  id_cours: Schema.Types.ObjectId; // Référence au cours
  id_classe: Schema.Types.ObjectId; // Référence à la classe
}

const CourClasseSchema = new Schema<ICourClasse>({
  id_cours: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  id_classe: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
});

export const CourClasse = model<ICourClasse>("CourClasse", CourClasseSchema);
