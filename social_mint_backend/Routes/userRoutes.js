import express from "express";
import User from "../Models/User.js";

const router = express.Router();

// Create User
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all Users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// READ single User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("updated", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
