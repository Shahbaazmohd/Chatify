import Message from "../models/message.model.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    // Stub implementation
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).populate("senderId", "fullName profilePic");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
