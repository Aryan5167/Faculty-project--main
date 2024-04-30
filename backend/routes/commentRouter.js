// Import necessary modules and models
import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { ApplicationNew } from "../models/ApplicationNewSchema";
import { Comment } from "../models/commentSchema";

const router = express.Router();


// Route to get comments for a specific application
router.get("/getCommentsByApplication/:applicationId", isAuthenticated, async (req, res) => {
  try {
    const comments = await Comment.find({ applicationId: req.params.applicationId });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

export default router;
