import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/signup', AuthController.signiUp);
  fastify.post('/login', AuthController.login);
  fastify.get('/logout', AuthController.logout);
};
