import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../base";
import { ClassStatic } from "../../types";
import {
  IdentifiableModel,
  IdentifiableModelMetadata,
} from "../identifiable-model";

export interface EntityMetadata extends IdentifiableModelMetadata {}

@Mutable(true)
export class EntityBase<P extends Props> extends IdentifiableModel<P> {
  constructor(metadata: EntityMetadata, props?: P) {
    super(metadata);

    if (props) this.initializeProps(props);
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
