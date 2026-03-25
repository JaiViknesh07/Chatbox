import express from "express";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from '../middleware/Auth.js';

const router = express.Router();

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");
    res.json(users);
  } catch (error) {
    console.log("Users error", error);
    res.status(500).json({ message: error.message });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "User already exists!" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    res.status(200).json({token, username})
  } catch (error) {
    console.log("Login Error", error);
    res.status(500).json({ message: error });
  }
});

export default router;