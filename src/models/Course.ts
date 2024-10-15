import { model, Schema } from "mongoose";

// Schema Course
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  number_of_hours: {
    type: Number, 
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  id_grade: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  id_classroom: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  statuses: {
    type: Boolean,
    default: true,
  },
});

const Course = model("Course", CourseSchema);
export default Course;
