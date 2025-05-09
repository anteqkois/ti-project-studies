import { Customer, CustomerRole, JwtCustomer } from '@project/shared';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { WithoutId } from 'mongodb';
import { Database } from '../../storage/database';
import { DatabaseCollection } from '../../storage/mongoCollections';

@injectable()
export class AuthService {
  static retriveJwtToken(headerContent?: string): string | null {
    if (!headerContent) return null;
    return headerContent.replace(/^Bearer\s+/, '');
  }

  static getCustomerFromJWTToken(token?: string): JwtCustomer | null {
    if (!token) {
      return null;
    } else {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: ['HS256'],
      }) as unknown as JwtCustomer;

      return jwtPayload;
    }
  }

  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}

  async register(email: string, password: string, name: string) {
    // check if existss
    const exisitngCustomer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({
        $or: [
          {
            email,
          },
          {
            name,
          },
        ],
      });

    if (exisitngCustomer)
      throw new Error('There exists other customer with given name or email');

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const nowDate = new Date();
    const newCustomer = await this.database.db
      .collection<WithoutId<Customer>>(DatabaseCollection.customers)
      .insertOne({
        created_at: nowDate,
        name,
        email,
        email_verified_datetime: nowDate,
        password: passwordHash,
        roles: [CustomerRole.CUSTOMER],
        settings: {},
      });

    const customer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({
        _id: newCustomer.insertedId,
      });

    delete customer.password;

    return customer;
  }

  async verifyCredentials(email: string, password: string) {
    const customer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({
        email,
      });
    if (!customer) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) throw new Error('Invalid email or password');

    delete customer.password;

    return customer;
  }
}
