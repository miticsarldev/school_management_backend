import { Schema } from "mongoose";

export interface IClassroomEtudiant extends Document {
  _id?: Schema.Types.ObjectId;
  classroom_id?: Schema.Types.ObjectId;
  student_id?: Schema.Types.ObjectId;
}