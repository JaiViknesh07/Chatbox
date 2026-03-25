import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import AuthRoute from "./routes/AuthRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import mongoose from "mongoose";
import { initSocket } from "./socket/socket.js";

configDotenv();

const app = express();
const server = http.createServer(app);

// Initialize socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoute);
app.use("/api/messages", MessageRoute);

// socketio Logic
initSocket(io);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully");

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
  }
}

startServer();
