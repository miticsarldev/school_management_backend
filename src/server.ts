import mongoose, { ConnectOptions } from "mongoose";
import exam_typeRoutes from "./routes/exam_typeRoutes";
import examRoutes from "./routes/examRoutes";
import { config } from "dotenv";
config();

import app from "./app";

//routes pour exam_type
app.use('/api',exam_typeRoutes)

//routes pour exam 
app.use('/api/exams', examRoutes);

const PORT = process.env.PORT || 4444;

type ConnectionOptionsExtend = {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
};

const options: ConnectOptions & ConnectionOptionsExtend = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
