import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: '30d'
  });
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const formatResponse = (data, message = 'Sucesso', statusCode = 200) => {
  return {
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

export const paginateResults = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    data: array.slice(startIndex, endIndex),
    pagination: {
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit)
    }
  };

  if (endIndex < array.length) {
    results.pagination.next = page + 1;
  }

  if (startIndex > 0) {
    results.pagination.prev = page - 1;
  }

  return results;
}; 