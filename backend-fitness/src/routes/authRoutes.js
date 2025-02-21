import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// 📌 Registrar um novo usuário
router.post("/register", register);

// 📌 Login do usuário e geração de token JWT
router.post("/login", login);

export default router;
