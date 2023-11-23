import { AnyAggregate } from "./aggregate";
import { Id } from "./id";

export interface Repository<T extends AnyAggregate> {
  findById(id: Id): Promise<T | undefined>;
  save(aggregate: T): Promise<void>;
}
