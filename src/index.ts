import express, { Express } from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/routes.js";
import http from "http";
import { DATABASE_URL_STR, PORT } from "./config.js";
import cors from "cors";

const app: Express = express();
const port = Number(PORT) || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/v1", userRouter);

async function startApplication() {
  try {
    await mongoose.connect(DATABASE_URL_STR);
    console.log("Successfully connected to the Database!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });

    const server = http.createServer(app);
    const gracefulShutdown = async () => {
      console.log("Shutting down...");
      await mongoose.connection.close();
      console.log("✅ DataBase connection closed");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (e) {
    console.error("Error Starting Application:", e);
  }
}

startApplication();
