import express from "express";
import { getAllUsers, google, login, register } from "../contorllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/getAllUsers", getAllUsers);
router.post("/login", login);
router.post("/google", google);


export default router;