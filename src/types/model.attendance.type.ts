import { Schema, Document } from 'mongoose';

// Interface pour le modèle Attendance
export interface IAttendance extends Document {
    student_id?: Schema.Types.ObjectId; // Référence à un étudiant (User)
    teacher_id?: Schema.Types.ObjectId; // Référence à un professeur (User)
    timetable_id: Schema.Types.ObjectId; // Référence à TimeTable pour le cours en question
    status: boolean; // Présent ou absent
    desc?: string; // Notes supplémentaires sur la présence
    date: Date; // Date de la présence
}