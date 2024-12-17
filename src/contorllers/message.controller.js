import Message from "../model/message.model.js";


export const createMessage = async (req, res) => {
    try {
        const { text } = req.body;

        // Ensure user is logged in
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newMessage = new Message({
            userID: req.user._id,
            text,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error creating message", error });
    }
};

// Get all messages for the logged-in user
export const getAllMessages = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const messages = await Message.find({ userID: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ data: messages, message: "All messages fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
};

// Get a single message by messageID for the logged-in user
export const getMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const message = await Message.findOne({ _id: id, userID: req.user._id });

        if (!message) {
            return res.status(404).json({ message: "Message not found or unauthorized" });
        }

        res.status(200).json({ data: message, message: "Paricular message fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching message", error });
    }
};

// Update a message (only if it belongs to the logged-in user)
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const message = await Message.findOneAndUpdate(
            { _id: id, userID: req.user._id },
            { text },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: "Message not found or unauthorized" });
        }

        res.status(200).json({ message: "Message updated successfully", data: message });
    } catch (error) {
        res.status(500).json({ message: "Error updating message", error });
    }
};

// Delete a message (only if it belongs to the logged-in user)
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const message = await Message.findOneAndDelete({ _id: id, userID: req.user._id });

        if (!message) {
            return res.status(404).json({ message: "Message not found or unauthorized" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error });
    }
};

