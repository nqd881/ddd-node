import { ModelWithIdBuilder } from "../model-with-id";
import { AnyEntity, EntityClassWithTypedConstructor } from "./entity";

export class EntityBuilder<T extends AnyEntity> extends ModelWithIdBuilder<T> {
  constructor(private entityClass: EntityClassWithTypedConstructor<T>) {
    super();
  }

  build() {
    if (!this.props) throw new Error("The props must be set before build");

    return new this.entityClass({ id: this.id }, this.props);
  }
}
