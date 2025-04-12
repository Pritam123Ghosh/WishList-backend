import Message from "../model/message.model.js";


// export const createMessage = async (req, res) => {
//     try {
//         const { text } = req.body;

//         // Ensure user is logged in
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const newMessage = new Message({
//             userID: req.user._id,
//             text,
//         });

//         const savedMessage = await newMessage.save();
//         res.status(201).json(savedMessage);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating message", error });
//     }
// };


export const createMessage = async (req, res) => {
    try {
        const { text, role } = req.body;

        // Ensure user is logged in
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Validate role
        if (!["he", "she"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Role must be 'he' or 'she'." });
        }

        const newMessage = new Message({
            userID: req.user._id,
            text,
            role, // Set the role of the creator
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error creating message", error });
    }
};


export const getAllMessagesByRole = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { role } = req.query;

        const filter = { userID: req.user._id };
        if (role) {
            filter.role = role; // Add role filter if specified
        }

        const messages = await Message.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ data: messages, message: "All messages fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
};


// Get all messages for the logged-in user
export const getAllMessages = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch messages excluding those where isAchieved is true
        const messages = await Message.find({
            userID: req.user._id,
            isAchieved: { $ne: true } // Exclude messages with isAchieved === true
        }).sort({ createdAt: -1 });

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
// export const updateMessage = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { text } = req.body;

//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const message = await Message.findOneAndUpdate(
//             { _id: id, userID: req.user._id },
//             { text },
//             { new: true }
//         );

//         if (!message) {
//             return res.status(404).json({ message: "Message not found or unauthorized" });
//         }

//         res.status(200).json({ message: "Message updated successfully", data: message });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating message", error });
//     }
// };

export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, role } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find the message to verify ownership and role
        const message = await Message.findOne({ _id: id, userID: req.user._id });

        if (!message) {
            return res.status(404).json({ message: "Message not found or unauthorized" });
        }

        if (message.role !== role) {
            return res
                .status(403)
                .json({ message: `Only '${message.role}' can update this wish.` });
        }

        // Update the message
        message.text = text;
        const updatedMessage = await message.save();

        res.status(200).json({
            message: "Message updated successfully",
            data: updatedMessage,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating message", error });
    }
};


// Delete a message (only if it belongs to the logged-in user)
// export const deleteMessage = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const message = await Message.findOneAndDelete({ _id: id, userID: req.user._id });

//         if (!message) {
//             return res.status(404).json({ message: "Message not found or unauthorized" });
//         }

//         res.status(200).json({ message: "Message deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting message", error });
//     }
// };

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find the message to verify ownership and role
        const message = await Message.findOne({ _id: id, userID: req.user._id });

        if (!message) {
            return res.status(404).json({ message: "Message not found or unauthorized" });
        }

        if (message.role !== role) {
            return res
                .status(403)
                .json({ message: `Only '${message.role}' can delete this wish.` });
        }

        // Delete the message
        await Message.deleteOne({ _id: id });

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error });
    }
};


export const achieveMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find the message by ID and verify ownership
        const message = await Message.findOne({ _id: id });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Mark the wish as achieved
        message.isAchieved = true;
        const updatedMessage = await message.save();

        res.status(200).json({
            message: "Wish marked as achieved successfully",
            data: updatedMessage,
        });
    } catch (error) {
        res.status(500).json({ message: "Error marking wish as achieved", error });
    }
};

export const reactedMessage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const message = await Message.findOne({ _id: id });
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        message.isReacted = true;
        const updatedMessage = await message.save();
        res.status(200).json({
            message: "Wish marked as reacted successfully",
            data: updatedMessage,
        });
    } catch (error) {
        res.status(500).json({ message: "Error marking wish as reacted", error });
    }
};


export const getAchievedMessages = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch all achieved wishes for this account
        const messages = await Message.find({ isAchieved: true }).sort({
            updatedAt: -1,
        });

        res.status(200).json({
            message: "Achieved wishes fetched successfully",
            data: messages,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching achieved wishes", error });
    }
};
