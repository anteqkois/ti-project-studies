/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type DeepPartial<Thing> = Thing extends Function
  ? Thing
  : Thing extends Array<infer InferredArrayMember>
  ? DeepPartialArray<InferredArrayMember>
  : Thing extends object
  ? DeepPartialObject<Thing>
  : Thing | undefined

export type DeepPartialArray<Thing> = Array<DeepPartial<Thing>>

export type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>
}

export type Dictionary<K extends string | number | symbol, V> = {
  [key in K]: V
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
