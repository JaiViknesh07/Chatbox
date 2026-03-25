import express from "express";
import Message from "../models/MessageModel.js";
import auth from "../middleware/Auth.js";

const router = express();

// Get messages between two Users
router.get("/:receiver", auth, async (req, res) => {
  const { receiver } = req.params;
  const sender = req.user.username;
  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// Send mesage to a specific User
router.post("/", auth, async (req, res) => {
  const { text, receiver } = req.body;
  const message = await Message.create({
    sender: req.user.username,
    text,
    receiver,
  });
  res.json(message);
});
export default router;
