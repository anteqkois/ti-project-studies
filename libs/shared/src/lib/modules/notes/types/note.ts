import { BaseDatabaseFields, Id } from '../../../libs/mongodb/types';

export interface Note extends BaseDatabaseFields {
  customer_id: Id;
  title: string;
  content: string;
  tags: string[];
}
