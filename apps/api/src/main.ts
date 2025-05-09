import './app/container';

import Fastify from 'fastify';
import { app } from './app/app';
import { servicesContainer } from './app/container';

const host = process.env.HOST ?? '127.0.0.1';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = Fastify({
  logger: false,
});

server.register(app);

server.listen({ port, host }, (err) => {
  if (err) {
    console.error('Error', err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
  }
});

const exitHandler = async (...args) => {
  console.error('Error', args);
  await servicesContainer.unbindAll();

  process.exit(0);
};

['SIGINT', 'SIGTERM', 'uncaughtException'].forEach((eventType) => {
  process.on(eventType, exitHandler);
});
