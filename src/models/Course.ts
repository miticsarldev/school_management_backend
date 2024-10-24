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
    ref: "User", // Référence au prof
    required: true,
  },
  id_grade: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  id_classroom_etudiant: {
    type: Schema.Types.ObjectId,
    ref: "ClassroomEtudiant", // Référence à la classe
    required: true,
  },
  statuses: {
    type: String,
      enum: ["Completed", "Inprogress", "Incompleted"],
      default: "Inprogress",
  },
},
{
  timestamps: true,
});

const Course = model("Course", CourseSchema);
export default Course;
