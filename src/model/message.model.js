import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["he", "she"], // Specifies the creator of the wish
        required: true,
    },
    isAchieved: {
        type: Boolean,
        default: false, // Default is unachieved
    },

}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

export default Message;
