import { AppError } from '../middlewares/errorHandler.js';

export const validateWorkout = (data) => {
  const { name, description, exercises } = data;

  if (!name || typeof name !== 'string') {
    throw new AppError('Nome do treino é obrigatório e deve ser uma string');
  }

  if (description && typeof description !== 'string') {
    throw new AppError('Descrição do treino deve ser uma string');
  }

  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    throw new AppError('Treino deve conter pelo menos um exercício');
  }

  exercises.forEach((exercise, index) => {
    if (!exercise.name || typeof exercise.name !== 'string') {
      throw new AppError(`Nome do exercício ${index + 1} é obrigatório e deve ser uma string`);
    }

    if (!exercise.sets || typeof exercise.sets !== 'number' || exercise.sets <= 0) {
      throw new AppError(`Número de séries do exercício ${index + 1} deve ser um número positivo`);
    }

    if (!exercise.reps || typeof exercise.reps !== 'number' || exercise.reps <= 0) {
      throw new AppError(`Número de repetições do exercício ${index + 1} deve ser um número positivo`);
    }
  });
};

export const validateProgress = (data) => {
  const { exerciseId, weight, reps, date } = data;

  if (!exerciseId) {
    throw new AppError('ID do exercício é obrigatório');
  }

  if (typeof weight !== 'number' || weight < 0) {
    throw new AppError('Peso deve ser um número positivo');
  }

  if (typeof reps !== 'number' || reps <= 0) {
    throw new AppError('Número de repetições deve ser um número positivo');
  }

  if (date && isNaN(Date.parse(date))) {
    throw new AppError('Data inválida');
  }
};

export const validateUser = (data) => {
  const { name, email, password } = data;

  if (!name || typeof name !== 'string') {
    throw new AppError('Nome é obrigatório e deve ser uma string');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new AppError('Email inválido');
  }

  if (!password || password.length < 6) {
    throw new AppError('Senha deve ter pelo menos 6 caracteres');
  }
}; 