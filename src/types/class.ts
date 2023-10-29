export type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export type Class<T, Arguments extends unknown[] = any[]> = Constructor<
  T,
  Arguments
> & {
  prototype: T;
};

export type AbstractConstructor<
  T,
  Arguments extends unknown[] = any[]
> = abstract new (...arguments_: Arguments) => T;

export type AbstractClass<
  T,
  Arguments extends unknown[] = any[]
> = AbstractConstructor<T, Arguments> & {
  prototype: T;
};

export type AbstractableClass<T, Arguments extends unknown[] = any[]> =
  | Class<T, Arguments>
  | AbstractClass<T, Arguments>;
