import { AnyEvent } from ".";
import { ModelDescriptor } from "../../../model";

export interface EventModelDescriptor<T extends AnyEvent>
  extends ModelDescriptor<T> {
  eventType: string;
}
