import { EntityBuilderBase } from "../../entity";
import { AnyAggregate } from "./aggregate";

export abstract class AggregateBuilderBase<
  T extends AnyAggregate
> extends EntityBuilderBase<T> {
  protected version: number = 0;

  withVersion(version: number) {
    this.version = version;

    return this;
  }
}
