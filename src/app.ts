import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import exam_typeRoutes from "./routes/exam_type.routes";
import tuitionFeeRoutes from "./routes/tuition_fee.routes";
import eventRoutes from "./routes/event.routes";
import leaveRoutes from "./routes/leave.routes";
import payrollRoutes from "./routes/payroll.routes";
import timetableRoute from "./routes/timetable.routes";
import courseRoutes from "./routes/course.routes";
import classroomRoutes from "./routes/classroom.routes";
import gradeRoutes from "./routes/grade.routes";
import attendanceRoutes from "./routes/attendance.routes";
import homeworkRoute from "./routes/homework.routes";
import examRoutes from "./routes/exam.routes";
import examResultRoutes from "./routes/exam_result.routes";
import schoolRoutes from "./routes/school.routes";
import examSheduleRoutes from "./routes/exam_shedule.routes";

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

//routes pour exam_type
app.use("/api", exam_typeRoutes);

//routes pour exam
app.use("/api/exams", examRoutes);

//routes pour exam_result
app.use("/api", examResultRoutes);

//routes pour school
app.use("/api", schoolRoutes);

//routes pour exam shedule
app.use("/api", examSheduleRoutes);

export default app;
