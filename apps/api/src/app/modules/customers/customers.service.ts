import { Customer, Id } from '@project/shared';
import { inject, injectable } from 'inversify';
import { Database } from '../storage/database';
import { DatabaseCollection } from '../storage/mongoCollections';

@injectable()
export class CustomerService {
  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}

  async getOne(id: Id) {
    const customer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({
        _id: id,
      });
    if (!customer) return null;

    delete customer.password;

    return customer;
  }
}
