import {
  getCommandHandlerMap,
  getEventApplierMap,
  getOwnCommandHandlerMap,
  getOwnEventApplierMap,
} from "../../../meta";
import { AnyEventSourcedAggregate, EventSourcedAggregateClass } from "..";

export class ESAModelMetadata<T extends AnyEventSourcedAggregate> {
  constructor(private aggregateClass: EventSourcedAggregateClass<T>) {}

  get ownEventApplierMap() {
    return getOwnEventApplierMap(this.aggregateClass.prototype);
  }

  get eventApplierMap() {
    return getEventApplierMap(this.aggregateClass.prototype);
  }

  get ownCommandHandlerMap() {
    return getOwnCommandHandlerMap(this.aggregateClass.prototype);
  }

  get commandHandlerMap() {
    return getCommandHandlerMap(this.aggregateClass.prototype);
  }
}
