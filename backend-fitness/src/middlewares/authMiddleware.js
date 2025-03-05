import jwt from "jsonwebtoken";
import { config } from '../config/config.js';
import { AppError } from './errorHandler.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  try {
    // 1) Verificar se o token existe
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Você não está logado! Por favor, faça login para ter acesso.', 401);
    }

    // 2) Verificar se o token é válido
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3) Verificar se o usuário ainda existe
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!currentUser) {
      throw new AppError('O usuário deste token não existe mais.', 401);
    }

    // 4) Verificar se o usuário mudou a senha após o token ser emitido
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );

      if (decoded.iat < changedTimestamp) {
        throw new AppError('Usuário mudou a senha recentemente! Por favor, faça login novamente.', 401);
      }
    }

    // Guardar o usuário na requisição para uso futuro
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
