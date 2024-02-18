import { AnyAggregate, AnyAggregateES } from "./aggregate";
import { Id } from "./id";

export interface IRepository<T extends AnyAggregate | AnyAggregateES> {
  findById(id: Id): Promise<T | null>;
  save(instance: T): Promise<any>;
}
