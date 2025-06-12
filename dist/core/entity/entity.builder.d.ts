import { ModelWithIdBuilder } from "../model-with-id";
import { AnyEntity, EntityClassWithTypedConstructor } from "./entity";
export declare class EntityBuilder<T extends AnyEntity> extends ModelWithIdBuilder<T> {
    private entityClass;
    constructor(entityClass: EntityClassWithTypedConstructor<T>);
    build(): T;
}
