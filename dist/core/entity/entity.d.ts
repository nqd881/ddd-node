import { Class } from "type-fest";
import { Props, InferredProps } from "../../base";
import { ClassStatic } from "../../types";
import { ModelWithId, ModelWithIdMetadata } from "../model-with-id";
import { EntityBuilder } from ".";
export interface EntityMetadata extends ModelWithIdMetadata {
}
export declare class EntityBase<P extends Props> extends ModelWithId<P> {
    static builder<T extends AnyEntity>(this: EntityClass<T>): EntityBuilder<T>;
    constructor(metadata: EntityMetadata, props: P);
}
export type AnyEntity = EntityBase<Props>;
export interface EntityClass<T extends AnyEntity = AnyEntity, Arguments extends unknown[] = any[]> extends Class<T, Arguments>, ClassStatic<typeof EntityBase<InferredProps<T>>> {
}
export interface EntityClassWithTypedConstructor<T extends AnyEntity = AnyEntity> extends EntityClass<T, ConstructorParameters<typeof EntityBase<InferredProps<T>>>> {
}
export interface EntityClassWithProps<P extends Props> extends EntityClass<EntityBase<P>> {
}
