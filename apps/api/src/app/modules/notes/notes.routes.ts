import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const notesRoutes = async (fastify: FastifyInstance) => {
  // fastify.get(
  //   '/:id',
  //   { preValidation: authMiddleware },
  //   AdminController.getOne
  // );
};
