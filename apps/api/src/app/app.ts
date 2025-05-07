import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { idSchema } from '@project/shared';
import { FastifyInstance } from 'fastify';
import { isNativeError } from 'util/types';
import { servicesContainer } from './container';
import { customersRoutes } from './modules/customers/customer.routes';
import { CustomerService } from './modules/customers/customers.service';
import { notesRoutes } from './modules/notes/notes.routes';

/* eslint-disable-next-line */
export interface AppOptions {}
const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080'];

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  const customerService =
    servicesContainer.get<CustomerService>(CustomerService);

  fastify.register(sensible);
  fastify.register(fastifyCors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // SESSION
  fastify.register(fastifyCookie);
  // registerFastifyPassportAuth(fastify, {
  //   getCustomer(id) {
  //     // fetch from DB – return null/false if user vanished
  //     return customerService.getOne(new ObjectId(id));
  //   }
  // })

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
      `customer: ${request?.customer ? request.customer.sub : 'unknwon'}\n${error}`,
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
  fastify.register(customersRoutes, {
    prefix: '/customers',
  });

  // initialize here, not use @postConstruct() because it wil run when the service is requested first time (first api request for this), so better in this way and to see clean what is done
  // const indexMetadataService = servicesContainer.get(IndexMetadataService);
  // // call this to initialize orchiestrators
  // servicesContainer.get(ConditionsService);
  // servicesContainer.get(TriggersService);
  // servicesContainer.get(AdminService);
  // await indexMetadataService.onInit();
}
