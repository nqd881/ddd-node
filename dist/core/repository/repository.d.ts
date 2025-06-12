import { Id } from "../model-with-id";
import { AnyAggregate } from "../aggregate";
export interface IRepository<T extends AnyAggregate> {
    id(id: Id): Promise<T | null>;
    save(instance: T): Promise<any>;
}
