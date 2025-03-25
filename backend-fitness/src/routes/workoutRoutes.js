import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createWorkout, getWorkouts, getWorkoutOfTheDay, deleteWorkout, updateWorkout, getWorkoutHistory } from "../controllers/workoutController.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Rotas protegidas
router.use(protect);
router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/workout-today", getWorkoutOfTheDay);
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Recebida requisição para desativar treino:', { id, userId: req.user.id });

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
      include: { exercises: true }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    console.log('Treino encontrado:', workout);

    // Atualiza o treino e seus exercícios para inativos
    const updatedWorkout = await prisma.workout.update({
      where: { id: parseInt(id) },
      data: {
        isActive: false,
        exercises: {
          updateMany: {
            where: { workoutId: parseInt(id) },
            data: { isActive: false }
          }
        }
      }
    });

    console.log('Treino e exercícios desativados com sucesso:', updatedWorkout);
    res.json(updatedWorkout);
  } catch (error) {
    console.error('Erro ao desativar treino:', error);
    res.status(500).json({ error: 'Erro ao desativar treino' });
  }
});
router.put("/:id", updateWorkout);
router.get("/history", getWorkoutHistory);

export default router;
