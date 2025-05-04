export type Nullable<T> = T | undefined | null;

export type DeepNullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ValueOf<T> = Required<T>[keyof T];

export type TypeOrDefaultType<
  LiteralStrings,
  LiteralString extends string,
  Type,
  DefaultType
> = LiteralString extends LiteralStrings ? Type : DefaultType;

export type MapGetRequired<K, V> = Omit<Map<K, V>, 'get'> & {
  get(key: K): V;
};

export type WithConstructor<T> = new (...args: any[]) => T;

export enum Order {
  'desc' = 'desc',
  'asc' = 'asc',
}
