import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Registrar progresso de um exercício
export const logProgress = async (req, res) => {
  const { exerciseId, setsDone, weight, reps } = req.body;

  try {
    const progress = await prisma.progress.create({
      data: { exerciseId, setsDone, weight, reps },
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar progresso." });
  }
};

// 📌 Listar progresso de um exercício específico
export const getProgressByExercise = async (req, res) => {
  const { exerciseId } = req.params;

  try {
    const progress = await prisma.progress.findMany({
      where: { exerciseId: parseInt(exerciseId) },
      orderBy: { date: "desc" }, // Ordena do mais recente para o mais antigo
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar progresso do exercício." });
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
