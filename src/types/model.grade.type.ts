import { Schema } from "mongoose";

export interface IGrade extends Document {
  _id: Schema.Types.ObjectId;
  value: number;
  appreciation: string;
  statuses: boolean;
}
