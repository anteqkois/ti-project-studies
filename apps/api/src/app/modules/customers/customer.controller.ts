import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import { servicesContainer } from '../../container';
import { CustomerService } from './customers.service';

export class CustomerController {
  static async getOne(req: FastifyRequest, res: FastifyReply) {
    const customerService = servicesContainer.get<CustomerService>(CustomerService);

    const customer = await customerService.getOne(new ObjectId( req.customer.sub))
    if(!customer) if (!customer) return res.notFound();

    return res.send(customer)
  }
}
