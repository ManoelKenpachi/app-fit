import express from "express";
import { PrismaClient } from '@prisma/client';
import { protect } from "../middlewares/authMiddleware.js";
import { registerProgress, getExerciseProgress, getUserProgress } from "../controllers/progressController.js";

const router = express.Router();
const prisma = new PrismaClient();

// Proteger todas as rotas
router.use(protect);

// Registrar progresso de um exercício
router.post('/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { weight, reps, set } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
      include: {
        workout: true,
        progress: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }

    // Verificar se o exercício pertence a um treino do usuário
    if (exercise.workout.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    // Buscar o último peso registrado para este exercício
    const lastProgress = exercise.progress[0];

    // Se não foi fornecido um peso, usar o último peso registrado ou o peso alvo
    const weightToUse = weight || (lastProgress ? lastProgress.weight : exercise.targetWeight || 0);

    const progress = await prisma.progress.create({
      data: {
        exerciseId: parseInt(exerciseId),
        weight: parseFloat(weightToUse),
        reps: parseInt(reps),
        set: parseInt(set)
      }
    });

    // Verificar se todas as séries foram completadas
    const completedSets = await prisma.progress.count({
      where: {
        exerciseId: parseInt(exerciseId)
      }
    });

    let message = 'Progresso registrado com sucesso';
    let suggestedWeight = null;

    if (completedSets === exercise.sets) {
      // Todas as séries foram completadas
      const allSetsCompleted = exercise.progress.every(p => p.reps >= exercise.reps);
      
      if (allSetsCompleted) {
        suggestedWeight = weightToUse + 1.25;
        message = `Parabéns! Você completou todas as séries. Sugerimos aumentar a carga para ${suggestedWeight}kg na próxima vez!`;
      }
    }

    res.json({ 
      progress,
      message,
      suggestedWeight,
      isCompleted: completedSets === exercise.sets
    });

  } catch (error) {
    console.error('Erro ao registrar progresso:', error);
    res.status(500).json({ error: 'Erro ao registrar progresso' });
  }
});

// Buscar progresso de um exercício
router.get('/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const progress = await prisma.progress.findMany({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { createdAt: 'asc' }
    });

    res.json(progress);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
});

// Atualizar uma série
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, reps } = req.body;

    const updatedProgress = await prisma.progress.update({
      where: { id: parseInt(id) },
      data: {
        weight: parseFloat(weight),
        reps: parseInt(reps)
      }
    });

    res.json(updatedProgress);
  } catch (error) {
    console.error('Erro ao atualizar série:', error);
    res.status(500).json({ error: 'Erro ao atualizar série' });
  }
});

// Buscar último peso usado
router.get('/:exerciseId/last-weight', async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const lastProgress = await prisma.progress.findFirst({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { createdAt: 'desc' }
    });

    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) }
    });

    res.json({
      weight: lastProgress?.weight || exercise?.targetWeight || 0
    });
  } catch (error) {
    console.error('Erro ao buscar último peso:', error);
    res.status(500).json({ error: 'Erro ao buscar último peso' });
  }
});

// Atualizar peso alvo do exercício
router.post('/:exerciseId/update-weight', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { weight } = req.body;

    const updatedExercise = await prisma.exercise.update({
      where: { id: parseInt(exerciseId) },
      data: { targetWeight: parseFloat(weight) }
    });

    res.json(updatedExercise);
  } catch (error) {
    console.error('Erro ao atualizar peso alvo:', error);
    res.status(500).json({ error: 'Erro ao atualizar peso alvo' });
  }
});

// Buscar histórico de progresso do usuário
router.get('/history', getUserProgress);

export default router;
