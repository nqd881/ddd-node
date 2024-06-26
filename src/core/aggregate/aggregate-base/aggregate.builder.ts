import _ from "lodash";
import { EntityBuilderBase } from "../../entity";
import { AnyAggregate } from "./aggregate";

export abstract class AggregateBuilderBase<
  T extends AnyAggregate
> extends EntityBuilderBase<T> {
  protected _version?: number;

  getVersion() {
    return !_.isUndefined(this._version) ? this._version : 0;
  }

  withVersion(version: number) {
    this._version = version;

    return this;
  }
}
