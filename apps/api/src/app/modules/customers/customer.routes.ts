// import 'passport-jwt';
import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { CustomerController } from './customer.controller';

export const customersRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/me',
    {
      preValidation: authMiddleware,
    },
    CustomerController.getOne
  );
};
