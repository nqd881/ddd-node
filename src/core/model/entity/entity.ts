import { Class } from "type-fest";
import { v4 } from "uuid";
import { InferredProps, Mutable, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id, IdentifiedModel } from "../identified-model";

@Mutable(true)
export class Entity<P extends Props> extends IdentifiedModel<P> {
  static new<T extends AnyEntity>(
    this: EntityClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    id?: Id
  ) {
    return new this(id ?? v4(), props);
  }

  constructor(id: Id, props: P) {
    super(id);

    this.initializeProps(props);
  }

  _constructor() {
    return this.constructor as EntityClass<typeof this>;
  }
}

export type AnyEntity = Entity<Props>;

export interface EntityClass<
  T extends AnyEntity = AnyEntity,
  Arguments extends unknown[] = any[]
> extends Class<T, Arguments>,
    ClassStatic<typeof Entity<InferredProps<T>>> {}

export interface EntityClassWithTypedConstructor<
  T extends AnyEntity = AnyEntity
> extends EntityClass<
    T,
    ConstructorParameters<typeof Entity<InferredProps<T>>>
  > {}

export interface EntityClassWithProps<P extends Props>
  extends EntityClass<Entity<P>> {}
