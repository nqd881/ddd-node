import { Class } from "type-fest";
import { Id } from "./id";
import { ModelWithId, Props, PropsOf } from "./model";
import { ClassStatic } from "../types";

export interface EntityMetadata {
  readonly id: Id;
}

export class EntityBase<P extends Props> extends ModelWithId<P> {
  constructor(metadata: EntityMetadata, props?: P) {
    super(metadata.id);

    if (props) this.initializeProps(props);
  }

  static override mutable(): boolean {
    return true;
  }

  static newEntity<T extends AnyEntity>(
    this: EntityClassWithTypedConstructor<T>,
    props: PropsOf<T>,
    id?: Id
  ) {
    return new this(
      {
        id: this.id(id),
      },
      props
    );
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
