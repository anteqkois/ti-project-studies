import { z } from "zod";
import { BaseDatabaseFields } from "../../../libs/mongodb/types";
import { stringDateSchema, stringShortSchema } from "../../../libs/zod";

export enum CustomerRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export const customerSchema = z.object({
  name: stringShortSchema,
  roles: z.array(z.nativeEnum(CustomerRole)),
  password: z.array(z.nativeEnum(CustomerRole)),
  email: z.string().email(),
  email_verified_datetime: stringDateSchema.optional(),
  deleted_datetime: stringDateSchema.optional(),
  settings: z.any(),
})

export interface Customer extends BaseDatabaseFields, z.infer<typeof customerSchema> {}
