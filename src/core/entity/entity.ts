import { Class } from "type-fest";
import { Mutable, Props, PropsOf } from "../../model";
import { ClassStatic } from "../../types";
import { Id } from "../id";
import { ModelWithId } from "../model-with-id";

export interface EntityMetadata {
  readonly id: Id;
}

@Mutable(true)
export class EntityBase<P extends Props> extends ModelWithId<P> {
  constructor(metadata: EntityMetadata, props?: P) {
    super(metadata.id);

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
