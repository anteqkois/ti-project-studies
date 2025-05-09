import { preValidationAsyncHookHandler } from 'fastify';
import { AuthService } from '../modules/customers/auth/auth.service';

export const authMiddleware: preValidationAsyncHookHandler = async (
  request,
  reply
) => {
  const token = AuthService.retriveJwtToken(request.headers.authorization);
  if (!token) return reply.status(401).send('Unauthorized');

  const customer = AuthService.getCustomerFromJWTToken(token);
  if (!customer) return reply.status(401).send('Unauthorized');
  request.customer = customer;
};
