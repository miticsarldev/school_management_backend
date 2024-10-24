import { Schema, model } from "mongoose";
import { ILeave } from "../types/model.leave.type";

// Schéma des congés et absences
const LeaveSchema = new Schema<ILeave>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User", // Référence à l'utilisateur
    required: true,
  },
  timetable_id: {
    type: Schema.Types.ObjectId,
    ref: "Timetable", // Référence à l'emploi du temps
    required: true,
  },
  exam_id: {
    type: Schema.Types.ObjectId,
    ref: "Exam", // Référence à l'examen
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "validate","cancel"],
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["congé", "absence","medical"], // Enum pour définir le type de demande
  },
}, {
  timestamps: true, // Pour ajouter createdAt et updatedAt automatiquement
});

const Leave = model<ILeave>("Leave", LeaveSchema);
export default Leave;
