import { Class } from "type-fest";
import { v4 } from "uuid";
import { InferredProps, Mutable, Props } from "../../../base";
import { ClassStatic } from "../../../types";
import { Id, ModelWithId, ModelWithIdMetadata } from "../model-with-id";

export interface EntityMetadata extends ModelWithIdMetadata {}

@Mutable(true)
export class Entity<P extends Props> extends ModelWithId<P> {
  static build<T extends AnyEntity>(
    this: EntityClassWithTypedConstructor<T>,
    props: InferredProps<T>,
    id?: Id
  ) {
    return new this({ id: id ?? v4() }, props);
  }

  constructor(metadata: EntityMetadata, props: P) {
    super(metadata);

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
