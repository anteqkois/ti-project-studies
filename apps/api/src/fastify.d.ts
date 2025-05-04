import { JwtCustomer } from "@pro-alerts/shared";

declare module 'fastify' {
  interface FastifyRequest {
    customer: JwtCustomer
  }
}
