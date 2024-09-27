import mongoose from "mongoose";
import { config } from "dotenv";
import tuitionFeeRoutes from "./routes/tuitionFeeRoutes";
import app from "./app";

// Charger les variables d'environnement
config();

// Utilisation des routes
app.use("/api/tuition-fees", tuitionFeeRoutes);

// Configurer le port
const PORT = process.env.PORT || 4444;

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    
    // Démarrer le serveur uniquement après la connexion réussie à MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);  // Fermer l'application en cas d'échec de connexion
  });
