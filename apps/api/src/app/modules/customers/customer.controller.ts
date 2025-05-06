import {
  Customer,
  Database,
  DatabaseCollection,
  servicesContainer,
} from '@project/shared';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';

export class CustomerController {
  static async getOne(req: FastifyRequest, res: FastifyReply) {
    const database = servicesContainer.get<Database>(Database);
    const customer = await database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({
        _id: new ObjectId(req.customer.sub),
      });
    if (!customer) return res.notFound();
    delete customer.password;

    return res.send(customer);
  }
}
