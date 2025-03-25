import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Registrar progresso de um exercício
export const registerProgress = async (req, res) => {
  const { exerciseId, weight, reps, set } = req.body;
  const userId = req.user.id;

  try {
    // Verificar se o exercício pertence a um treino do usuário
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
      include: {
        workout: true
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercício não encontrado" });
    }

    if (exercise.workout.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    // Buscar o último peso registrado para este exercício (primeira série do dia)
    const lastProgress = await prisma.progress.findFirst({
      where: {
        exerciseId: parseInt(exerciseId),
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)) // Início do dia atual
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Se não foi fornecido um peso e existe um registro anterior, usar o mesmo peso
    const weightToUse = weight || (lastProgress ? lastProgress.weight : exercise.targetWeight || 0);

    const progress = await prisma.progress.create({
      data: {
        exerciseId: parseInt(exerciseId),
        weight: weightToUse,
        reps: parseInt(reps),
        set: parseInt(set),
        completed: true
      }
    });

    res.json(progress);
  } catch (error) {
    console.error("Erro ao registrar progresso:", error);
    res.status(500).json({ error: "Erro ao registrar progresso" });
  }
};

// 📌 Listar progresso de um exercício específico
export const getExerciseProgress = async (req, res) => {
  const { exerciseId } = req.params;
  const userId = req.user.id;

  try {
    // Verificar se o exercício pertence a um treino do usuário
    const exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(exerciseId) },
      include: {
        workout: true,
        progress: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercício não encontrado" });
    }

    if (exercise.workout.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    res.json(exercise.progress);
  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    res.status(500).json({ error: "Erro ao buscar progresso" });
  }
};

// 📌 Listar histórico de progresso de um usuário
export const getUserProgress = async (req, res) => {
  const userId = req.userId;

  try {
    const progress = await prisma.progress.findMany({
      where: {
        exercise: {
          workout: {
            userId: userId,
          },
        },
      },
      include: { exercise: true },
      orderBy: { date: "desc" },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico de progresso." });
  }
};
