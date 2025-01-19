import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../base";
import { ClassStatic } from "../../types";
import {
  IdentifiableModel,
  IdentifiableModelMetadata,
} from "../identifiable-model";
import { EntityBuilder } from ".";

export interface EntityMetadata extends IdentifiableModelMetadata {}

@Mutable(true)
export class EntityBase<P extends Props> extends IdentifiableModel<P> {
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
