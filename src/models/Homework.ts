import { Schema, model} from 'mongoose';
import { IHomework } from '../types/model.homework.type';

const homeworkSchema = new Schema<IHomework>({
  classe_id: {
    type: Schema.Types.ObjectId,
    required: true 
    },
  cours_id: {
    type: Schema.Types.ObjectId,
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
});

export const HomeworkModel = model<IHomework>('Homework', homeworkSchema);
