// import 'passport-jwt';
import fastifyPassport from '@fastify/passport';
import { FastifyInstance } from 'fastify';
import { CustomerController } from './customer.controller';

export const customersRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/me',
    {
      preValidation:
        fastifyPassport.authenticate('jwt')
    },
    CustomerController.getOne
  );
};
