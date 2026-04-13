import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;


// import express from "express";
// import Message from "../models/message.model.js";
// import { protectRoute } from "../middleware/auth.js";

// const router = express.Router();

// // GET all messages
// router.get("/", protectRoute, async (req, res) => {
//   try {
//     const messages = await Message.find()
//       .populate("sender", "fullName")
//       .sort({ createdAt: 1 });
//     const formatted = messages.map((msg) => ({
//       _id: msg._id,
//       text: msg.text,
//       username: msg.sender?.fullName || msg.sender?.username || "Unknown",
//       createdAt: msg.createdAt,
//     }));
//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST new message
// router.post("/", protectRoute, async (req, res) => {
//   try {
//     const { text } = req.body;
//     if (!text) return res.status(400).json({ message: "Message text is required" });

//     const message = await Message.create({ sender: req.user._id, text });
//     res.status(201).json({ message });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
