import { Document, Schema } from 'mongoose';

// interfaces/homework.interface.ts
export interface IHomework extends Document {
  classroom_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  name: string;
  homework_date: Date;
  submission_date: Date;
  status: boolean;
}
