import { ObjectId } from "mongodb"

const dbNameRegex = /\/([^/?]+)\?/
export function getDbName(dbUrl: string): string {
  const match = dbUrl.match(dbNameRegex)
  if (!match) throw new Error(`Can not retrive db url from=${dbUrl}`)
  return match[1]
}

export type Id = ObjectId // Id to db docuemnt
// export const mongoObjectIdFactory = (id?: string) => new ObjectId(id)

// Note types
export interface Note {
  _id: Id;
  title: string;
  content: string;
  customerId: Id;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

// Customer types
export interface Customer {
  _id: Id;
  name: string;
  email: string;
  password: string;
  email_verified_datetime: Date | null;
  roles: CustomerRole[];
  settings: CustomerSettings;
  created_at: Date;
}

export interface CustomerSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  emailNotifications?: boolean;
  defaultNotePrivacy?: 'private' | 'public';
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  settings?: Partial<CustomerSettings>;
}

export enum CustomerRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export interface JwtCustomer {
  sub: string; // customer ID
  iat?: number;
  exp?: number;
}

// API Response types
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  name: string;
  password: string;
}

export interface IdParams {
  id: string;
}

// Cookie names
export enum Cookies {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}


export interface DatabaseTimestamp {
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

export interface BaseDatabaseFields extends DatabaseTimestamp {
  _id: Id
}

export type DatabaseTimestampKeys = keyof BaseDatabaseFields
export type DatabaseModelInput<M> = Omit<M, '_id' | DatabaseTimestampKeys> & (M extends { _id: any } ? Partial<Pick<M, '_id'>> : object)

// it is usefull for mongoose, but not for mongodb package
// export type DatabaseModelWithStringId<M> = Omit<M, '_id'> & { _id: string }
// export type DatabaseModelWithStringId<M> = M & { id: string }
