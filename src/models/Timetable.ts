import { Schema, model } from "mongoose";
import { ITimetable } from "../types/model.timetable.type";

// Définir le schéma de l'emploi du temps
const TimetableSchema = new Schema<ITimetable>({
    cours_id: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: "Course" // Référence à la collection cours
    },
    id_users: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" // Référence à l'utilisateur
    },  
    classroom_id: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: "Classroom" // Référence à la salle de classe
    },  
    day: { 
        type: Date, 
        required: true 
    },  
    start_time: { 
        type: Date, 
        required: true 
    },  
    end_time: { 
        type: Date, 
        required: true 
    }, 
});

// Créer le modèle Mongoose pour l'emploi du temps
const Timetable = model<ITimetable>("Timetable", TimetableSchema);

export default Timetable;
