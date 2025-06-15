import { preValidationAsyncHookHandler } from 'fastify';
import { AuthService } from '../modules/customers/auth/auth.service';
import { Cookies } from '@project/shared';

export const authMiddleware: preValidationAsyncHookHandler = async (
  request,
  reply
) => {
  const token = request.cookies?.[Cookies.ACCESS_TOKEN];
  console.log('HERE', token);
  if (!token) return reply.status(401).send('Unauthorized');

  const customer = AuthService.getCustomerFromJWTToken(token);
  console.log('HERE 2', customer);
  if (!customer) return reply.status(401).send('Unauthorized');
  request.customer = customer;
};
