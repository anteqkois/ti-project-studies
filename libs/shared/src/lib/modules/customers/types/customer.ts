import { BaseDatabaseFields } from '../../../libs/mongodb/types';

export enum CustomerRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export interface CustomerSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  defaultNotePrivacy?: 'private' | 'public';
}

export interface Customer extends BaseDatabaseFields {
  name: string;
  roles: CustomerRole[];
  password: string;
  email: string;
  email_verified_datetime?: Date;
  deleted_datetime?: Date;
  settings: CustomerSettings;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  settings?: Partial<CustomerSettings>;
}
