import { Customer } from '@project/shared';
import { inject, injectable } from 'inversify';
import { Database } from '../../storage/database';
// import jwt from 'jsonwebtoken';
// import { RedisService } from '../../libs/redis';

@injectable()
export class AuthService {
  async verifyCredentials(email: string, password: string) {
    return {} as Customer;
  }

  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}
}
