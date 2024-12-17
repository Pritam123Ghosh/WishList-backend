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

}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

export default Message;
