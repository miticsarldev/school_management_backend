import { Schema } from "mongoose";

export interface IClassroom extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  capacity: number;
  statuses: boolean;
}