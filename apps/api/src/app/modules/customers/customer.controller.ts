import { UpdateCustomerInput } from '@project/shared';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import { servicesContainer } from '../../container';
import { CustomerService } from './customers.service';

export class CustomerController {
  static async getOne(req: FastifyRequest, res: FastifyReply) {
    const customerService = servicesContainer.get<CustomerService>(CustomerService);

    const customer = await customerService.getOne(new ObjectId(req.customer.sub));
    if (!customer) return res.notFound();

    return res.send(customer);
  }

  static async updateSettings(req: FastifyRequest<UpdateCustomerRequest>, res: FastifyReply) {
    const customerService = servicesContainer.get<CustomerService>(CustomerService);
    const customerId = new ObjectId(req.customer.sub);

    const updatedCustomer = await customerService.updateSettings(customerId, req.body);
    if (!updatedCustomer) return res.notFound();

    return res.send(updatedCustomer);
  }

  static async changePassword(req: FastifyRequest<ChangePasswordRequest>, res: FastifyReply) {
    const customerService = servicesContainer.get<CustomerService>(CustomerService);
    const customerId = new ObjectId(req.customer.sub);
    const { currentPassword, newPassword } = req.body;

    try {
      await customerService.changePassword(customerId, currentPassword, newPassword);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  }

  static async deleteAccount(req: FastifyRequest, res: FastifyReply) {
    const customerService = servicesContainer.get<CustomerService>(CustomerService);
    const customerId = new ObjectId(req.customer.sub);

    const deleted = await customerService.deleteAccount(customerId);
    if (!deleted) return res.notFound();

    // Clear the auth cookie
    return res
      .clearCookie('ACCESS_TOKEN', { path: '/' })
      .status(204)
      .send();
  }
}

export interface UpdateCustomerRequest {
  Body: UpdateCustomerInput;
}

export interface ChangePasswordRequest {
  Body: {
    currentPassword: string;
    newPassword: string;
  };
}