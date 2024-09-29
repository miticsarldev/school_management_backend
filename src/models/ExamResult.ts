import { Schema, model } from "mongoose";
import { IExam_Result } from "../types/model.exam_result.type";

// Schéma pour le modèle Exam_Result
const ExamResultSchema = new Schema<IExam_Result>(
  {
    exam_id: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Réussi", "Échoué", "Incomplet"],
      default: "Incomplet",
    },
  },
  {
    timestamps: true,
  }
);

// Modèle Mongoose pour les résultats d'examen
const ExamResult = model<IExam_Result>("ExamResult", ExamResultSchema);

export default ExamResult;
