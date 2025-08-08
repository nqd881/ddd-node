import { AnyAggregate, Id } from "../model";

export interface IRepository<T extends AnyAggregate> {
  id(id: Id): Promise<T | null>;
  save(instance: T): Promise<any>;
}
