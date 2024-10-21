import { Schema, model} from 'mongoose';
import { IHomework } from '../types/model.homework.type';

const homeworkSchema = new Schema<IHomework>({
  classroom_id: {
    type: Schema.Types.ObjectId,
    ref: "Classroom",
    required: true 
    },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true 
    },
  name: {
      type: String, 
      required: true 
      },
  homework_date: {
    type: Date, 
    required: true 
    },
  submission_date: {
    type: Date, 
    required: true 
    },
  status: {
    type: Boolean,
    default: false 
    },
},
{
  timestamps: true,
});

export const Homework = model<IHomework>('Homework', homeworkSchema);
