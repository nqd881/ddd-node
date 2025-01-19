import { IdentifiableModelBuilder } from "../../identifiable-model";
import { AnyAggregate } from "./aggregate";

export abstract class AggregateBuilderBase<
  T extends AnyAggregate
> extends IdentifiableModelBuilder<T> {
  protected version: number = 0;

  withVersion(version: number) {
    this.version = version;

    return this;
  }
}
