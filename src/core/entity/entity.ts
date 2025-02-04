import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../base";
import { ClassStatic } from "../../types";
import { ModelWithId, ModelWithIdMetadata } from "../model-with-id";
import { EntityBuilder } from ".";

export interface EntityMetadata extends ModelWithIdMetadata {}

@Mutable(true)
export class EntityBase<P extends Props> extends ModelWithId<P> {
  static builder<T extends AnyEntity>(this: EntityClass<T>): EntityBuilder<T> {
    return new EntityBuilder(this);
  }

  constructor(metadata: EntityMetadata, props: P) {
    super(metadata);

    this.initializeProps(props);
  }
}

export type AnyEntity = EntityBase<Props>;

export interface EntityClass<
  T extends AnyEntity = AnyEntity,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof EntityBase<PropsOf<T>>> {}

export interface EntityClassWithTypedConstructor<
  T extends AnyEntity = AnyEntity
> extends EntityClass<
    T,
    ConstructorParameters<typeof EntityBase<PropsOf<T>>>
  > {}

export interface EntityClassWithProps<P extends Props>
  extends EntityClass<EntityBase<P>> {}
