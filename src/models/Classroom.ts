import { required } from "joi";
import { model, Schema } from "mongoose";

// Schema Classroom
const ClassroomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      statuses: {
        type: Boolean,
        default: true,
      },
});

const Classroom = model("Classroom", ClassroomSchema);
export default Classroom;
