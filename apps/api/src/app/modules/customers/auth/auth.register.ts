import fastifyJWT from '@fastify/jwt';
import fastifyPassport from '@fastify/passport';
import { Customer } from '@project/shared';
import { FastifyInstance } from 'fastify';
import { Strategy as JwtStrategy } from 'passport-jwt';

export const registerFastifyPassportAuth = (
  fastify: FastifyInstance,
  {
    getCustomer,
  }: {
    getCustomer: (id: string) => Promise<Customer | null>;
  }
) => {
  fastify.register(fastifyJWT, { secret: process.env.JWT_SECRET_KEY });
  fastify.register(fastifyPassport.initialize()); // adds request.login, etc.


  fastifyPassport.use(
    new JwtStrategy(
      {
        jwtFromRequest: req => req.cookies.access_token,
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      async (payload, done) => {
        // payload is whatever you signed (e.g. { sub: customer.id, role: 'admin' })
        const customer = await getCustomer(payload.sub);
        if (!customer) return done(null, false);
        done(null, customer);
      }
    )
  );
};
