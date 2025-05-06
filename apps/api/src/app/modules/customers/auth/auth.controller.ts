import { FastifyReply, FastifyRequest } from 'fastify';
import { servicesContainer } from '../../../container';
import { AuthService } from './auth.service';
import { Cookies } from '@project/shared';

export class AuthController {
  static async login(req: FastifyRequest<LoginRequest>, res: FastifyReply) {
    const { email, password } = req.body;

    const authService = servicesContainer.get<AuthService>(AuthService);
    const customer = await authService.verifyCredentials(email, password);
    if (!customer) return res.code(401).send({ error: 'Bad credentails' });

    const token = await res.jwtSign(
      { sub: customer._id },
      {
        expiresIn: '60m',
      }
    );

    // Store it in an HttpOnly cookie
    res
      .setCookie(Cookies.ACCESS_TOKEN, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60, // 15 minutes in seconds
      })
      .code(204)
      .send();
  }

  static async logout(req: FastifyRequest<LoginRequest>, res: FastifyReply) {
    res.clearCookie(Cookies.ACCESS_TOKEN, { path: '/' }).code(204).send();
  }
}

export interface LoginRequest {
  Body: {
    email: string;
    password: string;
  };
}
