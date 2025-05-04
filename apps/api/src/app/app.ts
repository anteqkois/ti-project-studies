import fastifyCors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { idSchema } from '@project/shared';
import { FastifyInstance } from 'fastify';
import { isNativeError } from 'util/types';
import { notesRoutes } from './modules/notes/notes.routes';

/* eslint-disable-next-line */
export interface AppOptions {}
const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080'];

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(sensible);
  fastify.register(fastifyCors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  fastify.addSchema(idSchema);

  fastify.addHook('preHandler', function (request, reply, done) {
    console.info(`request`, {
      url: `${request.method} ${request.url}`,
      origin: request.headers.origin,
      query: request.query,
      body: request.body,
      params: request.params,
      user: request?.customer ? request.customer.sub : 'unknwon',
    });

    return done();
  });

  // fastify.addHook('preSerialization', async (request, reply, payload) => {
  //   return JSON.parse(JSON.stringify(payload, (d, v) => (typeof v === 'bigint' ? Number(v) : v)))
  // })

  fastify.addHook('onError', async (request, reply, error) => {
    console.error(
      `user: ${request?.customer ? request.customer.sub : 'unknwon'}\n${error}`,
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
  fastify.register(notesRoutes, {
    prefix: '/notes',
  });

  // initialize here, not use @postConstruct() because it wil run when the service is requested first time (first api request for this), so better in this way and to see clean what is done
  // const indexMetadataService = servicesContainer.get(IndexMetadataService);
  // // call this to initialize orchiestrators
  // servicesContainer.get(ConditionsService);
  // servicesContainer.get(TriggersService);
  // servicesContainer.get(AdminService);
  // await indexMetadataService.onInit();
}
