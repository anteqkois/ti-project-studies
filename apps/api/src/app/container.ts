import { CustomerService, Database } from '@project/shared';
import { Container } from 'inversify';

export const servicesContainer: Container = new Container();

servicesContainer.bind(Database).toSelf().inSingletonScope();
servicesContainer.bind(CustomerService).toSelf().inSingletonScope();
