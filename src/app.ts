import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import exam_typeRoutes from "./routes/exam_typeRoutes";
import tuitionFeeRoutes from "./routes/tuitionFeeRoutes";
import eventRoutes from "./routes/eventRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import payrollRoutes from "./routes/PayrollRoutes";
import timetableRoute from "./routes/timetableRoute";
import courseRoutes from "./routes/course.routes";
import classroomRoutes from "./routes/classroom.routes";
import gradeRoutes from "./routes/grade.routes";
import attendanceRoutes from "./routes/attendanceRoutes";
import homeworkRoute from "./routes/homeworkRoute";
import examRoutes from "./routes/examRoutes";
import examResultRoutes from "./routes/exam_resultRoutes";

const app = express();

// Middleware for the CORS
// Allowing all origins
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Routes
app.use("/api", authRoutes);
// Utilisation des routes
app.use("/api", tuitionFeeRoutes);
// Utilisation des routes d'événements
app.use("/api", eventRoutes);
// Utilisation des routes pour les demandes de congés et absences
app.use("/api", leaveRoutes);
app.use("/api", payrollRoutes);
app.use("/api", timetableRoute);
app.use("/api", courseRoutes);
app.use("/api", classroomRoutes);
app.use("/api", gradeRoutes);

//routes pour attendance
app.use("/api", attendanceRoutes);
app.use("/api", homeworkRoute);

//routes pour exam_type
app.use("/api", exam_typeRoutes);

//routes pour exam_type
app.use("/api", exam_typeRoutes);

//routes pour exam
app.use("/api/exams", examRoutes);

//routes pour exam_type
app.use("/api", exam_typeRoutes);

//routes pour exam
app.use("/api/exams", examRoutes);

//routes pour exam_result
app.use("/api", examResultRoutes);

export default app;
