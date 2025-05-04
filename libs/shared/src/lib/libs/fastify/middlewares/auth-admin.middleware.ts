import { preValidationAsyncHookHandler } from 'fastify';

export const authAdminMiddleware: preValidationAsyncHookHandler = async (
  request,
  reply
) => {
  const apiKey = request.headers['x-api-key'] || '';

  if (!apiKey) return reply.status(401).send('Unauthorized');
  if (apiKey !== process.env.ADMIN_API_KEY)
    return reply.status(401).send('Unauthorized');
};
