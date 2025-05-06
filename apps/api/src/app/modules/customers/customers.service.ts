import { Customer, Id } from '@project/shared';
import { inject, injectable } from 'inversify';
import { Database } from '../storage/database';

@injectable()
export class CustomerService {
  async getOne(id: Id) {
    return {} as Customer
  }

  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}
}
