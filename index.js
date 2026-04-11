import "dotenv/config";
import express from "express";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";
import messageRouter from "./src/routes/message.route.js";
import cors from "cors"; // Import the cors module
import prisma from "./src/db/prisma.js";

const app = express();
app.use(cors());
app.use(express.json());

//Test DB connection
const startServer = async () => {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    const messageCount = await prisma.message.count();
    console.log("[DB] Railway MySQL connected successfully");
    console.log(`[DB] users: ${userCount}, messages: ${messageCount}`);
  } catch (error) {
    console.error("[DB] Database connection failed");
    console.error(`[DB] ${error.message}`);
    process.exit(1);
  }
};
startServer();

//Connect to server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
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
});
