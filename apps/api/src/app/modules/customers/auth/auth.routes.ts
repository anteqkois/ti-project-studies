import fastifyPassport from '@fastify/passport';
import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/login',
    {
      preValidation: fastifyPassport.authenticate('local', {
        successRedirect: '/me',
        failureRedirect: '/login?error=1',
        authInfo: false,
      }),
    },
    AuthController.login
  );
  fastify.get('/logout', AuthController.logout);
};
