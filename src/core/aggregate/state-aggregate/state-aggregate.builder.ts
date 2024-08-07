import { AggregateBuilderBase } from "../aggregate-base";
import {
  AnyStateAggregate,
  StateAggregateClassWithTypedConstructor,
} from "./state-aggregate";

export class StateAggregateBuilder<
  T extends AnyStateAggregate
> extends AggregateBuilderBase<T> {
  constructor(
    private aggregateClass: StateAggregateClassWithTypedConstructor<T>
  ) {
    super();
  }

  build() {
    if (!this.props) throw new Error("The props must be set before build");

    return new this.aggregateClass(
      {
        id: this.id,
        version: this.version,
      },
      this.props
    );
  }
}
