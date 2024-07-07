import { Id } from "../identifiable-model";
import { AnyAggregate } from "../aggregate";

export interface IRepository<T extends AnyAggregate> {
  findById(id: Id): Promise<T | null>;
  save(instance: T): Promise<any>;
}
