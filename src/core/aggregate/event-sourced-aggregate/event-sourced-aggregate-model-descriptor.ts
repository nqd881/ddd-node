import { AnyEventSourcedAggregate } from ".";
import { CommandHandlerMap, EventApplierMap } from "../../../meta";
import { ModelDescriptor } from "../../../base";

export interface EventSourcedAggregateModelDescriptor<
  T extends AnyEventSourcedAggregate
> extends ModelDescriptor<T> {
  ownEventApplierMap: EventApplierMap;
  eventApplierMap: EventApplierMap;
  ownCommandHandlerMap: CommandHandlerMap;
  commandHandlerMap: CommandHandlerMap;
}
