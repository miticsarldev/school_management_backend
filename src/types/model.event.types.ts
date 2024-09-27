import { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  type: string;
  desc: string;
  place: string;
  start_date: Date;
  end_date: Date;
  status: boolean;
  start_hour: Date;
  end_hour: Date;
  student_id: Schema.Types.ObjectId; // Référence à l'étudiant
  timetable_id: Schema.Types.ObjectId; // Référence à l'emploi du temps
}
