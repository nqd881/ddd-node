import { AnyEventSourcedAggregate } from ".";
import { CommandHandlerMap, EventApplierMap } from "../../../meta";
import { IModelMetadata } from "../../../model";

export interface IEventSourcedAggregateModelMetadata<
  T extends AnyEventSourcedAggregate
> extends IModelMetadata<T> {
  ownEventApplierMap: EventApplierMap;
  eventApplierMap: EventApplierMap;
  ownCommandHandlerMap: CommandHandlerMap;
  commandHandlerMap: CommandHandlerMap;
}
