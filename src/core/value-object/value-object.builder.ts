import { ModelBuilder } from "../../model";
import {
  AnyValueObject,
  ValueObjectClassWithTypedConstructor,
} from "./value-object";

export class ValueObjectBuilder<
  T extends AnyValueObject
> extends ModelBuilder<T> {
  constructor(
    private valueObjectClass: ValueObjectClassWithTypedConstructor<T>
  ) {
    super();
  }

  build(): T {
    if (!this._props) throw new Error("The props must be set before build");

    return new this.valueObjectClass(this._props);
  }
}
