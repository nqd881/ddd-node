import { v4 } from "uuid";
import { ModelBuilder } from "../../model";
import { Id } from "../id";
import { AnyIdentifiableModel } from "./identifiable-model";

export abstract class IdentifiableModelBuilder<
  T extends AnyIdentifiableModel
> extends ModelBuilder<T> {
  protected id: Id = this.newId();

  newId() {
    return new Id(v4());
  }

  withId(id: Id) {
    this.id = id;
    return this;
  }

  withNewId() {
    return this.withId(this.newId());
  }
}
