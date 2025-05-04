import { Order } from "../../common"

export interface IdParams<T = string> {
  id: T
}

export const idSchema = {
  $id: 'idSchema',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
    },
  },
}

export type OrderQuery<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: Order
}
