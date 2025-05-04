import { JwtCustomer } from "./lib/modules/customers";

declare module 'fastify' {
  interface FastifyRequest {
    customer: JwtCustomer
  }
}
