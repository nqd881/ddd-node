export type Class<T, Arguments extends unknown[] = any[]> = {
  prototype: T;
  new (...arguments_: Arguments): T;
};
