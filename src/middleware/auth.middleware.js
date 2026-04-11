import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: Number(decoded.id) },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
