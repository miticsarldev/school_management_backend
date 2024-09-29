import { Document, Schema } from 'mongoose';

// interfaces/homework.interface.ts
export interface IHomework extends Document {
  classe_id: Schema.Types.ObjectId;
  cours_id: Schema.Types.ObjectId;
  homework_date: Date;
  submission_date: Date;
  status: boolean;
}
