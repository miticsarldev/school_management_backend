import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import tuitionFeeRoutes from "./routes/tuitionFeeRoutes";
import eventRoutes from "./routes/eventRoutes";
import leaveRoutes from "./routes/leaveRoutes";

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
export default app;
