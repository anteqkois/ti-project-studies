import { JwtCustomer } from "@project/shared";

declare module 'fastify' {
  interface FastifyRequest {
    customer: JwtCustomer
  }
}
