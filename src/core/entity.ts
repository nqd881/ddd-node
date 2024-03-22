import { Class, ClassStatic } from "#types";
import { Id } from "./id";
import { ModelWithId, PropsOf } from "./model";

export interface EntityMetadata {
  readonly id: Id;
}

export class Entity<Props extends object> extends ModelWithId<Props> {
  protected readonly _id: Id;

  constructor(metadata: EntityMetadata, props?: Props) {
    super(props);

    this._id = metadata.id;
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

  getId() {
    return this._id;
  }

  hasId(id: Id) {
    return this._id.equals(id);
  }
}

export type AnyEntity = Entity<object>;

export type EntityClass<
  T extends AnyEntity = AnyEntity,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof Entity<PropsOf<T>>>;

export type EntityClassWithTypedConstructor<T extends AnyEntity = AnyEntity> =
  EntityClass<T, ConstructorParameters<typeof Entity<PropsOf<T>>>>;
