import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { Id, Uuid4 } from "./id";
import { Model, PropsOf } from "./model";

export interface EntityMetadata {
  readonly id: Id;
}

export class Entity<Props extends object> extends Model<Props> {
  private readonly _id: Id;

  constructor(metadata: EntityMetadata, props?: Props) {
    super(props);

    this._id = metadata.id;
  }

  static newEntity<T extends AnyEntity>(
    this: EntityClassWithTypedConstructor<T>,
    props: PropsOf<T>
  ) {
    return new this(
      {
        id: Uuid4.new(),
      },
      props
    );
  }

  get id() {
    return this._id;
  }

  hasId(id: Id) {
    return this.id.equals(id);
  }
}

export type AnyEntity = Entity<object>;

export type EntityClass<
  T extends AnyEntity = AnyEntity,
  Arguments extends unknown[] = any[]
> = Class<T, Arguments> & ClassStatic<typeof Entity<PropsOf<T>>>;

export type EntityClassWithTypedConstructor<T extends AnyEntity = AnyEntity> =
  EntityClass<T, ConstructorParameters<typeof Entity<PropsOf<T>>>>;
