import { model, Schema } from "mongoose";

// Schema Classroom
const ClassroomEtudiantSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: "User", // Référence à l'etudiant
        required: true,
      },
      classroom_id: {
        type: Schema.Types.ObjectId,
        ref: "Classroom", // Référence à la classe
        required: true,
      },
});

const ClassroomEtudiant = model("ClassroomEtudiant", ClassroomEtudiantSchema);
export default ClassroomEtudiant;