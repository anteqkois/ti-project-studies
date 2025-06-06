import { AuthStatus, Cookies, LoginInput, SignUpInput } from '@project/shared';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { servicesContainer } from '../../../container';
import { AuthService } from './auth.service';

export class AuthController {
  static async signiUp(req: FastifyRequest<SignInRequest>, res: FastifyReply) {
    const authService = servicesContainer.get<AuthService>(AuthService);

    const { email, name, password } = req.body;

    const newCustomer = await authService.register(email, password, name);

    const token = await jwt.sign(
      { sub: newCustomer._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '60m',
        algorithm: 'HS256',
      }
    );

    // Store it in an HttpOnly cookie
    return res
      .setCookie(Cookies.ACCESS_TOKEN, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60, // 60 minutes in seconds
      })
      .setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 10000,
      })
      .send({ customer: newCustomer });
  }

  static async login(req: FastifyRequest<LoginRequest>, res: FastifyReply) {
    const { email, password } = req.body;

    const authService = servicesContainer.get<AuthService>(AuthService);
    const customer = await authService.verifyCredentials(email, password);
    if (!customer) return res.code(401).send({ error: 'Bad credentails' });

    const token = await jwt.sign(
      { sub: customer._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '60m',
        algorithm: 'HS256',
      }
    );

    // Store it in an HttpOnly cookie
    return res
      .setCookie(Cookies.ACCESS_TOKEN, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60, // 60 minutes in seconds
      })
      .setCookie(Cookies.AUTH_STATUS, AuthStatus.AUTHENTICATED, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 10000,
      })
      .send({ customer });
  }

  static async logout(req: FastifyRequest<LoginRequest>, res: FastifyReply) {
    return res
      .clearCookie(Cookies.ACCESS_TOKEN, { path: '/' })
      .clearCookie(Cookies.AUTH_STATUS, { path: '/' })
      .code(204)
      .send();
  }
}

export interface SignInRequest {
  Body: SignUpInput;
}

export interface LoginRequest {
  Body: LoginInput;
}
