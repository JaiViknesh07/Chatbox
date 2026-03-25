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
    origin: "http://localhost:5173", methods: ["GET", "POST"]
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoute);
app.use("/api/messages", MessageRoute);

// socketio Logic
initSocket(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB Connected successfully`);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error.message));
