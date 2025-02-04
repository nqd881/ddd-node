import { ModelWithIdBuilder } from "../../model-with-id";
import { AnyAggregate } from "./aggregate";

export abstract class AggregateBuilderBase<
  T extends AnyAggregate
> extends ModelWithIdBuilder<T> {
  protected version: number = 0;

  withVersion(version: number) {
    this.version = version;

    return this;
  }
}
