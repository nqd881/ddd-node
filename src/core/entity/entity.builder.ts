import { ModelWithIdBuilder } from "..";
import { AnyEntity, EntityClassWithTypedConstructor } from "./entity";

export abstract class EntityBuilderBase<
  T extends AnyEntity
> extends ModelWithIdBuilder<T> {}

export class EntityBuilder<T extends AnyEntity> extends EntityBuilderBase<T> {
  constructor(private entityClass: EntityClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    return new this.entityClass({ id: this.getId() }, this._props);
  }
}
