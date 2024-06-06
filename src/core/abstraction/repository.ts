import { AnyAggregate } from "../aggregate";
import { Id } from "../id";

export interface IRepository<T extends AnyAggregate> {
  findById(id: Id): Promise<T | null>;
  save(instance: T): Promise<any>;
}
