import { AnyAggregate } from "./aggregate";

export interface Repository<T extends AnyAggregate> {
  save(aggregate: T): Promise<void>;
}
