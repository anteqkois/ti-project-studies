import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/signup',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
          additionalProperties: false, // can not pass more data, fields
        },
      },
    },
    AuthController.signiUp
  );
  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
          additionalProperties: false, // can not pass more data, fields
        },
      },
    },
    AuthController.login
  );
  fastify.post('/logout', AuthController.logout);
};
