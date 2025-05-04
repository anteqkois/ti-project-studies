import { ObjectId } from "mongodb"

const dbNameRegex = /\/([^/?]+)\?/
export function getDbName(dbUrl: string): string {
  const match = dbUrl.match(dbNameRegex)
  if (!match) throw new Error(`Can not retrive db url from=${dbUrl}`)
  return match[1]
}

export type Id = ObjectId // Id to db docuemnt
export const mongoObjectIdFactory = (id?: string) => new ObjectId(id)

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
