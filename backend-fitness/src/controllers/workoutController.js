import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 Criar um novo treino
export const createWorkout = async (req, res) => {
  const { name, day } = req.body;
  const userId = req.userId; // Obtém o ID do usuário autenticado

  try {
    const workout = await prisma.workout.create({
      data: { name, day, userId },
    });

    res.json(workout);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar treino." });
  }
};

// 📌 Listar todos os treinos do usuário autenticado
export const getWorkouts = async (req, res) => {
  const userId = req.userId;

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
    });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treinos." });
  }
};

// 📌 Obter o treino do dia baseado no dia da semana
export const getWorkoutOfTheDay = async (req, res) => {
  const userId = req.userId;
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = daysOfWeek[new Date().getDay()]; // Obtém o dia da semana atual

  try {
    const workout = await prisma.workout.findFirst({
      where: { userId, day: today },
      include: { exercises: true },
    });

    res.json(workout || { message: "Nenhum treino planejado para hoje." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treino do dia." });
  }
};

// 📌 Excluir um treino
export const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.workout.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Treino excluído com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao excluir treino." });
  }
};
