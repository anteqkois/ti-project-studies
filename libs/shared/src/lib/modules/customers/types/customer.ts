import { BaseDatabaseFields } from '../../../libs/mongodb/types';

export enum CustomerRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export interface Customer extends BaseDatabaseFields {
  name: string;
  roles: CustomerRole[];
  password: string;
  email: string;
  email_verified_datetime?: Date;
  deleted_datetime?: Date;
  settings: object;
}
