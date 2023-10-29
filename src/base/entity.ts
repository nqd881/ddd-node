import { getEntityType } from "#metadata/entity";
import { Class } from "#types/class";
import { ClassStatic } from "#types/class-static";
import { v4 } from "uuid";
import { PropsEnvelope, PropsOf } from "./props-envelope";

export interface IEntityMetadata {
  readonly id: string;
}

export type NewEntityMetadataOptions = Partial<IEntityMetadata>;

export class Entity<P extends object>
  extends PropsEnvelope<P>
  implements IEntityMetadata
{
  private readonly _id: string;

  constructor(metadata: IEntityMetadata, props?: P) {
    super(props);

    this._id = metadata.id;
  }

  static entityType() {
    return getEntityType(this.prototype);
  }

  static newEntity<T extends AnyEntity>(
    this: EntityClass<T>,
    props?: PropsOf<T>,
    metadata?: NewEntityMetadataOptions
  ) {
    return new this(
      {
        id: v4(),
        ...metadata,
      },
      props
    );
  }

  get id() {
    return this._id;
  }

  entityType() {
    const prototype = Object.getPrototypeOf(this);

    return getEntityType(prototype);
  }

  equals<E extends AnyEntity>(entity: E) {
    const equalsType = entity instanceof this.constructor;
    const equalsId = entity.id === this.id;

    return equalsType && equalsId;
  }
}

export type AnyEntity = Entity<any>;

export type EntityConstructorParamsWithProps<P extends object> =
  ConstructorParameters<typeof Entity<P>>;

export type EntityClassWithProps<P extends object> = Class<
  Entity<P>,
  EntityConstructorParamsWithProps<P>
> &
  ClassStatic<typeof Entity<P>>;

export type EntityConstructorParams<T extends AnyEntity> =
  EntityConstructorParamsWithProps<PropsOf<T>>;

export type EntityClass<T extends AnyEntity> = Class<
  T,
  EntityConstructorParams<T>
> &
  ClassStatic<typeof Entity<PropsOf<T>>>;

export type AnyEntityClass = EntityClass<AnyEntity>;
