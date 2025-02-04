import { v4 } from "uuid";
import { ModelBuilder } from "../../base";
import { AnyModelWithId } from "./model-with-id";
import { Id } from "./id";

export abstract class ModelWithIdBuilder<
  T extends AnyModelWithId
> extends ModelBuilder<T> {
  protected id: Id = this.newId();

  newId() {
    return v4();
  }

  withId(id: Id) {
    this.id = id;
    return this;
  }

  withNewId() {
    return this.withId(this.newId());
  }
}
