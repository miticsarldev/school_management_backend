import { model, Schema } from "mongoose";

// Schema Grade
const GradeSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  appreciation: {
    type: String,
    trim: true,
  },
  statuses: {
    type: Boolean,
    default: true,
  },
});

const Grade = model("Grade", GradeSchema);
export default Grade;
