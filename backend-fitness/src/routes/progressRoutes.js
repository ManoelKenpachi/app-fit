import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { logProgress, getProgressByExercise, getUserProgress } from "../controllers/progressController.js";

const router = express.Router();

// 📌 Registrar o progresso de um exercício
router.post("/progress", authenticateToken, logProgress);

// 📌 Listar o progresso de um exercício específico
router.get("/progress/:exerciseId", authenticateToken, getProgressByExercise);

// 📌 Listar histórico de progresso do usuário
router.get("/progress-history", authenticateToken, getUserProgress);

export default router;
