import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
    avatar: {
        type: String,
        default: "https://i.pinimg.com/736x/68/69/7e/68697ed39e4b7df530c3a61c1853b81a.jpg"
    }

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
