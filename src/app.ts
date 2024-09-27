import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import attendanceRoutes from './routes/attendanceRoutes';


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

//routes pour attendance
app.use('/api',attendanceRoutes)

export default app;
