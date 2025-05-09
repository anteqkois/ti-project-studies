import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { idSchema } from '@project/shared';
import { FastifyInstance } from 'fastify';
import { isNativeError } from 'util/types';
import { authRoutes } from './modules/customers/auth/auth.routes';
import { customersRoutes } from './modules/customers/customer.routes';
import { notesRoutes } from './modules/notes/notes.routes';

/* eslint-disable-next-line */
export interface AppOptions {}
const allowedOrigins = [
  'http://localhost:3000',
  'http://0.0.0.0:3000',
  'http://127.0.0.1:3000',
];

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(fastifyCors, {
    credentials: true,
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  fastify.register(sensible);

  fastify.register(fastifyCookie);

  fastify.addSchema(idSchema);

  fastify.addHook('preHandler', function (request, reply, done) {
    console.info(`request`, {
      url: `${request.method} ${request.url}`,
      origin: request.headers.origin,
      query: request.query,
      body: request.body,
      params: request.params,
      customer: request?.customer ? request.customer.sub : 'unknwon',
    });

    return done();
  });

  fastify.addHook('onError', async (request, reply, error) => {
    console.error(
      `customer: ${
        request?.customer ? request.customer.sub : 'unknwon'
      }\n${error}`,
      {
        url: `${request.method} ${request.url}`,
        origin: request.headers.origin,
        query: request.query,
        body: request.body,
        params: request.params,
        error: JSON.stringify(error),
      }
    );
    console.error(error?.stack);

    if (isNativeError(error)) {
      return reply.internalServerError(error.message);
    }
    throw error;
  });

  // routes
  fastify.register(authRoutes, {
    prefix: '/auth',
  });
  fastify.register(notesRoutes, {
    prefix: '/notes',
  });
  fastify.register(customersRoutes, {
    prefix: '/customers',
  });
}
