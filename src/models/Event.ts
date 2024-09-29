import { Schema, model } from "mongoose";
import { IEvent } from "../types/model.event.types";

// Schéma des événements
const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  place: {
    type: String,
    required: true,
    trim: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
  start_hour: {
    type: Date,
    required: true,
  },
  end_hour: {
    type: Date,
    required: true,
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "User", // Référence à l'étudiant
    required: true,
  },
  timetable_id: {
    type: Schema.Types.ObjectId,
    ref: "Timetable", // Référence à l'emploi du temps
    required: true,
  },
}, {
  timestamps: true, // Pour ajouter createdAt et updatedAt
});

const Event = model<IEvent>("Event", EventSchema);
export default Event;
