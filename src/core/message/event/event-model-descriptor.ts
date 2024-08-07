import { AnyEvent } from ".";
import { EventType } from "../../../meta";
import { ModelDescriptor } from "../../../base";

export interface EventModelDescriptor<T extends AnyEvent>
  extends ModelDescriptor<T> {
  eventType: EventType;
}
