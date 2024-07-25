import { IdentifiableModelBuilder } from "../identifiable-model";
import { AnyEntity, EntityClassWithTypedConstructor } from "./entity";

export abstract class EntityBuilderBase<
  T extends AnyEntity
> extends IdentifiableModelBuilder<T> {}

export class EntityBuilder<T extends AnyEntity> extends EntityBuilderBase<T> {
  constructor(private entityClass: EntityClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    return new this.entityClass({ id: this.id }, this.props);
  }
}
