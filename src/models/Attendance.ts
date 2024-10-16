import { Schema, model } from 'mongoose';
import { IAttendance } from '../types/model.attendance.type';


// Schéma Mongoose pour Attendance
const attendanceSchema = new Schema<IAttendance>(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User pour les étudiants
      required: false,
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User pour les professeurs
      required: false,
    },
    timetable_id: {
      type: Schema.Types.ObjectId,
      ref: 'Timetable', // Référence au modèle TimeTable pour le cours
      required: true,
    },
    status: {
      type: Boolean,
      required: true, // Présence obligatoire
    },
    desc: {
      type: String,
      required: false, // Optionnel
    },
    date: {
      type: Date,
      default: Date.now, // Date par défaut: la date actuelle
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// 3. Modèle Mongoose pour Attendance
const Attendance = model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;
