import { BaseDatabaseFields, Id } from '../../../libs/mongodb/types';

export interface Note extends BaseDatabaseFields {
  title: string;
  content: string;
  customerId: Id;
  tags: string[];
}
