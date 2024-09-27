import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/course.routes";
import Classroom from "./models/Classroom";
import classroomRoutes from "./routes/classroom.routes";

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
app.use("/api", courseRoutes);
app.use("/api", classroomRoutes);

export default app;
