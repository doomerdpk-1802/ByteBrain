import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from ByteBrain App!");
});

async function startApplication() {
  try {
    if (!process.env.DATABASE_URL_TEST) {
      throw new Error("Error fetching DATABASE URL from environment variables");
    }

    await mongoose.connect(process.env.DATABASE_URL_TEST);
    console.log("Successfully connected to the Database!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  } catch (e) {
    console.error("Error Starting Application:", e);
  }
}

startApplication();

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
