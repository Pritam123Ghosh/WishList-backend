import express from "express";
import { achieveMessage, createMessage, deleteMessage, getAchievedMessages, getAllMessages, getMessage, updateMessage } from "../contorllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router()

router.post("/createMessage", protect, createMessage); // Create a new message
router.get("/getAllMessages", protect, getAllMessages); // Get all messages for the logged-in user
router.get("/getMessage/:id", protect, getMessage); // Get a specific message by ID for the logged-in user
router.put("/updateMessage/:id", protect, updateMessage); // Update a message
router.delete("/deleteMessage/:id", protect, deleteMessage); // Delete a message
router.put("/:id/achieve", achieveMessage);
router.get("/achieved", getAchievedMessages);
export default router;