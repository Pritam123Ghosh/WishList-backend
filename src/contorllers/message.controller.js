import prisma from "../db/prisma.js";

export const createMessage = async (req, res) => {
  try {
    const { text, role } = req.body;
    // Ensure user is logged in
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Validate role
    if (!["he", "she"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Role must be 'he' or 'she'." });
    }
    const savedMessage = await prisma.message.create({
      data: {
        userId: req.user.id,
        text,
        role,
      },
    });
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
    const messages = await prisma.message.findMany({
      where: {
        userId: req.user.id,
        ...(role ? { role } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res
      .status(200)
      .json({ data: messages, message: "All messages fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const messages = await prisma.message.findMany({
      where: {
        userId: req.user.id,
        isAchieved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res
      .status(200)
      .json({ data: messages, message: "All messages fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

// Get a single message by messageID for the logged-in user
export const getMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }
    res
      .status(200)
      .json({
        data: message,
        message: "Paricular message fetched successfully",
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching message", error });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { text, role } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }
    if (message.role !== role) {
      return res
        .status(403)
        .json({ message: `Only '${message.role}' can update this wish.` });
    }
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { text },
    });
    res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }
    if (message.role !== role) {
      return res
        .status(403)
        .json({ message: `Only '${message.role}' can delete this wish.` });
    }
    await prisma.message.delete({
      where: { id },
    });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};

export const achieveMessage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isAchieved: true },
    });
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
    const id = Number(req.params.id);
    const { isReacted } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await prisma.message.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isReacted },
    });
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
    const messages = await prisma.message.findMany({
      where: {
        userId: req.user.id,
        isAchieved: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.status(200).json({
      message: "Achieved wishes fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching achieved wishes", error });
  }
};
