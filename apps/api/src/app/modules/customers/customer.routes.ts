import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { CustomerController } from './customer.controller';

export const customersRoutes = async (fastify: FastifyInstance) => {
  // Get current customer profile
  fastify.get(
    '/me',
    {
      preValidation: authMiddleware,
    },
    CustomerController.getOne
  );

  // Update customer settings (name, email, preferences)
  fastify.put(
    '/me/settings',
    {
      preValidation: authMiddleware,
    },
    CustomerController.updateSettings
  );

  // Change password
  fastify.put(
    '/me/password',
    {
      preValidation: authMiddleware,
    },
    CustomerController.changePassword
  );

  // Delete account
  fastify.delete(
    '/delete',
    {
      preValidation: authMiddleware,
    },
    CustomerController.deleteAccount
  );
};