import express from 'express';
import connectDB from './src/db/dbconnection.js';
import userRouter from './src/routes/user.route.js';
import authRouter from './src/routes/auth.route.js';
import messageRouter from './src/routes/message.route.js';
//Connect to DB
connectDB();

const app = express();
app.use(express.json());
//Connect to server
app.listen(3000, () => {
    console.log('Server running on port 3000')
})
//Defined Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

//error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})