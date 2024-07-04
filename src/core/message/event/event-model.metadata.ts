import { AnyEvent } from ".";
import { IModelMetadata } from "../../../model";

export interface IEventModelMetadata<T extends AnyEvent>
  extends IModelMetadata<T> {
  eventType: string;
}
