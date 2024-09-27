import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import exam_typeRoutes from "./routes/exam_typeRoutes";
import examRoutes from "./routes/examRoutes";
import examResultRoutes from "./routes/exam_resultRoutes";
import schoolRoutes from "./routes/schoolRoutes";

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

//routes pour exam_type
app.use('/api',exam_typeRoutes)

//routes pour exam 
app.use('/api/exams', examRoutes);

//routes pour exam_result
app.use('/api',examResultRoutes);

//routes pour school
app.use('/api',schoolRoutes);

export default app;
