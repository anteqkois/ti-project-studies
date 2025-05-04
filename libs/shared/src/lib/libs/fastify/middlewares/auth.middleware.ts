import { preValidationAsyncHookHandler } from 'fastify';
import { CustomerService } from '../../../modules/customers';

export const authMiddleware: preValidationAsyncHookHandler = async (
  request,
  reply
) => {
  // const token = CustomerService.retriveJwtToken(request.headers.authorization);
  // if (!token) return reply.status(401).send('Unauthorized');

  // const user = CustomerService.getUser(token);
  // if (!user) return reply.status(401).send('Unauthorized');
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore not every time this types are coreccly added
  // request.user = user;
};
