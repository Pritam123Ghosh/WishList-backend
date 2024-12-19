import express from "express";
import { getAllUsers, google, login, logout, register } from "../contorllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get("/getAllUsers", getAllUsers);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", google);


export default router;