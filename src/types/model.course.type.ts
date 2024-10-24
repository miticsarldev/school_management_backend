import { Schema } from "mongoose";

export interface ICourse extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  number_of_hours: number;
  description?: string;
  id_user: Schema.Types.ObjectId;
  id_grade: Schema.Types.ObjectId;
  id_classroom_etudiant: Schema.Types.ObjectId;
  statuses?: string;
}
