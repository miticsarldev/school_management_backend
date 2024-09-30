import { Schema, Document } from "mongoose";

export interface ILeave extends Document {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId; // Référence à l'utilisateur
  timetable_id: Schema.Types.ObjectId; // Référence à l'emploi du temps
  exam_id: Schema.Types.ObjectId; // Référence à l'examen
  status: boolean; // Statut de la demande (approuvée ou non)
  date: Date; // Date de la demande
  type: string; // Type de congé ou absence
}
